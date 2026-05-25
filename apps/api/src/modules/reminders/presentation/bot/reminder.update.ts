import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Update, Command } from 'nestjs-telegraf';
import type { Context } from 'telegraf';

@Update()
@Injectable()
export class ReminderBotUpdate {
  private readonly logger = new Logger(ReminderBotUpdate.name);

  @Command('reminders')
  async list(@Ctx() ctx: Context & { session?: any }) {
    const familyId = ctx.session?.familyId;
    if (!familyId) {
      await ctx.reply('Avval oilaga qo\'shiling!');
      return;
    }
    await ctx.reply('⏰ Eslatmalar bo\'limi. /add_reminder - yangi eslatma qo\'shish');
  }

  @Command('add_reminder')
  async add(@Ctx() ctx: Context) {
    await ctx.reply('Eslatma matnini kiriting:');
  }
}
