// ─── Menu Registry — Har bir menyu alohida fayl, ro'yxatdan o'tkaziladi ───

import type { Context } from 'telegraf';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from '../core/keyboard.factory';
import { CallbackRouter } from '../core/callback-router';

export interface MenuDefinition {
  /** Unique menu identifier */
  id: string;
  /** Build inline keyboard for this menu */
  build(ctx: Context, i18n: I18nService, kb: KeyboardFactory): any;
  /** Handle callback actions within this menu */
  handleAction?(action: string, params: string[], ctx: Context): Promise<boolean>;
}

export class MenuRegistry {
  private menus = new Map<string, MenuDefinition>();

  register(menu: MenuDefinition): this {
    this.menus.set(menu.id, menu);
    return this;
  }

  get(id: string): MenuDefinition | undefined {
    return this.menus.get(id);
  }

  /** Render a menu by ID */
  async render(id: string, ctx: Context, i18n: I18nService, kb: KeyboardFactory): Promise<void> {
    const menu = this.menus.get(id);
    if (!menu) { await ctx.reply('Menu not found'); return; }

    const markup = menu.build(ctx, i18n, kb);
    const l = i18n.getUserLang(ctx);

    // Try edit existing message, fallback to new
    const cbMsg = (ctx as any).callbackQuery?.message;
    if (cbMsg) {
      try {
        await ctx.editMessageText(i18n.t(l, `menu.${id}`), markup);
        return;
      } catch { /* fall through */ }
    }
    await ctx.reply(i18n.t(l, `menu.${id}`), markup);
  }

  /** Route callback to the right menu */
  async routeCallback(data: string, ctx: Context): Promise<boolean> {
    const parts = data.split(':');
    
    // menu:action:params...
    if (parts[0] === 'menu') {
      const menuId = parts[1];
      const action = parts[2] ?? '';
      const params = parts.slice(3);
      
      if (action === 'open' && menuId) {
        await this.render(menuId, ctx, /* need DI */ null as any, null as any);
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
