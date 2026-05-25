import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QUEUES } from './queue.constants';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: process.env.REDIS_URL ?? 'redis://localhost:6379',
      }),
    }),
    BullModule.registerQueue(
      ...Object.values(QUEUES).map((name) => ({ name })),
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}
