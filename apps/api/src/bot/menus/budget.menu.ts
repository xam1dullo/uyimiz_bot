// ─── Budget Menu ───

import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';
import { MenuDefinition } from './menu.registry';

export const budgetMenu: MenuDefinition = {
  id: 'budget',
  build(ctx: Context, i18n: I18nService, kb: KeyboardFactory) {
    const l = i18n.getUserLang(ctx);
    return kb.inline([
      kb.row(kb.cb(i18n.t(l, 'budget.add_income'), 'action:budget_income')),
      kb.row(kb.cb(i18n.t(l, 'budget.add_expense'), 'action:budget_expense')),
      kb.row(kb.cb(i18n.t(l, 'budget.balance'), 'action:budget_balance')),
      kb.row(kb.cb(i18n.t(l, 'budget.report'), 'action:budget_report')),
      kb.row(kb.cb(i18n.t(l, 'common.back'), 'menu:main:open')),
    ]);
  },
};
