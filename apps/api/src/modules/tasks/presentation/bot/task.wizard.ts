import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Wizard, WizardStep, Ctx, Hears } from 'nestjs-telegraf';
import type { WizardContext } from 'telegraf/scenes';
import { CreateTaskHandler } from '../../application/commands/create-task/create-task.handler';
import { I18nService } from '../../../../infrastructure/i18n/i18n.service';

@Injectable()
@Wizard('TASK_ADD')
export class TaskAddWizard {
  constructor(
    @Inject(forwardRef(() => CreateTaskHandler)) private readonly createTask: CreateTaskHandler,
    @Inject(forwardRef(() => I18nService)) private readonly i18n: I18nService,
  ) {}

  private lang(ctx: WizardContext): string {
    return (ctx.session as { lang?: string }).lang ?? 'uz';
  }

  @WizardStep(0)
  async stepTitle(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await ctx.reply(this.i18n.t(l, 'tasks.add_prompt'));
    ctx.wizard.next();
  }

  @WizardStep(1)
  async stepSave(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    const title = ((ctx.message as { text: string })?.text ?? '').trim();
    
    if (!title || title.length < 2) {
      await ctx.reply(this.i18n.t(l, 'budget.invalid_amount')); // reuse: "please enter valid"
      return;
    }

    const familyId = (ctx as any).session.familyId;
    if (!familyId) {
      await ctx.reply(this.i18n.t(l, 'budget.no_family'));
      await ctx.scene.leave();
      return;
    }

    await this.createTask.execute({
      familyId,
      title,
      createdBy: String(ctx.from?.id),
      priority: 'medium',
      points: 10,
    });

    await ctx.reply(this.i18n.t(l, 'tasks.created').replace('{title}', title));
    await ctx.scene.leave();
  }

  @Hears(/\/cancel/)
  async cancel(@Ctx() ctx: WizardContext) {
    const l = this.lang(ctx);
    await ctx.scene.leave();
    await ctx.reply(this.i18n.t(l, 'budget.cancelled'));
  }
}
