// ─── BotUpdate — Streaming + Smart Edit Router ───

import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Update, Command, Action } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from './keyboard.factory';
import { MenuRegistry } from '../menus/menu.registry';
import { StreamingService } from './streaming.service';
import { MessageManager } from './message-manager';

@Update()
@Injectable()
export class BotUpdate {
  private readonly logger = new Logger(BotUpdate.name);

  constructor(
    private readonly i18n: I18nService,
    private readonly kb: KeyboardFactory,
    private readonly menus: MenuRegistry,
    private readonly stream: StreamingService,
    private readonly msgs: MessageManager,
  ) {
    this.menus.register(require('../menus/main.menu').mainMenu);
    this.menus.register(require('../menus/family.menu').familyMenu);
    this.menus.register(require('../menus/budget.menu').budgetMenu);
    this.menus.register(require('../menus/settings.menu').settingsMenu);
  }

  @Command('menu')
  async menu(@Ctx() ctx: Context) {
    await this.menus.render('main', ctx);
  }

  @Action(/.*/)
  async onAction(@Ctx() ctx: Context) {
    const data: string = (ctx as any).callbackQuery?.data;
    if (!data) return;

    // Answer callback FIRST (Telegram timeout = 0.5s)
    await this.stream.answerFirst(ctx);

    // Try menu routing
    const routed = await this.menus.routeCallback(data, ctx);
    if (routed) return;

    // Module actions — use editOrReply to avoid message flood
    await this.handleAction(data, ctx);
  }

  private async handleAction(data: string, ctx: Context) {
    const l = this.i18n.getUserLang(ctx);

    if (data === 'action:start_onboarding') {
      await (ctx as any).scene?.enter('ONBOARDING');
      return;
    }

    if (data === 'action:budget_income' || data === 'action:budget_expense') {
      await (ctx as any).scene?.enter('BUDGET_ADD');
      return;
    }

    if (data === 'action:budget_balance') {
      const fid = (ctx as any).session?.familyId;
      if (!fid) {
        await this.stream.editOrReply(ctx, this.i18n.t(l, 'errors.need_family'));
        return;
      }
      // Progressive: loading → result
      await this.stream.stream(ctx, [
        { emoji: '💰', placeholder: this.i18n.t(l, 'budget.balance.calculating'), compute: async () => '💰 Balans: hisoblanmoqda...' },
      ]);
      return;
    }

    // Generic: coming soon with emoji
    await this.stream.editOrReply(ctx, `🚧 ${this.i18n.t(l, 'menu.coming_soon')}`);
  }

  // Removed @On('text') — was blocking @Start() handler chain
}
