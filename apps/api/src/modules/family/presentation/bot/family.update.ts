import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Update, Command, Action } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { CreateFamilyHandler } from '../../application/commands/create-family/create-family.handler';
import { JoinFamilyHandler } from '../../application/commands/join-family/join-family.handler';
import { GetFamilyHandler } from '../../application/queries/get-family/get-family.handler';

@Update()
@Injectable()
export class FamilyBotUpdate {
  private readonly logger = new Logger(FamilyBotUpdate.name);

  constructor(
    private readonly createFamily: CreateFamilyHandler,
    private readonly joinFamily: JoinFamilyHandler,
    private readonly getFamily: GetFamilyHandler,
  ) {}

  @Command('create_family')
  async create(@Ctx() ctx: Context) {
    try {
      const telegramId = String(ctx.from?.id);
      const name = ctx.from?.first_name ?? 'User';
      const result = await this.createFamily.execute({
        name: `${name}'s Family`,
        creatorTelegramId: telegramId,
        creatorName: name,
      });
      await ctx.reply(
        `✅ Oilangiz yaratildi!\n\n` +
        `Oila kodi: *${result.family.code}*\n\n` +
        `Bu kodni oila a'zolaringizga yuboring, ular /join_family orqali qo'shilishadi.`,
        { parse_mode: 'Markdown' },
      );
    } catch (e: any) {
      this.logger.error('Create family failed', e);
      await ctx.reply(`❌ ${e.message === 'USER_ALREADY_IN_FAMILY' ? 'Siz allaqachon oila a\'zosisiz.' : 'Xatolik yuz berdi.'}`);
    }
  }

  @Command('join_family')
  async join(@Ctx() ctx: Context) {
    await ctx.reply('Iltimos, oila kodini kiriting:');
    ctx.session = { ...ctx.session, awaitingFamilyCode: true };
  }

  @Command('my_family')
  async myFamily(@Ctx() ctx: Context) {
    try {
      const telegramId = String(ctx.from?.id);
      const member = await this.getFamily['repo'].findMemberByTelegramId(telegramId);
      if (!member) {
        await ctx.reply('Siz hech qanday oila a\'zosi emassiz. /create_family yoki /join_family');
        return;
      }
      const result = await this.getFamily.execute({ familyId: member.familyId });
      if (!result) {
        await ctx.reply('Oila topilmadi.');
        return;
      }
      const membersText = result.members
        .map((m) => `- ${m.name} (${m.role})`)
        .join('\n');
      await ctx.reply(
        `👨‍👩‍👧‍👦 *${result.family.name}*\n\n` +
        `Kod: \`${result.family.code}\`\n\n` +
        `A\'zolar:\n${membersText}`,
        { parse_mode: 'Markdown' },
      );
    } catch (e: any) {
      this.logger.error('Get family failed', e);
      await ctx.reply('❌ Xatolik yuz berdi.');
    }
  }
}
