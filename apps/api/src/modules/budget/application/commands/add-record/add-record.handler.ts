import { Injectable, Inject } from '@nestjs/common';
import { IBudgetRepository } from '../../../domain/repositories/budget.repository.interface';
import { CacheService } from '../../../../../infrastructure/cache/cache.service';
import { BudgetRecordEntity } from '../../../domain/entities/budget-record.entity';
import { AddRecordCommand } from './add-record.command';
import { BUDGET_REPO } from '../../../budget.tokens';

@Injectable()
export class AddRecordHandler {
  constructor(
    @Inject(BUDGET_REPO) private readonly repo: IBudgetRepository,
    private readonly cache: CacheService,
  ) {}

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
    const saved = await this.repo.create(entity);
    
    // Invalidate balance and summary caches
    await Promise.all([
      this.cache.del(`budget:balance:${command.familyId}`),
      this.cache.del(`budget:summary:${command.familyId}:*`),
    ]);
    
    return saved;
  }
}
