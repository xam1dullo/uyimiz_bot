import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { Wizard, WizardStep, Ctx, Hears } from 'nestjs-telegraf';
import type { WizardContext } from 'telegraf/scenes';
import { CreateFamilyHandler } from '../family/application/commands/create-family/create-family.handler';
import { JoinFamilyHandler } from '../family/application/commands/join-family/join-family.handler';
import { I18nService } from '../../infrastructure/i18n/i18n.service';
import { StreamingService } from '../../bot/core/streaming.service';

@Injectable()
@Wizard('ONBOARDING')
export class OnboardingWizard {
  private readonly logger = new Logger(OnboardingWizard.name);

  constructor(
    private readonly createFamily: CreateFamilyHandler,
    private readonly joinFamily: JoinFamilyHandler,
    private readonly i18n: I18nService,
    @Inject(forwardRef(() => StreamingService)) private readonly stream: StreamingService,
  ) {}

  private lang(ctx: WizardContext): string {
    return (ctx.wizard as any).state?.lang ?? 'uz';
  }

  @WizardStep(0)
  async stepLanguage(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await this.stream.answerFirst(ctx as any);
    await ctx.reply('🌐 ' + this.i18n.t(l, 'onboarding.language.select'), {
      reply_markup: {
        keyboard: [[
          { text: '🇺🇿 O\'zbekcha' },
          { text: '🇷🇺 Русский' },
        ]],
        resize_keyboard: true, one_time_keyboard: true,
      },
    });
    ctx.wizard.next();
  }

  @WizardStep(1)
  async stepLanguageChoose(@Ctx() ctx: WizardContext) {
    const text = (ctx as any).message?.text;
    if (!text) return;
    
    if (text.includes('O\'zbekcha')) {
      (ctx.wizard as any).state.lang = 'uz';
    } else if (text.includes('Русский')) {
      (ctx.wizard as any).state.lang = 'ru';
    } else {
      await ctx.reply('❗ Iltimos, tilni tanlang / Пожалуйста, выберите язык');
      return;
    }
    ctx.wizard.next();
    await this.stepFamily(ctx);
  }

  @WizardStep(2)
  async stepFamily(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await ctx.reply('👨‍👩‍👧‍👦 ' + this.i18n.t(l, 'onboarding.family.has'), {
      reply_markup: {
        keyboard: [[
          { text: '✅ ' + this.i18n.t(l, 'common.yes') },
          { text: '🆕 Yangi oila' },
        ]],
        resize_keyboard: true, one_time_keyboard: true,
      },
    });
    ctx.wizard.next();
  }

  @WizardStep(3)
  async stepFamilyChoice(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    const text = (ctx as any).message?.text;
    
    if (text?.includes('Yangi oila') || text?.includes('Новая')) {
      ctx.wizard.next();
      ctx.wizard.next();
      ctx.wizard.next();
      await this.stepCreateFamily(ctx);
    } else {
      // Has family → enter code
      ctx.wizard.next();
      await this.stepEnterCode(ctx);
    }
  }

  @WizardStep(4)
  async stepEnterCode(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await ctx.reply('🔑 ' + this.i18n.t(l, 'onboarding.code.enter'));
    ctx.wizard.next();
    ctx.wizard.next(); // skip to process
  }

  @WizardStep(5)
  async stepProcessCode(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    const code = (ctx as any).message?.text?.trim().toUpperCase();
    if (!code || code.length < 4) {
      await ctx.reply('⚠️ ' + this.i18n.t(l, 'onboarding.code.invalid'));
      return;
    }

    // Progressive join
    await this.stream.stream(ctx as any, [
      { emoji: '🔍', placeholder: 'Kod tekshirilmoqda...', compute: async () => {
        const telegramId = String(ctx.from?.id);
        const name = ctx.from?.first_name ?? 'User';
        await this.joinFamily.execute({ code, telegramId, name });
        return '✅ ' + this.i18n.t(l, 'onboarding.code.success');
      }},
    ]);

    await ctx.scene.leave();
  }

  @WizardStep(6)
  async stepCreateFamily(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await ctx.reply('📝 ' + this.i18n.t(l, 'onboarding.family.create_name'));
    ctx.wizard.next();
  }

  @WizardStep(7)
  async stepProcessCreation(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    const familyName = (ctx as any).message?.text?.trim();
    if (!familyName) {
      await ctx.reply('⚠️ ' + this.i18n.t(l, 'onboarding.family.no_name'));
      return;
    }

    // Progressive create
    await this.stream.stream(ctx as any, [
      { emoji: '🏗️', placeholder: 'Oila yaratilmoqda...', compute: async () => {
        const telegramId = String(ctx.from?.id);
        const name = ctx.from?.first_name ?? 'User';
        const result = await this.createFamily.execute({ 
          name: familyName, creatorTelegramId: telegramId, creatorName: name 
        });
        return '✅ ' + this.i18n.t(l, 'onboarding.family.created', { code: result.family.code });
      }},
    ]);

    await ctx.scene.leave();
  }

  @Hears(/\/cancel/)
  async cancel(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await ctx.scene.leave();
    await ctx.reply('👋 ' + this.i18n.t(l, 'common.cancelled'), {
      reply_markup: { remove_keyboard: true },
    });
  }
}
