import { Injectable } from '@nestjs/common';
import { Ctx, On } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';

@Injectable()
export class PhotoHandler {
  constructor(private readonly i18n: I18nService) {}

  @On('photo')
  async handlePhoto(@Ctx() ctx: Context) {
    const l = this.i18n.getUserLang(ctx);
    await ctx.reply('📸 Rasm qabul qilindi!');
  }
}
