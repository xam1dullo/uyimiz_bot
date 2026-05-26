import { Injectable, Inject } from '@nestjs/common';
import { IBudgetRepository } from '../../../domain/repositories/budget.repository.interface';
import { BUDGET_REPO } from '../../../budget.tokens';
import { GetCategoryReportQuery } from './get-category-report.query';

interface CategoryReportItem {
  categoryId: string;
  total: number;
  count: number;
  percentage: number;
}

@Injectable()
export class GetCategoryReportHandler {
  constructor(@Inject(BUDGET_REPO) private readonly repo: IBudgetRepository) {}

  async execute(query: GetCategoryReportQuery): Promise<{ items: CategoryReportItem[]; total: number }> {
    // Single combined query: returns total expense + per-category breakdown
    const combined = await this.repo.getCategoryReport(query.familyId, query.year, query.month);
    
    const totalExpense = combined.total;
    const items: CategoryReportItem[] = combined.categories
      .filter((c) => c.total > 0)
      .map((c) => ({
        categoryId: c.categoryId,
        total: c.total,
        count: c.count,
        percentage: totalExpense > 0 ? Math.round((c.total / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    return { items, total: totalExpense };
  }
}
