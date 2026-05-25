import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Update, Command, Action } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { AddRecordHandler } from '../../application/commands/add-record/add-record.handler';
import { GetBalanceHandler } from '../../application/queries/get-balance/get-balance.handler';
import { GetMonthlySummaryHandler } from '../../application/queries/get-monthly-summary/get-monthly-summary.handler';
import { formatCurrency } from '@uyimiz/shared';

@Update()
@Injectable()
export class BudgetBotUpdate {
  private readonly logger = new Logger(BudgetBotUpdate.name);

  constructor(
    private readonly addRecord: AddRecordHandler,
    private readonly getBalance: GetBalanceHandler,
    private readonly getMonthlySummary: GetMonthlySummaryHandler,
  ) {}

  @Command('balance')
  async balance(@Ctx() ctx: Context & { session?: any }) {
    try {
      const familyId = ctx.session?.familyId;
      if (!familyId) {
        await ctx.reply('Avval oilaga qo\'shiling! /join_family');
        return;
      }
      const balance = await this.getBalance.execute({ familyId });
      await ctx.reply(`💰 Balans: ${formatCurrency(balance)}`);
    } catch (e) {
      this.logger.error('Balance failed', e);
      await ctx.reply('❌ Xatolik yuz berdi.');
    }
  }

  @Command('income')
  async income(@Ctx() ctx: Context & { session?: any }) {
    const familyId = ctx.session?.familyId;
    if (!familyId) {
      await ctx.reply('Avval oilaga qo\'shiling!');
      return;
    }
    const now = new Date();
    const summary = await this.getMonthlySummary.execute({ familyId, year: now.getFullYear(), month: now.getMonth() + 1 });
    await ctx.reply(
      `📊 *Oylik hisobot*\n\n` +
      `Kirim: ${formatCurrency(summary.income)}\n` +
      `Chiqim: ${formatCurrency(summary.expense)}\n` +
      `Farq: ${formatCurrency(summary.balance)}`,
      { parse_mode: 'Markdown' },
    );
  }
}
