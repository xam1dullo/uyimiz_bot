import { TransactionType } from '@uyimiz/shared';
import { BudgetRecordEntity } from '../entities/budget-record.entity';

export interface IBudgetRepository {
  create(record: BudgetRecordEntity): Promise<BudgetRecordEntity>;
  findById(id: string): Promise<BudgetRecordEntity | null>;
  findByFamilyId(familyId: string, options?: { type?: TransactionType; categoryId?: string; limit?: number; offset?: number }): Promise<BudgetRecordEntity[]>;
  update(record: BudgetRecordEntity): Promise<BudgetRecordEntity>;
  delete(id: string): Promise<void>;
  getBalance(familyId: string): Promise<number>;
  getMonthlySummary(familyId: string, year: number, month: number): Promise<{ income: number; expense: number }>;
  getCategorySummary(familyId: string, year: number, month: number): Promise<Array<{ categoryId: string; total: number; count: number }>>;
}
