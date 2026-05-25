import type { UserLang } from '../types/user.types';

export const SUPPORTED_LANGUAGES: Record<UserLang, { name: string; nativeName: string }> = {
  uz: { name: 'Uzbek', nativeName: "O'zbekcha" },
  ru: { name: 'Russian', nativeName: 'Русский' },
  en: { name: 'English', nativeName: 'English' },
};

export const DEFAULT_LANG: UserLang = 'uz';
