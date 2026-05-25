export const TASK_STATUSES = ['pending', 'in_progress', 'completed', 'cancelled'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const REPEAT_TYPES = ['none', 'daily', 'weekly', 'monthly'] as const;
export type RepeatType = (typeof REPEAT_TYPES)[number];

export interface Task {
  id: string;
  familyId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  repeat: RepeatType;
  points: number;
  assignedTo?: string;
  createdBy: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
