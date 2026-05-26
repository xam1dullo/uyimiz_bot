import { BUDGET_REPO } from './budget.tokens';
import { Module, forwardRef } from '@nestjs/common';
import { AddRecordHandler } from './application/commands/add-record/add-record.handler';
import { GetBalanceHandler } from './application/queries/get-balance/get-balance.handler';
import { GetMonthlySummaryHandler } from './application/queries/get-monthly-summary/get-monthly-summary.handler';
import { GetCategoryReportHandler } from './application/queries/get-category-report/get-category-report.handler';
import { DrizzleBudgetRepository } from './infrastructure/repositories/drizzle-budget.repository';
import { CategorySystem } from './presentation/bot/category.system';
import { BudgetController } from './presentation/http/budget.controller';
import { BudgetCategoriesController } from './presentation/http/budget-categories.controller';

@Module({
  controllers: [BudgetController, BudgetCategoriesController],
  providers: [
    AddRecordHandler,
    GetBalanceHandler,
    GetMonthlySummaryHandler,
    GetCategoryReportHandler,
    { provide: BUDGET_REPO, useClass: DrizzleBudgetRepository },
    CategorySystem,
  ],
  exports: [BUDGET_REPO, CategorySystem, AddRecordHandler, GetBalanceHandler, GetMonthlySummaryHandler, GetCategoryReportHandler],
})
export class BudgetModule {}
