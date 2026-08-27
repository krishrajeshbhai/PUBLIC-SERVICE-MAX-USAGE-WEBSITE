import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import * as fs from 'fs';
import * as path from 'path';

export interface GraphEdge {
  fromStopId: string;
  toStopId: string;
  minutes: number;
  cost: number;
  mode: string;
  lineId?: string;
  distanceMeters?: number;
  noStairs: boolean;
}

export interface Segment {
  mode: string;
  lineId?: string;
  fromStopId: string;
  toStopId: string;
  minutes: number;
  cost: number;
  crowdLevel: string;
}

export interface RouteOption {
  type: string;
  totalMinutes: number;
  totalCost: number;
  totalWalkMeters: number;
  co2SavedGrams: number;
  segments: Segment[];
}

@Injectable()
export class RoutingService {
  private readonly logger = new Logger(RoutingService.name);

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(RedisService) private readonly redis: RedisService,
  ) {}

  private getCrowdLevel(lineId?: string): string {
    if (!lineId) return 'green';
    const levels: Record<string, string> = {
      'line-purple': 'red',
      'line-green': 'yellow',
      'line-bus-201': 'green',
      'line-bus-500': 'yellow',
    };
    return levels[lineId] || 'green';
  }

  async getActiveDelays(): Promise<Array<{ lineId: string; fromStopId: string; toStopId: string; delayMinutes: number }>> {
    const keys = await this.redis.keys('delay:*');
    const delays = [];
    for (const key of keys) {
      // Key format: delay:lineId:fromStopId:toStopId
      const parts = key.split(':');
      if (parts.length === 4) {
        const val = await this.redis.get(key);
        if (val) {
          delays.push({
            lineId: parts[1],
            fromStopId: parts[2],
            toStopId: parts[3],
            delayMinutes: parseInt(val, 10) || 0,
          });
        }
      }
    }
    return delays;
  }

  private getEdgeMinutes(edge: GraphEdge, delays: Array<{ lineId: string; fromStopId: string; toStopId: string; delayMinutes: number }>): number {
    if (edge.mode === 'walk' || !edge.lineId) {
      return edge.minutes;
    }
    const delay = delays.find(
      (d) => d.lineId === edge.lineId && d.fromStopId === edge.fromStopId && d.toStopId === edge.toStopId,
    );
    return delay ? edge.minutes + delay.delayMinutes : edge.minutes;
  }

  async buildGraph(): Promise<Record<string, GraphEdge[]>> {
    const stops = await this.prisma.stop.findMany();
    const routes = await this.prisma.route.findMany({
      include: {
        routeStops: {
          orderBy: { stopSequence: 'asc' },
        },
      },
    });

    const stopsMap = new Map(stops.map((s) => [s.id, s]));
    const graph: Record<string, GraphEdge[]> = {};
    
    stops.forEach((s) => {
      graph[s.id] = [];
    });

    // 1. Add transit routes
    for (const route of routes) {
      const rs = route.routeStops;
      for (let i = 0; i < rs.length - 1; i++) {
        const fromStopId = rs[i].stopId;
        const toStopId = rs[i + 1].stopId;
        const minutes = rs[i].hopMinutes;
        const cost = rs[i].hopCost;

        const fromStop = stopsMap.get(fromStopId);
        const toStop = stopsMap.get(toStopId);

        const edgeNoStairs = route.noStairs &&
          (fromStop ? fromStop.noStairs !== false : true) &&
          (toStop ? toStop.noStairs !== false : true);

        if (graph[fromStopId]) {
          graph[fromStopId].push({
            fromStopId,
            toStopId,
            minutes,
            cost,
            mode: route.type,
            lineId: route.id,
            noStairs: edgeNoStairs,
          });
        }
      }
    }

    // 2. Add walking edges
    try {
      const walkEdgesPath = path.join(process.cwd(), 'src', 'common', 'config', 'walkEdges.json');
      if (fs.existsSync(walkEdgesPath)) {
        const walkEdges = JSON.parse(fs.readFileSync(walkEdgesPath, 'utf8'));
        for (const edge of walkEdges) {
          const { fromStopId, toStopId, distanceMeters, minutes } = edge;
          
          if (graph[fromStopId] && graph[toStopId]) {
            const fromStop = stopsMap.get(fromStopId);
            const toStop = stopsMap.get(toStopId);

            const walkNoStairs = 
              (fromStop ? fromStop.noStairs !== false : true) &&
              (toStop ? toStop.noStairs !== false : true);

            const baseWalk = {
              minutes,
              cost: 0,
              mode: 'walk',
              distanceMeters,
              noStairs: walkNoStairs,
            };

            graph[fromStopId].push({
              fromStopId,
              toStopId,
              lineId: undefined,
              ...baseWalk,
            });

            graph[toStopId].push({
              fromStopId: toStopId,
              toStopId: fromStopId,
              lineId: undefined,
              ...baseWalk,
            });
          }
        }
      }
    } catch (e: any) {
      this.logger.error(`Failed to load walking edges config: ${e.message}`);
    }

    return graph;
  }

  dijkstra(
    graph: Record<string, GraphEdge[]>,
    startStopId: string,
    endStopId: string,
    type: string,
    delays: Array<{ lineId: string; fromStopId: string; toStopId: string; delayMinutes: number }>,
  ): GraphEdge[] | null {
    const distances: Record<string, number> = {};
    const previous: Record<string, GraphEdge | null> = {};
    const visited = new Set<string>();
    const pq: Array<{ id: string; dist: number }> = [];

    const stops = Object.keys(graph);
    stops.forEach((stopId) => {
      distances[stopId] = Infinity;
      previous[stopId] = null;
    });

    distances[startStopId] = 0;
    pq.push({ id: startStopId, dist: 0 });

    while (pq.length > 0) {
      pq.sort((a, b) => a.dist - b.dist);
      const { id: u } = pq.shift()!;

      if (u === endStopId) break;
      if (distances[u] === Infinity) break;

      if (visited.has(u)) continue;
      visited.add(u);

      const neighbors = graph[u] || [];
      for (const edge of neighbors) {
        const v = edge.toStopId;

        if (type === 'accessible' && !edge.noStairs) {
          continue;
        }

        const minutes = this.getEdgeMinutes(edge, delays);
        let edgeWeight = 0;

        if (type === 'fastest' || type === 'accessible') {
          edgeWeight = minutes;
        } else if (type === 'cheapest') {
          edgeWeight = edge.cost * 1000 + minutes;
        } else if (type === 'least_walking') {
          const walkingPenalty = edge.mode === 'walk' ? minutes * 50 : 0;
          edgeWeight = minutes + walkingPenalty;
        }

        const alt = distances[u] + edgeWeight;
        if (alt < distances[v]) {
          distances[v] = alt;
          previous[v] = edge;
          pq.push({ id: v, dist: alt });
        }
      }
    }

    if (distances[endStopId] === Infinity) {
      return null;
    }

    const pathEdges: GraphEdge[] = [];
    let curr = endStopId;
    while (curr !== startStopId) {
      const edge = previous[curr];
      if (!edge) break;
      pathEdges.unshift(edge);
      curr = edge.fromStopId;
    }

    return pathEdges;
  }

  groupEdgesIntoSegments(pathEdges: GraphEdge[], delays: Array<{ lineId: string; fromStopId: string; toStopId: string; delayMinutes: number }>): Segment[] {
    if (!pathEdges || pathEdges.length === 0) return [];

    const segments: Segment[] = [];
    let currentSegment: Segment | null = null;

    for (const edge of pathEdges) {
      const minutes = this.getEdgeMinutes(edge, delays);
      const cost = edge.cost;

      if (!currentSegment) {
        currentSegment = {
          mode: edge.mode,
          lineId: edge.lineId,
          fromStopId: edge.fromStopId,
          toStopId: edge.toStopId,
          minutes,
          cost,
          crowdLevel: this.getCrowdLevel(edge.lineId),
        };
      } else {
        const sameMode = edge.mode === currentSegment.mode;
        const sameLine = edge.lineId === currentSegment.lineId;

        if (sameMode && sameLine) {
          currentSegment.toStopId = edge.toStopId;
          currentSegment.minutes += minutes;
          currentSegment.cost += cost;
        } else {
          segments.push(currentSegment);
          currentSegment = {
            mode: edge.mode,
            lineId: edge.lineId,
            fromStopId: edge.fromStopId,
            toStopId: edge.toStopId,
            minutes,
            cost,
            crowdLevel: this.getCrowdLevel(edge.lineId),
          };
        }
      }
    }

    if (currentSegment) {
      segments.push(currentSegment);
    }

    return segments;
  }

  computeJourneyStats(segments: Segment[], pathEdges: GraphEdge[]) {
    let totalMinutes = 0;
    let totalCost = 0;
    let totalWalkMeters = 0;
    let totalDistanceKm = 0;

    segments.forEach((seg) => {
      totalMinutes += seg.minutes;
      totalCost += seg.cost;
    });

    pathEdges.forEach((edge) => {
      if (edge.mode === 'walk') {
        const dist = edge.distanceMeters || edge.minutes * 80;
        totalWalkMeters += dist;
        totalDistanceKm += dist / 1000;
      } else if (edge.mode === 'metro') {
        totalDistanceKm += edge.minutes * 0.75;
      } else if (edge.mode === 'bus') {
        totalDistanceKm += edge.minutes * 0.4;
      }
    });

    const co2SavedGrams = Math.round(totalDistanceKm * 120);

    return { totalMinutes, totalCost, totalWalkMeters, co2SavedGrams };
  }

  async calculateRoutes(originStopId: string, destinationStopId: string, prefs: { accessible?: boolean } = {}): Promise<RouteOption[]> {
    const graph = await this.buildGraph();
    const delays = await this.getActiveDelays();
    const types: string[] = [];

    if (prefs.accessible) {
      types.push('accessible');
    } else {
      types.push('fastest', 'cheapest', 'least_walking');
    }

    const options: RouteOption[] = [];
    for (const type of types) {
      const pathEdges = this.dijkstra(graph, originStopId, destinationStopId, type, delays);
      if (pathEdges) {
        const segments = this.groupEdgesIntoSegments(pathEdges, delays);
        const stats = this.computeJourneyStats(segments, pathEdges);
        options.push({
          type,
          ...stats,
          segments,
        });
      }
    }

    // Deduplicate options by segment signature
    const seen = new Set<string>();
    const deduped: RouteOption[] = [];
    for (const opt of options) {
      const sig = opt.segments
        .map((s) => `${s.mode}-${s.lineId || 'none'}-${s.fromStopId}-${s.toStopId}`)
        .join('|');
      if (!seen.has(sig)) {
        seen.add(sig);
        deduped.push(opt);
      }
    }

    return deduped;
  }
}
