import { RoutingService } from '../routing/routing.service.js';
import { SearchJourneyDto } from './dto/search-journey.dto.js';
export declare class JourneyController {
    private readonly routingService;
    constructor(routingService: RoutingService);
    search(dto: SearchJourneyDto): Promise<{
        options: {
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
        }[];
    }>;
}
