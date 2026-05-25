import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';

// Core
import { BotUpdate } from './core/bot.update';
import { KeyboardFactory } from './core/keyboard.factory';
import { StreamingService } from './core/streaming.service';
import { MessageManager } from './core/message-manager';
import { BotAnalytics } from './core/bot-analytics';

// Handlers
import { StartHandler } from './handlers/start.handler';
import { HelpHandler } from './handlers/help.handler';
import { SettingsHandler } from './handlers/settings.handler';
import { MiniAppHandler } from './handlers/miniapp.handler';
import { InlineHandler } from './handlers/inline.handler';
import { PollHandler } from './handlers/poll.handler';
import { ChatMemberHandler } from './handlers/chat-member.handler';
import { PhotoHandler } from './handlers/photo.handler';
import { AdminHandler } from './handlers/admin.handler';

// Menus
import { MenuRegistry } from './menus/menu.registry';
import { mainMenu } from './menus/main.menu';
import { familyMenu } from './menus/family.menu';
import { budgetMenu } from './menus/budget.menu';
import { settingsMenu } from './menus/settings.menu';

// Wizards
import { OnboardingWizard } from '../modules/onboarding/onboarding.wizard';
import { BudgetAddWizard } from '../modules/budget/presentation/bot/budget.wizard';

// Module handlers
import { BirthdayBotUpdate } from '../modules/birthdays/presentation/bot/birthday.update';
import { MedicationBotUpdate } from '../modules/medications/presentation/bot/medication.update';

// Dependencies
import { FamilyModule } from '../modules/family/family.module';
import { BudgetModule } from '../modules/budget/budget.module';
import { BirthdaysModule } from '../modules/birthdays/birthdays.module';
import { MedicationsModule } from '../modules/medications/medications.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: () => {
        const token = process.env.BOT_TOKEN;
        if (!token || token === 'your_bot_token_here') throw new Error('BOT_TOKEN is required');
        return {
          token,
          middlewares: [session()],
          launchOptions: process.env.BOT_WEBHOOK_DOMAIN ? {
            webhook: { domain: process.env.BOT_WEBHOOK_DOMAIN, path: process.env.BOT_WEBHOOK_PATH ?? '/bot/webhook' },
          } : undefined,
        };
      },
    }),
    FamilyModule, BudgetModule, BirthdaysModule, MedicationsModule,
  ],
  providers: [
    BotUpdate, KeyboardFactory, MenuRegistry, StreamingService, MessageManager, BotAnalytics,
    StartHandler, HelpHandler, SettingsHandler, MiniAppHandler, InlineHandler, PollHandler, ChatMemberHandler, PhotoHandler,
    AdminHandler,
    OnboardingWizard, BudgetAddWizard,
    BirthdayBotUpdate, MedicationBotUpdate,
    { provide: 'MAIN_MENU', useValue: mainMenu },
    { provide: 'FAMILY_MENU', useValue: familyMenu },
    { provide: 'BUDGET_MENU', useValue: budgetMenu },
    { provide: 'SETTINGS_MENU', useValue: settingsMenu },
  ],
  exports: [KeyboardFactory, MenuRegistry, StreamingService],
})
export class BotModule {}
