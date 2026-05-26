import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Update, Command, Action } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import type { BotContext } from '../../../../bot/core/bot-context.types';
import { CreateFamilyHandler } from '../../application/commands/create-family/create-family.handler';
import { JoinFamilyHandler } from '../../application/commands/join-family/join-family.handler';
import { GetFamilyHandler } from '../../application/queries/get-family/get-family.handler';
import { I18nService } from '../../../../infrastructure/i18n/i18n.service';

@Update()
@Injectable()
export class FamilyBotUpdate {
  private readonly logger = new Logger(FamilyBotUpdate.name);

  constructor(
    private readonly createFamily: CreateFamilyHandler,
    private readonly joinFamily: JoinFamilyHandler,
    private readonly getFamily: GetFamilyHandler,
    private readonly i18n: I18nService,
  ) {}

  private lang(ctx: Context): string {
    return this.i18n.getUserLang(ctx);
  }

  @Command('create_family')
  async create(@Ctx() ctx: BotContext) {
    const l = this.lang(ctx);
    try {
      const telegramId = String(ctx.from?.id);
      const name = ctx.from?.first_name ?? 'User';
      const result = await this.createFamily.execute({
        name: `${name}'s Family`,
        creatorTelegramId: telegramId,
        creatorName: name,
      });
      await ctx.reply(
        this.i18n.t(l, 'onboarding.family.created', { code: result.family.code }),
        { parse_mode: 'Markdown' },
      );
    } catch (e: any) {
      this.logger.error('Create family failed', e);
      const msg = e.message === 'USER_ALREADY_IN_FAMILY'
        ? this.i18n.t(l, 'errors.user_already_in_family')
        : this.i18n.t(l, 'common.error.general');
      await ctx.reply(msg);
    }
  }

  @Command('join_family')
  async join(@Ctx() ctx: BotContext) {
    const l = this.lang(ctx);
    await ctx.reply(this.i18n.t(l, 'onboarding.code.enter'));
    ctx.session = { ...ctx.session, awaitingFamilyCode: true };
  }

  @Command('my_family')
  async myFamily(@Ctx() ctx: BotContext) {
    const l = this.lang(ctx);
    try {
      const telegramId = String(ctx.from?.id);
      const member = await this.getFamily['repo'].findMemberByTelegramId(telegramId);
      if (!member) {
        await ctx.reply(this.i18n.t(l, 'family.not_member'));
        return;
      }
      const result = await this.getFamily.execute({ familyId: member.familyId });
      if (!result) {
        await ctx.reply(this.i18n.t(l, 'family.not_found'));
        return;
      }
      const membersText = result.members
        .map((m) => `- ${m.name} (${m.role})`)
        .join('\n');
      await ctx.reply(
        `👨‍👩‍👧‍👦 *${result.family.name}*\n\n` +
        `${this.i18n.t(l, 'family.invite_code', { code: result.family.code })}\n\n` +
        `${this.i18n.t(l, 'family.members')}:\n${membersText}`,
        { parse_mode: 'Markdown' },
      );
    } catch (e: any) {
      this.logger.error('Get family failed', e);
      await ctx.reply(this.i18n.t(l, 'common.error.general'));
    }
  }
}
