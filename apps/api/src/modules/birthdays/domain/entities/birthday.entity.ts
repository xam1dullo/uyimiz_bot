// ─── Sprint 6: Birthdays Module ───
import { v4 as uuid } from 'uuid';

export class BirthdayEntity {
  constructor(
    public readonly id: string,
    public readonly familyId: string,
    public readonly userId: string | null,
    public name: string,
    public readonly birthDate: string,
    public notifyDaysBefore: number[],
    public readonly createdBy: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(params: {
    familyId: string;
    name: string;
    birthDate: string;
    createdBy: string;
    userId?: string | null;
    notifyDaysBefore?: number[];
  }): BirthdayEntity {
    if (!params.name.trim()) throw new Error('BIRTHDAY_NAME_REQUIRED');
    return new BirthdayEntity(
      uuid(), params.familyId, params.userId ?? null,
      params.name.trim(), params.birthDate,
      params.notifyDaysBefore ?? [7, 3, 1],
      params.createdBy, new Date(), new Date(),
    );
  }
}
