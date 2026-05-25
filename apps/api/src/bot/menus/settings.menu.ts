// ─── Settings Menu (Language Switch) ───

import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';
import { MenuDefinition } from './menu.registry';

export const settingsMenu: MenuDefinition = {
  id: 'settings',
  build(ctx: Context, i18n: I18nService, kb: KeyboardFactory) {
    const l = i18n.getUserLang(ctx);
    return kb.inline([
      kb.row(kb.cb('🇺🇿 O\'zbekcha', 'settings:lang:uz')),
      kb.row(kb.cb('🇷🇺 Русский', 'settings:lang:ru')),
      kb.row(kb.cb('🇬🇧 English', 'settings:lang:en')),
      kb.row(kb.cb(i18n.t(l, 'common.back'), 'menu:main:open')),
    ]);
  },

  async handleAction(action: string, params: string[], ctx: Context): Promise<boolean> {
    if (action === 'lang') {
      const lang = params[0] as 'uz' | 'ru' | 'en';
      if (lang) {
        (ctx as any).session = { ...(ctx as any).session, lang };
        const msgs: Record<string, string> = {
          uz: '✅ Til O\'zbekchaga o\'zgartirildi',
          ru: '✅ Язык изменён на Русский',
          en: '✅ Language changed to English',
        };
        await ctx.editMessageText(msgs[lang] ?? msgs.uz);
      }
      return true;
    }
    return false;
  },
};
