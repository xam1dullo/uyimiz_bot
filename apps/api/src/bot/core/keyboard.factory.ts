// ─── Advanced Telegram Bot Keyboard Factory ───

import { Injectable } from '@nestjs/common';

export interface KeyboardButton {
  text: string;
  callback_data?: string;
  url?: string;
  web_app?: { url: string };
  login_url?: { url: string; request_write_access?: boolean };
  switch_inline_query?: string;
  switch_inline_query_current_chat?: string;
}

@Injectable()
export class KeyboardFactory {
  /** Single row of buttons */
  row(...buttons: KeyboardButton[]): KeyboardButton[] {
    return buttons;
  }

  /** Create inline keyboard from 2D array */
  inline(rows: KeyboardButton[][]): any {
    return { inline_keyboard: rows };
  }

  /** Quick callback button */
  cb(text: string, data: string): KeyboardButton {
    return { text, callback_data: data };
  }

  /** URL button */
  url(text: string, url: string): KeyboardButton {
    return { text, url };
  }

  /** WebApp button (Mini App) */
  webApp(text: string, url: string): KeyboardButton {
    return { text, web_app: { url } };
  }

  /** Paginated inline keyboard */
  paginated<T>(
    items: T[],
    page: number,
    pageSize: number,
    render: (item: T, index: number) => KeyboardButton,
    prefix: string,
  ): any {
    const totalPages = Math.ceil(items.length / pageSize);
    const start = page * pageSize;
    const slice = items.slice(start, start + pageSize);
    const rows: KeyboardButton[][] = slice.map((item, i) => [render(item, start + i)]);
    const navRow: KeyboardButton[] = [];
    if (page > 0) navRow.push(this.cb('◀️', `${prefix}:page:${page - 1}`));
    navRow.push(this.cb(`${page + 1}/${totalPages}`, `${prefix}:noop`));
    if (page < totalPages - 1) navRow.push(this.cb('▶️', `${prefix}:page:${page + 1}`));
    if (navRow.length > 0) rows.push(navRow);
    return { inline_keyboard: rows as any };
  }

  /** Confirmation dialog */
  confirm(prefix: string, id: string): any {
    return { inline_keyboard: [[
      this.cb('✅ Ha', `${prefix}:confirm:${id}`),
      this.cb('❌ Yo\'q', `${prefix}:cancel:${id}`),
    ]] as any };
  }

  /** Create reply keyboard */
  reply(rows: string[][], opts?: { resize?: boolean; oneTime?: boolean }): any {
    return {
      keyboard: rows.map((row) => row.map((text) => ({ text }))),
      resize_keyboard: opts?.resize ?? true,
      one_time_keyboard: opts?.oneTime ?? false,
    } as any;
  }

  /** Remove keyboard */
  removeKeyboard(): any {
    return { remove_keyboard: true };
  }
}
