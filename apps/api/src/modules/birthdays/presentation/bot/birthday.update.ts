import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Update, Command } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
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

  @Command('birthdays')
  async list(@Ctx() ctx: Context & { session?: { familyId?: string } }) {
    const l = this.i18n.getUserLang(ctx);
    const fid = ctx.session?.familyId;
    if (!fid) { await ctx.reply(this.i18n.t(l, 'errors.need_family')); return; }
    const birthdays = await this.listBirthdays.execute({ familyId: fid });
    if (birthdays.length === 0) {
      await ctx.reply('🎂 Hozircha tug\'ilgan kunlar yo\'q.');
      return;
    }
    const list = birthdays.map((b) => `- ${b.name}: ${b.birthDate}`).join('\n');
    await ctx.reply(`🎂 Tug'ilgan kunlar:\n${list}`);
  }
}
