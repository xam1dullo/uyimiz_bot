import { describe, it, expect, beforeAll } from 'vitest';
import { I18nService } from '../i18n.service';

describe('I18nService — Coverage', () => {
  let i18n: I18nService;
  beforeAll(() => { i18n = new I18nService(); });

  const keys = ['common.start', 'common.help', 'common.cancelled', 'common.back',
    'menu.main', 'menu.family', 'menu.budget', 'menu.tasks', 'menu.reminders',
    'family.section', 'family.members', 'budget.section', 'budget.add_income',
    'onboarding.language.select', 'onboarding.family.has', 'onboarding.code.enter',
    'errors.user_already_in_family', 'errors.need_family', 'common.welcome', 'menu.settings'];

  for (const lang of ['uz', 'ru', 'en']) {
    for (const key of keys) {
      it(`${lang}:${key} resolves`, () => {
        const result = i18n.t(lang, key);
        // Key should resolve (not return the key itself)
        // Skip keys that need params (like budget.balance)
        if (key.includes('balance')) return;
        expect(result).not.toBe(key);
        expect(result.length).toBeGreaterThan(0);
      });
    }
  }
});
