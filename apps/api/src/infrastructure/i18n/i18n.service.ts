import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type Lang = 'uz' | 'ru' | 'en';
type NestedRecord = Record<string, unknown>;

@Injectable()
export class I18nService {
  private readonly logger = new Logger(I18nService.name);
  private messages: Record<Lang, NestedRecord> = { uz: {}, ru: {}, en: {} };
  private readonly localesDir: string;

  constructor() {
    this.localesDir = join(process.cwd(), 'apps/api/locales');
    this.loadAll();
  }

  private loadAll(): void {
    for (const lang of ['uz', 'ru', 'en'] as Lang[]) {
      try {
        const path = join(this.localesDir, lang, 'messages.json');
        this.messages[lang] = JSON.parse(readFileSync(path, 'utf-8'));
      } catch (e) {
        this.logger.error(`Failed to load locale: ${lang}`, e);
      }
    }
    this.logger.log('i18n loaded: uz, ru, en');
  }

  /**
   * Get a localized message by dot-notation key.
   * Supports interpolation: t('budget.add.success', { amount: '5000' })
   */
  t(lang: Lang | string | undefined, key: string, params?: Record<string, string | number>): string {
    const l = this.normalizeLang(lang);
    const value = this.getByPath(this.messages[l], key);

    if (typeof value !== 'string') {
      this.logger.warn(`Missing i18n key: ${key} (lang: ${l})`);
      return this.getByPath(this.messages.uz, key) as string ?? key;
    }

    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
    }

    return value;
  }

  /** Get user's language preference from context */
  getUserLang(ctx: { from?: { language_code?: string }; session?: { lang?: string } }): Lang {
    if (ctx.session?.lang === 'ru') return 'ru';
    if (ctx.session?.lang === 'en') return 'en';
    return 'uz';
  }

  private normalizeLang(lang: Lang | string | undefined): Lang {
    if (lang === 'ru') return 'ru';
    if (lang === 'en') return 'en';
    return 'uz';
  }

  private getByPath(obj: NestedRecord, path: string): unknown {
    return path.split('.').reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object') return (acc as NestedRecord)[key];
      return undefined;
    }, obj);
  }

  /** Reload locales (for dev hot-reload) */
  reload(): void {
    this.loadAll();
  }
}
