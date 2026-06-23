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
    @Inject(forwardRef(() => CreateFamilyHandler)) private readonly createFamily: CreateFamilyHandler,
    @Inject(forwardRef(() => JoinFamilyHandler)) private readonly joinFamily: JoinFamilyHandler,
    @Inject(forwardRef(() => I18nService)) private readonly i18n: I18nService,
    @Inject(forwardRef(() => StreamingService)) private readonly stream: StreamingService,
  ) {}

  private lang(ctx: WizardContext): string {
    return (ctx.wizard as any).state?.lang ?? 'uz';
  }

  private t(ctx: WizardContext, key: string, params?: Record<string, string | number>): string {
    return this.i18n.t(this.lang(ctx), key, params);
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

    let selectedLang: string | null = null;
    if (text.includes('O\'zbekcha')) {
      selectedLang = 'uz';
    } else if (text.includes('Русский')) {
      selectedLang = 'ru';
    }

    if (!selectedLang) {
      await ctx.reply('❗ Iltimos, tilni tanlang / Пожалуйста, выберите язык');
      return;
    }

    (ctx.wizard as any).state.lang = selectedLang;
    ctx.wizard.next();
    await this.stepFamily(ctx);
  }

  @WizardStep(2)
  async stepFamily(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await ctx.reply('👨‍👩‍👧‍👦 ' + this.i18n.t(l, 'onboarding.family.has'), {
      reply_markup: {
        keyboard: [[
          { text: this.i18n.t(l, 'onboarding.family.new_btn') },
          { text: this.i18n.t(l, 'onboarding.family.join_btn') },
        ]],
        resize_keyboard: true, one_time_keyboard: true,
      },
    });
    ctx.wizard.next();
  }

  @WizardStep(3)
  async stepFamilyChoice(@Ctx() ctx: WizardContext) {
    const text = (ctx as any).message?.text;
    const l = this.lang(ctx);

    if (text?.includes(this.i18n.t(l, 'onboarding.family.new_btn').slice(2))) {
      ctx.wizard.selectStep(6);
      await this.stepCreateFamily(ctx);
    } else if (text?.includes(this.i18n.t(l, 'onboarding.family.join_btn').slice(2))) {
      ctx.wizard.selectStep(4);
      await this.stepEnterCode(ctx);
    } else {
      await ctx.reply(this.t(ctx, 'onboarding.choose_action'));
    }
  }

  @WizardStep(4)
  async stepEnterCode(@Ctx() ctx: WizardContext) {
    await ctx.reply('🔑 ' + this.t(ctx, 'onboarding.code.enter'));
    ctx.wizard.next();
  }

  @WizardStep(5)
  async stepProcessCode(@Ctx() ctx: WizardContext) {
    const code = (ctx as any).message?.text?.trim().toUpperCase();
    if (!code || code.length < 4) {
      await ctx.reply('⚠️ ' + this.t(ctx, 'onboarding.code.invalid_short'));
      return;
    }

    try {
      const telegramId = String(ctx.from?.id);
      const name = ctx.from?.first_name ?? 'User';
      const result = await this.joinFamily.execute({ code, telegramId, name });

      this.saveSession(ctx, result.familyId, this.lang(ctx));

      await ctx.reply('✅ ' + this.t(ctx, 'onboarding.code.joined'));
      await ctx.scene.leave();
      await this.showMainMenu(ctx as any, this.lang(ctx));
    } catch (e: any) {
      const msg = e?.message ?? '';
      if (msg.includes('INVITE_INVALID') || msg.includes('NOT_FOUND')) {
        await ctx.reply('⚠️ ' + this.t(ctx, 'onboarding.code.not_found'));
      } else {
        await ctx.reply('❌ ' + this.t(ctx, 'onboarding.error_unknown'));
      }
    }
  }

  @WizardStep(6)
  async stepCreateFamily(@Ctx() ctx: WizardContext) {
    await ctx.reply('📝 ' + this.t(ctx, 'onboarding.family.create_name'));
    ctx.wizard.next();
  }

  @WizardStep(7)
  async stepProcessCreation(@Ctx() ctx: WizardContext) {
    const familyName = (ctx as any).message?.text?.trim();
    if (!familyName || familyName.length < 2) {
      await ctx.reply('⚠️ ' + this.t(ctx, 'onboarding.family.name_too_short'));
      return;
    }

    const loadingMsg = await ctx.reply(this.t(ctx, 'onboarding.family.create_loading'));

    try {
      const telegramId = String(ctx.from?.id);
      const name = ctx.from?.first_name ?? 'User';
      const result = await this.createFamily.execute({
        name: familyName, creatorTelegramId: telegramId, creatorName: name,
      });

      this.saveSession(ctx, result.family.id, this.lang(ctx));

      const l = this.lang(ctx);
      await ctx.telegram.editMessageText(
        ctx.chat!.id, (loadingMsg as any).message_id, undefined,
        this.t(ctx, 'onboarding.family.created_inline', {
          name: familyName,
          code: result.family.code,
        }),
      );

      await ctx.scene.leave();
      await this.showMainMenu(ctx as any, l);
    } catch (e: any) {
      const msg = e?.message ?? '';
      if (msg.includes('USER_ALREADY_IN_FAMILY')) {
        await ctx.telegram.editMessageText(
          ctx.chat!.id, (loadingMsg as any).message_id, undefined,
          this.t(ctx, 'onboarding.already_in_family'),
        );
      } else {
        await ctx.telegram.editMessageText(
          ctx.chat!.id, (loadingMsg as any).message_id, undefined,
          this.t(ctx, 'onboarding.error_prefix') + (msg || 'Unknown'),
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
    await ctx.reply(
      this.i18n.t(l, 'onboarding.main_menu'),
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '💰 ' + this.i18n.t(l, 'menu.budget'), callback_data: 'menu:budget:open' }],
            [{ text: '📋 ' + this.i18n.t(l, 'menu.tasks'), callback_data: 'menu:tasks:open' }],
            [{ text: '🔔 ' + this.i18n.t(l, 'menu.reminders'), callback_data: 'menu:reminders:open' }],
            [{ text: '⚙️ ' + this.i18n.t(l, 'menu.settings'), callback_data: 'menu:settings:open' }],
          ],
        },
      },
    );
  }

  @Hears(/\/cancel/)
  async cancel(@Ctx() ctx: WizardContext) {
    await ctx.scene.leave();
    await ctx.reply(this.t(ctx, 'onboarding.cancelled'), {
      reply_markup: { remove_keyboard: true },
    });
  }
}
