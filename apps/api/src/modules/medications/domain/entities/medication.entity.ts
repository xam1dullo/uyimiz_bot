// ─── Sprint 9b: Medications Module ───
import { v4 as uuid } from 'uuid';

export class MedicationEntity {
  constructor(
    public readonly id: string, public readonly familyId: string,
    public name: string, public description: string | null,
    public dosage: string | null, public schedule: Record<string, unknown> | null,
    public assignedTo: string | null, public isActive: boolean,
    public readonly createdAt: Date, public updatedAt: Date,
  ) {}
  static create(familyId: string, name: string, dosage?: string | null, assignedTo?: string | null): MedicationEntity {
    if (!name.trim()) throw new Error('MED_NAME_REQUIRED');
    return new MedicationEntity(uuid(), familyId, name.trim(), null, dosage ?? null, null, assignedTo ?? null, true, new Date(), new Date());
  }
}
