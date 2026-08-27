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
import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../database/prisma.service.js';
let StopsController = class StopsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
};
__decorate([
    Get(),
    ApiOperation({ summary: 'List all stops' }),
    ApiResponse({ status: 200, description: 'Return all stops matching API contract' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StopsController.prototype, "getStops", null);
StopsController = __decorate([
    ApiTags('transport'),
    Controller({ path: 'stops', version: '1' }),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], StopsController);
export { StopsController };
//# sourceMappingURL=stops.controller.js.map