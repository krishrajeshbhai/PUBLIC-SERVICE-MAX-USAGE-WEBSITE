import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../database/prisma.service.js';

@ApiTags('transport')
@Controller({ path: 'stops', version: '1' })
export class StopsController {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all stops' })
  @ApiResponse({ status: 200, description: 'Return all stops matching API contract' })
  async getStops() {
    const stops = await this.prisma.stop.findMany({
      orderBy: { id: 'asc' },
    });
    return stops.map(s => ({
      id: s.id,
      name: s.name,
      lat: s.lat,
      lng: s.lng,
      noStairs: s.noStairs,
    }));
  }
}
