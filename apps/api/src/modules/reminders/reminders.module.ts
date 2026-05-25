import { Module } from '@nestjs/common';
import { CreateReminderHandler } from './application/commands/create-reminder/create-reminder.handler';
import { SnoozeReminderHandler } from './application/commands/snooze-reminder/snooze-reminder.handler';
import { DrizzleReminderRepository } from './infrastructure/repositories/drizzle-reminder.repository';
import { ReminderBotUpdate } from './presentation/bot/reminder.update';

export const REMINDER_REPO = Symbol('IReminderRepository');

@Module({
  providers: [
    CreateReminderHandler,
    SnoozeReminderHandler,
    { provide: REMINDER_REPO, useClass: DrizzleReminderRepository },
    ReminderBotUpdate,
  ],
  exports: [REMINDER_REPO],
})
export class RemindersModule {}
