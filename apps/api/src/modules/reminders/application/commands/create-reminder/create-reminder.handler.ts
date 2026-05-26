import { REMINDER_REPO } from '../../../reminders.tokens';
import { Injectable, Inject } from '@nestjs/common';
import { QueueService } from '../../../../../infrastructure/queues/queue.service';
import { QUEUES } from '../../../../../infrastructure/queues/queue.constants';
import { IReminderRepository } from '../../../domain/repositories/reminder.repository.interface';
import { ReminderEntity } from '../../../domain/entities/reminder.entity';
import { CreateReminderCommand } from './create-reminder.command';

@Injectable()
export class CreateReminderHandler {
  constructor(
    @Inject(REMINDER_REPO) private readonly repo: IReminderRepository,
    private readonly queue: QueueService,
  ) {}

  async execute(command: CreateReminderCommand): Promise<ReminderEntity> {
    // 1. Create in DB
    const entity = ReminderEntity.create(
      command.familyId,
      command.title,
      command.type,
      command.scheduledAt,
      command.createdBy,
      command.description,
    );

    const saved = await this.repo.create(entity);

    // 2. Schedule in BullMQ for delayed notification
    const now = Date.now();
    const scheduledTime = new Date(command.scheduledAt).getTime();
    const delay = Math.max(0, scheduledTime - now);

    try {
      const jobId = await this.queue.add(QUEUES.REMINDERS, {
        type: 'send_reminder',
        payload: {
          reminderId: saved.id,
          familyId: command.familyId,
          title: command.title,
          description: command.description,
          telegramId: command.createdBy,
        },
      }, delay);

      // 3. Save jobId to reminder
      saved.jobId = jobId;
      await this.repo.update(saved);
    } catch (e) {
      // Queue failed but reminder is already saved
      // Will be picked up by periodic scan
    }

    return saved;
  }
}
