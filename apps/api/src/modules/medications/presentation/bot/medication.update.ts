import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Update, Command } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { ListMedicationsHandler } from '../../application/medications.handlers';
import { I18nService } from '../../../../infrastructure/i18n/i18n.service';

@Update()
@Injectable()
export class MedicationBotUpdate {
  private readonly logger = new Logger(MedicationBotUpdate.name);
  constructor(
    private readonly listMeds: ListMedicationsHandler,
    private readonly i18n: I18nService,
  ) {}

  @Command('medications')
  async list(@Ctx() ctx: Context & { session?: { familyId?: string } }) {
    const l = this.i18n.getUserLang(ctx);
    const fid = ctx.session?.familyId;
    if (!fid) { await ctx.reply(this.i18n.t(l, 'errors.need_family')); return; }
    const meds = await this.listMeds.execute({ familyId: fid });
    if (meds.length === 0) {
      await ctx.reply('💊 Hozircha dorilar yo\'q.');
      return;
    }
    const list = meds.map((m) => `${m.isActive ? '🟢' : '⚪'} ${m.name}${m.dosage ? ` — ${m.dosage}` : ''}`).join('\n');
    await ctx.reply(`💊 Dorilar:\n${list}`);
  }
}
