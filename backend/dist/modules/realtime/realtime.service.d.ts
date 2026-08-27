import { PrismaService } from '../../database/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { RoutingService } from '../routing/routing.service.js';
import { SimulateDelayDto } from './dto/simulate-delay.dto.js';
export declare class RealtimeService {
    private readonly prisma;
    private readonly redis;
    private readonly routingService;
    private readonly logger;
    constructor(prisma: PrismaService, redis: RedisService, routingService: RoutingService);
    getTicketLiveStatus(ticketId: string): Promise<{
        status: string;
        currentSegmentIndex: number;
        alert?: undefined;
        rerouted?: undefined;
    } | {
        status: string;
        currentSegmentIndex: number;
        alert: string | undefined;
        rerouted: {
            id: string;
            type: string;
            totalMinutes: number;
            totalCost: number;
            totalWalkMeters: number;
            co2SavedGrams: number;
            segments: {
                mode: string;
                lineId: string | undefined;
                fromStopId: string;
                toStopId: string;
                minutes: number;
                cost: number;
                crowdLevel: string;
            }[];
        } | undefined;
    }>;
    isSegmentAffected(segment: {
        mode: string;
        lineId?: string | null;
        fromStopId: string;
        toStopId: string;
    }, lineId: string, fromStopId: string, toStopId: string): Promise<boolean>;
    simulateDelay(dto: SimulateDelayDto): Promise<string[]>;
    getCrowdLevelForLine(lineId: string): {
        crowdLevel: string;
    };
}
