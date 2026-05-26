import { Injectable, Inject } from '@nestjs/common';
import { IBudgetRepository } from '../../../domain/repositories/budget.repository.interface';
import { CacheService } from '../../../../../infrastructure/cache/cache.service';
import { GetBalanceQuery } from './get-balance.query';
import { BUDGET_REPO } from '../../../budget.tokens';

@Injectable()
export class GetBalanceHandler {
  constructor(
    @Inject(BUDGET_REPO) private readonly repo: IBudgetRepository,
    private readonly cache: CacheService,
  ) {}

  async execute(query: GetBalanceQuery): Promise<number> {
    return this.cache.getOrSet(
      `budget:balance:${query.familyId}`,
      () => this.repo.getBalance(query.familyId),
      30, // 30 second TTL — balances change frequently
    );
  }
}
