import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../database/prisma.service.js';

const MOCK_STOPS = [
  { id: 'stop-1', name: 'Central Station (Kempegowda)', lat: 12.9716, lng: 77.5946, noStairs: true },
  { id: 'stop-2', name: 'MG Road Metro Hub', lat: 12.9756, lng: 77.6066, noStairs: true },
  { id: 'stop-3', name: 'Indiranagar Terminal', lat: 12.9784, lng: 77.6408, noStairs: false },
  { id: 'stop-4', name: 'Tech Park South Gate', lat: 12.9856, lng: 77.6620, noStairs: true },
  { id: 'stop-5', name: 'Whitefield Depot', lat: 12.9698, lng: 77.7499, noStairs: true },
  { id: 'stop-6', name: 'Koramangala 5th Block', lat: 12.9352, lng: 77.6245, noStairs: false },
  { id: 'stop-7', name: 'Silk Board Junction', lat: 12.9177, lng: 77.6238, noStairs: true },
  { id: 'stop-8', name: 'Electronic City Tollgate', lat: 12.8452, lng: 77.6602, noStairs: true },
  { id: 'stop-9', name: 'Majestic City Bus Stand', lat: 12.9767, lng: 77.5713, noStairs: true },
  { id: 'stop-10', name: 'Cubbon Park High Court', lat: 12.9789, lng: 77.5917, noStairs: true }
];

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
    try {
      const stops = await this.prisma.stop.findMany({
        orderBy: { id: 'asc' },
      });
      if (stops && stops.length > 0) {
        return stops.map(s => ({
          id: s.id,
          name: s.name,
          lat: s.lat,
          lng: s.lng,
          noStairs: s.noStairs,
        }));
      }
    } catch (e) {
      // Fallback if database is un-seeded or disconnected
    }
    return MOCK_STOPS;
  }
}
