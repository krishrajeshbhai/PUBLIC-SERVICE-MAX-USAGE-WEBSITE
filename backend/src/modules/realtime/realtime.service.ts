import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { RedisService } from '../redis/redis.service.js';
import { RoutingService } from '../routing/routing.service.js';
import { SimulateDelayDto } from './dto/simulate-delay.dto.js';

@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(RedisService) private readonly redis: RedisService,
    @Inject(RoutingService) private readonly routingService: RoutingService,
  ) {}

  async getTicketLiveStatus(ticketId: string) {
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

    // Mark completed if time exceeded
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
        // Map back to JourneyOption schema for API contract compatibility
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

  async isSegmentAffected(
    segment: { mode: string; lineId?: string | null; fromStopId: string; toStopId: string },
    lineId: string,
    fromStopId: string,
    toStopId: string,
  ): Promise<boolean> {
    if (segment.mode !== 'metro' && segment.mode !== 'bus') return false;
    if (segment.lineId !== lineId) return false;

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

    return (
      delayMinIdx >= minIdx &&
      delayMaxIdx <= maxIdx &&
      Math.abs(delayMaxIdx - delayMinIdx) === 1
    );
  }

  async simulateDelay(dto: SimulateDelayDto): Promise<string[]> {
    const { lineId, fromStopId, toStopId, delayMinutes } = dto;
    const redisKey = `delay:${lineId}:${fromStopId}:${toStopId}`;

    // 1. Save delay to Redis store
    await this.redis.set(redisKey, String(delayMinutes));
    this.logger.log(`Realtime delay registered: ${redisKey} = ${delayMinutes} mins`);

    // Write internal Operational Incident to database to track the problem
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

    // 2. Fetch active tickets to evaluate reroutes
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

    const affectedTicketIds: string[] = [];

    for (const ticket of tickets) {
      const liveStatus = await this.getTicketLiveStatus(ticket.id);
      if (liveStatus.status === 'COMPLETED' || liveStatus.currentSegmentIndex === -1) {
        continue;
      }

      const journey = ticket.booking.journey;
      const segments = journey.segments;
      let isAffected = false;

      // Scan remaining segments
      for (let i = liveStatus.currentSegmentIndex; i < segments.length; i++) {
        if (await this.isSegmentAffected(segments[i], lineId, fromStopId, toStopId)) {
          isAffected = true;
          break;
        }
      }

      if (!isAffected) continue;

      // Commuter is affected! Run routing engine to recalculate path
      affectedTicketIds.push(ticket.id);

      const SIM_SPEED = process.env.SIM_SPEED ? parseFloat(process.env.SIM_SPEED) : 60;
      const elapsedMs = Date.now() - new Date(ticket.createdAt).getTime();
      const elapsedMinutes = (elapsedMs / 1000) * (SIM_SPEED / 60);

      const currentSegment = segments[liveStatus.currentSegmentIndex];
      
      // Compute elapsed minutes of prior segments
      let cumulativeMins = 0;
      for (let j = 0; j < liveStatus.currentSegmentIndex; j++) {
        cumulativeMins += segments[j].minutes;
      }
      const elapsedMinsInCurrentSegment = elapsedMinutes - cumulativeMins;

      // Reroute origin selection: if within 1st minute, start from origin stop, else destination stop
      const rerouteStartStopId = elapsedMinsInCurrentSegment < 1.0
        ? currentSegment.fromStopId
        : currentSegment.toStopId;

      const finalDestinationStopId = segments[segments.length - 1].toStopId;

      // Search alternate options (Dijkstra including the new Redis delay)
      const options = await this.routingService.calculateRoutes(
        rerouteStartStopId,
        finalDestinationStopId,
        { accessible: journey.type === 'accessible' },
      );

      // Match the user's original route preference type
      const chosenOption = options.find((o) => o.type === journey.type) || options[0];

      if (chosenOption) {
        await this.prisma.$transaction(async (tx) => {
          // Create the new Journey option
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

          // Update Ticket
          await tx.ticket.update({
            where: { id: ticket.id },
            data: {
              status: 'REROUTED',
              reroutedJourneyOptionId: newJourney.id,
              alert: `Delay on ${lineId} near ${fromStopId}. Rerouted to destination via ${chosenOption.type} path.`,
            },
          });
        });
      } else {
        // Flag alert, but no alternate route found
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

  getCrowdLevelForLine(lineId: string): { crowdLevel: string } {
    const levels: Record<string, string> = {
      'line-purple': 'red',
      'line-green': 'yellow',
      'line-bus-201': 'green',
      'line-bus-500': 'yellow',
    };
    return {
      crowdLevel: levels[lineId] || 'green',
    };
  }
}
