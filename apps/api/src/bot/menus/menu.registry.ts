// ─── Menu Registry ───

import { Injectable } from '@nestjs/common';
import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';

export interface MenuDefinition {
  id: string;
  build(ctx: Context, i18n: I18nService, kb: KeyboardFactory): any;
  handleAction?(action: string, params: string[], ctx: Context): Promise<boolean>;
}

@Injectable()
export class MenuRegistry {
  private menus = new Map<string, MenuDefinition>();

  constructor(
    private readonly i18n: I18nService,
    private readonly kb: KeyboardFactory,
  ) {}

  register(menu: MenuDefinition): this {
    this.menus.set(menu.id, menu);
    return this;
  }

  get(id: string): MenuDefinition | undefined {
    return this.menus.get(id);
  }

  async render(id: string, ctx: Context): Promise<void> {
    const menu = this.menus.get(id);
    if (!menu) { await ctx.reply('Menu not found'); return; }

    const markup = menu.build(ctx, this.i18n, this.kb);
    const l = this.i18n.getUserLang(ctx);
    const text = this.i18n.t(l, `menu.${id}`);

    const cbMsg = (ctx as any).callbackQuery?.message;
    if (cbMsg) {
      try {
        await ctx.editMessageText(text, { reply_markup: markup.inline_keyboard ? markup : { inline_keyboard: [] } });
        return;
      } catch { /* fall through */ }
    }
    await ctx.reply(text, markup.inline_keyboard ? markup : undefined);
  }

  async routeCallback(data: string, ctx: Context): Promise<boolean> {
    const parts = data.split(':');
    
    if (parts[0] === 'menu') {
      const menuId = parts[1];
      const action = parts[2] ?? '';
      const params = parts.slice(3);
      
      if (action === 'open' && menuId) {
        await this.render(menuId, ctx);
        await ctx.answerCbQuery();
        return true;
      }

      const menu = this.menus.get(menuId ?? '');
      if (menu?.handleAction) {
        const handled = await menu.handleAction(action, params, ctx);
        if (handled) { await ctx.answerCbQuery(); return true; }
      }
    }

    return false;
  }
}
