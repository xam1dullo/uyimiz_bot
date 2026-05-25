// ─── Main Menu ───
// ID: main
// Keyboard: 2 sahifali asosiy menyu

import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';
import { MenuDefinition } from './menu.registry';

export const mainMenu: MenuDefinition = {
  id: 'main',
  build(ctx: Context, i18n: I18nService, kb: KeyboardFactory) {
    const l = i18n.getUserLang(ctx);
    const page = Number((ctx as any).callbackQuery?.data?.split(':')[2] ?? '0');
    const isPage2 = page === 1;

    if (isPage2) {
      return kb.inline([
        kb.row(kb.cb(i18n.t(l, 'menu.medications'), 'menu:medications:open')),
        kb.row(kb.cb(i18n.t(l, 'menu.health'), 'menu:health:open')),
        kb.row(kb.cb(i18n.t(l, 'menu.diet'), 'menu:diet:open')),
        kb.row(kb.cb(i18n.t(l, 'menu.firstaid'), 'menu:firstaid:open')),
        kb.row(kb.cb(i18n.t(l, 'menu.back'), 'menu:main:page:0')),
      ]);
    }

    return kb.inline([
      kb.row(kb.cb(i18n.t(l, 'menu.family'), 'menu:family:open')),
      kb.row(kb.cb(i18n.t(l, 'menu.budget'), 'menu:budget:open')),
      kb.row(kb.cb(i18n.t(l, 'menu.tasks'), 'menu:tasks:open')),
      kb.row(kb.cb(i18n.t(l, 'menu.reminders'), 'menu:reminders:open')),
      kb.row(kb.cb(i18n.t(l, 'menu.birthdays'), 'menu:birthdays:open')),
      kb.row(kb.cb(i18n.t(l, 'menu.more') + ' →', 'menu:main:page:1')),
      kb.row(kb.cb('⚙️ ' + i18n.t(l, 'menu.settings'), 'menu:settings:open')),
    ]);
  },

  async handleAction(action: string, params: string[], ctx: Context): Promise<boolean> {
    if (action === 'page') {
      const page = Number(params[0] ?? '0');
      const kb = new KeyboardFactory();
      const i18n = new I18nService();
      return true; // handled by build re-render
    }
    return false;
  },
};
