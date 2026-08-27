import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class WalletService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async getWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!wallet) {
      // Find user, and initialize wallet
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      wallet = await this.prisma.wallet.create({
        data: {
          userId,
          balance: 500, // Default signup credit
          currency: 'INR',
        },
        include: {
          transactions: true,
        },
      });
    }

    return wallet;
  }

  async debit(userId: string, amount: number, ticketId?: string, bookingId?: string, operatorId?: string, tx?: any) {
    const prismaClient = tx || this.prisma;

    const wallet = await prismaClient.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      throw new NotFoundException(`Wallet not found for user ${userId}`);
    }

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    // Update wallet balance
    const updatedWallet = await prismaClient.wallet.update({
      where: { userId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    // Write DEBIT record in ledger
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

  async credit(userId: string, amount: number, type: string = 'CREDIT', ticketId?: string, bookingId?: string, operatorId?: string, tx?: any) {
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

    // Update wallet balance
    const updatedWallet = await prismaClient.wallet.update({
      where: { userId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // Write CREDIT record in ledger
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
}
