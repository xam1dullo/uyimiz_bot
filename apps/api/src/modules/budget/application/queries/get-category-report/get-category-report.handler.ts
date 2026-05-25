import { Injectable } from '@nestjs/common';
import { IBudgetRepository } from '../../../domain/repositories/budget.repository.interface';
import { GetCategoryReportQuery } from './get-category-report.query';

interface CategoryReportItem {
  categoryId: string;
  total: number;
  count: number;
  percentage: number;
}

@Injectable()
export class GetCategoryReportHandler {
  constructor(private readonly repo: IBudgetRepository) {}

  async execute(query: GetCategoryReportQuery): Promise<{ items: CategoryReportItem[]; total: number }> {
    const summary = await this.repo.getMonthlySummary(query.familyId, query.year, query.month);
    const categories = await this.repo.getCategorySummary(query.familyId, query.year, query.month);
    const totalExpense = summary.expense;

    const items: CategoryReportItem[] = categories
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
