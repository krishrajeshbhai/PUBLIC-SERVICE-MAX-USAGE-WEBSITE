import { PrismaService } from '../../database/prisma.service.js';
export declare class OperationsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        activeVehicles: number;
        incidents: {
            id: string;
            type: string;
            severity: string;
            status: string;
            location: string | null;
            description: string;
            createdAt: string;
        }[];
        affectedCommuters: number;
    }>;
    getOfflinePackage(userId?: string): {
        userId: string;
        generatedAt: string;
        essentialMaps: {
            name: string;
            url: string;
        }[];
        emergencyContacts: {
            name: string;
            phone: string;
        }[];
    };
}
