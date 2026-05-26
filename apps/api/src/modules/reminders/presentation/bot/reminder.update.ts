import { Injectable, Logger, Inject } from '@nestjs/common';
import { Ctx, Update, Command } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import type { BotContext } from '../../../../bot/core/bot-context.types';
import { I18nService } from '../../../../infrastructure/i18n/i18n.service';
import { CreateReminderHandler } from '../../application/commands/create-reminder/create-reminder.handler';
import { REMINDER_REPO } from '../../reminders.tokens';
import { IReminderRepository } from '../../domain/repositories/reminder.repository.interface';
import { CreateReminderCommand } from '../../application/commands/create-reminder/create-reminder.command';

@Update()
@Injectable()
export class ReminderBotUpdate {
  private readonly logger = new Logger(ReminderBotUpdate.name);

  constructor(
    private readonly i18n: I18nService,
    private readonly createReminder: CreateReminderHandler,
    @Inject(REMINDER_REPO) private readonly repo: IReminderRepository,
  ) {}

  private lang(ctx: Context): string {
    return ctx.session.lang ?? 'uz';
  }

  @Command('reminders')
  async list(@Ctx() ctx: BotContext) {
    const l = this.lang(ctx);
    const familyId = ctx.session.familyId;
    if (!familyId) {
      await ctx.reply(this.i18n.t(l, 'budget.no_family'));
      return;
    }
    const reminders = await this.repo.findByFamilyId(familyId);
    if (reminders.length === 0) {
      await ctx.reply(this.i18n.t(l, 'reminders.empty'));
      return;
    }
    const list = reminders
      .map((r) => `${r.isActive ? '🔔' : '🔕'} ${r.title} — ${new Date(r.scheduledAt).toLocaleString()}`)
      .join('\n');
    await ctx.reply(`🔔 ${this.i18n.t(l, 'reminders.list')}\n\n${list}`);
  }

  @Command('add_reminder')
  async add(@Ctx() ctx: BotContext) {
    const l = this.lang(ctx);
    await ctx.reply(this.i18n.t(l, 'reminders.add_prompt'));
  }
}
