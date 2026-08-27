var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RoutingService_1;
import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import * as fs from 'fs';
import * as path from 'path';
let RoutingService = RoutingService_1 = class RoutingService {
    prisma;
    redis;
    logger = new Logger(RoutingService_1.name);
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    getCrowdLevel(lineId) {
        if (!lineId)
            return 'green';
        const levels = {
            'line-purple': 'red',
            'line-green': 'yellow',
            'line-bus-201': 'green',
            'line-bus-500': 'yellow',
        };
        return levels[lineId] || 'green';
    }
    async getActiveDelays() {
        const keys = await this.redis.keys('delay:*');
        const delays = [];
        for (const key of keys) {
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
    getEdgeMinutes(edge, delays) {
        if (edge.mode === 'walk' || !edge.lineId) {
            return edge.minutes;
        }
        const delay = delays.find((d) => d.lineId === edge.lineId && d.fromStopId === edge.fromStopId && d.toStopId === edge.toStopId);
        return delay ? edge.minutes + delay.delayMinutes : edge.minutes;
    }
    async buildGraph() {
        const stops = await this.prisma.stop.findMany();
        const routes = await this.prisma.route.findMany({
            include: {
                routeStops: {
                    orderBy: { stopSequence: 'asc' },
                },
            },
        });
        const stopsMap = new Map(stops.map((s) => [s.id, s]));
        const graph = {};
        stops.forEach((s) => {
            graph[s.id] = [];
        });
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
        try {
            const walkEdgesPath = path.join(process.cwd(), 'src', 'common', 'config', 'walkEdges.json');
            if (fs.existsSync(walkEdgesPath)) {
                const walkEdges = JSON.parse(fs.readFileSync(walkEdgesPath, 'utf8'));
                for (const edge of walkEdges) {
                    const { fromStopId, toStopId, distanceMeters, minutes } = edge;
                    if (graph[fromStopId] && graph[toStopId]) {
                        const fromStop = stopsMap.get(fromStopId);
                        const toStop = stopsMap.get(toStopId);
                        const walkNoStairs = (fromStop ? fromStop.noStairs !== false : true) &&
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
        }
        catch (e) {
            this.logger.error(`Failed to load walking edges config: ${e.message}`);
        }
        return graph;
    }
    dijkstra(graph, startStopId, endStopId, type, delays) {
        const distances = {};
        const previous = {};
        const visited = new Set();
        const pq = [];
        const stops = Object.keys(graph);
        stops.forEach((stopId) => {
            distances[stopId] = Infinity;
            previous[stopId] = null;
        });
        distances[startStopId] = 0;
        pq.push({ id: startStopId, dist: 0 });
        while (pq.length > 0) {
            pq.sort((a, b) => a.dist - b.dist);
            const { id: u } = pq.shift();
            if (u === endStopId)
                break;
            if (distances[u] === Infinity)
                break;
            if (visited.has(u))
                continue;
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
                }
                else if (type === 'cheapest') {
                    edgeWeight = edge.cost * 1000 + minutes;
                }
                else if (type === 'least_walking') {
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
        const pathEdges = [];
        let curr = endStopId;
        while (curr !== startStopId) {
            const edge = previous[curr];
            if (!edge)
                break;
            pathEdges.unshift(edge);
            curr = edge.fromStopId;
        }
        return pathEdges;
    }
    groupEdgesIntoSegments(pathEdges, delays) {
        if (!pathEdges || pathEdges.length === 0)
            return [];
        const segments = [];
        let currentSegment = null;
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
            }
            else {
                const sameMode = edge.mode === currentSegment.mode;
                const sameLine = edge.lineId === currentSegment.lineId;
                if (sameMode && sameLine) {
                    currentSegment.toStopId = edge.toStopId;
                    currentSegment.minutes += minutes;
                    currentSegment.cost += cost;
                }
                else {
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
    computeJourneyStats(segments, pathEdges) {
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
            }
            else if (edge.mode === 'metro') {
                totalDistanceKm += edge.minutes * 0.75;
            }
            else if (edge.mode === 'bus') {
                totalDistanceKm += edge.minutes * 0.4;
            }
        });
        const co2SavedGrams = Math.round(totalDistanceKm * 120);
        return { totalMinutes, totalCost, totalWalkMeters, co2SavedGrams };
    }
    async calculateRoutes(originStopId, destinationStopId, prefs = {}) {
        const graph = await this.buildGraph();
        const delays = await this.getActiveDelays();
        const types = [];
        if (prefs.accessible) {
            types.push('accessible');
        }
        else {
            types.push('fastest', 'cheapest', 'least_walking');
        }
        const options = [];
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
        const seen = new Set();
        const deduped = [];
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
};
RoutingService = RoutingService_1 = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __param(1, Inject(RedisService)),
    __metadata("design:paramtypes", [PrismaService,
        RedisService])
], RoutingService);
export { RoutingService };
//# sourceMappingURL=routing.service.js.map