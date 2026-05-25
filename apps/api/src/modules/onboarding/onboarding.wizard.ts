import { Injectable, Logger } from '@nestjs/common';
import { Wizard, WizardStep, Ctx, Hears } from 'nestjs-telegraf';
import type { WizardContext } from 'telegraf/scenes';
import { CreateFamilyHandler } from '../family/application/commands/create-family/create-family.handler';
import { JoinFamilyHandler } from '../family/application/commands/join-family/join-family.handler';
import { I18nService } from '../../infrastructure/i18n/i18n.service';

@Injectable()
@Wizard('ONBOARDING')
export class OnboardingWizard {
  private readonly logger = new Logger(OnboardingWizard.name);

  constructor(
    private readonly createFamily: CreateFamilyHandler,
    private readonly joinFamily: JoinFamilyHandler,
    private readonly i18n: I18nService,
  ) {}

  private lang(ctx: WizardContext): string {
    return (ctx.wizard as any).state?.lang ?? 'uz';
  }

  @WizardStep(0)
  async stepLanguage(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await ctx.reply(this.i18n.t(l, 'onboarding.language.select'), {
      reply_markup: {
        keyboard: [
          [{ text: this.i18n.t(l, 'onboarding.language.uz') }, { text: this.i18n.t(l, 'onboarding.language.ru') }],
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
      const l = this.lang(ctx);
      await ctx.reply(this.i18n.t(l, 'onboarding.language.invalid'));
      return;
    }
    ctx.wizard.next();
    await this.stepFamily(ctx);
  }

  @WizardStep(2)
  async stepFamily(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await ctx.reply(this.i18n.t(l, 'onboarding.family.has'), {
      reply_markup: {
        keyboard: [
          [{ text: this.i18n.t(l, 'common.yes') }, { text: this.i18n.t(l, 'common.no') }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    ctx.wizard.next();
  }

  @WizardStep(3)
  async stepFamilyChoice(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    const text = (ctx as any).message?.text;
    if (text?.includes('Ha') || text?.includes('Да') || text?.includes('Yes')) {
      ctx.wizard.next();
      await this.stepEnterCode(ctx);
    } else {
      await ctx.reply(this.i18n.t(l, 'onboarding.family.create'), {
        reply_markup: {
          keyboard: [
            [{ text: this.i18n.t(l, 'onboarding.family.create') }, { text: this.i18n.t(l, 'onboarding.family.join') }],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    }
  }

  @WizardStep(4)
  async stepEnterCode(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await ctx.reply(this.i18n.t(l, 'onboarding.code.enter'));
    ctx.wizard.next();
  }

  @WizardStep(5)
  async stepProcessCode(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    const code = (ctx as any).message?.text?.trim().toUpperCase();
    if (!code || code.length < 4) {
      await ctx.reply(this.i18n.t(l, 'onboarding.code.invalid'));
      return;
    }
    try {
      const telegramId = String(ctx.from?.id);
      const name = ctx.from?.first_name ?? 'User';
      await this.joinFamily.execute({ code, telegramId, name });
      await ctx.reply(this.i18n.t(l, 'onboarding.code.success'));
      await ctx.scene.leave();
    } catch (e: any) {
      const msg = e.message === 'INVITE_CODE_INVALID'
        ? this.i18n.t(l, 'errors.invite_code_invalid')
        : e.message;
      await ctx.reply(`❌ ${msg}`);
    }
  }

  @WizardStep(6)
  async stepCreateFamily(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await ctx.reply(this.i18n.t(l, 'onboarding.family.create_name'));
    ctx.wizard.next();
  }

  @WizardStep(7)
  async stepProcessCreation(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    const familyName = (ctx as any).message?.text?.trim();
    if (!familyName) {
      await ctx.reply(this.i18n.t(l, 'onboarding.family.no_name'));
      return;
    }
    try {
      const telegramId = String(ctx.from?.id);
      const name = ctx.from?.first_name ?? 'User';
      const result = await this.createFamily.execute({ name: familyName, creatorTelegramId: telegramId, creatorName: name });
      await ctx.reply(
        this.i18n.t(l, 'onboarding.family.created', { code: result.family.code }),
        { parse_mode: 'Markdown' },
      );
      await ctx.scene.leave();
    } catch (e: any) {
      await ctx.reply(`❌ ${e.message}`);
    }
  }

  @Hears(/^(❌|\/cancel)$/i)
  async cancel(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await ctx.scene.leave();
    await ctx.reply(this.i18n.t(l, 'common.cancelled'));
  }
}
