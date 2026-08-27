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
import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WalletService } from '../wallet/wallet.service.js';
import { RoutingService } from '../routing/routing.service.js';
import { BookingService } from '../booking/booking.service.js';
import { AssistantChatDto } from './dto/assistant-chat.dto.js';
let AssistantController = class AssistantController {
    walletService;
    routingService;
    bookingService;
    constructor(walletService, routingService, bookingService) {
        this.walletService = walletService;
        this.routingService = routingService;
        this.bookingService = bookingService;
    }
    async chat(dto) {
        const { userId, message } = dto;
        const msgLower = message.toLowerCase();
        if (msgLower.includes('balance') || msgLower.includes('wallet') || msgLower.includes('money')) {
            const wallet = await this.walletService.getWallet(userId);
            return {
                intent: 'GET_WALLET',
                message: `Your current TransitOne wallet balance is ₹${wallet.balance}.`,
                data: {
                    balance: wallet.balance,
                    currency: wallet.currency,
                },
            };
        }
        if (msgLower.includes('book') && msgLower.includes('jo-')) {
            const match = message.match(/(jo-[a-zA-Z0-9_\-]+)/);
            if (match) {
                const optionId = match[1];
                try {
                    const result = await this.bookingService.bookTicket({
                        userId,
                        journeyOptionId: optionId,
                    });
                    return {
                        intent: 'BOOK_TICKET',
                        message: `Awesome! I have booked your ticket. Your ticket ID is "${result.ticket.id}". ₹${result.ticket.id ? 'deducted' : '0'} from your wallet. Your new balance is ₹${result.walletBalance}.`,
                        data: result,
                    };
                }
                catch (e) {
                    return {
                        intent: 'BOOK_TICKET',
                        message: `Booking failed: ${e.message}`,
                        data: { error: e.message },
                    };
                }
            }
        }
        if (msgLower.includes('route') || msgLower.includes('search') || msgLower.includes('take me') || msgLower.includes('get from')) {
            const stopMatches = message.match(/(stop-\d+)/g);
            if (stopMatches && stopMatches.length >= 2) {
                const origin = stopMatches[0];
                const destination = stopMatches[1];
                const isAccessible = msgLower.includes('accessible') || msgLower.includes('wheelchair');
                try {
                    const result = await this.routingService.calculateRoutes(origin, destination, {
                        accessible: isAccessible,
                    });
                    const options = result.map((opt) => {
                        const id = `jo-${opt.type}-${origin}-${destination}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                        return {
                            id,
                            type: opt.type,
                            totalMinutes: opt.totalMinutes,
                            totalCost: opt.totalCost,
                            totalWalkMeters: opt.totalWalkMeters,
                            segments: opt.segments,
                        };
                    });
                    if (options.length === 0) {
                        return {
                            intent: 'SEARCH_ROUTE',
                            message: `I couldn't find any public transit routes from ${origin} to ${destination}.`,
                            data: { options: [] },
                        };
                    }
                    const fastest = options.find((o) => o.type === 'fastest') || options[0];
                    let reply = `I found ${options.length} route(s). The fastest takes ${fastest.totalMinutes} minutes and costs ₹${fastest.totalCost}.`;
                    reply += `\nTo book it, say: "Book option ${fastest.id}"`;
                    return {
                        intent: 'SEARCH_ROUTE',
                        message: reply,
                        data: { options },
                    };
                }
                catch (e) {
                    return {
                        intent: 'SEARCH_ROUTE',
                        message: `Search failed: ${e.message}`,
                        data: { error: e.message },
                    };
                }
            }
        }
        return {
            intent: 'UNKNOWN',
            message: `Hi! I'm your TransitOne Assistant. I can help you check your wallet balance, search for routes (e.g. "Find route from stop-10 to stop-5"), or book tickets (e.g. "Book ticket jo-fastest-...")!`,
            data: {},
        };
    }
};
__decorate([
    Post('chat'),
    ApiOperation({ summary: 'Chat with the TransitOne AI interface to search routes, book, or view wallets' }),
    ApiResponse({ status: 201, description: 'Returns text response and structural transaction context data' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AssistantChatDto]),
    __metadata("design:returntype", Promise)
], AssistantController.prototype, "chat", null);
AssistantController = __decorate([
    ApiTags('assistant'),
    Controller({ path: 'assistant', version: '1' }),
    __param(0, Inject(WalletService)),
    __param(1, Inject(RoutingService)),
    __param(2, Inject(BookingService)),
    __metadata("design:paramtypes", [WalletService,
        RoutingService,
        BookingService])
], AssistantController);
export { AssistantController };
//# sourceMappingURL=assistant.controller.js.map