// ─── Tasks Menu ───

import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';
import { MenuDefinition } from './menu.registry';

export const tasksMenu: MenuDefinition = {
  id: 'tasks',
  build(ctx: Context, i18n: I18nService, kb: KeyboardFactory) {
    const l = i18n.getUserLang(ctx);
    return kb.inline([
      kb.row(kb.cb('➕ Yangi yumush qo\'shish', 'action:task_add')),
      kb.row(kb.cb('📋 Mening yumushlarim', 'action:task_list')),
      kb.row(kb.cb(i18n.t(l, 'common.back'), 'menu:main:open')),
    ]);
  },
};
