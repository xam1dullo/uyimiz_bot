import { Injectable } from '@nestjs/common';
import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { Command, Ctx, Update } from 'nestjs-telegraf';

@Update()
@Injectable()
export class PollHandler {
  constructor(private readonly i18n: I18nService) {}

  @Command('poll')
  async createPoll(@Ctx() ctx: Context) {
    const l = this.i18n.getUserLang(ctx);
    const args = ((ctx as any).message?.text ?? '').split(' ').slice(1);
    const question = args.join(' ') || 'Ovoz bering';

    await ctx.replyWithPoll(
      question,
      ['✅ Ha', '❌ Yo\'q', '🤔 Bilmayman'],
      { is_anonymous: false, allows_multiple_answers: false },
    );
  }
}
