import { TaskEntity } from '../entities/task.entity';

export interface ITaskRepository {
  create(task: TaskEntity): Promise<TaskEntity>;
  findById(id: string, familyId: string): Promise<TaskEntity | null>;
  findByFamilyId(familyId: string, options?: { status?: string; assignedTo?: string; limit?: number; offset?: number }): Promise<TaskEntity[]>;
  update(task: TaskEntity): Promise<TaskEntity>;
  delete(id: string, familyId: string): Promise<void>;
  completeTask(id: string, familyId: string): Promise<TaskEntity | null>;
  getUserPoints(userId: string, weekStart: string): Promise<number>;
}
