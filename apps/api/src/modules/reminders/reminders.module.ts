import { REMINDER_REPO } from './reminders.tokens';
import { Module } from '@nestjs/common';
import { QueueModule } from '../../infrastructure/queues/queue.module';
import { CreateReminderHandler } from './application/commands/create-reminder/create-reminder.handler';
import { SnoozeReminderHandler } from './application/commands/snooze-reminder/snooze-reminder.handler';
import { DeleteReminderHandler } from './application/commands/delete-reminder/delete-reminder.handler';
import { DrizzleReminderRepository } from './infrastructure/repositories/drizzle-reminder.repository';
import { ReminderBotUpdate } from './presentation/bot/reminder.update';
import { ReminderController } from './presentation/http/reminder.controller';

@Module({
  imports: [QueueModule],
  controllers: [ReminderController],
  providers: [
    CreateReminderHandler,
    SnoozeReminderHandler,
    DeleteReminderHandler,
    { provide: REMINDER_REPO, useClass: DrizzleReminderRepository },
    ReminderBotUpdate,
  ],
  exports: [REMINDER_REPO],
})
export class RemindersModule {}
