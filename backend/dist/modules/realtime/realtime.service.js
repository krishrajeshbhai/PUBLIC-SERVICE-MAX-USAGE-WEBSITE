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
var RealtimeService_1;
import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { RoutingService } from '../routing/routing.service.js';
let RealtimeService = RealtimeService_1 = class RealtimeService {
    prisma;
    redis;
    routingService;
    logger = new Logger(RealtimeService_1.name);
    constructor(prisma, redis, routingService) {
        this.prisma = prisma;
        this.redis = redis;
        this.routingService = routingService;
    }
    async getTicketLiveStatus(ticketId) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id: ticketId },
            include: {
                booking: {
                    include: {
                        journey: {
                            include: {
                                segments: {
                                    orderBy: { sequence: 'asc' },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!ticket) {
            throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
        }
        if (ticket.status === 'COMPLETED') {
            return {
                status: 'COMPLETED',
                currentSegmentIndex: -1,
            };
        }
        const journey = ticket.booking.journey;
        const segments = journey.segments;
        if (!segments || segments.length === 0) {
            return {
                status: ticket.status,
                currentSegmentIndex: 0,
            };
        }
        const SIM_SPEED = process.env.SIM_SPEED ? parseFloat(process.env.SIM_SPEED) : 60;
        const elapsedMs = Date.now() - new Date(ticket.createdAt).getTime();
        const elapsedMinutes = (elapsedMs / 1000) * (SIM_SPEED / 60);
        let cumulativeTime = 0;
        let currentSegmentIndex = -1;
        for (let i = 0; i < segments.length; i++) {
            cumulativeTime += segments[i].minutes;
            if (elapsedMinutes <= cumulativeTime) {
                currentSegmentIndex = i;
                break;
            }
        }
        if (currentSegmentIndex === -1 && elapsedMinutes > cumulativeTime) {
            await this.prisma.ticket.update({
                where: { id: ticketId },
                data: { status: 'COMPLETED' },
            });
            return {
                status: 'COMPLETED',
                currentSegmentIndex: -1,
            };
        }
        let reroutedOption = undefined;
        if (ticket.reroutedJourneyOptionId) {
            const newJourney = await this.prisma.journey.findUnique({
                where: { id: ticket.reroutedJourneyOptionId },
                include: {
                    segments: {
                        orderBy: { sequence: 'asc' },
                    },
                },
            });
            if (newJourney) {
                reroutedOption = {
                    id: newJourney.id,
                    type: newJourney.type,
                    totalMinutes: newJourney.totalMinutes,
                    totalCost: newJourney.totalCost,
                    totalWalkMeters: newJourney.totalWalkMeters,
                    co2SavedGrams: newJourney.co2SavedGrams,
                    segments: newJourney.segments.map((s) => ({
                        mode: s.mode,
                        lineId: s.lineId || undefined,
                        fromStopId: s.fromStopId,
                        toStopId: s.toStopId,
                        minutes: s.minutes,
                        cost: s.cost,
                        crowdLevel: s.crowdLevel,
                    })),
                };
            }
        }
        return {
            status: ticket.status,
            currentSegmentIndex: Math.max(0, currentSegmentIndex),
            alert: ticket.alert || undefined,
            rerouted: reroutedOption,
        };
    }
    async isSegmentAffected(segment, lineId, fromStopId, toStopId) {
        if (segment.mode !== 'metro' && segment.mode !== 'bus')
            return false;
        if (segment.lineId !== lineId)
            return false;
        const routeStops = await this.prisma.routeStop.findMany({
            where: { routeId: lineId },
            orderBy: { stopSequence: 'asc' },
        });
        const stopIds = routeStops.map((rs) => rs.stopId);
        const fromIdx = stopIds.indexOf(segment.fromStopId);
        const toIdx = stopIds.indexOf(segment.toStopId);
        const delayFromIdx = stopIds.indexOf(fromStopId);
        const delayToIdx = stopIds.indexOf(toStopId);
        if (fromIdx === -1 || toIdx === -1 || delayFromIdx === -1 || delayToIdx === -1) {
            return false;
        }
        const minIdx = Math.min(fromIdx, toIdx);
        const maxIdx = Math.max(fromIdx, toIdx);
        const delayMinIdx = Math.min(delayFromIdx, delayToIdx);
        const delayMaxIdx = Math.max(delayFromIdx, delayToIdx);
        return (delayMinIdx >= minIdx &&
            delayMaxIdx <= maxIdx &&
            Math.abs(delayMaxIdx - delayMinIdx) === 1);
    }
    async simulateDelay(dto) {
        const { lineId, fromStopId, toStopId, delayMinutes } = dto;
        const redisKey = `delay:${lineId}:${fromStopId}:${toStopId}`;
        await this.redis.set(redisKey, String(delayMinutes));
        this.logger.log(`Realtime delay registered: ${redisKey} = ${delayMinutes} mins`);
        await this.prisma.incident.create({
            data: {
                operatorId: lineId.startsWith('line-purple') || lineId.startsWith('line-green') ? 'op-metro' : 'op-bus',
                type: 'DELAY',
                severity: delayMinutes >= 15 ? 'HIGH' : 'MEDIUM',
                status: 'OPEN',
                location: `Between stop ${fromStopId} and stop ${toStopId}`,
                description: `Active delay of ${delayMinutes} minutes on route ${lineId}.`,
                createdBy: 'OPERATIONS_MGR',
            },
        });
        const tickets = await this.prisma.ticket.findMany({
            where: {
                status: { in: ['ACTIVE', 'REROUTED'] },
            },
            include: {
                booking: {
                    include: {
                        journey: {
                            include: {
                                segments: {
                                    orderBy: { sequence: 'asc' },
                                },
                            },
                        },
                    },
                },
            },
        });
        const affectedTicketIds = [];
        for (const ticket of tickets) {
            const liveStatus = await this.getTicketLiveStatus(ticket.id);
            if (liveStatus.status === 'COMPLETED' || liveStatus.currentSegmentIndex === -1) {
                continue;
            }
            const journey = ticket.booking.journey;
            const segments = journey.segments;
            let isAffected = false;
            for (let i = liveStatus.currentSegmentIndex; i < segments.length; i++) {
                if (await this.isSegmentAffected(segments[i], lineId, fromStopId, toStopId)) {
                    isAffected = true;
                    break;
                }
            }
            if (!isAffected)
                continue;
            affectedTicketIds.push(ticket.id);
            const SIM_SPEED = process.env.SIM_SPEED ? parseFloat(process.env.SIM_SPEED) : 60;
            const elapsedMs = Date.now() - new Date(ticket.createdAt).getTime();
            const elapsedMinutes = (elapsedMs / 1000) * (SIM_SPEED / 60);
            const currentSegment = segments[liveStatus.currentSegmentIndex];
            let cumulativeMins = 0;
            for (let j = 0; j < liveStatus.currentSegmentIndex; j++) {
                cumulativeMins += segments[j].minutes;
            }
            const elapsedMinsInCurrentSegment = elapsedMinutes - cumulativeMins;
            const rerouteStartStopId = elapsedMinsInCurrentSegment < 1.0
                ? currentSegment.fromStopId
                : currentSegment.toStopId;
            const finalDestinationStopId = segments[segments.length - 1].toStopId;
            const options = await this.routingService.calculateRoutes(rerouteStartStopId, finalDestinationStopId, { accessible: journey.type === 'accessible' });
            const chosenOption = options.find((o) => o.type === journey.type) || options[0];
            if (chosenOption) {
                await this.prisma.$transaction(async (tx) => {
                    const newJourney = await tx.journey.create({
                        data: {
                            userId: ticket.booking.userId,
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
                    await tx.ticket.update({
                        where: { id: ticket.id },
                        data: {
                            status: 'REROUTED',
                            reroutedJourneyOptionId: newJourney.id,
                            alert: `Delay on ${lineId} near ${fromStopId}. Rerouted to destination via ${chosenOption.type} path.`,
                        },
                    });
                });
            }
            else {
                await this.prisma.ticket.update({
                    where: { id: ticket.id },
                    data: {
                        status: 'REROUTED',
                        alert: `Delay on ${lineId} near ${fromStopId}. No alternate public transit route found.`,
                    },
                });
            }
        }
        return affectedTicketIds;
    }
    getCrowdLevelForLine(lineId) {
        const levels = {
            'line-purple': 'red',
            'line-green': 'yellow',
            'line-bus-201': 'green',
            'line-bus-500': 'yellow',
        };
        return {
            crowdLevel: levels[lineId] || 'green',
        };
    }
};
RealtimeService = RealtimeService_1 = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __param(1, Inject(RedisService)),
    __param(2, Inject(RoutingService)),
    __metadata("design:paramtypes", [PrismaService,
        RedisService,
        RoutingService])
], RealtimeService);
export { RealtimeService };
//# sourceMappingURL=realtime.service.js.map