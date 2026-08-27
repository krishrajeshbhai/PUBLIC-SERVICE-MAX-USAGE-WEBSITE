import { RealtimeService } from './realtime.service.js';
import { SimulateDelayDto } from './dto/simulate-delay.dto.js';
export declare class RealtimeController {
    private readonly realtimeService;
    constructor(realtimeService: RealtimeService);
    getLiveStatus(ticketId: string): Promise<{
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
    simulateDelay(dto: SimulateDelayDto): Promise<{
        affectedTicketIds: string[];
    }>;
    getCrowdLevel(lineId: string): Promise<{
        crowdLevel: string;
    }>;
}
