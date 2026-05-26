// ─── ActionRouter — Deep action dispatch ───
// Interface: dispatch(data, ctx) → boolean
// Depth: one call point, N handlers registered externally.
// Tests: inject mock handlers, assert dispatch routing.
//
// Dependency class: In-process (Telegraf context, NestJS DI).
// Testable directly — no port/adapter needed.

import { Injectable } from '@nestjs/common';
import type { Context } from 'telegraf';

export interface ActionHandler {
  /** Prefix to match (e.g., 'action:budget', 'menu:budget') */
  prefix: string;
  /** Handle action. Return true if consumed. */
  handle(data: string, ctx: Context): Promise<boolean>;
}

@Injectable()
export class ActionRouter {
  private handlers: ActionHandler[] = [];

  /** Module self-registers its actions. Called from OnModuleInit. */
  register(handler: ActionHandler): void {
    this.handlers.push(handler);
    // Sort: longer prefix first → most specific match wins
    this.handlers.sort((a, b) => b.prefix.length - a.prefix.length);
  }

  /** Dispatch callback data. Returns true if consumed. */
  async dispatch(data: string, ctx: Context): Promise<boolean> {
    for (const handler of this.handlers) {
      if (data.startsWith(handler.prefix)) {
        return handler.handle(data, ctx);
      }
    }
    return false;
  }
}
