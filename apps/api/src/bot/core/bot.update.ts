// ─── BotUpdate — Thin router, delegates to menus and handlers ───

import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Update, Command, Action, On } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from './keyboard.factory';
import { MenuRegistry } from '../menus/menu.registry';
import { BotPerformance } from './bot-performance';

@Update()
@Injectable()
export class BotUpdate {
  private readonly logger = new Logger(BotUpdate.name);
  private readonly rateLimiter = BotPerformance.rateLimiter(30, 60_000);

  constructor(
    private readonly i18n: I18nService,
    private readonly kb: KeyboardFactory,
    private readonly menus: MenuRegistry,
  ) {
    this.menus.register(require('../menus/main.menu').mainMenu);
    this.menus.register(require('../menus/family.menu').familyMenu);
    this.menus.register(require('../menus/budget.menu').budgetMenu);
    this.menus.register(require('../menus/settings.menu').settingsMenu);
  }

  // ═══ COMMANDS ═══

  @Command('menu')
  async menu(@Ctx() ctx: Context) {
    await this.menus.render('main', ctx, this.i18n, this.kb);
  }

  // ═══ CALLBACK ACTIONS ═══

  @Action(/.*/)
  async onAction(@Ctx() ctx: Context) {
    const data: string = (ctx as any).callbackQuery?.data;
    if (!data) return;

    // Try menu routing first
    const routed = await this.menus.routeCallback(data, ctx);
    if (routed) return;

    // Module-specific actions
    await this.handleModuleAction(data, ctx);
  }

  private async handleModuleAction(data: string, ctx: Context) {
    const l = this.i18n.getUserLang(ctx);

    // Quick action map
    const actions: Record<string, () => Promise<void>> = {
      'action:start_onboarding': async () => {
        await ctx.answerCbQuery();
        await (ctx as any).scene?.enter('ONBOARDING');
      },
      'action:budget_income': async () => {
        await ctx.answerCbQuery();
        await (ctx as any).scene?.enter('BUDGET_ADD');
      },
      'action:budget_expense': async () => {
        await ctx.answerCbQuery();
        await (ctx as any).scene?.enter('BUDGET_ADD');
      },
      'action:budget_balance': async () => {
        await ctx.answerCbQuery();
        const fid = (ctx as any).session?.familyId;
        await ctx.reply(fid ? '💰 Balans hisoblanmoqda...' : this.i18n.t(l, 'errors.need_family'));
      },
      'action:budget_report': async () => {
        await ctx.answerCbQuery();
        await ctx.reply('📈 ' + this.i18n.t(l, 'menu.coming_soon'));
      },
    };

    const handler = actions[data];
    if (handler) { await handler(); return; }

    // Default: coming soon
    await ctx.answerCbQuery();
    await ctx.reply(this.i18n.t(l, 'menu.coming_soon'));
  }

  // ═══ TEXT MESSAGES ═══

  @On('text')
  async onText(@Ctx() ctx: Context & { session?: any }) {
    const userId = String(ctx.from?.id);
    if (!this.rateLimiter(userId)) return;

    const text = (ctx as any).message?.text;
    this.logger.log(`Message from ${userId}: ${text}`);
  }
}
