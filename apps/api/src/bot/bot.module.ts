import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from './bot.update';
import { OnboardingWizard } from '../modules/onboarding/onboarding.wizard';
import { BudgetAddWizard } from '../modules/budget/presentation/bot/budget.wizard';
import { FamilyModule } from '../modules/family/family.module';
import { BudgetModule } from '../modules/budget/budget.module';
import { BirthdaysModule } from '../modules/birthdays/birthdays.module';
import { MedicationsModule } from '../modules/medications/medications.module';
import { BirthdayBotUpdate } from '../modules/birthdays/presentation/bot/birthday.update';
import { MedicationBotUpdate } from '../modules/medications/presentation/bot/medication.update';
import { session } from 'telegraf';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: () => {
        const token = process.env.BOT_TOKEN;
        if (!token || token === 'your_bot_token_here') {
          throw new Error('BOT_TOKEN is required and must be a real token from @BotFather');
        }
        return {
          token,
          middlewares: [session()],
          launchOptions: process.env.BOT_WEBHOOK_DOMAIN ? {
            webhook: {
              domain: process.env.BOT_WEBHOOK_DOMAIN,
              path: process.env.BOT_WEBHOOK_PATH ?? '/bot/webhook',
            },
          } : undefined,  // polling mode if no domain
        };
      },
    }),
    FamilyModule,
    BudgetModule,
    BirthdaysModule,
    MedicationsModule,
  ],
  providers: [BotUpdate, OnboardingWizard, BudgetAddWizard, BirthdayBotUpdate, MedicationBotUpdate],
})
export class BotModule {}
