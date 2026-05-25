// ─── Help Handler ───

import { Injectable } from '@nestjs/common';
import { Ctx, Help } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';
import { BotPerformance } from '../core/bot-performance';

@Injectable()
export class HelpHandler {
  constructor(
    private readonly i18n: I18nService,
    private readonly kb: KeyboardFactory,
  ) {}

  @Help()
  async handle(@Ctx() ctx: Context) {
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
