import { Controller, Get, Param, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WalletService } from './wallet.service.js';

@ApiTags('wallet')
@Controller({ path: 'wallet', version: '1' })
export class WalletController {
  constructor(
    @Inject(WalletService) private readonly walletService: WalletService,
  ) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get wallet balance and transaction ledger' })
  @ApiResponse({ status: 200, description: 'User balance and transactional history' })
  async getWallet(@Param('userId') userId: string) {
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
}
