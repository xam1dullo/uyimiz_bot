import { REMINDER_REPO } from './reminders.tokens';
import { Module } from '@nestjs/common';
import { QueueModule } from '../../infrastructure/queues/queue.module';
import { CreateReminderHandler } from './application/commands/create-reminder/create-reminder.handler';
import { SnoozeReminderHandler } from './application/commands/snooze-reminder/snooze-reminder.handler';
import { DeleteReminderHandler } from './application/commands/delete-reminder/delete-reminder.handler';
import { DrizzleReminderRepository } from './infrastructure/repositories/drizzle-reminder.repository';
import { ReminderBotUpdate } from './presentation/bot/reminder.update';
import { ReminderController } from './presentation/http/reminder.controller';
import { ReminderProcessor } from './application/processors/reminder.processor';
import { BullModule } from '@nestjs/bull';
import { QUEUES } from '../../infrastructure/queues/queue.constants';

@Module({
  imports: [QueueModule, BullModule.registerQueue({ name: QUEUES.REMINDERS })],
  controllers: [ReminderController],
  providers: [
    CreateReminderHandler,
    SnoozeReminderHandler,
    DeleteReminderHandler,
    { provide: REMINDER_REPO, useClass: DrizzleReminderRepository },
    ReminderBotUpdate, ReminderProcessor,
  ],
  exports: [REMINDER_REPO],
})
export class RemindersModule {}
