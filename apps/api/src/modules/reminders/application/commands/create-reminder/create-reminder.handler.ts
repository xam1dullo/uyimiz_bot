import { REMINDER_REPO } from '../../../reminders.tokens';
import { Injectable, Inject } from '@nestjs/common';
import { IReminderRepository } from '../../../domain/repositories/reminder.repository.interface';
import { ReminderEntity } from '../../../domain/entities/reminder.entity';
import { CreateReminderCommand } from './create-reminder.command';

@Injectable()
export class CreateReminderHandler {
  constructor(@Inject(REMINDER_REPO) private readonly repo: IReminderRepository) {}

  async execute(command: CreateReminderCommand): Promise<ReminderEntity> {
    const entity = ReminderEntity.create(
      command.familyId,
      command.title,
      command.type,
      command.scheduledAt,
      command.createdBy,
      command.description,
    );
    return this.repo.create(entity);
  }
}
