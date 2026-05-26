import { REMINDER_REPO } from '../../../reminders.tokens';
import { Injectable, Inject } from '@nestjs/common';
import { QueueService } from '../../../../../infrastructure/queues/queue.service';
import { QUEUES } from '../../../../../infrastructure/queues/queue.constants';
import { IReminderRepository } from '../../../domain/repositories/reminder.repository.interface';
import { DeleteReminderCommand } from './delete-reminder.command';

@Injectable()
export class DeleteReminderHandler {
  constructor(
    @Inject(REMINDER_REPO) private readonly repo: IReminderRepository,
    private readonly queue: QueueService,
  ) {}

  async execute(command: DeleteReminderCommand): Promise<void> {
    // Find reminder to get jobId
    const reminder = await this.repo.findById(command.reminderId, command.familyId);
    if (!reminder) return;

    // Cancel scheduled job
    if (reminder.jobId) {
      await this.queue.cancel(QUEUES.REMINDERS, reminder.jobId);
    }

    // Delete from DB
    await this.repo.delete(command.reminderId, reminder.familyId);
  }
}
