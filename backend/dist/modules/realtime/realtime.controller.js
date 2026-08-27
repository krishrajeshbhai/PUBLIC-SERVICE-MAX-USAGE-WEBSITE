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
import { Controller, Post, Get, Body, Param, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RealtimeService } from './realtime.service.js';
import { SimulateDelayDto } from './dto/simulate-delay.dto.js';
let RealtimeController = class RealtimeController {
    realtimeService;
    constructor(realtimeService) {
        this.realtimeService = realtimeService;
    }
    async getLiveStatus(ticketId) {
        return this.realtimeService.getTicketLiveStatus(ticketId);
    }
    async simulateDelay(dto) {
        const affectedTicketIds = await this.realtimeService.simulateDelay(dto);
        return { affectedTicketIds };
    }
    async getCrowdLevel(lineId) {
        return this.realtimeService.getCrowdLevelForLine(lineId);
    }
};
__decorate([
    Get('tickets/:ticketId/live'),
    ApiOperation({ summary: 'Poll live ticket status, progress and rerouting updates' }),
    ApiResponse({ status: 200, description: 'Returns ticket state, active segment, and delay rerouted details' }),
    __param(0, Param('ticketId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RealtimeController.prototype, "getLiveStatus", null);
__decorate([
    Post('simulate/delay'),
    ApiOperation({ summary: 'Inject delay on a segment and trigger automatic rerouting' }),
    ApiResponse({ status: 200, description: 'Returns list of affected passenger ticket IDs' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SimulateDelayDto]),
    __metadata("design:returntype", Promise)
], RealtimeController.prototype, "simulateDelay", null);
__decorate([
    Get('lines/:lineId/crowd'),
    ApiOperation({ summary: 'Get crowd status indicator for a transit line' }),
    ApiResponse({ status: 200, description: 'Returns green, yellow, or red crowd status' }),
    __param(0, Param('lineId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RealtimeController.prototype, "getCrowdLevel", null);
RealtimeController = __decorate([
    ApiTags('realtime'),
    Controller({ version: '1' }),
    __param(0, Inject(RealtimeService)),
    __metadata("design:paramtypes", [RealtimeService])
], RealtimeController);
export { RealtimeController };
//# sourceMappingURL=realtime.controller.js.map