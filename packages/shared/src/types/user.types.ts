export const USER_ROLES = ['admin', 'parent', 'child', 'guest'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_LANGS = ['uz', 'ru', 'en'] as const;
export type UserLang = (typeof USER_LANGS)[number];

export interface UserProfile {
  id: string;
  telegramId: string;
  familyId: string;
  role: UserRole;
  lang: UserLang;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
