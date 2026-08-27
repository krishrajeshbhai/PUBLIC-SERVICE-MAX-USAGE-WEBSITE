import { PrismaService } from '../../database/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
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
export declare class RoutingService {
    private readonly prisma;
    private readonly redis;
    private readonly logger;
    constructor(prisma: PrismaService, redis: RedisService);
    private getCrowdLevel;
    getActiveDelays(): Promise<Array<{
        lineId: string;
        fromStopId: string;
        toStopId: string;
        delayMinutes: number;
    }>>;
    private getEdgeMinutes;
    buildGraph(): Promise<Record<string, GraphEdge[]>>;
    dijkstra(graph: Record<string, GraphEdge[]>, startStopId: string, endStopId: string, type: string, delays: Array<{
        lineId: string;
        fromStopId: string;
        toStopId: string;
        delayMinutes: number;
    }>): GraphEdge[] | null;
    groupEdgesIntoSegments(pathEdges: GraphEdge[], delays: Array<{
        lineId: string;
        fromStopId: string;
        toStopId: string;
        delayMinutes: number;
    }>): Segment[];
    computeJourneyStats(segments: Segment[], pathEdges: GraphEdge[]): {
        totalMinutes: number;
        totalCost: number;
        totalWalkMeters: number;
        co2SavedGrams: number;
    };
    calculateRoutes(originStopId: string, destinationStopId: string, prefs?: {
        accessible?: boolean;
    }): Promise<RouteOption[]>;
}
