import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './infrastructure/filters/all-exceptions.filter';
import { LoggingInterceptor } from './infrastructure/interceptors/logging.interceptor';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { QueueModule } from './infrastructure/queues/queue.module';
import { BotModule } from './bot/bot.module';
import { HealthModule } from './modules/health/health.module';
import { HealthRecordsModule } from './modules/health_records/health-records.module';
import { FamilyModule } from './modules/family/family.module';
import { BudgetModule } from './modules/budget/budget.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { AuthModule } from './modules/auth/auth.module';
import { I18nModule } from './infrastructure/i18n/i18n.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { BirthdaysModule } from './modules/birthdays/birthdays.module';
import { ChildrenModule } from './modules/children/children.module';
import { DietModule } from './modules/diet/diet.module';
import { FirstAidModule } from './modules/first_aid/first-aid.module';
import { MedicationsModule } from './modules/medications/medications.module';
import { ImportantTasksModule } from './modules/important_tasks/important-tasks.module';
import { WebSocketModule } from './infrastructure/websocket/websocket.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 30 }]),
    DatabaseModule,
    CacheModule,
    QueueModule,
    BotModule,
    HealthModule,
    HealthRecordsModule,
    FamilyModule,
    BudgetModule,
    RemindersModule,
    OnboardingModule,
    AuthModule,
    I18nModule,
    TasksModule,
    BirthdaysModule,
    ChildrenModule,
    DietModule,
    FirstAidModule,
    MedicationsModule,
    ImportantTasksModule,
    WebSocketModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
