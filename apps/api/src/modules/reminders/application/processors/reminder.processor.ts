import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUES } from '../../../../infrastructure/queues/queue.constants';
import { Telegraf } from 'telegraf';

interface ReminderJob {
  reminderId: string;
  familyId: string;
  title: string;
  description?: string;
  telegramId: string;
}

@Processor(QUEUES.REMINDERS)
export class ReminderProcessor {
  private readonly logger = new Logger(ReminderProcessor.name);
  private bot: Telegraf | null = null;

  private getBot(): Telegraf {
    if (!this.bot) {
      const token = process.env.BOT_TOKEN;
      if (!token) throw new Error('BOT_TOKEN not set');
      this.bot = new Telegraf(token);
    }
    return this.bot;
  }

  @Process()
  async handleReminder(job: Job<ReminderJob>): Promise<void> {
    const { title, description, telegramId } = job.data;
    this.logger.log(`Processing reminder: ${title} for ${telegramId}`);

    try {
      const message = description 
        ? `🔔 *${title}*\n\n${description}`
        : `🔔 *${title}*`;

      await this.getBot().telegram.sendMessage(telegramId, message, {
        parse_mode: 'Markdown',
      });
      
      this.logger.log(`Reminder sent: ${title} → ${telegramId}`);
    } catch (e) {
      this.logger.error(`Failed to send reminder: ${e}`);
      throw e;
    }
  }
}
