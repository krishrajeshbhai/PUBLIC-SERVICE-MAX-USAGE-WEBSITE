import { Controller, Post, Get, Body, Param, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RealtimeService } from './realtime.service.js';
import { SimulateDelayDto } from './dto/simulate-delay.dto.js';

@ApiTags('realtime')
@Controller({ version: '1' })
export class RealtimeController {
  constructor(
    @Inject(RealtimeService) private readonly realtimeService: RealtimeService,
  ) {}

  @Get('tickets/:ticketId/live')
  @ApiOperation({ summary: 'Poll live ticket status, progress and rerouting updates' })
  @ApiResponse({ status: 200, description: 'Returns ticket state, active segment, and delay rerouted details' })
  async getLiveStatus(@Param('ticketId') ticketId: string) {
    return this.realtimeService.getTicketLiveStatus(ticketId);
  }

  @Post('simulate/delay')
  @ApiOperation({ summary: 'Inject delay on a segment and trigger automatic rerouting' })
  @ApiResponse({ status: 200, description: 'Returns list of affected passenger ticket IDs' })
  async simulateDelay(@Body() dto: SimulateDelayDto) {
    const affectedTicketIds = await this.realtimeService.simulateDelay(dto);
    return { affectedTicketIds };
  }

  @Get('lines/:lineId/crowd')
  @ApiOperation({ summary: 'Get crowd status indicator for a transit line' })
  @ApiResponse({ status: 200, description: 'Returns green, yellow, or red crowd status' })
  async getCrowdLevel(@Param('lineId') lineId: string) {
    return this.realtimeService.getCrowdLevelForLine(lineId);
  }
}
