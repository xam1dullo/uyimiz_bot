import { Injectable } from '@nestjs/common';
import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { Ctx, On, Update } from 'nestjs-telegraf';

@Update()
@Injectable()
export class PhotoHandler {
  constructor(private readonly i18n: I18nService) {}

  @On('photo')
  async handlePhoto(@Ctx() ctx: Context) {
    const l = this.i18n.getUserLang(ctx);
    await ctx.reply('📸 Rasm qabul qilindi!');
  }
}
