// ─── Advanced Streaming Bot Service ───
// Progressive message editing: user hech qachon kutmaydi
// Pattern: typing → placeholder → compute → editMessageText

import { Injectable, Logger } from '@nestjs/common';
import type { Context } from 'telegraf';
import type { BotContext } from './bot-context.types';

export interface StreamStep {
  /** Emoji for typing indicator */
  emoji: string;
  /** Text to show while computing */
  placeholder: string;
  /** Async computation */
  compute: () => Promise<string>;
}

@Injectable()
export class StreamingService {
  private readonly logger = new Logger(StreamingService.name);

  /**
   * Progressive streaming: show each step as it completes.
   * User sees: "🔍 Qidirilmoqda..." → "🔍 Topildi: 5 ta" → "📊 Hisoblanmoqda..." → "✅ Natija: ..."
   */
  async stream(ctx: Context | BotContext, steps: StreamStep[]): Promise<string> {
    let messageId: number | undefined;
    let finalResult = '';

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]!;
      const isLast = i === steps.length - 1;

      // Show typing with emoji
      await ctx.sendChatAction('typing').catch(() => {});

      // First step: send new message
      if (!messageId) {
        const msg = await ctx.reply(`${step.emoji} ${step.placeholder}...`);
        messageId = msg.message_id;
      } else {
        // Update existing message
        await ctx.telegram.editMessageText(
          ctx.chat!.id, messageId, undefined,
          `${step.emoji} ${step.placeholder}...`,
        ).catch(() => {});
      }

      // Compute
      const result = await step.compute();
      
      if (isLast) {
        finalResult = result;
        // Final update
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
   * Pattern: "⏳ Yuklanmoqda..." → add lines one by one
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
   * Telegram requires callback queries to be answered quickly.
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
   * Updates existing message instead of sending new one.
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

    // Fallback: send new
    await ctx.reply(text, extra);
  }

  /**
   * Loading states with emoji — never let the user see empty screen
   */
  loadingStates = {
    search: '🔍 Qidirilmoqda...',
    compute: '🧮 Hisoblanmoqda...',
    save: '💾 Saqlanmoqda...',
    load: '📂 Yuklanmoqda...',
    process: '⚙️ Ishlamoqda...',
    done: '✅ Tayyor!',
    error: '❌ Xatolik',
  } as const;
}
