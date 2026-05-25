// ─── Sprint 7: Children Module ───
import { v4 as uuid } from 'uuid';

export class ChildEntity {
  constructor(
    public readonly id: string, public readonly familyId: string,
    public name: string, public birthDate: string | null, public gender: string | null,
    public notes: string | null, public readonly createdAt: Date, public updatedAt: Date,
  ) {}
  static create(familyId: string, name: string, birthDate?: string | null): ChildEntity {
    if (!name.trim()) throw new Error('CHILD_NAME_REQUIRED');
    return new ChildEntity(uuid(), familyId, name.trim(), birthDate ?? null, null, null, new Date(), new Date());
  }
}
