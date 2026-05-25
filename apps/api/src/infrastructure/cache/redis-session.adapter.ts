import { Injectable } from '@nestjs/common';

/**
 * Redis session adapter for telegraf.
 * Usage: session({ store: new RedisSessionStore(redisClient) })
 * 
 * Currently using in-memory (telegraf default).
 * Switch to this when Redis is needed for session persistence.
 */
@Injectable()
export class RedisSessionStore {
  private store = new Map<string, string>();

  async get(key: string): Promise<Record<string, unknown> | undefined> {
    const val = this.store.get(key);
    return val ? JSON.parse(val) : undefined;
  }

  async set(key: string, value: Record<string, unknown>): Promise<void> {
    this.store.set(key, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}
