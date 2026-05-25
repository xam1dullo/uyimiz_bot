// ─── Callback Data Router — State Machine Pattern ───
// Encodes complex state into callback_data strings
// Format: "module:action:param1:param2:..."
// Max 64 bytes per Telegram limit — keep it tight

export class CallbackData {
  readonly module: string;
  readonly action: string;
  readonly params: string[];

  constructor(data: string) {
    const parts = data.split(':');
    if (parts.length < 2) {
      this.module = 'unknown';
      this.action = data;
      this.params = [];
      return;
    }
    this.module = parts[0] ?? 'unknown';
    this.action = parts[1] ?? 'unknown';
    this.params = parts.slice(2);
  }

  /** Get param by index with type coercion */
  get<T = string>(index: number, fallback?: T): T | string {
    return (this.params[index] ?? fallback ?? '') as T | string;
  }

  getNumber(index: number, fallback = 0): number {
    return Number(this.params[index]) || fallback;
  }

  getBool(index: number): boolean {
    return this.params[index] === '1';
  }

  /** Check if action matches */
  is(action: string): boolean {
    return this.action === action;
  }

  /** Check if module:action matches */
  isFull(module: string, action: string): boolean {
    return this.module === module && this.action === action;
  }

  /** Build callback data string */
  static build(module: string, action: string, ...params: (string | number | boolean)[]): string {
    const encoded = params.map((p) => String(p));
    return [module, action, ...encoded].join(':');
  }
}

// ─── Callback Handler Registry ───
type CallbackHandler = (data: CallbackData, ctx: any) => Promise<void>;

export class CallbackRouter {
  private handlers = new Map<string, CallbackHandler>();

  /** Register handler for "module:action" */
  on(module: string, action: string, handler: CallbackHandler): this {
    this.handlers.set(`${module}:${action}`, handler);
    return this;
  }

  /** Handle multiple actions for same module */
  onActions(module: string, actions: string[], handler: CallbackHandler): this {
    for (const action of actions) {
      this.on(module, action, handler);
    }
    return this;
  }

  /** Route callback to handler, returns true if handled */
  async route(data: string, ctx: any): Promise<boolean> {
    const cb = new CallbackData(data);
    
    // Try exact match first
    const key = `${cb.module}:${cb.action}`;
    const handler = this.handlers.get(key);
    
    if (handler) {
      await handler(cb, ctx);
      return true;
    }

    return false;
  }
}
