import { Module, forwardRef } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';

// Core
import { BotUpdate } from './core/bot.update';
import { ActionRouter } from './core/action-router';
import { KeyboardFactory } from './core/keyboard.factory';

// Handlers
import { StartHandler } from './handlers/start.handler';
import { HelpHandler } from './handlers/help.handler';
import { SettingsHandler } from './handlers/settings.handler';
import { MiniAppHandler } from './handlers/miniapp.handler';
import { InlineHandler } from './handlers/inline.handler';
import { PollHandler } from './handlers/poll.handler';
import { ChatMemberHandler } from './handlers/chat-member.handler';
import { PhotoHandler } from './handlers/photo.handler';

// Menus
import { MenuRegistry } from './menus/menu.registry';

// Wizards
import { BudgetAddWizard } from '../modules/budget/presentation/bot/budget.wizard';
import { BudgetBotUpdate } from '../modules/budget/presentation/bot/budget.update';

// Dependencies
import { FamilyModule } from '../modules/family/family.module';
import { BudgetModule } from '../modules/budget/budget.module';
import { OnboardingModule } from '../modules/onboarding/onboarding.module';

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
    forwardRef(() => FamilyModule),
    forwardRef(() => BudgetModule),
    OnboardingModule,
  ],
  providers: [
    BotUpdate, MenuRegistry,
    StartHandler, HelpHandler, SettingsHandler, MiniAppHandler, InlineHandler, PollHandler, ChatMemberHandler, PhotoHandler,
    BudgetAddWizard, BudgetBotUpdate,
  ],
  exports: [MenuRegistry],
})
export class BotModule {}
