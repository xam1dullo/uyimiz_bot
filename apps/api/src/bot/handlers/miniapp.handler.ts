import { Injectable } from '@nestjs/common';
import { Ctx, Command } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';

@Injectable()
export class MiniAppHandler {
  constructor(
    private readonly i18n: I18nService,
    private readonly kb: KeyboardFactory,
  ) {}

  @Command('app')
  async openMiniApp(@Ctx() ctx: Context) {
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
