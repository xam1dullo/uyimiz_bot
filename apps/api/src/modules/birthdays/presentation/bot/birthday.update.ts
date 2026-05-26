import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Update, Command } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import type { BotContext } from '../../../../bot/core/bot-context.types';
import { ListBirthdaysHandler } from '../../application/queries/list/list-birthdays.handler';
import { CreateBirthdayHandler } from '../../application/commands/create/create-birthday.handler';
import { I18nService } from '../../../../infrastructure/i18n/i18n.service';

@Update()
@Injectable()
export class BirthdayBotUpdate {
  private readonly logger = new Logger(BirthdayBotUpdate.name);

  constructor(
    private readonly listBirthdays: ListBirthdaysHandler,
    private readonly createBirthday: CreateBirthdayHandler,
    private readonly i18n: I18nService,
  ) {}

  private lang(ctx: Context): string {
    return ctx.session.lang ?? 'uz';
  }

  @Command('birthdays')
  async list(@Ctx() ctx: BotContext) {
    const l = this.lang(ctx);
    const familyId = ctx.session.familyId;
    if (!familyId) {
      await ctx.reply(this.i18n.t(l, 'budget.no_family'));
      return;
    }
    const birthdays = await this.listBirthdays.execute({ familyId });
    if (birthdays.length === 0) {
      await ctx.reply(this.i18n.t(l, 'birthdays.empty'));
      return;
    }
    const list = birthdays.map((b) => `🎂 ${b.name}: ${b.birthDate}`).join('\n');
    await ctx.reply(`🎂 ${this.i18n.t(l, 'menu.birthdays')}:\n${list}`);
  }
}
