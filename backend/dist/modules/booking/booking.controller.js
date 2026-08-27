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
import { Controller, Post, Get, Body, Param, Headers, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingService } from './booking.service.js';
import { BookTicketDto } from './dto/book-ticket.dto.js';
let BookingController = class BookingController {
    bookingService;
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    async book(dto, idempotencyKey) {
        return this.bookingService.bookTicket(dto, idempotencyKey);
    }
    async getLiveStatus(id) {
        return this.bookingService.getLiveStatus(id);
    }
    async confirmReroute(id) {
        return this.bookingService.confirmReroute(id);
    }
    async rejectReroute(id) {
        return this.bookingService.rejectReroute(id);
    }
};
__decorate([
    Post('book'),
    ApiOperation({ summary: 'Book one journey option, deduct wallet balance' }),
    ApiResponse({ status: 201, description: 'Returns issued ticket and updated wallet balance' }),
    __param(0, Body()),
    __param(1, Headers('idempotency-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BookTicketDto, String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "book", null);
__decorate([
    Get(':id/live'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getLiveStatus", null);
__decorate([
    Post(':id/reroute/confirm'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "confirmReroute", null);
__decorate([
    Post(':id/reroute/reject'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "rejectReroute", null);
BookingController = __decorate([
    ApiTags('booking'),
    Controller({ path: 'tickets', version: '1' }),
    __param(0, Inject(BookingService)),
    __metadata("design:paramtypes", [BookingService])
], BookingController);
export { BookingController };
//# sourceMappingURL=booking.controller.js.map