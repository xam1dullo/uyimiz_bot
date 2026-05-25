export const TRANSACTION_TYPES = ['income', 'expense'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export interface BudgetRecord {
  id: string;
  familyId: string;
  type: TransactionType;
  categoryId: string;
  amount: number;
  description?: string;
  txDate: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetCategory {
  id: string;
  name: Record<string, string>;
  icon: string;
  type: TransactionType;
  sortOrder: number;
}
