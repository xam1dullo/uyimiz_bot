import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { createClient, type RedisClientType } from 'redis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private client: RedisClientType | null = null;
  private readonly defaultTTL = 300; // 5 minutes

  constructor() {
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      const url = process.env.REDIS_URL;
      if (!url) { this.logger.warn('REDIS_URL not set, cache disabled'); return; }

      this.client = createClient({ url });
      await this.client.connect();
      this.logger.log('Redis connected');
    } catch (e) {
      this.logger.warn('Redis unavailable, cache disabled');
      this.client = null;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;
    try {
      const val = await this.client.get(key);
      return val ? (JSON.parse(val) as T) : null;
    } catch { return null; }
  }

  async set(key: string, value: unknown, ttl = this.defaultTTL): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
    } catch { /* silent */ }
  }

  async del(key: string): Promise<void> {
    if (!this.client) return;
    try { await this.client.del(key); } catch { /* silent */ }
  }

  async getOrSet<T>(key: string, factory: () => Promise<T>, ttl = this.defaultTTL): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;
    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  /** Cache budget balance */
  async getBudgetBalance(familyId: string): Promise<number | null> {
    return this.get<number>(`budget:balance:${familyId}`);
  }

  async setBudgetBalance(familyId: string, balance: number): Promise<void> {
    await this.set(`budget:balance:${familyId}`, balance, 60); // 1 min TTL
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) await this.client.quit();
  }
}
