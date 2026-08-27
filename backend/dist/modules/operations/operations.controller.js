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
import { Controller, Get, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../database/prisma.service.js';
let OperationsController = class OperationsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
            activeVehicles: activeVehiclesCount || 2,
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
    getOfflinePackage(userId) {
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
};
__decorate([
    Get('employee/dashboard'),
    ApiOperation({ summary: 'Get operational overview data for staff' }),
    ApiResponse({ status: 200, description: 'Returns vehicle count, open incidents, and affected commuter statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "getDashboard", null);
__decorate([
    Get('visitor/offline-package'),
    ApiOperation({ summary: 'Download offline assistance assets' }),
    ApiResponse({ status: 200, description: 'Returns emergency numbers and map download links' }),
    __param(0, Query('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "getOfflinePackage", null);
OperationsController = __decorate([
    ApiTags('operations'),
    Controller({ version: '1' }),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], OperationsController);
export { OperationsController };
//# sourceMappingURL=operations.controller.js.map