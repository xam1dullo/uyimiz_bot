import { Injectable, Inject, forwardRef } from '@nestjs/common';
import type { Context } from 'telegraf';
import type { BotContext } from '../core/bot-context.types';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { Command, Ctx, Update } from 'nestjs-telegraf';

@Update()
@Injectable()
export class PollHandler {
  constructor(    @Inject(forwardRef(() => I18nService)) private readonly i18n: I18nService) {}

  @Command('poll')
  async createPoll(@Ctx() ctx: BotContext) {
    const l = this.i18n.getUserLang(ctx);
    const args = ((ctx.message as { text: string })?.text ?? '').split(' ').slice(1);
    const question = args.join(' ') || 'Ovoz bering';

    await ctx.replyWithPoll(
      question,
      ['✅ Ha', '❌ Yo\'q', '🤔 Bilmayman'],
      { is_anonymous: false, allows_multiple_answers: false },
    );
  }
}
