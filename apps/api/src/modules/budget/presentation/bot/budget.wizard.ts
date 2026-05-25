import { Injectable, Logger } from '@nestjs/common';
import { Wizard, WizardStep, Ctx, Hears } from 'nestjs-telegraf';
import type { WizardContext } from 'telegraf/scenes';
import { AddRecordHandler } from '../../application/commands/add-record/add-record.handler';
import { DEFAULT_BUDGET_CATEGORIES } from '@uyimiz/shared';

@Injectable()
@Wizard('BUDGET_ADD')
export class BudgetAddWizard {
  private readonly logger = new Logger(BudgetAddWizard.name);

  constructor(private readonly addRecord: AddRecordHandler) {}

  @WizardStep(0)
  async stepType(@Ctx() ctx: WizardContext) {
    await ctx.reply('Tanlang:', {
      reply_markup: {
        keyboard: [
          [{ text: '💰 Kirim' }, { text: '💳 Chiqim' }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    ctx.wizard.next();
  }

  @WizardStep(1)
  async stepCategory(@Ctx() ctx: WizardContext) {
    const text = (ctx as any).message?.text;
    const type = text?.includes('Kirim') ? 'income' : text?.includes('Chiqim') ? 'expense' : null;
    if (!type) {
      await ctx.reply('Iltimos, tanlang: Kirim yoki Chiqim');
      return;
    }
    (ctx.wizard as any).state.type = type;

    const categories = DEFAULT_BUDGET_CATEGORIES.filter((c) => c.type === type);
    const buttons = categories.map((c) => [{ text: `${c.icon} ${c.name.uz}` }]);
    buttons.push([{ text: '❌ Bekor qilish' }]);

    await ctx.reply('Kategoriyani tanlang:', {
      reply_markup: {
        keyboard: buttons,
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    ctx.wizard.next();
  }

  @WizardStep(2)
  async stepAmount(@Ctx() ctx: WizardContext) {
    const text = (ctx as any).message?.text;
    const category = DEFAULT_BUDGET_CATEGORIES.find((c) => text?.includes(c.name.uz));
    if (!category) {
      await ctx.reply('Iltimos, kategoriyani tanlang');
      return;
    }
    (ctx.wizard as any).state.categoryId = category.id;
    await ctx.reply("Miqdorni kiriting (so'm):");
    ctx.wizard.next();
  }

  @WizardStep(3)
  async stepConfirm(@Ctx() ctx: WizardContext) {
    const amountText = (ctx as any).message?.text;
    const amount = Number(amountText?.replace(/[^\d]/g, ''));
    if (!amount || amount <= 0) {
      await ctx.reply("Noto'g'ri miqdor. Qayta urining.");
      return;
    }
    (ctx.wizard as any).state.amount = amount;

    const state = (ctx.wizard as any).state;
    await ctx.reply(
      'Tasdiqlaysizmi?\n\n' +
      `Tur: ${state.type === 'income' ? '💰 Kirim' : '💳 Chiqim'}\n` +
      `Kategoriya: ${DEFAULT_BUDGET_CATEGORIES.find(c => c.id === state.categoryId)?.name.uz}\n` +
      `Miqdor: ${amount.toLocaleString()} UZS`,
      {
        reply_markup: {
          keyboard: [
            [{ text: '✅ Ha' }, { text: "❌ Yo'q" }],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      },
    );
    ctx.wizard.next();
  }

  @WizardStep(4)
  async stepSave(@Ctx() ctx: WizardContext & { session?: any }) {
    const text = (ctx as any).message?.text;
    if (text?.includes('❌')) {
      await ctx.reply('❌ Bekor qilindi');
      await ctx.scene.leave();
      return;
    }

    const state = (ctx.wizard as any).state;
    try {
      await this.addRecord.execute({
        familyId: ctx.session?.familyId ?? '',
        type: state.type,
        categoryId: state.categoryId,
        amount: state.amount,
        createdBy: String(ctx.from?.id),
      });
      await ctx.reply('✅ Saqlandi! /balance');
      await ctx.scene.leave();
    } catch (e) {
      this.logger.error('Budget add failed', e);
      await ctx.reply('❌ Xatolik yuz berdi');
    }
  }
}
