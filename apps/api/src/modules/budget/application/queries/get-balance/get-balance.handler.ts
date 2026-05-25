import { Injectable, Inject } from '@nestjs/common';
import { IBudgetRepository } from '../../../domain/repositories/budget.repository.interface';
import { GetBalanceQuery } from './get-balance.query';
import { BUDGET_REPO } from '../../../budget.module';

@Injectable()
export class GetBalanceHandler {
  constructor(@Inject(BUDGET_REPO) private readonly repo: IBudgetRepository) {}

  async execute(query: GetBalanceQuery): Promise<number> {
    return this.repo.getBalance(query.familyId);
  }
}
