import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Update, Command, Start, Help, Action, On } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { I18nService } from '../infrastructure/i18n/i18n.service';

@Update()
@Injectable()
export class BotUpdate {
  private readonly logger = new Logger(BotUpdate.name);

  constructor(private readonly i18n: I18nService) {}

  @Start()
  async start(@Ctx() ctx: Context & { scene?: any }) {
    const lang = this.i18n.getUserLang(ctx);
    await ctx.reply(this.i18n.t(lang, 'common.start'), {
      reply_markup: {
        inline_keyboard: [
          [{ text: this.i18n.t(lang, 'common.start_button'), callback_data: 'start_onboarding' }],
        ],
      },
    });
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    const lang = this.i18n.getUserLang(ctx);
    await ctx.reply(this.i18n.t(lang, 'common.help'));
  }

  @Action('start_onboarding')
  async startOnboarding(@Ctx() ctx: Context & { scene?: any }) {
    await ctx.answerCbQuery();
    await (ctx as any).scene?.enter('ONBOARDING');
  }

  @Command('menu')
  async menu(@Ctx() ctx: Context) {
    const lang = this.i18n.getUserLang(ctx);
    await ctx.reply(this.i18n.t(lang, 'menu.main'), {
      reply_markup: {
        inline_keyboard: [
          [{ text: this.i18n.t(lang, 'menu.family'), callback_data: 'menu_family' }],
          [{ text: this.i18n.t(lang, 'menu.budget'), callback_data: 'menu_budget' }],
          [{ text: this.i18n.t(lang, 'menu.tasks'), callback_data: 'menu_tasks' }],
          [{ text: this.i18n.t(lang, 'menu.reminders'), callback_data: 'menu_reminders' }],
          [{ text: this.i18n.t(lang, 'menu.birthdays'), callback_data: 'menu_birthdays' }],
        ],
      },
    });
  }

  @Action('menu_family')
  async menuFamily(@Ctx() ctx: Context) {
    const lang = this.i18n.getUserLang(ctx);
    await ctx.answerCbQuery();
    await ctx.reply(this.i18n.t(lang, 'family.section'), {
      reply_markup: {
        inline_keyboard: [
          [{ text: this.i18n.t(lang, 'family.members_list'), callback_data: 'family_members' }],
          [{ text: this.i18n.t(lang, 'family.invite_button'), callback_data: 'family_invite' }],
          [{ text: this.i18n.t(lang, 'common.back'), callback_data: 'menu_back' }],
        ],
      },
    });
  }

  @Action('menu_budget')
  async menuBudget(@Ctx() ctx: Context) {
    const lang = this.i18n.getUserLang(ctx);
    await ctx.answerCbQuery();
    await ctx.reply(this.i18n.t(lang, 'budget.section'), {
      reply_markup: {
        inline_keyboard: [
          [{ text: this.i18n.t(lang, 'budget.add_income'), callback_data: 'budget_income' }],
          [{ text: this.i18n.t(lang, 'budget.add_expense'), callback_data: 'budget_expense' }],
          [{ text: this.i18n.t(lang, 'budget.balance'), callback_data: 'budget_balance' }],
          [{ text: this.i18n.t(lang, 'budget.report'), callback_data: 'budget_report' }],
          [{ text: this.i18n.t(lang, 'common.back'), callback_data: 'menu_back' }],
        ],
      },
    });
  }

  @Action('menu_tasks')
  async menuTasks(@Ctx() ctx: Context) {
    const lang = this.i18n.getUserLang(ctx);
    await ctx.answerCbQuery();
    await ctx.reply(`📋 ${this.i18n.t(lang, 'menu.tasks')} ${this.i18n.t(lang, 'menu.coming_soon')}`);
  }

  @Action('menu_reminders')
  async menuReminders(@Ctx() ctx: Context) {
    const lang = this.i18n.getUserLang(ctx);
    await ctx.answerCbQuery();
    await ctx.reply(`${this.i18n.t(lang, 'reminder.section')}. ${this.i18n.t(lang, 'reminder.new')}`);
  }

  @Action('menu_birthdays')
  async menuBirthdays(@Ctx() ctx: Context) {
    const lang = this.i18n.getUserLang(ctx);
    await ctx.answerCbQuery();
    await ctx.reply(`🎂 ${this.i18n.t(lang, 'menu.birthdays')} ${this.i18n.t(lang, 'menu.coming_soon')}`);
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
    const lang = this.i18n.getUserLang(ctx);
    await ctx.answerCbQuery();
    const familyId = ctx.session?.familyId;
    if (!familyId) {
      await ctx.reply(this.i18n.t(lang, 'errors.need_family'));
      return;
    }
    await ctx.reply(this.i18n.t(lang, 'budget.balance.calculating'));
  }

  @On('text')
  async onText(@Ctx() ctx: Context & { session?: any }) {
    const text = (ctx as any).message?.text;
    this.logger.log(`Message from ${ctx.from?.id}: ${text}`);
  }
}
