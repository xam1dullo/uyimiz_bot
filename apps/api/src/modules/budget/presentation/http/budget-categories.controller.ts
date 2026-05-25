import { Controller, Get, Param } from '@nestjs/common';
import { CategorySystem } from '../bot/category.system';

@Controller('api/budget/categories')
export class BudgetCategoriesController {
  constructor(private readonly categorySystem: CategorySystem) {}

  @Get()
  getAll() {
    return this.categorySystem.getByLang('uz');
  }

  @Get(':type')
  getByType(@Param('type') type: string) {
    if (type !== 'income' && type !== 'expense') {
      return { error: 'Invalid type. Use "income" or "expense"' };
    }
    return this.categorySystem.getByLang('uz').filter((c) => {
      const all = this.categorySystem.getAll();
      const cat = all.find((cc) => cc.id === c.id);
      return cat?.type === type;
    });
  }
}
