// ─── Start Handler — Progressive Loading ───

import { Injectable } from '@nestjs/common';
import { Ctx, Start } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';
import { StreamingService } from '../core/streaming.service';

@Injectable()
export class StartHandler {
  constructor(
    private readonly i18n: I18nService,
    private readonly kb: KeyboardFactory,
    private readonly stream: StreamingService,
  ) {}

  @Start()
  async handle(@Ctx() ctx: Context & { scene?: any; startPayload?: string }) {
    const l = this.i18n.getUserLang(ctx);
    const payload = (ctx as any).startPayload;

    // Progressive reveal: show welcome step by step
    await this.stream.stream(ctx, [
      {
        emoji: '👋',
        placeholder: this.i18n.t(l, 'common.welcome_short'),
        compute: async () => {
          await new Promise(r => setTimeout(r, 200)); // brief pause
          return `${this.i18n.t(l, 'common.welcome')}\n\n${this.i18n.t(l, 'common.welcome_desc')}`;
        },
      },
      {
        emoji: '✅',
        placeholder: this.i18n.t(l, 'common.ready'),
        compute: async () => {
          if (payload) {
            const params = new URLSearchParams(payload);
            const code = params.get('code');
            if (params.get('action') === 'join' && code) {
              return `🔑 Kod: \`${code}\`\n\n/join_family orqali qo'shiling`;
            }
          }
          return `${this.i18n.t(l, 'common.welcome')}\n\n${this.i18n.t(l, 'common.welcome_desc')}`;
        },
      },
    ]);

    // Show menu keyboard (always available)
    await ctx.reply(this.i18n.t(l, 'common.choose_action'), {
      reply_markup: this.kb.inline([
        this.kb.row(this.kb.cb(this.i18n.t(l, 'common.start_btn'), 'action:start_onboarding')),
        this.kb.row(this.kb.cb(this.i18n.t(l, 'menu.main'), 'menu:main:open')),
      ]),
    });
  }
}
