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
import { Controller, Get, Param, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WalletService } from './wallet.service.js';
let WalletController = class WalletController {
    walletService;
    constructor(walletService) {
        this.walletService = walletService;
    }
    async getWallet(userId) {
        const wallet = await this.walletService.getWallet(userId);
        return {
            balance: wallet.balance,
            transactions: wallet.transactions.map((t) => ({
                id: t.id,
                userId: t.userId,
                amount: t.amount,
                type: t.type,
                status: t.status,
                ticketId: t.ticketId || undefined,
                timestamp: t.createdAt.toISOString(),
            })),
        };
    }
};
__decorate([
    Get(':userId'),
    ApiOperation({ summary: 'Get wallet balance and transaction ledger' }),
    ApiResponse({ status: 200, description: 'User balance and transactional history' }),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "getWallet", null);
WalletController = __decorate([
    ApiTags('wallet'),
    Controller({ path: 'wallet', version: '1' }),
    __param(0, Inject(WalletService)),
    __metadata("design:paramtypes", [WalletService])
], WalletController);
export { WalletController };
//# sourceMappingURL=wallet.controller.js.map