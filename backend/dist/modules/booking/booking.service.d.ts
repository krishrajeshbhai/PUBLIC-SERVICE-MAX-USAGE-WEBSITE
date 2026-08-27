import { PrismaService } from '../../database/prisma.service.js';
import { WalletService } from '../wallet/wallet.service.js';
import { RoutingService } from '../routing/routing.service.js';
import { BookTicketDto } from './dto/book-ticket.dto.js';
export declare class BookingService {
    private readonly prisma;
    private readonly walletService;
    private readonly routingService;
    private readonly logger;
    private static inMemoryTickets;
    constructor(prisma: PrismaService, walletService: WalletService, routingService: RoutingService);
    private parseJourneyOptionId;
    bookTicket(dto: BookTicketDto, clientIdempotencyKey?: string): Promise<{
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
    getLiveStatus(ticketId: string): Promise<{
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
    confirmReroute(ticketId: string): Promise<{
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
    rejectReroute(ticketId: string): Promise<{
        success: boolean;
        ticket: {
            id: string;
            status: string;
        };
    }>;
}
