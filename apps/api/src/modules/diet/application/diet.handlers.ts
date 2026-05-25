// ─── Diet Command + Query ───
import { Injectable, Inject } from '@nestjs/common';
import { DietPlanEntity } from '../domain/entities/diet-plan.entity';
import { DIET_REPO } from '../diet.module';
import type { IDietRepository } from '../infrastructure/repositories/drizzle-diet.repository';

export class CreateDietCommand {
  constructor(public readonly familyId: string, public readonly mealType: string,
    public readonly foodItems: Record<string, unknown>, public readonly userId?: string | null, public readonly scheduledDate?: string | null) {}
}
@Injectable()
export class CreateDietHandler {
  constructor(@Inject(DIET_REPO) private readonly repo: IDietRepository) {}
  async execute(cmd: CreateDietCommand): Promise<DietPlanEntity> {
    return this.repo.create(DietPlanEntity.create(cmd.familyId, cmd.mealType, cmd.foodItems, cmd.userId, cmd.scheduledDate));
  }
}
export class ListDietQuery { constructor(public readonly familyId: string) {} }
@Injectable()
export class ListDietHandler {
  constructor(@Inject(DIET_REPO) private readonly repo: IDietRepository) {}
  async execute(q: ListDietQuery): Promise<DietPlanEntity[]> { return this.repo.findByFamilyId(q.familyId); }
}
