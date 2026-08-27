import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoutingService } from '../routing/routing.service.js';
import { SearchJourneyDto } from './dto/search-journey.dto.js';

@ApiTags('journey')
@Controller({ path: 'journeys', version: '1' })
export class JourneyController {
  constructor(
    @Inject(RoutingService) private readonly routingService: RoutingService,
  ) {}

  @Post('search')
  @ApiOperation({ summary: 'Search ranked journey options' })
  @ApiResponse({ status: 200, description: 'List of ranked options' })
  async search(@Body() dto: SearchJourneyDto) {
    const originStopId = dto.originStopId || 'stop-1';
    const destinationStopId = dto.destinationStopId || 'stop-2';

    const options = await this.routingService.calculateRoutes(
      originStopId,
      destinationStopId,
      dto.prefs,
    );

    const formattedOptions = options.map((opt) => {
      const id = `jo-${opt.type}-${originStopId}-${destinationStopId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
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
