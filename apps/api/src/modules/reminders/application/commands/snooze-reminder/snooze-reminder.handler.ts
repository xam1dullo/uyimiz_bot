import { Injectable, Logger } from '@nestjs/common';
import { IReminderRepository } from '../../../domain/repositories/reminder.repository.interface';
import { SnoozeReminderCommand } from './snooze-reminder.command';

@Injectable()
export class SnoozeReminderHandler {
  private readonly logger = new Logger(SnoozeReminderHandler.name);

  constructor(private readonly repo: IReminderRepository) {}

  async execute(command: SnoozeReminderCommand): Promise<void> {
    const reminder = await this.repo.findById(command.reminderId);
    if (!reminder) throw new Error('REMINDER_NOT_FOUND');
    reminder.snooze(command.until);
    await this.repo.update(reminder);
  }
}
