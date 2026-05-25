import { Injectable, Inject } from '@nestjs/common';
import { IBudgetRepository } from '../../../domain/repositories/budget.repository.interface';
import { GetMonthlySummaryQuery } from './get-monthly-summary.query';
import { BUDGET_REPO } from '../../../budget.module';

@Injectable()
export class GetMonthlySummaryHandler {
  constructor(@Inject(BUDGET_REPO) private readonly repo: IBudgetRepository) {}

  async execute(query: GetMonthlySummaryQuery): Promise<{ income: number; expense: number; balance: number }> {
    const summary = await this.repo.getMonthlySummary(query.familyId, query.year, query.month);
    return {
      income: summary.income,
      expense: summary.expense,
      balance: summary.income - summary.expense,
    };
  }
}
