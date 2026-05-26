import { Injectable, Inject, Logger } from '@nestjs/common';
import { tasks, userPoints, withFamilyContext, type DB } from '@uyimiz/db';
import { eq, and, desc } from 'drizzle-orm';
import { TaskEntity } from '../../domain/entities/task.entity';
import { ITaskRepository } from '../../domain/repositories/task.repository.interface';
import { DB_TOKEN } from '../../../../infrastructure/database/database.module';

@Injectable()
export class DrizzleTaskRepository implements ITaskRepository {
  private readonly logger = new Logger(DrizzleTaskRepository.name);

  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}

  async create(task: TaskEntity): Promise<TaskEntity> {
    return withFamilyContext(task.familyId, async (tx) => {
      const [row] = await tx.insert(tasks).values({
        id: task.id,
        familyId: task.familyId,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        repeat: task.repeat,
        points: task.points,
        assignedTo: task.assignedTo,
        createdBy: task.createdBy,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      }).returning();
      return this.toEntity(row);
    });
  }

  async findById(id: string, familyId: string): Promise<TaskEntity | null> {
    return withFamilyContext(familyId, async (tx) => {
      const [row] = await tx.select().from(tasks).where(eq(tasks.id, id));
      return row ? this.toEntity(row) : null;
    }, this.db);
  }

  async findByFamilyId(familyId: string, options?: { status?: string; assignedTo?: string; limit?: number; offset?: number }): Promise<TaskEntity[]> {
    return withFamilyContext(familyId, async (tx) => {
      const conditions = [eq(tasks.familyId, familyId)];
      if (options?.status) conditions.push(eq(tasks.status, options.status as TaskEntity['status']));
      if (options?.assignedTo) conditions.push(eq(tasks.assignedTo, options.assignedTo));

      const rows = await tx.select().from(tasks)
        .where(and(...conditions))
        .orderBy(desc(tasks.createdAt))
        .limit(options?.limit ?? 50)
        .offset(options?.offset ?? 0);
      return rows.map((r) => this.toEntity(r));
    }, this.db);
  }

  async update(task: TaskEntity): Promise<TaskEntity> {
    return withFamilyContext(task.familyId, async (tx) => {
      const [row] = await tx.update(tasks)
        .set({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          points: task.points,
          updatedAt: task.updatedAt,
        })
        .where(eq(tasks.id, task.id))
        .returning();
      return this.toEntity(row);
    });
  }

  async delete(id: string, familyId: string): Promise<void> {
    return withFamilyContext(familyId, async (tx) => {
      await tx.delete(tasks).where(eq(tasks.id, id));
    }, this.db);
  }

  async completeTask(id: string, familyId: string): Promise<TaskEntity | null> {
    const task = await this.findById(id, familyId);
    if (!task) return null;
    task.complete();
    return this.update(task);
  }

  async getUserPoints(userId: string, weekStart: string): Promise<number> {
    const [row] = await this.db.select().from(userPoints)
      .where(and(eq(userPoints.userId, userId), eq(userPoints.weekStart, weekStart)));
    return row?.points ?? 0;
  }

  private toEntity(row: Record<string, unknown>): TaskEntity {
    return new TaskEntity(
      String(row.id ?? ''),
      String(row.familyId ?? ''),
      String(row.title ?? ''),
      (row.description as string) ?? null,
      row.status as TaskEntity['status'],
      row.priority as TaskEntity['priority'],
      row.repeat as TaskEntity['repeat'],
      Number(row.points ?? 0),
      (row.assignedTo as string) ?? null,
      String(row.createdBy ?? ''),
      (row.completedAt as Date) ?? null,
      row.createdAt as Date,
      row.updatedAt as Date,
    );
  }
}
