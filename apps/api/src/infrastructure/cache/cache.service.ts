import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const value = await this.cache.get<T>(key);
      return value ?? undefined;
    } catch (e) {
      this.logger.warn(`Cache get failed for ${key}`);
      return undefined;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cache.set(key, value, ttl ?? 5 * 60 * 1000);
    } catch (e) {
      this.logger.warn(`Cache set failed for ${key}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cache.del(key);
    } catch (e) {
      this.logger.warn(`Cache del failed for ${key}`);
    }
  }

  async getOrSet<T>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) return cached;
    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  static budgetBalanceKey(familyId: string): string {
    return `budget:balance:${familyId}`;
  }

  static budgetMonthlyKey(familyId: string, year: number, month: number): string {
    return `budget:monthly:${familyId}:${year}:${month}`;
  }

  static budgetCategoriesKey(familyId: string): string {
    return `budget:categories:${familyId}`;
  }
}
