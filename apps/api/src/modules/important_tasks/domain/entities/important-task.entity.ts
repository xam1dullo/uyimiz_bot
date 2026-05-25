import { v4 as uuid } from 'uuid';

export class ImportantTaskEntity {
  constructor(
    public readonly id: string, public readonly familyId: string,
    public title: string, public description: string | null,
    public priority: string, public progress: number,
    public deadline: Date | null, public assignedTo: string | null,
    public readonly createdBy: string, public isCompleted: boolean,
    public completedAt: Date | null, public readonly createdAt: Date, public updatedAt: Date,
  ) {}
  static create(familyId: string, title: string, createdBy: string, deadline?: Date | null, priority = 'medium'): ImportantTaskEntity {
    if (!title.trim()) throw new Error('IMPORTANT_TASK_TITLE_REQUIRED');
    return new ImportantTaskEntity(uuid(), familyId, title.trim(), null, priority, 0, deadline ?? null, null, createdBy, false, null, new Date(), new Date());
  }
  complete(): void { this.isCompleted = true; this.completedAt = new Date(); this.updatedAt = new Date(); }
  updateProgress(pct: number): void { this.progress = Math.min(100, Math.max(0, pct)); this.updatedAt = new Date(); }
}
