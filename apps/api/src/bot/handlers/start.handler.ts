// ─── Start Handler ───

import { Injectable } from '@nestjs/common';
import { Ctx, Start } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';

@Injectable()
export class StartHandler {
  constructor(
    private readonly i18n: I18nService,
    private readonly kb: KeyboardFactory,
  ) {}

  @Start()
  async handle(@Ctx() ctx: Context & { scene?: any; startPayload?: string }) {
    const l = this.i18n.getUserLang(ctx);
    const payload = (ctx as any).startPayload;

    if (payload) {
      await this.handleDeepLink(ctx, payload);
      return;
    }

    await ctx.reply(this.i18n.t(l, 'common.welcome'), {
      reply_markup: this.kb.inline([
        this.kb.row(this.kb.cb(this.i18n.t(l, 'common.start_btn'), 'action:start_onboarding')),
        this.kb.row(this.kb.cb(this.i18n.t(l, 'menu.main'), 'menu:main:open')),
      ]),
    });
  }

  private async handleDeepLink(ctx: Context, payload: string) {
    const params = new URLSearchParams(payload);
    const code = params.get('code');
    if (params.get('action') === 'join' && code) {
      await ctx.reply(`🔑 Kod: \`${code}\`\n\n/join_family orqali qo'shiling`, { parse_mode: 'Markdown' });
      return;
    }
    await this.handle(ctx);
  }
}
