import { v4 as uuid } from 'uuid';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export class TaskEntity {
  constructor(
    public readonly id: string,
    public readonly familyId: string,
    public title: string,
    public description: string | null,
    public status: TaskStatus,
    public priority: TaskPriority,
    public repeat: RepeatType,
    public points: number,
    public readonly assignedTo: string | null,
    public readonly createdBy: string,
    public completedAt: Date | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(params: {
    familyId: string;
    title: string;
    createdBy: string;
    assignedTo?: string | null;
    description?: string | null;
    priority?: TaskPriority;
    points?: number;
    repeat?: RepeatType;
  }): TaskEntity {
    if (!params.title.trim()) throw new Error('TASK_TITLE_REQUIRED');
    return new TaskEntity(
      uuid(),
      params.familyId,
      params.title.trim(),
      params.description ?? null,
      'pending',
      params.priority ?? 'medium',
      params.repeat ?? 'none',
      params.points ?? 0,
      params.assignedTo ?? null,
      params.createdBy,
      null,
      new Date(),
      new Date(),
    );
  }

  complete(): void {
    this.status = 'completed';
    this.completedAt = new Date();
    this.updatedAt = new Date();
  }

  start(): void {
    this.status = 'in_progress';
    this.updatedAt = new Date();
  }

  cancel(): void {
    this.status = 'cancelled';
    this.updatedAt = new Date();
  }

  updateTitle(title: string): void {
    if (!title.trim()) throw new Error('TASK_TITLE_REQUIRED');
    this.title = title.trim();
    this.updatedAt = new Date();
  }
}
