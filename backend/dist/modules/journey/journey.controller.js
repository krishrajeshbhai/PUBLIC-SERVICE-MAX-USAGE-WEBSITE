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
import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoutingService } from '../routing/routing.service.js';
import { SearchJourneyDto } from './dto/search-journey.dto.js';
let JourneyController = class JourneyController {
    routingService;
    constructor(routingService) {
        this.routingService = routingService;
    }
    async search(dto) {
        const originStopId = dto.originStopId || 'stop-1';
        const destinationStopId = dto.destinationStopId || 'stop-2';
        const options = await this.routingService.calculateRoutes(originStopId, destinationStopId, dto.prefs);
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
};
__decorate([
    Post('search'),
    ApiOperation({ summary: 'Search ranked journey options' }),
    ApiResponse({ status: 200, description: 'List of ranked options' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SearchJourneyDto]),
    __metadata("design:returntype", Promise)
], JourneyController.prototype, "search", null);
JourneyController = __decorate([
    ApiTags('journey'),
    Controller({ path: 'journeys', version: '1' }),
    __param(0, Inject(RoutingService)),
    __metadata("design:paramtypes", [RoutingService])
], JourneyController);
export { JourneyController };
//# sourceMappingURL=journey.controller.js.map