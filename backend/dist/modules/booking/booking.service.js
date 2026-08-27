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
var BookingService_1;
import { Injectable, BadRequestException, NotFoundException, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { WalletService } from '../wallet/wallet.service.js';
import { RoutingService } from '../routing/routing.service.js';
let BookingService = BookingService_1 = class BookingService {
    prisma;
    walletService;
    routingService;
    logger = new Logger(BookingService_1.name);
    constructor(prisma, walletService, routingService) {
        this.prisma = prisma;
        this.walletService = walletService;
        this.routingService = routingService;
    }
    parseJourneyOptionId(id) {
        const match = id.match(/^jo-(fastest|cheapest|least_walking|accessible)-(stop-\d+)-(stop-\d+)-/);
        if (!match)
            return null;
        return {
            type: match[1],
            originStopId: match[2],
            destinationStopId: match[3],
        };
    }
    async bookTicket(dto, clientIdempotencyKey) {
        const { userId, journeyOptionId } = dto;
        const idempotencyKey = clientIdempotencyKey || `fallback-${userId}-${journeyOptionId}`;
        const existingBooking = await this.prisma.booking.findUnique({
            where: { idempotencyKey },
            include: {
                tickets: true,
                user: {
                    include: {
                        wallet: true,
                    },
                },
            },
        });
        if (existingBooking) {
            this.logger.log(`Idempotent booking hit. Returning existing transaction: ${existingBooking.id}`);
            const ticket = existingBooking.tickets[0];
            return {
                ticket: {
                    id: ticket.id,
                    journeyOptionId,
                    userId,
                    status: ticket.status,
                    createdAt: ticket.createdAt,
                },
                walletBalance: existingBooking.user.wallet?.balance ?? 500,
            };
        }
        const parsed = this.parseJourneyOptionId(journeyOptionId);
        if (!parsed) {
            throw new BadRequestException('Invalid journeyOptionId format');
        }
        const { type, originStopId, destinationStopId } = parsed;
        const routes = await this.routingService.calculateRoutes(originStopId, destinationStopId, {
            accessible: type === 'accessible',
        });
        const chosenOption = routes.find((r) => r.type === type);
        if (!chosenOption) {
            throw new NotFoundException('Selected journey option is no longer available');
        }
        return await this.prisma.$transaction(async (tx) => {
            const dbJourney = await tx.journey.create({
                data: {
                    userId,
                    type: chosenOption.type,
                    totalMinutes: chosenOption.totalMinutes,
                    totalCost: chosenOption.totalCost,
                    totalWalkMeters: chosenOption.totalWalkMeters,
                    co2SavedGrams: chosenOption.co2SavedGrams,
                    segments: {
                        create: chosenOption.segments.map((seg, idx) => ({
                            mode: seg.mode,
                            lineId: seg.lineId || undefined,
                            fromStopId: seg.fromStopId,
                            toStopId: seg.toStopId,
                            minutes: seg.minutes,
                            cost: seg.cost,
                            crowdLevel: seg.crowdLevel,
                            sequence: idx + 1,
                        })),
                    },
                },
            });
            const booking = await tx.booking.create({
                data: {
                    userId,
                    journeyId: dbJourney.id,
                    amount: chosenOption.totalCost,
                    status: 'CONFIRMED',
                    idempotencyKey,
                },
            });
            const ticket = await tx.ticket.create({
                data: {
                    bookingId: booking.id,
                    status: 'ACTIVE',
                    qrCode: `TKT-${booking.id}`,
                },
            });
            await tx.payment.create({
                data: {
                    bookingId: booking.id,
                    transactionId: `pay-${booking.id}-${Date.now()}`,
                    amount: chosenOption.totalCost,
                    currency: 'INR',
                    status: 'SUCCESS',
                    provider: 'UPI',
                },
            });
            const debitResult = await this.walletService.debit(userId, chosenOption.totalCost, ticket.id, booking.id, undefined, tx);
            return {
                ticket: {
                    id: ticket.id,
                    journeyOptionId,
                    userId,
                    status: ticket.status,
                    createdAt: ticket.createdAt,
                },
                walletBalance: debitResult.wallet.balance,
            };
        });
    }
};
BookingService = BookingService_1 = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __param(1, Inject(WalletService)),
    __param(2, Inject(RoutingService)),
    __metadata("design:paramtypes", [PrismaService,
        WalletService,
        RoutingService])
], BookingService);
export { BookingService };
//# sourceMappingURL=booking.service.js.map