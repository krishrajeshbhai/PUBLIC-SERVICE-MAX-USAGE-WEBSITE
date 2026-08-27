import { PrismaService } from '../../database/prisma.service.js';
export declare class WalletService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getWallet(userId: string): Promise<{
        transactions: {
            id: string;
            createdAt: Date;
            operatorId: string | null;
            type: string;
            userId: string;
            currency: string;
            walletId: string;
            amount: number;
            status: string;
            ticketId: string | null;
            bookingId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        balance: number;
        currency: string;
    }>;
    debit(userId: string, amount: number, ticketId?: string, bookingId?: string, operatorId?: string, tx?: any): Promise<{
        wallet: any;
        transaction: any;
    }>;
    credit(userId: string, amount: number, type?: string, ticketId?: string, bookingId?: string, operatorId?: string, tx?: any): Promise<{
        wallet: any;
        transaction: any;
    }>;
}
