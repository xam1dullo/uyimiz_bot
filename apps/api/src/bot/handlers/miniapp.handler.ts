import { Injectable, Inject, forwardRef } from '@nestjs/common';
import type { Context } from 'telegraf';
import type { BotContext } from '../core/bot-context.types';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';
import { Command, Ctx, Update } from 'nestjs-telegraf';

@Update()
@Injectable()
export class MiniAppHandler {
  constructor(
    @Inject(forwardRef(() => I18nService)) private readonly i18n: I18nService,
    @Inject(forwardRef(() => KeyboardFactory)) private readonly kb: KeyboardFactory,
  ) {}

  @Command('app')
  async openMiniApp(@Ctx() ctx: BotContext) {
    const l = this.i18n.getUserLang(ctx);
    const miniAppUrl = process.env.MINIAPP_URL ?? 'https://t.me/uyimiz_bot/app';

    await ctx.reply(
      this.i18n.t(l, 'miniapp.open'),
      this.kb.inline([
        this.kb.row(this.kb.webApp('📱 ' + this.i18n.t(l, 'miniapp.open_btn'), miniAppUrl)),
        this.kb.row(this.kb.cb(this.i18n.t(l, 'common.back'), 'menu:main:open')),
      ]),
    );
  }
}
