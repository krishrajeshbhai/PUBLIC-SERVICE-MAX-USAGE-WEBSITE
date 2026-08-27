import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private fallbackStore = new Map<string, string>();
  private useFallback = false;

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
    } catch (e: any) {
      this.logger.warn(`Redis is not running: ${e.message}. Using in-memory fallback store.`);
      this.useFallback = true;
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.useFallback || !this.client) {
      return this.fallbackStore.get(key) || null;
    }
    try {
      return await this.client.get(key);
    } catch (e: any) {
      this.logger.warn(`Redis GET failed: ${e.message}. Falling back.`);
      return this.fallbackStore.get(key) || null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.useFallback || !this.client) {
      this.fallbackStore.set(key, value);
      return;
    }
    try {
      if (ttlSeconds) {
        await this.client.set(key, value, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, value);
      }
    } catch (e: any) {
      this.logger.warn(`Redis SET failed: ${e.message}. Falling back.`);
      this.fallbackStore.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    if (this.useFallback || !this.client) {
      this.fallbackStore.delete(key);
      return;
    }
    try {
      await this.client.del(key);
    } catch (e: any) {
      this.logger.warn(`Redis DEL failed: ${e.message}. Falling back.`);
      this.fallbackStore.delete(key);
    }
  }

  async keys(pattern: string): Promise<string[]> {
    if (this.useFallback || !this.client) {
      const regexPattern = pattern.replace(/\*/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`);
      return Array.from(this.fallbackStore.keys()).filter((k) => regex.test(k));
    }
    try {
      return await this.client.keys(pattern);
    } catch (e: any) {
      this.logger.warn(`Redis KEYS failed: ${e.message}. Falling back.`);
      const regexPattern = pattern.replace(/\*/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`);
      return Array.from(this.fallbackStore.keys()).filter((k) => regex.test(k));
    }
  }
}
