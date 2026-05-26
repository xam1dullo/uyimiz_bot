// ─── Help Handler ───

import { Injectable, Inject, forwardRef } from '@nestjs/common';
import type { Context } from 'telegraf';
import type { BotContext } from '../core/bot-context.types';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';
import { BotPerformance } from '../core/bot-performance';
import { Ctx, Help, Update } from 'nestjs-telegraf';

@Update()
@Injectable()
export class HelpHandler {
  constructor(
    @Inject(forwardRef(() => I18nService)) private readonly i18n: I18nService,
    @Inject(forwardRef(() => KeyboardFactory)) private readonly kb: KeyboardFactory,
  ) {}

  @Help()
  async handle(@Ctx() ctx: BotContext) {
    const l = this.i18n.getUserLang(ctx);
    await BotPerformance.withTyping(ctx, 'typing', async () => {
      await ctx.reply(this.i18n.t(l, 'common.help_text'), {
        reply_markup: this.kb.inline([
          this.kb.row(this.kb.cb(this.i18n.t(l, 'common.back'), 'menu:main:open')),
        ]),
      });
    });
  }
}
