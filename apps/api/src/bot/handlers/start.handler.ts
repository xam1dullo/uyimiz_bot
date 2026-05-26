// ─── Start Handler ───

import { Injectable, Inject, forwardRef } from '@nestjs/common';
import type { Context } from 'telegraf';
import type { BotContext } from '../core/bot-context.types';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';
import { Ctx, Start, Update } from 'nestjs-telegraf';

@Update()
@Injectable()
export class StartHandler {
  constructor(
    @Inject(forwardRef(() => I18nService)) private readonly i18n: I18nService,
    @Inject(forwardRef(() => KeyboardFactory)) private readonly kb: KeyboardFactory,
  ) {}

  @Start()
  async handle(@Ctx() ctx: BotContext) {
    const l = this.i18n.getUserLang(ctx);
    
    // Simple direct reply
    await ctx.reply(
      `👋 ${this.i18n.t(l, 'common.welcome')}\n\n${this.i18n.t(l, 'common.welcome_desc')}`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🚀 ' + this.i18n.t(l, 'common.start_btn'), callback_data: 'action:start_onboarding' }],
            [{ text: '📋 ' + this.i18n.t(l, 'menu.main'), callback_data: 'menu:main:open' }],
          ],
        },
      },
    );
  }
}
