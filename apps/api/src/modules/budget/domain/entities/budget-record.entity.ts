import { v4 as uuid } from 'uuid';
import type { TransactionType } from '@uyimiz/shared';

export class BudgetRecordEntity {
  constructor(
    public readonly id: string,
    public readonly familyId: string,
    public readonly type: TransactionType,
    public readonly categoryId: string,
    public amount: number,
    public description: string | null,
    public readonly txDate: Date,
    public readonly createdBy: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(
    familyId: string,
    type: TransactionType,
    categoryId: string,
    amount: number,
    createdBy: string,
    description?: string | null,
    txDate?: Date,
  ): BudgetRecordEntity {
    if (amount <= 0) throw new Error('BUDGET_AMOUNT_INVALID');
    return new BudgetRecordEntity(
      uuid(), familyId, type, categoryId, amount, description ?? null,
      txDate ?? new Date(), createdBy, new Date(), new Date(),
    );
  }

  updateAmount(amount: number): void {
    if (amount <= 0) throw new Error('BUDGET_AMOUNT_INVALID');
    this.amount = amount;
    this.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }
}
