// ─── Advanced Streaming Bot Service ───
// Progressive message editing: user hech qachon kutmaydi
// Pattern: typing → placeholder → compute → editMessageText

import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import type { Context } from 'telegraf';
import type { BotContext } from './bot-context.types';
import { I18nService } from '../../infrastructure/i18n/i18n.service';

export interface StreamStep {
  /** Emoji for typing indicator */
  emoji: string;
  /** i18n key for the placeholder text */
  placeholderKey: string;
  /** Async computation */
  compute: () => Promise<string>;
}

@Injectable()
export class StreamingService {
  private readonly logger = new Logger(StreamingService.name);

  constructor(
    @Inject(forwardRef(() => I18nService)) private readonly i18n: I18nService,
  ) {}

  /**
   * Get user's language from context
   */
  private getLang(ctx: Context | BotContext): string {
    return (ctx as any).session?.lang ?? 'uz';
  }

  /**
   * Progressive streaming: show each step as it completes.
   * User sees: "🔍 Qidirilmoqda..." → "🔍 Topildi: 5 ta" → "📊 Hisoblanmoqda..." → "✅ Natija: ..."
   */
  async stream(ctx: Context | BotContext, steps: StreamStep[]): Promise<string> {
    let messageId: number | undefined;
    let finalResult = '';
    const l = this.getLang(ctx);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]!;
      const placeholder = this.i18n.t(l, step.placeholderKey);

      await ctx.sendChatAction('typing').catch(() => {});

      if (!messageId) {
        const msg = await ctx.reply(`${step.emoji} ${placeholder}...`);
        messageId = msg.message_id;
      } else {
        await ctx.telegram.editMessageText(
          ctx.chat!.id, messageId, undefined,
          `${step.emoji} ${placeholder}...`,
        ).catch(() => {});
      }

      const result = await step.compute();

      if (i === steps.length - 1) {
        finalResult = result;
        await ctx.telegram.editMessageText(
          ctx.chat!.id, messageId!, undefined,
          result,
        ).catch(() => {});
      }
    }

    return finalResult;
  }

  /**
   * Loading with progress: show skeleton → fill in details
   */
  async progressiveReveal(ctx: Context | BotContext, title: string, lines: () => AsyncGenerator<string>): Promise<void> {
    await ctx.sendChatAction('typing').catch(() => {});
    const msg = await ctx.reply(`⏳ ${title}\n\n▬▬▬▬▬▬▬▬`);
    const messageId = msg.message_id;
    let content = '';

    for await (const line of lines()) {
      content += line;
      await ctx.telegram.editMessageText(
        ctx.chat!.id, messageId, undefined,
        content,
      ).catch(() => {});
    }
  }

  /**
   * Answer callback query FIRST (within 0.5s), then process.
   */
  async answerFirst(ctx: Context, text?: string): Promise<void> {
    try {
      await ctx.answerCbQuery(text);
    } catch {
      // Already answered or expired
    }
  }

  /**
   * Safe edit: try to edit, fallback to reply.
   */
  async editOrReply(ctx: Context | BotContext, text: string, extra?: any): Promise<void> {
    const cbMsg = ctx.callbackQuery?.message;
    if (cbMsg?.message_id) {
      try {
        await ctx.telegram.editMessageText(
          ctx.chat!.id,
          cbMsg.message_id,
          undefined,
          text,
          extra,
        );
        return;
      } catch {
        // Message might be too old or different format
      }
    }
    await ctx.reply(text, extra);
  }

  /**
   * Loading states — localized via i18n service
   */
  async getLoadingState(ctx: Context | BotContext, key: 'search' | 'compute' | 'save' | 'load' | 'process' | 'done' | 'error'): Promise<string> {
    const l = this.getLang(ctx);
    return this.i18n.t(l, `streaming.${key}`);
  }
}
