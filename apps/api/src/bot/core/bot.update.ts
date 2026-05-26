// ─── BotUpdate — Thin dispatch layer ───
// Delegates to ActionRouter + MenuRegistry. Zero action logic.

import { Injectable, Logger, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { Ctx, Update, Command, Action } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import type { BotContext } from './bot-context.types';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { MenuRegistry } from '../menus/menu.registry';
import { ActionRouter } from './action-router';
import { StreamingService } from './streaming.service';

@Update()
@Injectable()
export class BotUpdate implements OnModuleInit {
  private readonly logger = new Logger(BotUpdate.name);

  constructor(
    @Inject(forwardRef(() => I18nService)) private readonly i18n: I18nService,
    @Inject(forwardRef(() => MenuRegistry)) private readonly menus: MenuRegistry,
    @Inject(forwardRef(() => ActionRouter)) private readonly router: ActionRouter,
    @Inject(forwardRef(() => StreamingService)) private readonly stream: StreamingService,
  ) {}

  /** Register built-in menus. Feature modules register theirs via onModuleInit. */
  onModuleInit(): void {
    // Built-in menus registered by importing modules
    // Feature menus: BudgetModule, TasksModule etc register via DI
  }

  @Command('menu')
  async menu(@Ctx() ctx: BotContext) {
    await this.menus.render('main', ctx);
  }

  /** All callback_data routes through ActionRouter */
  @Action(/.*/)
  async onAction(@Ctx() ctx: BotContext) {
    const data = (ctx.callbackQuery as { data: string })?.data;
    if (!data) return;

    // Answer callback FIRST (Telegram timeout = 0.5s)
    await this.stream.answerFirst(ctx);

    // Try menu routing
    const routed = await this.menus.routeCallback(data, ctx);
    if (routed) return;

    // Delegate to registered action handlers
    const consumed = await this.router.dispatch(data, ctx);
    if (consumed) return;

    // Fallback
    const l = this.i18n.getUserLang(ctx);
    await this.stream.editOrReply(ctx, '🚧 ' + this.i18n.t(l, 'menu.coming_soon'));
  }
}
