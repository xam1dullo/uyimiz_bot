import { Injectable, Inject } from '@nestjs/common';
import { importantTasks, withFamilyContext, type DB } from '@uyimiz/db';
import { eq, desc } from 'drizzle-orm';
import { ImportantTaskEntity } from '../../domain/entities/important-task.entity';
import { DB_TOKEN } from '../../../../infrastructure/database/database.module';

export interface IImportantTaskRepository {
  create(t: ImportantTaskEntity): Promise<ImportantTaskEntity>;
  findByFamilyId(fid: string): Promise<ImportantTaskEntity[]>;
  update(t: ImportantTaskEntity): Promise<ImportantTaskEntity>;
  delete(id: string): Promise<void>;
}

@Injectable()
export class DrizzleImportantTaskRepository implements IImportantTaskRepository {
  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}
  async create(t: ImportantTaskEntity): Promise<ImportantTaskEntity> {
    return withFamilyContext(t.familyId, async (tx) => {
      const [row] = await tx.insert(importantTasks).values({
        id: t.id, familyId: t.familyId, title: t.title, description: t.description,
        priority: t.priority as any, progress: t.progress, deadline: t.deadline,
        assignedTo: t.assignedTo, createdBy: t.createdBy, isCompleted: t.isCompleted,
        completedAt: t.completedAt, createdAt: t.createdAt, updatedAt: t.updatedAt,
      }).returning();
      return this.toEntity(row);
    });
  }
  async findByFamilyId(fid: string): Promise<ImportantTaskEntity[]> {
    const rows = await this.db.select().from(importantTasks)
      .where(eq(importantTasks.familyId, fid)).orderBy(desc(importantTasks.createdAt));
    return rows.map((r) => this.toEntity(r));
  }
  async update(t: ImportantTaskEntity): Promise<ImportantTaskEntity> { return t; }
  async delete(id: string): Promise<void> { await this.db.delete(importantTasks).where(eq(importantTasks.id, id)); }
  private toEntity(row: Record<string, unknown>): ImportantTaskEntity {
    return new ImportantTaskEntity(String(row.id), String(row.familyId), String(row.title),
      (row.description as string) ?? null, String(row.priority ?? 'medium'), Number(row.progress ?? 0),
      (row.deadline as Date) ?? null, (row.assignedTo as string) ?? null, String(row.createdBy),
      Boolean(row.isCompleted), (row.completedAt as Date) ?? null, row.createdAt as Date, row.updatedAt as Date);
  }
}
