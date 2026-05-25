import { Injectable, Inject } from '@nestjs/common';
import { dietPlans, withFamilyContext, type DB } from '@uyimiz/db';
import { eq } from 'drizzle-orm';
import { DietPlanEntity } from '../../domain/entities/diet-plan.entity';
import { DB_TOKEN } from '../../../../infrastructure/database/database.module';

export interface IDietRepository { create(d: DietPlanEntity): Promise<DietPlanEntity>; findByFamilyId(fid: string): Promise<DietPlanEntity[]>; update(d: DietPlanEntity): Promise<DietPlanEntity>; delete(id: string): Promise<void>; }

@Injectable()
export class DrizzleDietRepository implements IDietRepository {
  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}
  async create(d: DietPlanEntity): Promise<DietPlanEntity> {
    return withFamilyContext(d.familyId, async (tx) => {
      const [row] = await tx.insert(dietPlans).values({
        id: d.id, familyId: d.familyId, userId: d.userId, mealType: d.mealType,
        foodItems: d.foodItems, scheduledDate: d.scheduledDate,
        notes: d.notes, createdAt: d.createdAt, updatedAt: d.updatedAt,
      }).returning();
      return this.toEntity(row);
    });
  }
  async findByFamilyId(fid: string): Promise<DietPlanEntity[]> {
    const rows = await this.db.select().from(dietPlans).where(eq(dietPlans.familyId, fid));
    return rows.map((r) => this.toEntity(r));
  }
  async update(d: DietPlanEntity): Promise<DietPlanEntity> { return d; }
  async delete(id: string): Promise<void> { await this.db.delete(dietPlans).where(eq(dietPlans.id, id)); }
  private toEntity(row: Record<string, unknown>): DietPlanEntity {
    return new DietPlanEntity(String(row.id), String(row.familyId), (row.userId as string) ?? null,
      String(row.mealType), (row.foodItems as Record<string, unknown>) ?? {},
      (row.scheduledDate as string) ?? null, (row.notes as string) ?? null,
      row.createdAt as Date, row.updatedAt as Date);
  }
}
