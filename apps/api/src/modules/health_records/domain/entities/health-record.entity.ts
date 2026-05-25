import { v4 as uuid } from 'uuid';

export class HealthRecordEntity {
  constructor(
    public readonly id: string, public readonly familyId: string,
    public readonly userId: string, public readonly type: string,
    public readonly value: Record<string, unknown>, public readonly recordedAt: Date,
    public notes: string | null, public readonly createdAt: Date,
  ) {}
  static create(familyId: string, userId: string, type: string, value: Record<string, unknown>, recordedAt?: Date, notes?: string | null): HealthRecordEntity {
    return new HealthRecordEntity(uuid(), familyId, userId, type, value, recordedAt ?? new Date(), notes ?? null, new Date());
  }
}
