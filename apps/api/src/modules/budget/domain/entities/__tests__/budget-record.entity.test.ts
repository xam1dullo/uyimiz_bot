import { describe, it, expect } from 'vitest';
import { BudgetRecordEntity } from '../budget-record.entity';

describe('BudgetRecordEntity', () => {
  const valid = { familyId: 'f1', type: 'income' as const, categoryId: 'c1', amount: 5000, createdBy: 'u1' };

  describe('create', () => {
    it('creates with valid params', () => {
      const r = BudgetRecordEntity.create(valid.familyId, valid.type, valid.categoryId, valid.amount, valid.createdBy);
      expect(r.id).toBeTruthy();
      expect(r.type).toBe('income');
      expect(r.amount).toBe(5000);
      expect(r.description).toBeNull();
      expect(r.txDate).toBeInstanceOf(Date);
    });

    it('throws on amount <= 0', () => {
      expect(() => BudgetRecordEntity.create(valid.familyId, valid.type, valid.categoryId, 0, valid.createdBy))
        .toThrow('BUDGET_AMOUNT_INVALID');
      expect(() => BudgetRecordEntity.create(valid.familyId, valid.type, valid.categoryId, -100, valid.createdBy))
        .toThrow('BUDGET_AMOUNT_INVALID');
    });

    it('accepts custom txDate', () => {
      const past = new Date('2024-01-15');
      const r = BudgetRecordEntity.create(valid.familyId, valid.type, valid.categoryId, 100, valid.createdBy, undefined, past);
      expect(r.txDate).toEqual(past);
    });
  });

  describe('updateAmount', () => {
    it('updates amount and updatedAt', () => {
      const r = BudgetRecordEntity.create(valid.familyId, valid.type, valid.categoryId, valid.amount, valid.createdBy);
      const prev = r.updatedAt;
      r.updateAmount(10000);
      expect(r.amount).toBe(10000);
      expect(r.updatedAt.getTime()).toBeGreaterThanOrEqual(prev.getTime());
    });

    it('throws on amount <= 0', () => {
      const r = BudgetRecordEntity.create(valid.familyId, valid.type, valid.categoryId, valid.amount, valid.createdBy);
      expect(() => r.updateAmount(0)).toThrow('BUDGET_AMOUNT_INVALID');
    });
  });
});
