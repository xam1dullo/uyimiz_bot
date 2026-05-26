import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './infrastructure/filters/all-exceptions.filter';
import { LoggingInterceptor } from './infrastructure/interceptors/logging.interceptor';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { QueueModule } from './infrastructure/queues/queue.module';
import { BotModule } from './bot/bot.module';
import { FamilyModule } from './modules/family/family.module';
import { BudgetModule } from './modules/budget/budget.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { AuthModule } from './modules/auth/auth.module';
import { I18nModule } from './infrastructure/i18n/i18n.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { BirthdaysModule } from './modules/birthdays/birthdays.module';
import { WebSocketModule } from './infrastructure/websocket/websocket.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 30 }]),
    DatabaseModule,
    CacheModule,
    QueueModule,
    BotModule,
    FamilyModule,
    BudgetModule,
    RemindersModule,
    OnboardingModule,
    AuthModule,
    I18nModule,
    TasksModule,
    BirthdaysModule,
    WebSocketModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
