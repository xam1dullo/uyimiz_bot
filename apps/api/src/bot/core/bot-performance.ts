// ─── Telegram Bot Performance Utilities ───

import type { Context } from 'telegraf';

export class BotPerformance {
  /** Send typing indicator while processing */
  static async withTyping<T>(ctx: Context, action: 'typing' | 'upload_photo' | 'upload_document', fn: () => Promise<T>): Promise<T> {
    await ctx.sendChatAction(action).catch(() => {});
    return fn();
  }

  /** Batch reply: edit message if possible, else send new */
  static async smartReply(ctx: Context, text: string, extra?: any): Promise<any> {
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery?.message) {
      try {
        return await ctx.editMessageText(text, extra);
      } catch {
        return await ctx.reply(text, extra);
      }
    }
    return await ctx.reply(text, extra);
  }

  /** Delete message after delay (auto-cleanup) */
  static async autoDelete(ctx: Context, delayMs = 30_000): Promise<void> {
    setTimeout(async () => {
      try {
        if (ctx.callbackQuery?.message) {
          await ctx.deleteMessage();
        }
      } catch { /* message might already be deleted */ }
    }, delayMs);
  }

  /** Rate limit guard: max N requests per window */
  static rateLimiter(maxRequests: number, windowMs: number) {
    const buckets = new Map<string, { count: number; reset: number }>();

    return (userId: string): boolean => {
      const now = Date.now();
      const bucket = buckets.get(userId);

      if (!bucket || now > bucket.reset) {
        buckets.set(userId, { count: 1, reset: now + windowMs });
        return true;
      }

      if (bucket.count >= maxRequests) return false;
      bucket.count++;
      return true;
    };
  }

  /** Escape text for MarkdownV2 (Telegram's strict mode) */
  static escapeMd(text: string): string {
    return text
      .replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
  }

  /** Format as MarkdownV2 bold */
  static bold(text: string): string {
    return `*${text}*`;
  }

  /** Format as MarkdownV2 italic */
  static italic(text: string): string {
    return `_${text}_`;
  }

  /** Format as MarkdownV2 code */
  static code(text: string): string {
    return `\`${text}\``;
  }

  /** Format as MarkdownV2 link */
  static link(text: string, url: string): string {
    return `[${text}](${url})`;
  }
}
