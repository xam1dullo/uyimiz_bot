import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from './bot.update';
import { OnboardingWizard } from '../modules/onboarding/onboarding.wizard';
import { BudgetAddWizard } from '../modules/budget/presentation/bot/budget.wizard';
import { FamilyModule } from '../modules/family/family.module';
import { BudgetModule } from '../modules/budget/budget.module';
import { session } from 'telegraf';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        token: process.env.BOT_TOKEN ?? '',
        middlewares: [session()],
        launchOptions: {
          webhook: {
            domain: process.env.BOT_WEBHOOK_DOMAIN ?? '',
            path: process.env.BOT_WEBHOOK_PATH ?? '/bot/webhook',
          },
        },
      }),
    }),
    FamilyModule,
    BudgetModule,
  ],
  providers: [BotUpdate, OnboardingWizard, BudgetAddWizard],
})
export class BotModule {}
