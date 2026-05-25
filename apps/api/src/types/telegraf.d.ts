import 'telegraf';

declare module 'telegraf' {
  interface Context {
    session: {
      lang?: 'uz' | 'ru' | 'en';
      familyId?: string;
      awaitingFamilyCode?: boolean;
      [key: string]: unknown;
    };
  }
}
