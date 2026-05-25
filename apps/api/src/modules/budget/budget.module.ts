import { Module } from '@nestjs/common';
import { AddRecordHandler } from './application/commands/add-record/add-record.handler';
import { GetBalanceHandler } from './application/queries/get-balance/get-balance.handler';
import { GetMonthlySummaryHandler } from './application/queries/get-monthly-summary/get-monthly-summary.handler';
import { GetCategoryReportHandler } from './application/queries/get-category-report/get-category-report.handler';
import { DrizzleBudgetRepository } from './infrastructure/repositories/drizzle-budget.repository';
import { BudgetBotUpdate } from './presentation/bot/budget.update';
import { BudgetAddWizard } from './presentation/bot/budget.wizard';
import { CategorySystem } from './presentation/bot/category.system';
import { BudgetController } from './presentation/http/budget.controller';
import { BudgetCategoriesController } from './presentation/http/budget-categories.controller';

export const BUDGET_REPO = Symbol('IBudgetRepository');

@Module({
  controllers: [BudgetController, BudgetCategoriesController],
  providers: [
    AddRecordHandler,
    GetBalanceHandler,
    GetMonthlySummaryHandler,
    GetCategoryReportHandler,
    { provide: BUDGET_REPO, useClass: DrizzleBudgetRepository },
    BudgetBotUpdate,
    BudgetAddWizard,
    CategorySystem,
  ],
  exports: [BUDGET_REPO, CategorySystem],
})
export class BudgetModule {}
