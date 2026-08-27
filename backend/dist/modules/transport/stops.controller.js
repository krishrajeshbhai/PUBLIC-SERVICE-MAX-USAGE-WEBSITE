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
let StopsController = class StopsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
        }
        catch (e) {
        }
        return MOCK_STOPS;
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