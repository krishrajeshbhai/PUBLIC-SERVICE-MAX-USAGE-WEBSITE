import { OnModuleInit } from '@nestjs/common';
export declare class RedisService implements OnModuleInit {
    private readonly logger;
    private client;
    private fallbackStore;
    private useFallback;
    onModuleInit(): Promise<void>;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
    keys(pattern: string): Promise<string[]>;
}
