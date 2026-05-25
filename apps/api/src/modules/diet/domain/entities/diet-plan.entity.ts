// ─── Sprint 8b: Diet Module ───
import { v4 as uuid } from 'uuid';

export class DietPlanEntity {
  constructor(
    public readonly id: string, public readonly familyId: string,
    public readonly userId: string | null, public mealType: string,
    public foodItems: Record<string, unknown>, public scheduledDate: string | null,
    public notes: string | null, public readonly createdAt: Date, public updatedAt: Date,
  ) {}
  static create(familyId: string, mealType: string, foodItems: Record<string, unknown>, userId?: string | null, scheduledDate?: string | null): DietPlanEntity {
    return new DietPlanEntity(uuid(), familyId, userId ?? null, mealType, foodItems, scheduledDate ?? null, null, new Date(), new Date());
  }
}
