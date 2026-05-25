import { Injectable } from '@nestjs/common';
import { DEFAULT_BUDGET_CATEGORIES, type BudgetCategory } from '@uyimiz/shared';

@Injectable()
export class CategorySystem {
  getAll(): BudgetCategory[] {
    return DEFAULT_BUDGET_CATEGORIES;
  }

  getByType(type: 'income' | 'expense'): BudgetCategory[] {
    return DEFAULT_BUDGET_CATEGORIES.filter((c) => c.type === type);
  }

  getById(id: string): BudgetCategory | undefined {
    return DEFAULT_BUDGET_CATEGORIES.find((c) => c.id === id);
  }

  getByLang(lang: string): Array<{ id: string; name: string; icon: string }> {
    return DEFAULT_BUDGET_CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name[lang as keyof typeof c.name] ?? c.name.uz,
      icon: c.icon,
    }));
  }
}
