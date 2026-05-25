import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Update, Command, Start, Help, Action, On } from 'nestjs-telegraf';
import type { Context } from 'telegraf';

@Update()
@Injectable()
export class BotUpdate {
  private readonly logger = new Logger(BotUpdate.name);

  @Start()
  async start(@Ctx() ctx: Context & { scene?: any }) {
    await ctx.reply('👋 Xush kelibsiz!', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Boshlash', callback_data: 'start_onboarding' }],
        ],
      },
    });
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await ctx.reply(
      'Mavjud buyruqlar:\n' +
      '/start - Botni ishga tushirish\n' +
      '/help - Yordam\n' +
      '/menu - Asosiy menyu\n' +
      '/create_family - Oila yaratish\n' +
      '/join_family - Oilaga qo\'shilish\n' +
      '/my_family - Oilam\n' +
      '/balance - Balans\n' +
      '/income - Oylik hisobot\n' +
      '/reminders - Eslatmalar\n' +
      '/add_reminder - Eslatma qo\'shish',
    );
  }

  @Action('start_onboarding')
  async startOnboarding(@Ctx() ctx: Context & { scene?: any }) {
    await ctx.answerCbQuery();
    await (ctx as any).scene?.enter('ONBOARDING');
  }

  @Command('menu')
  async menu(@Ctx() ctx: Context) {
    await ctx.reply('🏠 Asosiy menyu', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '👨‍👩‍👧‍👦 Oilam', callback_data: 'menu_family' }],
          [{ text: '💰 Budjet', callback_data: 'menu_budget' }],
          [{ text: '📋 Yumushlar', callback_data: 'menu_tasks' }],
          [{ text: '⏰ Eslatmalar', callback_data: 'menu_reminders' }],
          [{ text: '🎂 Tug\'ilgan kunlar', callback_data: 'menu_birthdays' }],
        ],
      },
    });
  }

  @Action('menu_family')
  async menuFamily(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.reply('👨‍👩‍👧‍👦 Oila bo\'limi', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '👥 A\'zolar', callback_data: 'family_members' }],
          [{ text: '🔑 Taklif kodi', callback_data: 'family_invite' }],
          [{ text: '🔙 Orqaga', callback_data: 'menu_back' }],
        ],
      },
    });
  }

  @Action('menu_budget')
  async menuBudget(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.reply('💰 Budjet bo\'limi', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '➕ Kirim qo\'shish', callback_data: 'budget_income' }],
          [{ text: '➖ Chiqim qo\'shish', callback_data: 'budget_expense' }],
          [{ text: '📊 Balans', callback_data: 'budget_balance' }],
          [{ text: '📈 Hisobot', callback_data: 'budget_report' }],
          [{ text: '🔙 Orqaga', callback_data: 'menu_back' }],
        ],
      },
    });
  }

  @Action('menu_tasks')
  async menuTasks(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.reply('📋 Yumushlar bo\'limi (tez kunda)');
  }

  @Action('menu_reminders')
  async menuReminders(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.reply('⏰ Eslatmalar bo\'limi. /add_reminder - yangi eslatma');
  }

  @Action('menu_birthdays')
  async menuBirthdays(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.reply('🎂 Tug\'ilgan kunlar (tez kunda)');
  }

  @Action('menu_back')
  async menuBack(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await this.menu(ctx);
  }

  @Action('budget_income')
  async budgetIncome(@Ctx() ctx: Context & { scene?: any }) {
    await ctx.answerCbQuery();
    await (ctx as any).scene?.enter('BUDGET_ADD');
  }

  @Action('budget_expense')
  async budgetExpense(@Ctx() ctx: Context & { scene?: any }) {
    await ctx.answerCbQuery();
    await (ctx as any).scene?.enter('BUDGET_ADD');
  }

  @Action('budget_balance')
  async budgetBalance(@Ctx() ctx: Context & { session?: any }) {
    await ctx.answerCbQuery();
    const familyId = ctx.session?.familyId;
    if (!familyId) {
      await ctx.reply('Avval oilaga qo\'shiling!');
      return;
    }
    await ctx.reply('Balans hisoblanmoqda... /balance buyrug\'idan foydalaning');
  }

  @On('text')
  async onText(@Ctx() ctx: Context & { session?: any }) {
    const text = (ctx as any).message?.text;
    this.logger.log(`Message from ${ctx.from?.id}: ${text}`);
  }
}
