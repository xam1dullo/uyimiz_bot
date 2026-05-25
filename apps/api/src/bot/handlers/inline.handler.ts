import { Injectable } from '@nestjs/common';
import { Ctx, InlineQuery } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';

@Injectable()
export class InlineHandler {
  constructor(private readonly i18n: I18nService) {}

  @InlineQuery(/.*/)
  async handle(@Ctx() ctx: Context) {
    const query = (ctx as any).inlineQuery?.query ?? '';
    const l = this.i18n.getUserLang(ctx);

    // Provide quick actions via inline mode
    const results = [
      {
        type: 'article' as const,
        id: 'balance',
        title: '💰 Balans',
        description: 'Oilangiz balansini ko\'rish',
        input_message_content: { message_text: '💰 Balans: /balance buyrug\'idan foydalaning' },
        thumb_url: 'https://img.icons8.com/emoji/48/money-bag-emoji.png',
      },
      {
        type: 'article' as const,
        id: 'tasks',
        title: '📋 Yumushlar',
        description: 'Yumushlar ro\'yxati',
        input_message_content: { message_text: '📋 Yumushlar: /menu dan Tasks bo\'limiga o\'ting' },
      },
      {
        type: 'article' as const,
        id: 'reminders',
        title: '⏰ Eslatma qo\'shish',
        description: 'Yangi eslatma yaratish',
        input_message_content: { message_text: '⏰ Eslatma qo\'shish uchun /add_reminder' },
      },
    ].filter(r => !query || r.title.toLowerCase().includes(query.toLowerCase()));

    await ctx.answerInlineQuery(results, { cache_time: 30 });
  }
}
