// ─── Main Menu ───

import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';
import { MenuDefinition } from './menu.registry';

export const mainMenu: MenuDefinition = {
  id: 'main',
  build(ctx: Context, i18n: I18nService, kb: KeyboardFactory) {
    const l = i18n.getUserLang(ctx);

    return kb.inline([
      kb.row(kb.cb(i18n.t(l, 'menu.family'), 'menu:family:open')),
      kb.row(kb.cb(i18n.t(l, 'menu.budget'), 'menu:budget:open')),
      kb.row(kb.cb(i18n.t(l, 'menu.tasks'), 'menu:tasks:open')),
      kb.row(kb.cb(i18n.t(l, 'menu.reminders'), 'menu:reminders:open')),
      kb.row(kb.cb(i18n.t(l, 'menu.birthdays'), 'menu:birthdays:open')),
      kb.row(kb.cb('⚙️ ' + i18n.t(l, 'menu.settings'), 'menu:settings:open')),
    ]);
  },
};
