import { BookingService } from './booking.service.js';
import { BookTicketDto } from './dto/book-ticket.dto.js';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    book(dto: BookTicketDto, idempotencyKey?: string): Promise<{
        ticket: {
            id: string;
            journeyOptionId: string;
            userId: string;
            status: string;
            createdAt: Date;
            journeyOption: any;
        };
        walletBalance: any;
    } | {
        ticket: {
            id: string;
            journeyOptionId: string;
            userId: string;
            status: string;
            createdAt: Date;
        };
        walletBalance: number;
    }>;
    getLiveStatus(id: string): Promise<{
        status: string;
        currentSegmentIndex: number;
        alert: null;
        ticket: {
            id: string;
            status: string;
            journeyOption: any;
        };
        journeyOption: any;
    }>;
    confirmReroute(id: string): Promise<{
        success: boolean;
        ticket: {
            id: string;
            status: string;
            reroutedOption: {
                id: string;
                type: string;
                totalMinutes: number;
                totalCost: number;
                totalWalkMeters: number;
                co2SavedGrams: number;
                segments: ({
                    mode: string;
                    fromStopId: string;
                    toStopId: string;
                    minutes: number;
                    cost: number;
                    crowdLevel: string;
                    lineId?: undefined;
                } | {
                    mode: string;
                    lineId: string;
                    fromStopId: string;
                    toStopId: string;
                    minutes: number;
                    cost: number;
                    crowdLevel: string;
                })[];
            };
        };
    }>;
    rejectReroute(id: string): Promise<{
        success: boolean;
        ticket: {
            id: string;
            status: string;
        };
    }>;
}
