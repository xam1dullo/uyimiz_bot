// ─── Sprint 9: First Aid Module ───
import { v4 as uuid } from 'uuid';

export class FirstAidEntity {
  constructor(
    public readonly id: string, public readonly familyId: string,
    public title: string, public description: string,
    public symptoms: string | null, public treatment: string | null,
    public emergencyLevel: string, public lang: string,
    public tags: string[] | null, public readonly createdAt: Date, public updatedAt: Date,
  ) {}
  static create(familyId: string, title: string, description: string, lang = 'uz', emergencyLevel = 'info'): FirstAidEntity {
    if (!title.trim()) throw new Error('FIRSTAID_TITLE_REQUIRED');
    return new FirstAidEntity(uuid(), familyId, title.trim(), description, null, null, emergencyLevel, lang, null, new Date(), new Date());
  }
}
