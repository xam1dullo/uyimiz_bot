import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Update, Command, Start, Help, Action, On } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { I18nService } from '../infrastructure/i18n/i18n.service';
import { KeyboardFactory } from './keyboard.factory';
import { CallbackRouter, CallbackData } from './callback-router';
import { BotPerformance } from './bot-performance';
import type { KeyboardButton } from './keyboard.factory';

@Update()
@Injectable()
export class BotUpdate {
  private readonly logger = new Logger(BotUpdate.name);
  private readonly router = new CallbackRouter();
  private readonly rateLimiter = BotPerformance.rateLimiter(30, 60_000); // 30 req/min

  constructor(
    private readonly i18n: I18nService,
    private readonly kb: KeyboardFactory,
  ) {
    this.registerRoutes();
  }

  // ═══ ROUTE REGISTRATION ═══
  private registerRoutes(): void {
    // Pagination for lists
    this.router.onActions('menu', ['page', 'noop'], async (d, ctx) => {
      if (d.is('noop')) { await ctx.answerCbQuery(); return; }
      const page = d.getNumber(0);
      await this.paginatedMenu(ctx, page);
    });

    // Confirm actions
    this.router.onActions('confirm', ['yes', 'no'], async (d, ctx) => {
      await ctx.answerCbQuery();
      if (d.is('yes')) {
        await ctx.editMessageText('✅ Tasdiqlandi!');
      } else {
        await ctx.editMessageText('❌ Bekor qilindi');
      }
      BotPerformance.autoDelete(ctx, 5000);
    });
  }

  // ═══ COMMANDS ═══

  @Start()
  async start(@Ctx() ctx: Context & { scene?: any; startPayload?: string }) {
    const l = this.i18n.getUserLang(ctx);
    const payload = (ctx as any).startPayload;

    // Deep linking support
    if (payload) {
      await this.handleDeepLink(ctx, payload);
      return;
    }

    await ctx.reply(this.i18n.t(l, 'common.start'), {
      reply_markup: this.kb.inline([
        this.kb.row(this.kb.cb(this.i18n.t(l, 'common.start_button'), 'start_onboarding')),
      ]),
    });
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    const l = this.i18n.getUserLang(ctx);
    await BotPerformance.withTyping(ctx, 'typing', async () => {
      await ctx.reply(this.i18n.t(l, 'common.help'), {
        reply_markup: this.kb.inline([
          this.kb.row(this.kb.cb(this.i18n.t(l, 'common.back'), 'menu_back')),
        ]),
      });
    });
  }

  @Command('menu')
  async menu(@Ctx() ctx: Context) {
    await this.paginatedMenu(ctx, 0);
  }

  private async paginatedMenu(ctx: Context, page: number) {
    const l = this.i18n.getUserLang(ctx);

    const pages: Record<string, KeyboardButton[][]> = {
      main: [
        this.kb.row(this.kb.cb(this.i18n.t(l, 'menu.family'), 'menu_family')),
        this.kb.row(this.kb.cb(this.i18n.t(l, 'menu.budget'), 'menu_budget')),
        this.kb.row(this.kb.cb(this.i18n.t(l, 'menu.tasks'), 'menu_tasks')),
        this.kb.row(this.kb.cb(this.i18n.t(l, 'menu.reminders'), 'menu_reminders')),
        this.kb.row(this.kb.cb(this.i18n.t(l, 'menu.birthdays'), 'menu_birthdays')),
      ],
      more: [
        this.kb.row(this.kb.cb('💊 Dorilar', 'menu_medications')),
        this.kb.row(this.kb.cb('🩺 Sog\'liq', 'menu_health')),
        this.kb.row(this.kb.cb('🥗 Ovqatlanish', 'menu_diet')),
        this.kb.row(this.kb.cb('🚑 Birinchi yordam', 'menu_firstaid')),
        this.kb.row(this.kb.cb('📋 Muhim ishlar', 'menu_important')),
      ],
    };

    const pageNames = Object.keys(pages);
    const currentName = pageNames[page] ?? pageNames[0];
    const currentRows = pages[currentName] ?? [];

    const navRow: KeyboardButton[] = [];
    if (page > 0) navRow.push(this.kb.cb('◀️', 'menu:page:' + (page - 1)));
    navRow.push(this.kb.cb(`${page + 1}/${pageNames.length}`, 'menu:noop'));
    if (page < pageNames.length - 1) navRow.push(this.kb.cb('▶️', 'menu:page:' + (page + 1)));

    const allRows = [...currentRows];
    if (navRow.length > 0) allRows.push(navRow);

    await BotPerformance.smartReply(ctx, this.i18n.t(l, 'menu.main'), {
      reply_markup: { inline_keyboard: allRows },
    });
  }

