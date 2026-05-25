import { Injectable, Inject } from '@nestjs/common';
import { children, withFamilyContext, type DB } from '@uyimiz/db';
import { eq } from 'drizzle-orm';
import { ChildEntity } from '../../domain/entities/child.entity';
import { DB_TOKEN } from '../../../../infrastructure/database/database.module';

export interface IChildRepository { create(c: ChildEntity): Promise<ChildEntity>; findByFamilyId(fid: string): Promise<ChildEntity[]>; update(c: ChildEntity): Promise<ChildEntity>; delete(id: string): Promise<void>; }

@Injectable()
export class DrizzleChildRepository implements IChildRepository {
  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}
  async create(c: ChildEntity): Promise<ChildEntity> {
    return withFamilyContext(c.familyId, async (tx) => {
      const [row] = await tx.insert(children).values({
        id: c.id, familyId: c.familyId, name: c.name, birthDate: c.birthDate,
        gender: c.gender, notes: c.notes, createdAt: c.createdAt, updatedAt: c.updatedAt,
      }).returning();
      return this.toEntity(row);
    });
  }
  async findByFamilyId(fid: string): Promise<ChildEntity[]> {
    const rows = await this.db.select().from(children).where(eq(children.familyId, fid));
    return rows.map((r) => this.toEntity(r));
  }
  async update(c: ChildEntity): Promise<ChildEntity> { /* simplified */ return c; }
  async delete(id: string): Promise<void> { await this.db.delete(children).where(eq(children.id, id)); }
  private toEntity(row: Record<string, unknown>): ChildEntity {
    return new ChildEntity(String(row.id), String(row.familyId), String(row.name ?? ''),
      (row.birthDate as string) ?? null, (row.gender as string) ?? null, (row.notes as string) ?? null,
      row.createdAt as Date, row.updatedAt as Date);
  }
}
