import { Injectable, Logger } from '@nestjs/common';
import { Wizard, WizardStep, Ctx, Hears } from 'nestjs-telegraf';
import type { WizardContext } from 'telegraf/scenes';
import { CreateFamilyHandler } from '../family/application/commands/create-family/create-family.handler';
import { JoinFamilyHandler } from '../family/application/commands/join-family/join-family.handler';

@Injectable()
@Wizard('ONBOARDING')
export class OnboardingWizard {
  private readonly logger = new Logger(OnboardingWizard.name);

  constructor(
    private readonly createFamily: CreateFamilyHandler,
    private readonly joinFamily: JoinFamilyHandler,
  ) {}

  @WizardStep(0)
  async stepLanguage(@Ctx() ctx: WizardContext) {
    await ctx.reply('Tilni tanlang / Выберите язык:', {
      reply_markup: {
        keyboard: [
          [{ text: "O'zbekcha 🇺🇿" }, { text: 'Русский 🇷🇺' }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    ctx.wizard.next();
  }

  @WizardStep(1)
  async stepLanguageChoose(@Ctx() ctx: WizardContext) {
    const text = (ctx as any).message?.text;
    if (text?.includes("O'zbekcha")) {
      (ctx.wizard as any).state.lang = 'uz';
    } else if (text?.includes('Русский')) {
      (ctx.wizard as any).state.lang = 'ru';
    } else {
      await ctx.reply('Iltimos, tilni tanlang / Пожалуйста, выберите язык');
      return;
    }
    ctx.wizard.next();
    await this.stepFamily(ctx);
  }

  @WizardStep(2)
  async stepFamily(@Ctx() ctx: WizardContext) {
    await ctx.reply('Sizda oila bormi? / У вас есть семья?', {
      reply_markup: {
        keyboard: [
          [{ text: '✅ Ha / Да' }, { text: "❌ Yo'q / Нет" }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    ctx.wizard.next();
  }

  @WizardStep(3)
  async stepFamilyChoice(@Ctx() ctx: WizardContext) {
    const text = (ctx as any).message?.text;
    if (text?.includes('Ha') || text?.includes('Да')) {
      ctx.wizard.next();
      await this.stepEnterCode(ctx);
    } else {
      await ctx.reply('Yangi oila yarating yoki kodingizni kiriting:', {
        reply_markup: {
          keyboard: [
            [{ text: '🆕 Yangi oila' }, { text: '🔑 Kodni kiriting' }],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    }
  }

  @WizardStep(4)
  async stepEnterCode(@Ctx() ctx: WizardContext) {
    await ctx.reply('Iltimos, oila kodini kiriting:');
    ctx.wizard.next();
  }

  @WizardStep(5)
  async stepProcessCode(@Ctx() ctx: WizardContext) {
    const code = (ctx as any).message?.text?.trim().toUpperCase();
    if (!code || code.length < 4) {
      await ctx.reply("Noto'g'ri kod. Qayta urining.");
      return;
    }
    try {
      const telegramId = String(ctx.from?.id);
      const name = ctx.from?.first_name ?? 'User';
      await this.joinFamily.execute({ code, telegramId, name });
      await ctx.reply('✅ Oila ga qo\'shildingiz! /menu');
      await ctx.scene.leave();
    } catch (e: any) {
      await ctx.reply(`❌ ${e.message === 'INVITE_CODE_INVALID' ? 'Kod noto\'g\'ri.' : e.message}`);
    }
  }

  @WizardStep(6)
  async stepCreateFamily(@Ctx() ctx: WizardContext) {
    await ctx.reply('Oila nomini kiriting:');
    ctx.wizard.next();
  }

  @WizardStep(7)
  async stepProcessCreation(@Ctx() ctx: WizardContext) {
    const familyName = (ctx as any).message?.text?.trim();
    if (!familyName) {
      await ctx.reply('Iltimos, oila nomini kiriting.');
      return;
    }
    try {
      const telegramId = String(ctx.from?.id);
      const name = ctx.from?.first_name ?? 'User';
      const result = await this.createFamily.execute({ name: familyName, creatorTelegramId: telegramId, creatorName: name });
      await ctx.reply(
        `✅ Oilangiz yaratildi! Kodingiz: *${result.family.code}*\n\nBu kodni oila a\'zolaringizga yuboring.`,
        { parse_mode: 'Markdown' },
      );
      await ctx.scene.leave();
    } catch (e: any) {
      await ctx.reply(`❌ ${e.message}`);
    }
  }

  @Hears(/^(❌|\/cancel)$/i)
  async cancel(@Ctx() ctx: WizardContext) {
    await ctx.scene.leave();
    await ctx.reply('❌ Bekor qilindi');
  }
}
