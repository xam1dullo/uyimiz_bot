// ─── Typed Bot Context ───
// BotContext = telegraf Context + typed session.
// Usage: `@Ctx() ctx: BotContext` → `ctx.session.familyId` (no `any`)

import type { Context } from 'telegraf';

export interface BotSession {
  familyId?: string;
  lang?: 'uz' | 'ru' | 'en';
  role?: string;
  name?: string;
}

export interface WizardState {
  categoryId?: string;
  lang?: string;
  [key: string]: unknown;
}

/** Regular bot context with typed session */
export type BotContext = Context & { session: BotSession };

/** Helper: extract language from session */
export function getLang(ctx: BotContext): 'uz' | 'ru' | 'en' {
  return ctx.session?.lang ?? 'uz';
}

/** Helper: extract familyId from session */
export function getFamilyId(ctx: BotContext): string | undefined {
  return ctx.session?.familyId;
}
