import { WalletService } from '../wallet/wallet.service.js';
import { RoutingService } from '../routing/routing.service.js';
import { BookingService } from '../booking/booking.service.js';
import { AssistantChatDto } from './dto/assistant-chat.dto.js';
export declare class AssistantController {
    private readonly walletService;
    private readonly routingService;
    private readonly bookingService;
    constructor(walletService: WalletService, routingService: RoutingService, bookingService: BookingService);
    chat(dto: AssistantChatDto): Promise<{
        intent: string;
        message: string;
        data: {
            balance: number;
            currency: string;
            error?: undefined;
            options?: undefined;
        };
    } | {
        intent: string;
        message: string;
        data: {
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
        };
    } | {
        intent: string;
        message: string;
        data: {
            error: any;
            balance?: undefined;
            currency?: undefined;
            options?: undefined;
        };
    } | {
        intent: string;
        message: string;
        data: {
            options: {
                id: string;
                type: string;
                totalMinutes: number;
                totalCost: number;
                totalWalkMeters: number;
                segments: import("../routing/routing.service.js").Segment[];
            }[];
            balance?: undefined;
            currency?: undefined;
            error?: undefined;
        };
    } | {
        intent: string;
        message: string;
        data: {
            balance?: undefined;
            currency?: undefined;
            error?: undefined;
            options?: undefined;
        };
    }>;
}
