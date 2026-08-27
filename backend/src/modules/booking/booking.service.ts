import { Injectable, BadRequestException, NotFoundException, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { WalletService } from '../wallet/wallet.service.js';
import { RoutingService } from '../routing/routing.service.js';
import { BookTicketDto } from './dto/book-ticket.dto.js';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(WalletService) private readonly walletService: WalletService,
    @Inject(RoutingService) private readonly routingService: RoutingService,
  ) {}

  private parseJourneyOptionId(id: string) {
    const match = id.match(/^jo-(fastest|cheapest|least_walking|accessible)-(stop-\d+)-(stop-\d+)-/);
    if (!match) return null;
    return {
      type: match[1],
      originStopId: match[2],
      destinationStopId: match[3],
    };
  }

  async bookTicket(dto: BookTicketDto, clientIdempotencyKey?: string) {
    const { userId, journeyOptionId } = dto;
    const idempotencyKey = clientIdempotencyKey || `fallback-${userId}-${journeyOptionId}`;

    // 1. Check idempotency
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

    // 2. Parse and reconstruct search options
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

    // 3. Execute transactional booking
    return await this.prisma.$transaction(async (tx) => {
      // Create journey records in DB
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

      // Create Booking entry
      const booking = await tx.booking.create({
        data: {
          userId,
          journeyId: dbJourney.id,
          amount: chosenOption.totalCost,
          status: 'CONFIRMED',
          idempotencyKey,
        },
      });

      // Create Ticket
      const ticket = await tx.ticket.create({
        data: {
          bookingId: booking.id,
          status: 'ACTIVE',
          qrCode: `TKT-${booking.id}`,
        },
      });

      // Create Payment transaction
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

      // Debit wallet ledger
      const debitResult = await this.walletService.debit(
        userId,
        chosenOption.totalCost,
        ticket.id,
        booking.id,
        undefined,
        tx,
      );

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
}
