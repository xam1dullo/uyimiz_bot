import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { Ctx, Update, Command, Action } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import type { BotContext } from '../../../../bot/core/bot-context.types';
import { AddRecordHandler } from '../../application/commands/add-record/add-record.handler';
import { GetBalanceHandler } from '../../application/queries/get-balance/get-balance.handler';
import { GetMonthlySummaryHandler } from '../../application/queries/get-monthly-summary/get-monthly-summary.handler';
import { I18nService } from '../../../../infrastructure/i18n/i18n.service';
import { formatCurrency } from '@uyimiz/shared';

@Update()
@Injectable()
export class BudgetBotUpdate {
  private readonly logger = new Logger(BudgetBotUpdate.name);

  constructor(
    @Inject(forwardRef(() => AddRecordHandler)) private readonly addRecord: AddRecordHandler,
    private readonly getBalance: GetBalanceHandler,
    private readonly getMonthlySummary: GetMonthlySummaryHandler,
    private readonly i18n: I18nService,
  ) {}

  private lang(ctx: Context): string {
    return ctx.session.lang ?? 'uz';
  }

  @Command('balance')
  async balance(@Ctx() ctx: BotContext) {
    try {
      const l = this.lang(ctx);
      const familyId = ctx.session.familyId;
      if (!familyId) {
        await ctx.reply(this.i18n.t(l, 'budget.no_family'));
        return;
      }
      const balance = await this.getBalance.execute({ familyId });
      await ctx.reply(this.i18n.t(l, 'common.balance').replace('{amount}', formatCurrency(balance)));
    } catch (e) {
      this.logger.error('Balance failed', e);
      const l = this.lang(ctx);
      await ctx.reply(this.i18n.t(l, 'budget.error'));
    }
  }

  @Command('income')
  async income(@Ctx() ctx: BotContext) {
    const l = this.lang(ctx);
    const familyId = ctx.session.familyId;
    if (!familyId) {
      await ctx.reply(this.i18n.t(l, 'budget.no_family'));
      return;
    }
    const now = new Date();
    const summary = await this.getMonthlySummary.execute({ 
      familyId, year: now.getFullYear(), month: now.getMonth() + 1 
    });
    await ctx.reply(
      `📊 *${this.i18n.t(l, 'budget.report')}*\n\n` +
      `⬆️ ${this.i18n.t(l, 'budget.add_income')}: ${formatCurrency(summary.income)}\n` +
      `⬇️ ${this.i18n.t(l, 'budget.add_expense')}: ${formatCurrency(summary.expense)}\n` +
      `📊 Balance: ${formatCurrency(summary.balance)}`,
      { parse_mode: 'Markdown' },
    );
  }

  @Action('action:budget_balance')
  async onBalanceAction(@Ctx() ctx: BotContext) {
    await ctx.answerCbQuery();
    return this.balance(ctx);
  }

  @Action('action:budget_report')
  async onReportAction(@Ctx() ctx: BotContext) {
    await ctx.answerCbQuery();
    return this.income(ctx);
  }
}
