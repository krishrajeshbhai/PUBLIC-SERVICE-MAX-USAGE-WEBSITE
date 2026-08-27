import { Controller, Get, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../database/prisma.service.js';

@ApiTags('operations')
@Controller({ version: '1' })
export class OperationsController {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  @Get('employee/dashboard')
  @ApiOperation({ summary: 'Get operational overview data for staff' })
  @ApiResponse({ status: 200, description: 'Returns vehicle count, open incidents, and affected commuter statistics' })
  async getDashboard() {
    const activeVehiclesCount = await this.prisma.vehicle.count();
    const openIncidents = await this.prisma.incident.findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' },
    });
    const affectedCommuters = await this.prisma.ticket.count({
      where: { status: 'REROUTED' },
    });

    return {
      activeVehicles: activeVehiclesCount || 2, // Seeding fallback
      incidents: openIncidents.map((i) => ({
        id: i.id,
        type: i.type,
        severity: i.severity,
        status: i.status,
        location: i.location,
        description: i.description,
        createdAt: i.createdAt.toISOString(),
      })),
      affectedCommuters,
    };
  }

  @Get('visitor/offline-package')
  @ApiOperation({ summary: 'Download offline assistance assets' })
  @ApiResponse({ status: 200, description: 'Returns emergency numbers and map download links' })
  getOfflinePackage(@Query('userId') userId?: string) {
    return {
      userId: userId || 'anonymous',
      generatedAt: new Date().toISOString(),
      essentialMaps: [
        { name: 'Namma Metro Transit Line Map', url: 'https://transitone.in/maps/metro-purple-green.png' },
        { name: 'City Central Bus Terminus Network', url: 'https://transitone.in/maps/bus-terminal-routes.png' },
      ],
      emergencyContacts: [
        { name: 'Metro Helpline Service', phone: '+918022221234' },
        { name: 'City Traffic Control Room', phone: '103' },
        { name: 'Emergency Medical Services', phone: '108' },
      ],
    };
  }
}
