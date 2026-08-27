import { PrismaService } from '../../database/prisma.service.js';
export declare class StopsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStops(): Promise<{
        id: string;
        name: string;
        lat: number;
        lng: number;
        noStairs: boolean;
    }[]>;
}
