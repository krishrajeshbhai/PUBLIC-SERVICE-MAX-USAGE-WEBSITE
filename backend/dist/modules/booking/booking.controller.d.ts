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
        };
        walletBalance: any;
    }>;
}
