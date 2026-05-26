import { Injectable, Inject } from '@nestjs/common';
import { IBudgetRepository } from '../../../domain/repositories/budget.repository.interface';
import { BudgetRecordEntity } from '../../../domain/entities/budget-record.entity';
import { AddRecordCommand } from './add-record.command';
import { BUDGET_REPO } from '../../../budget.tokens';

@Injectable()
export class AddRecordHandler {
  constructor(@Inject(BUDGET_REPO) private readonly repo: IBudgetRepository) {}

  async execute(command: AddRecordCommand): Promise<BudgetRecordEntity> {
    const entity = BudgetRecordEntity.create(
      command.familyId,
      command.type,
      command.categoryId,
      command.amount,
      command.createdBy,
      command.description,
      command.txDate,
    );
    return this.repo.create(entity);
  }
}
