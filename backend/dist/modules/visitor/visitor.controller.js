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
import { Controller, Get, Param, Query } from '@nestjs/common';
import { VisitorService } from './visitor.service.js';
let VisitorController = class VisitorController {
    visitorService;
    constructor(visitorService) {
        this.visitorService = visitorService;
    }
    async getAttractions(category) {
        return this.visitorService.getAttractions(category);
    }
    async getAttractionDetail(id) {
        return this.visitorService.getAttractionDetail(id);
    }
};
__decorate([
    Get('attractions'),
    __param(0, Query('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitorController.prototype, "getAttractions", null);
__decorate([
    Get('attractions/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitorController.prototype, "getAttractionDetail", null);
VisitorController = __decorate([
    Controller('visitor'),
    __metadata("design:paramtypes", [VisitorService])
], VisitorController);
export { VisitorController };
//# sourceMappingURL=visitor.controller.js.map