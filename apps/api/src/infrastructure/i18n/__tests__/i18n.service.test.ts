import { describe, it, expect, beforeAll } from 'vitest';
import { I18nService } from '../i18n.service';

describe('I18nService', () => {
  let i18n: I18nService;

  beforeAll(() => { i18n = new I18nService(); });

  it('resolves uz keys', () => {
    expect(i18n.t('uz', 'common.start')).toContain('Xush kelibsiz');
  });
  it('resolves ru keys', () => {
    expect(i18n.t('ru', 'common.start')).toContain('Добро');
  });
  it('resolves en keys', () => {
    expect(i18n.t('en', 'common.start')).toContain('Welcome');
  });
  it('falls back to uz for unknown language', () => {
    expect(i18n.t('fr', 'common.start')).toContain('Xush');
  });
  it('returns key for missing key', () => {
    expect(i18n.t('uz', 'nonexistent.key')).toBe('nonexistent.key');
  });
  it('interpolates params', () => {
    const result = i18n.t('uz', 'budget.balance.message', { balance: 5000 });
    expect(result).toContain('5000');
  });
  it('getUserLang defaults to uz', () => {
    expect(i18n.getUserLang({})).toBe('uz');
  });
  it('getUserLang reads session', () => {
    expect(i18n.getUserLang({ session: { lang: 'ru' } })).toBe('ru');
  });
});
