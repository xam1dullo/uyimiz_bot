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
          { text: '🆕 Yangi oila yaratish' },
          { text: '🔑 Kod bilan qo\'shilish' },
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
    
    if (text?.includes('Yangi oila')) {
      // Skip to create family
      ctx.wizard.selectStep(6);
      await this.stepCreateFamily(ctx);
    } else if (text?.includes('Kod')) {
      // Enter code
      ctx.wizard.selectStep(4);
      await this.stepEnterCode(ctx);
    } else {
      await ctx.reply('❗ Iltimos, tugmalardan birini tanlang');
    }
  }

  @WizardStep(4)
  async stepEnterCode(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await ctx.reply('🔑 ' + this.i18n.t(l, 'onboarding.code.enter'));
    ctx.wizard.next();
  }

  @WizardStep(5)
  async stepProcessCode(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    const code = (ctx as any).message?.text?.trim().toUpperCase();
    if (!code || code.length < 4) {
      await ctx.reply('⚠️ ' + this.i18n.t(l, 'onboarding.code.invalid'));
      return;
    }

    try {
      const telegramId = String(ctx.from?.id);
      const name = ctx.from?.first_name ?? 'User';
      const result = await this.joinFamily.execute({ code, telegramId, name });
      
      // Save to session
      this.saveSession(ctx, result.familyId, l);
      
      await ctx.reply('✅ Oilaga qo\'shildingiz!');
      await ctx.scene.leave();
      await this.showMainMenu(ctx as any, l);
    } catch (e: any) {
      const msg = e?.message ?? '';
      if (msg.includes('INVITE_INVALID') || msg.includes('NOT_FOUND')) {
        await ctx.reply('⚠️ Bunday kod topilmadi. Qaytadan kiriting yoki /cancel');
      } else {
        await ctx.reply('❌ Xatolik yuz berdi. /cancel yozib qaytadan boshlang');
      }
    }
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
    if (!familyName || familyName.length < 2) {
      await ctx.reply('⚠️ Iltimos, oila nomini kiriting (kamida 2 ta harf)');
      return;
    }

    // Show loading
    const loadingMsg = await ctx.reply('🏗️ Oila yaratilmoqda...');

    try {
      const telegramId = String(ctx.from?.id);
      const name = ctx.from?.first_name ?? 'User';
      const result = await this.createFamily.execute({ 
        name: familyName, creatorTelegramId: telegramId, creatorName: name 
      });
      
      // Save to session
      this.saveSession(ctx, result.family.id, l);
      
      // Update loading message
      await ctx.telegram.editMessageText(
        ctx.chat!.id, (loadingMsg as any).message_id, undefined,
        `✅ Oila yaratildi!\n\n` +
        `📛 Nomi: ${familyName}\n` +
        `🔑 Kodi: \`${result.family.code}\`\n\n` +
        `Bu kodni oila a'zolariga yuboring.`
      );
      
      await ctx.scene.leave();
      await this.showMainMenu(ctx as any, l);
    } catch (e: any) {
      const msg = e?.message ?? '';
      if (msg.includes('USER_ALREADY_IN_FAMILY')) {
        await ctx.telegram.editMessageText(
          ctx.chat!.id, (loadingMsg as any).message_id, undefined,
          '⚠️ Siz allaqachon oiladasiz!\n\nAvval eski oiladan chiqing yoki /cancel bosing.'
        );
      } else {
        await ctx.telegram.editMessageText(
          ctx.chat!.id, (loadingMsg as any).message_id, undefined,
          '❌ Xatolik: ' + (msg || 'Nomalum xatolik')
        );
      }
    }
  }

  private saveSession(ctx: WizardContext, familyId: string, lang: string): void {
    const session = (ctx as any).session ?? {};
    session.familyId = familyId;
    session.lang = lang;
    (ctx as any).session = session;
    this.logger.log(`Session saved: familyId=${familyId}, lang=${lang}`);
  }

  private async showMainMenu(ctx: any, l: string): Promise<void> {
    const { Markup } = require('telegraf');
    await ctx.reply(
      '📋 Asosiy menyu:',
      Markup.keyboard([
        ['💰 Byudjet', '📋 Yumushlar'],
        ['🔔 Eslatmalar', '⚙️ Sozlamalar'],
      ]).resize(),
    );
  }

  @Hears(/\/cancel/)
  async cancel(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await ctx.scene.leave();
    await ctx.reply('👋 Bekor qilindi.', {
      reply_markup: { remove_keyboard: true },
    });
  }
}
