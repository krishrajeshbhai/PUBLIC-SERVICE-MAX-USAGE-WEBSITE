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
import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { WalletService } from '../wallet/wallet.service.js';
import { RoutingService } from '../routing/routing.service.js';
let BookingService = class BookingService {
    static { BookingService_1 = this; }
    prisma;
    walletService;
    routingService;
    logger = new Logger(BookingService_1.name);
    static inMemoryTickets = new Map();
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
        let chosenOption = dto.chosenOption;
        if (!chosenOption) {
            const parsed = this.parseJourneyOptionId(journeyOptionId);
            if (parsed) {
                const { type, originStopId, destinationStopId } = parsed;
                const routes = await this.routingService.calculateRoutes(originStopId, destinationStopId, {
                    accessible: type === 'accessible',
                });
                chosenOption = routes.find((r) => r.type === type);
            }
        }
        if (!chosenOption) {
            chosenOption = {
                type: 'fastest',
                totalMinutes: 20,
                totalCost: 0,
                totalWalkMeters: 350,
                co2SavedGrams: 400,
                segments: [
                    { mode: 'walk', fromStopId: 'stop-1', toStopId: 'stop-3', minutes: 10, cost: 0, crowdLevel: 'green' }
                ]
            };
        }
        const segSum = (chosenOption.segments || []).reduce((acc, s) => acc + (s.mode === 'walk' ? 0 : (s.cost || 0)), 0);
        const finalFare = segSum;
        chosenOption.totalCost = finalFare;
        return await this.prisma.$transaction(async (tx) => {
            const dbJourney = await tx.journey.create({
                data: {
                    userId,
                    type: chosenOption.type || 'fastest',
                    totalMinutes: chosenOption.totalMinutes || 15,
                    totalCost: finalFare,
                    totalWalkMeters: chosenOption.totalWalkMeters || 300,
                    co2SavedGrams: chosenOption.co2SavedGrams || 200,
                    segments: {
                        create: (chosenOption.segments || []).map((seg, idx) => ({
                            mode: seg.mode,
                            lineId: seg.lineId || undefined,
                            fromStopId: seg.fromStopId,
                            toStopId: seg.toStopId,
                            minutes: seg.minutes,
                            cost: seg.mode === 'walk' ? 0 : (seg.cost || 0),
                            crowdLevel: seg.crowdLevel || 'green',
                            sequence: idx + 1,
                        })),
                    },
                },
            });
            const booking = await tx.booking.create({
                data: {
                    userId,
                    journeyId: dbJourney.id,
                    amount: finalFare,
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
                    amount: finalFare,
                    currency: 'INR',
                    status: 'SUCCESS',
                    provider: 'UPI',
                },
            });
            const debitResult = await this.walletService.debit(userId, finalFare, ticket.id, booking.id, undefined, tx);
            BookingService_1.inMemoryTickets.set(ticket.id, chosenOption);
            return {
                ticket: {
                    id: ticket.id,
                    journeyOptionId,
                    userId,
                    status: ticket.status,
                    createdAt: ticket.createdAt,
                    journeyOption: chosenOption,
                },
                walletBalance: debitResult.wallet.balance,
            };
        });
    }
    async getLiveStatus(ticketId) {
        const cachedOption = BookingService_1.inMemoryTickets.get(ticketId);
        if (cachedOption) {
            return {
                status: 'active',
                currentSegmentIndex: 0,
                alert: null,
                ticket: {
                    id: ticketId,
                    status: 'active',
                    journeyOption: cachedOption
                },
                journeyOption: cachedOption
            };
        }
        try {
            const ticket = await this.prisma.ticket.findUnique({
                where: { id: ticketId },
                include: {
                    booking: {
                        include: {
                            journey: {
                                include: {
                                    segments: true,
                                },
                            },
                        },
                    },
                },
            });
            if (ticket && ticket.booking && ticket.booking.journey) {
                const j = ticket.booking.journey;
                const totalFare = j.segments.reduce((acc, s) => acc + (s.mode === 'walk' ? 0 : s.cost), 0);
                const realOption = {
                    id: `jo-${j.type}-${ticketId}`,
                    type: j.type,
                    totalMinutes: j.totalMinutes,
                    totalCost: totalFare,
                    totalWalkMeters: j.totalWalkMeters,
                    co2SavedGrams: j.co2SavedGrams,
                    segments: j.segments.map((s) => ({
                        mode: s.mode,
                        lineId: s.lineId || undefined,
                        fromStopId: s.fromStopId,
                        toStopId: s.toStopId,
                        minutes: s.minutes,
                        cost: s.mode === 'walk' ? 0 : s.cost,
                        crowdLevel: 'green',
                    })),
                };
                return {
                    status: ticket.status.toLowerCase(),
                    currentSegmentIndex: 0,
                    alert: null,
                    ticket: {
                        id: ticket.id,
                        status: ticket.status.toLowerCase(),
                        journeyOption: realOption,
                    },
                    journeyOption: realOption,
                };
            }
        }
        catch (e) {
        }
        const defaultOption = {
            id: `jo-express-${ticketId}`,
            type: 'fastest',
            totalMinutes: 15,
            totalCost: 0,
            totalWalkMeters: 350,
            co2SavedGrams: 420,
            segments: [
                { mode: 'walk', fromStopId: 'stop-1', toStopId: 'stop-3', minutes: 15, cost: 0, crowdLevel: 'green' }
            ]
        };
        return {
            status: 'active',
            currentSegmentIndex: 0,
            alert: null,
            ticket: {
                id: ticketId,
                status: 'active',
                journeyOption: defaultOption
            },
            journeyOption: defaultOption
        };
    }
    async confirmReroute(ticketId) {
        return {
            success: true,
            ticket: {
                id: ticketId,
                status: 'rerouted',
                reroutedOption: {
                    id: `jo-rerouted-${Date.now()}`,
                    type: 'fastest',
                    totalMinutes: 22,
                    totalCost: 32,
                    totalWalkMeters: 380,
                    co2SavedGrams: 490,
                    segments: [
                        { mode: 'walk', fromStopId: 'stop-1', toStopId: 'stop-10', minutes: 6, cost: 0, crowdLevel: 'green' },
                        { mode: 'metro', lineId: 'line-purple', fromStopId: 'stop-10', toStopId: 'stop-4', minutes: 8, cost: 16, crowdLevel: 'green' },
                        { mode: 'metro', lineId: 'line-purple', fromStopId: 'stop-4', toStopId: 'stop-2', minutes: 8, cost: 16, crowdLevel: 'yellow' }
                    ]
                }
            }
        };
    }
    async rejectReroute(ticketId) {
        return {
            success: true,
            ticket: {
                id: ticketId,
                status: 'active'
            }
        };
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