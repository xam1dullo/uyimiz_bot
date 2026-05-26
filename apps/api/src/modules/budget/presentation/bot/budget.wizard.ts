import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { Wizard, WizardStep, Ctx, Hears } from 'nestjs-telegraf';
import type { WizardContext } from 'telegraf/scenes';
import type { WizardState } from '../../../../bot/core/bot-context.types';
import { AddRecordHandler } from '../../application/commands/add-record/add-record.handler';
import { CategorySystem } from './category.system';
import { I18nService } from '../../../../infrastructure/i18n/i18n.service';
import { StreamingService } from '../../../../bot/core/streaming.service';

@Injectable()
@Wizard('BUDGET_ADD')
export class BudgetAddWizard {
  private readonly logger = new Logger(BudgetAddWizard.name);

  constructor(
    @Inject(forwardRef(() => AddRecordHandler)) private readonly addRecord: AddRecordHandler,
    @Inject(forwardRef(() => CategorySystem)) private readonly categories: CategorySystem,
    @Inject(forwardRef(() => I18nService)) private readonly i18n: I18nService,
    @Inject(forwardRef(() => StreamingService)) private readonly stream: StreamingService,
  ) {}

  private lang(ctx: WizardContext): string {
    return (ctx.session as { lang?: string }).lang ?? 'uz';
  }

  @WizardStep(0)
  async stepCategory(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    const cats = this.categories.getAll();
    const rows = cats.map((c) => [{ text: `${c.icon} ${c.name.uz}`, callback_data: `wiz:cat:${c.id}` }]);
    
    await ctx.reply(this.i18n.t(l, 'budget.select_category'), {
      reply_markup: { inline_keyboard: rows },
    });
    ctx.wizard.next();
  }

  @WizardStep(1)
  async stepAmount(@Ctx() ctx: WizardContext) {
    const data = (ctx.callbackQuery as { data: string })?.data;
    if (data?.startsWith('wiz:cat:')) {
      (ctx.wizard.state as { categoryId?: string }).categoryId = data.split(':')[2];
      await ctx.answerCbQuery();
      const l = this.lang(ctx);
      await ctx.editMessageText(this.i18n.t(l, 'budget.enter_amount'));
      ctx.wizard.next();
    }
  }

  @WizardStep(2)
  async stepProcess(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    const amount = Number((ctx.message as { text: string })?.text?.replace(/[^0-9]/g, ''));
    if (!amount || amount <= 0) {
      await ctx.reply(this.i18n.t(l, 'budget.invalid_amount'));
      return;
    }

    const state = ctx.wizard.state as { categoryId?: string; [k: string]: unknown };
    const cat = this.categories.getById(state.categoryId ?? '');
    const familyId = (ctx as any).session.familyId ?? 'unknown';

    await this.stream.stream(ctx as any, [
      { emoji: '💾', placeholder: 'Saqlanmoqda...', compute: async () => {
        await this.addRecord.execute({
          familyId, type: cat?.type ?? 'expense',
          categoryId: state.categoryId ?? '',
          amount, createdBy: String(ctx.from?.id),
        });
        return this.i18n.t(l, 'budget.saved')
          .replace('{amount}', amount.toLocaleString())
          .replace('{category}', cat?.icon + ' ' + (cat?.name.uz ?? ''));
      }},
    ]);

    await ctx.scene.leave();
  }

  @Hears(/\/cancel/)
  async cancel(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await ctx.scene.leave();
    await ctx.reply(this.i18n.t(l, 'budget.cancelled'));
  }
}
