// ─── Settings Handler (Language Switch) ───

import { Injectable, Inject, forwardRef } from '@nestjs/common';
import type { Context } from 'telegraf';
import type { BotContext } from '../core/bot-context.types';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';
import { Command, Ctx, Update } from 'nestjs-telegraf';

@Update()
@Injectable()
export class SettingsHandler {
  constructor(
    @Inject(forwardRef(() => I18nService)) private readonly i18n: I18nService,
    @Inject(forwardRef(() => KeyboardFactory)) private readonly kb: KeyboardFactory,
  ) {}

  @Command('settings')
  async handle(@Ctx() ctx: BotContext) {
    const l = this.i18n.getUserLang(ctx);
    await ctx.reply('⚙️ ' + this.i18n.t(l, 'menu.settings'), {
      reply_markup: this.kb.inline([
        this.kb.row(this.kb.cb('🇺🇿 O\'zbekcha', 'settings:lang:uz')),
        this.kb.row(this.kb.cb('🇷🇺 Русский', 'settings:lang:ru')),
        this.kb.row(this.kb.cb('🇬🇧 English', 'settings:lang:en')),
        this.kb.row(this.kb.cb(this.i18n.t(l, 'common.back'), 'menu:main:open')),
      ]),
    });
  }
}
