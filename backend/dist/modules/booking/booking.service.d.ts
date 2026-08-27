import { PrismaService } from '../../database/prisma.service.js';
import { WalletService } from '../wallet/wallet.service.js';
import { RoutingService } from '../routing/routing.service.js';
import { BookTicketDto } from './dto/book-ticket.dto.js';
export declare class BookingService {
    private readonly prisma;
    private readonly walletService;
    private readonly routingService;
    private readonly logger;
    constructor(prisma: PrismaService, walletService: WalletService, routingService: RoutingService);
    private parseJourneyOptionId;
    bookTicket(dto: BookTicketDto, clientIdempotencyKey?: string): Promise<{
        ticket: {
            id: string;
            journeyOptionId: string;
            userId: string;
            status: string;
            createdAt: Date;
        };
        walletBalance: any;
    }>;
}
