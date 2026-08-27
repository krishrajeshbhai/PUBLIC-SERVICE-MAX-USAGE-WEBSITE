var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RedisService_1;
import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
let RedisService = RedisService_1 = class RedisService {
    logger = new Logger(RedisService_1.name);
    client = null;
    fallbackStore = new Map();
    useFallback = false;
    async onModuleInit() {
        try {
            this.client = new Redis({
                host: process.env.REDIS_HOST || 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379,
                lazyConnect: true,
                maxRetriesPerRequest: 1,
                connectTimeout: 2000,
            });
            this.client.on('error', (err) => {
                if (!this.useFallback) {
                    this.logger.warn(`Redis error: ${err.message}. Switching to in-memory fallback.`);
                    this.useFallback = true;
                }
            });
            await this.client.connect();
            await this.client.ping();
            this.logger.log('Successfully connected to Redis server.');
        }
        catch (e) {
            this.logger.warn(`Redis is not running: ${e.message}. Using in-memory fallback store.`);
            this.useFallback = true;
        }
    }
    async get(key) {
        if (this.useFallback || !this.client) {
            return this.fallbackStore.get(key) || null;
        }
        try {
            return await this.client.get(key);
        }
        catch (e) {
            this.logger.warn(`Redis GET failed: ${e.message}. Falling back.`);
            return this.fallbackStore.get(key) || null;
        }
    }
    async set(key, value, ttlSeconds) {
        if (this.useFallback || !this.client) {
            this.fallbackStore.set(key, value);
            return;
        }
        try {
            if (ttlSeconds) {
                await this.client.set(key, value, 'EX', ttlSeconds);
            }
            else {
                await this.client.set(key, value);
            }
        }
        catch (e) {
            this.logger.warn(`Redis SET failed: ${e.message}. Falling back.`);
            this.fallbackStore.set(key, value);
        }
    }
    async del(key) {
        if (this.useFallback || !this.client) {
            this.fallbackStore.delete(key);
            return;
        }
        try {
            await this.client.del(key);
        }
        catch (e) {
            this.logger.warn(`Redis DEL failed: ${e.message}. Falling back.`);
            this.fallbackStore.delete(key);
        }
    }
    async keys(pattern) {
        if (this.useFallback || !this.client) {
            const regexPattern = pattern.replace(/\*/g, '.*');
            const regex = new RegExp(`^${regexPattern}$`);
            return Array.from(this.fallbackStore.keys()).filter((k) => regex.test(k));
        }
        try {
            return await this.client.keys(pattern);
        }
        catch (e) {
            this.logger.warn(`Redis KEYS failed: ${e.message}. Falling back.`);
            const regexPattern = pattern.replace(/\*/g, '.*');
            const regex = new RegExp(`^${regexPattern}$`);
            return Array.from(this.fallbackStore.keys()).filter((k) => regex.test(k));
        }
    }
};
RedisService = RedisService_1 = __decorate([
    Injectable()
], RedisService);
export { RedisService };
//# sourceMappingURL=redis.service.js.map