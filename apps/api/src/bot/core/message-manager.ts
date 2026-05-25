// ─── Smart Message Manager — Oversending Prevention ───
// Tracks active messages to avoid flooding the user

import { Injectable } from '@nestjs/common';
import type { Context } from 'telegraf';

interface ActiveMessage {
  chatId: number;
  messageId: number;
  timestamp: number;
  /** Last content hash — skip update if identical */
  contentHash: string;
}

@Injectable()
export class MessageManager {
  private messages = new Map<string, ActiveMessage>();
  private readonly MAX_AGE_MS = 48 * 60 * 60 * 1000; // 48 hours

  /** Hash content to detect duplicates */
  private hash(text: string): string {
    let h = 0;
    for (let i = 0; i < text.length; i++) {
      h = ((h << 5) - h) + text.charCodeAt(i);
      h |= 0;
    }
    return String(h);
  }

  /** Generate dedup key */
  private key(ctx: Context): string {
    return `${ctx.chat?.id}:${ctx.from?.id}`;
  }

  /**
   * Edit message if content changed, skip if identical.
   * Prevents oversending identical content.
   */
  async smartEdit(ctx: Context, text: string, extra?: any): Promise<boolean> {
    const k = this.key(ctx);
    const existing = this.messages.get(k);
    const hash = this.hash(text);

    // Skip if same content and recent
    if (existing && existing.contentHash === hash) {
      if (Date.now() - existing.timestamp < 5000) {
        return false; // Skip — identical content within 5s
      }
    }

    // Try to edit existing message
    if (existing?.messageId) {
      try {
        await ctx.telegram.editMessageText(
          existing.chatId, existing.messageId, undefined,
          text, extra,
        );
        existing.contentHash = hash;
        existing.timestamp = Date.now();
        return true;
      } catch {
        // Message deleted or too old — send new
      }
    }

    // Send new and track
    const msg = await ctx.reply(text, extra);
    const msgId = (msg as any).message_id;
    
    this.messages.set(k, {
      chatId: ctx.chat!.id,
      messageId: msgId,
      timestamp: Date.now(),
      contentHash: hash,
    });

    return true;
  }

  /**
   * Clean up old message tracking entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [k, v] of this.messages) {
      if (now - v.timestamp > this.MAX_AGE_MS) {
        this.messages.delete(k);
      }
    }
  }

  /**
   * Debounced reply: batch rapid updates into one
   */
  private pending = new Map<string, { text: string; timer: NodeJS.Timeout }>();

  debouncedEdit(ctx: Context, text: string, delayMs = 300): void {
    const k = this.key(ctx);
    const existing = this.pending.get(k);

    if (existing) {
      clearTimeout(existing.timer);
    }

    const timer = setTimeout(async () => {
      this.pending.delete(k);
      await this.smartEdit(ctx, text);
    }, delayMs);

    this.pending.set(k, { text, timer });
  }
}