  // ═══ ACTIONS ═══

  @Action('start_onboarding')
  async startOnboarding(@Ctx() ctx: Context & { scene?: any }) {
    await ctx.answerCbQuery();
    await (ctx as any).scene?.enter('ONBOARDING');
  }

  @Action('menu_back')
  async menuBack(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await this.paginatedMenu(ctx, 0);
  }

  @Action(/menu_.+/)
  async menuActions(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    const l = this.i18n.getUserLang(ctx);
    const data = (ctx as any).callbackQuery?.data as string;

    const actions: Record<string, () => Promise<void>> = {
      menu_family: async () => {
        await ctx.reply(this.i18n.t(l, 'family.section'), {
          reply_markup: this.kb.inline([
            this.kb.row(this.kb.cb(this.i18n.t(l, 'family.members_list'), 'family_members')),
            this.kb.row(this.kb.cb(this.i18n.t(l, 'family.invite_button'), 'family_invite')),
            this.kb.row(this.kb.cb(this.i18n.t(l, 'common.back'), 'menu_back')),
          ]),
        });
      },
      menu_budget: async () => {
        await ctx.reply(this.i18n.t(l, 'budget.section'), {
          reply_markup: this.kb.inline([
            this.kb.row(this.kb.cb(this.i18n.t(l, 'budget.add_income'), 'budget_income')),
            this.kb.row(this.kb.cb(this.i18n.t(l, 'budget.add_expense'), 'budget_expense')),
            this.kb.row(this.kb.cb(this.i18n.t(l, 'budget.balance'), 'budget_balance')),
            this.kb.row(this.kb.cb(this.i18n.t(l, 'budget.report'), 'budget_report')),
            this.kb.row(this.kb.cb(this.i18n.t(l, 'common.back'), 'menu_back')),
          ]),
        });
      },
    };

    const handler = actions[data];
    if (handler) await handler();
    else await ctx.reply(`${data} ${this.i18n.t(l, 'menu.coming_soon')}`);
  }

  @Action('budget_income')
  async budgetIncome(@Ctx() ctx: Context & { scene?: any }) {
    await ctx.answerCbQuery();
    await (ctx as any).scene?.enter('BUDGET_ADD');
  }

  @Action('budget_expense')
  async budgetExpense(@Ctx() ctx: Context & { scene?: any }) {
    await ctx.answerCbQuery();
    await (ctx as any).scene?.enter('BUDGET_ADD');
  }

  @Action('budget_balance')
  async budgetBalance(@Ctx() ctx: Context & { session?: any }) {
    const l = this.i18n.getUserLang(ctx);
    await ctx.answerCbQuery();
    if (!ctx.session?.familyId) {
      await ctx.reply(this.i18n.t(l, 'errors.need_family'));
      return;
    }
    await BotPerformance.withTyping(ctx, 'typing', async () => {
      await ctx.reply(this.i18n.t(l, 'budget.balance.calculating'));
    });
  }

  // ═══ DEEP LINKING ═══
  private async handleDeepLink(ctx: Context, payload: string) {
    const l = this.i18n.getUserLang(ctx);
    const params = new URLSearchParams(payload);

    if (params.get('action') === 'join' && params.get('code')) {
      await ctx.reply(`🔑 Kod: \`${params.get('code')}\`\n\n/join_family orqali qo'shiling`, {
        parse_mode: 'Markdown',
      });
      return;
    }

    await this.start(ctx); // fallback to normal start
  }

  @On('text')
  async onText(@Ctx() ctx: Context & { session?: any }) {
    const text = (ctx as any).message?.text;
    const userId = String(ctx.from?.id);

    // Rate limit check
    if (!this.rateLimiter(userId)) {
      this.logger.warn(`Rate limited: ${userId}`);
      return;
    }

    this.logger.log(`Message from ${userId}: ${text}`);
  }
}
