import { Injectable } from '@nestjs/common';
import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { Ctx, On, Update } from 'nestjs-telegraf';

@Update()
@Injectable()
export class ChatMemberHandler {
  constructor(private readonly i18n: I18nService) {}

  @On('my_chat_member')
  async handleMemberUpdate(@Ctx() ctx: Context) {
    const update = (ctx as any).myChatMember;
    if (update?.new_chat_member?.status === 'kicked') {
      // User blocked bot — cleanup session
      const l = this.i18n.getUserLang(ctx);
      // Log for analytics
    }
  }
}
