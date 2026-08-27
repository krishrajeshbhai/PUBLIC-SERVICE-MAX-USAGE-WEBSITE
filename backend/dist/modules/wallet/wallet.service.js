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
import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let WalletService = class WalletService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWallet(userId) {
        let wallet = await this.prisma.wallet.findUnique({
            where: { userId },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!wallet) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }
            wallet = await this.prisma.wallet.create({
                data: {
                    userId,
                    balance: 500,
                    currency: 'INR',
                },
                include: {
                    transactions: true,
                },
            });
        }
        return wallet;
    }
    async debit(userId, amount, ticketId, bookingId, operatorId, tx) {
        const prismaClient = tx || this.prisma;
        const wallet = await prismaClient.wallet.findUnique({ where: { userId } });
        if (!wallet) {
            throw new NotFoundException(`Wallet not found for user ${userId}`);
        }
        if (wallet.balance < amount) {
            throw new BadRequestException('Insufficient wallet balance');
        }
        const updatedWallet = await prismaClient.wallet.update({
            where: { userId },
            data: {
                balance: {
                    decrement: amount,
                },
            },
        });
        const txn = await prismaClient.walletTransaction.create({
            data: {
                walletId: wallet.id,
                userId,
                amount: -amount,
                type: 'DEBIT',
                status: 'COMPLETED',
                ticketId,
                bookingId,
                operatorId,
            },
        });
        return { wallet: updatedWallet, transaction: txn };
    }
    async credit(userId, amount, type = 'CREDIT', ticketId, bookingId, operatorId, tx) {
        const prismaClient = tx || this.prisma;
        let wallet = await prismaClient.wallet.findUnique({ where: { userId } });
        if (!wallet) {
            wallet = await prismaClient.wallet.create({
                data: {
                    userId,
                    balance: 0,
                    currency: 'INR',
                },
            });
        }
        const updatedWallet = await prismaClient.wallet.update({
            where: { userId },
            data: {
                balance: {
                    increment: amount,
                },
            },
        });
        const txn = await prismaClient.walletTransaction.create({
            data: {
                walletId: wallet.id,
                userId,
                amount,
                type,
                status: 'COMPLETED',
                ticketId,
                bookingId,
                operatorId,
            },
        });
        return { wallet: updatedWallet, transaction: txn };
    }
};
WalletService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], WalletService);
export { WalletService };
//# sourceMappingURL=wallet.service.js.map