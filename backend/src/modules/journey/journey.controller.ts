import { Controller, Post, Body, BadRequestException, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoutingService } from '../routing/routing.service.js';
import { SearchJourneyDto } from './dto/search-journey.dto.js';
import { PrismaService } from '../../database/prisma.service.js';

@ApiTags('journey')
@Controller({ path: 'journeys', version: '1' })
export class JourneyController {
  constructor(
    @Inject(RoutingService) private readonly routingService: RoutingService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  @Post('search')
  @ApiOperation({ summary: 'Search ranked journey options' })
  @ApiResponse({ status: 200, description: 'List of ranked options' })
  async search(@Body() dto: SearchJourneyDto) {
    // Validate stops
    const stops = await this.prisma.stop.findMany({
      where: {
        id: { in: [dto.originStopId, dto.destinationStopId] },
      },
    });

    const stopIds = stops.map((s) => s.id);
    if (!stopIds.includes(dto.originStopId) || !stopIds.includes(dto.destinationStopId)) {
      throw new BadRequestException('Invalid originStopId or destinationStopId');
    }

    const options = await this.routingService.calculateRoutes(
      dto.originStopId,
      dto.destinationStopId,
      dto.prefs,
    );

    const formattedOptions = options.map((opt) => {
      const id = `jo-${opt.type}-${dto.originStopId}-${dto.destinationStopId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      return {
        id,
        type: opt.type,
        totalMinutes: opt.totalMinutes,
        totalCost: opt.totalCost,
        totalWalkMeters: opt.totalWalkMeters,
        co2SavedGrams: opt.co2SavedGrams,
        segments: opt.segments.map((s) => ({
          mode: s.mode,
          lineId: s.lineId || undefined,
          fromStopId: s.fromStopId,
          toStopId: s.toStopId,
          minutes: s.minutes,
          cost: s.cost,
          crowdLevel: s.crowdLevel,
        })),
      };
    });

    return { options: formattedOptions };
  }
}
