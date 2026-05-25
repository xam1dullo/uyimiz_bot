import { Injectable, Inject, Logger } from '@nestjs/common';
import { budgetRecords, withFamilyContext, type DB } from '@uyimiz/db';
import { eq, and, sql, desc } from 'drizzle-orm';
import { BudgetRecordEntity } from '../../domain/entities/budget-record.entity';
import { IBudgetRepository } from '../../domain/repositories/budget.repository.interface';
import { DB_TOKEN } from '../../../../infrastructure/database/database.module';

@Injectable()
export class DrizzleBudgetRepository implements IBudgetRepository {
  private readonly logger = new Logger(DrizzleBudgetRepository.name);

  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}

  async create(record: BudgetRecordEntity): Promise<BudgetRecordEntity> {
    return withFamilyContext(record.familyId, async (tx) => {
      const [row] = await tx.insert(budgetRecords).values({
        id: record.id,
        familyId: record.familyId,
        type: record.type as any,
        categoryId: record.categoryId,
        amount: record.amount,
        description: record.description,
        txDate: record.txDate,
        createdBy: record.createdBy,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      }).returning();
      return this.toEntity(row);
    });
  }

  async findById(id: string): Promise<BudgetRecordEntity | null> {
    const [row] = await this.db.select().from(budgetRecords).where(eq(budgetRecords.id, id));
    return row ? this.toEntity(row) : null;
  }

  async findByFamilyId(familyId: string, options?: { type?: string; categoryId?: string; limit?: number; offset?: number }): Promise<BudgetRecordEntity[]> {
    const conditions = [eq(budgetRecords.familyId, familyId)];
    if (options?.type) conditions.push(eq(budgetRecords.type, options.type as any));
    if (options?.categoryId) conditions.push(eq(budgetRecords.categoryId, options.categoryId));

    const rows = await this.db.select().from(budgetRecords)
      .where(and(...conditions))
      .orderBy(desc(budgetRecords.txDate))
      .limit(options?.limit ?? 50)
      .offset(options?.offset ?? 0);
    return rows.map(this.toEntity);
  }

  async update(record: BudgetRecordEntity): Promise<BudgetRecordEntity> {
    return withFamilyContext(record.familyId, async (tx) => {
      const [row] = await tx.update(budgetRecords)
        .set({ amount: record.amount, description: record.description, updatedAt: record.updatedAt })
        .where(eq(budgetRecords.id, record.id))
        .returning();
      return this.toEntity(row);
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(budgetRecords).where(eq(budgetRecords.id, id));
  }

  async getBalance(familyId: string): Promise<number> {
    return withFamilyContext(familyId, async (tx) => {
      const result = await tx.execute(sql`
        SELECT
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
          COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as balance
        FROM budget_records
        WHERE family_id = ${familyId}
      `);
      return Number(result[0]?.balance ?? 0);
    });
  }

  async getMonthlySummary(familyId: string, year: number, month: number): Promise<{ income: number; expense: number }> {
    return withFamilyContext(familyId, async (tx) => {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const result = await tx.execute(sql`
        SELECT
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
          COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
        FROM budget_records
        WHERE family_id = ${familyId}
          AND tx_date >= ${startDate.toISOString()}::timestamp
          AND tx_date <= ${endDate.toISOString()}::timestamp
      `);
      return {
        income: Number(result[0]?.income ?? 0),
        expense: Number(result[0]?.expense ?? 0),
      };
    });
  }

  async getCategorySummary(familyId: string, year: number, month: number): Promise<Array<{ categoryId: string; total: number; count: number }>> {
    return withFamilyContext(familyId, async (tx) => {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const result = await tx.execute(sql`
        SELECT category_id, SUM(amount) as total, COUNT(*) as count
        FROM budget_records
        WHERE family_id = ${familyId}
          AND tx_date >= ${startDate.toISOString()}::timestamp
          AND tx_date <= ${endDate.toISOString()}::timestamp
        GROUP BY category_id
        ORDER BY total DESC
      `);
      return result.map((r: any) => ({
        categoryId: r.category_id as string,
        total: Number(r.total),
        count: Number(r.count),
      }));
    });
  }

  private toEntity(row: any): BudgetRecordEntity {
    return new BudgetRecordEntity(
      row.id, row.familyId, row.type, row.categoryId, row.amount,
      row.description, row.txDate, row.createdBy, row.createdAt, row.updatedAt,
    );
  }
}
