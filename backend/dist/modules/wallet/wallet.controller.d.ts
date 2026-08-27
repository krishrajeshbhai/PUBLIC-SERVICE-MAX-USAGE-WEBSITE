import { WalletService } from './wallet.service.js';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getWallet(userId: string): Promise<{
        balance: number;
        transactions: {
            id: string;
            userId: string;
            amount: number;
            type: string;
            status: string;
            ticketId: string | undefined;
            timestamp: string;
        }[];
    }>;
}
