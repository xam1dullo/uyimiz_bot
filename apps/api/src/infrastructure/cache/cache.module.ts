import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { CacheService } from './cache.service';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      useFactory: () => ({
        stores: [new KeyvRedis(process.env.REDIS_URL ?? 'redis://localhost:6379')],
        ttl: 5 * 60 * 1000,
      }),
    }),
  ],
  providers: [CacheService],
  exports: [NestCacheModule, CacheService],
})
export class CacheModule {}
