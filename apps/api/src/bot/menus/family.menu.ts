// ─── Family Menu ───

import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';
import { MenuDefinition } from './menu.registry';

export const familyMenu: MenuDefinition = {
  id: 'family',
  build(ctx: Context, i18n: I18nService, kb: KeyboardFactory) {
    const l = i18n.getUserLang(ctx);
    return kb.inline([
      kb.row(kb.cb(i18n.t(l, 'family.members_list'), 'action:family_members')),
      kb.row(kb.cb(i18n.t(l, 'family.invite_button'), 'action:family_invite')),
      kb.row(kb.cb(i18n.t(l, 'family.create_new'), 'action:create_family')),
      kb.row(kb.cb(i18n.t(l, 'common.back'), 'menu:main:open')),
    ]);
  },
};
