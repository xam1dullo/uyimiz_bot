import { Injectable, Inject } from '@nestjs/common';
import { firstAidItems, withFamilyContext, type DB } from '@uyimiz/db';
import { eq, and } from 'drizzle-orm';
import { FirstAidEntity } from '../../domain/entities/first-aid.entity';
import { DB_TOKEN } from '../../../../infrastructure/database/database.module';

export interface IFirstAidRepository { create(f: FirstAidEntity): Promise<FirstAidEntity>; findByFamilyId(fid: string): Promise<FirstAidEntity[]>; search(fid: string, query: string): Promise<FirstAidEntity[]>; update(f: FirstAidEntity): Promise<FirstAidEntity>; delete(id: string): Promise<void>; }

@Injectable()
export class DrizzleFirstAidRepository implements IFirstAidRepository {
  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}
  async create(f: FirstAidEntity): Promise<FirstAidEntity> {
    return withFamilyContext(f.familyId, async (tx) => {
      const [row] = await tx.insert(firstAidItems).values({
        id: f.id, familyId: f.familyId, title: f.title, description: f.description,
        symptoms: f.symptoms, treatment: f.treatment, emergencyLevel: f.emergencyLevel,
        lang: f.lang as any, tags: f.tags, createdAt: f.createdAt, updatedAt: f.updatedAt,
      }).returning();
      return this.toEntity(row);
    });
  }
  async findByFamilyId(fid: string): Promise<FirstAidEntity[]> {
    const rows = await this.db.select().from(firstAidItems).where(eq(firstAidItems.familyId, fid));
    return rows.map((r) => this.toEntity(r));
  }
  async search(fid: string, query: string): Promise<FirstAidEntity[]> {
    const all = await this.findByFamilyId(fid);
    const q = query.toLowerCase();
    return all.filter((f) => f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q));
  }
  async update(f: FirstAidEntity): Promise<FirstAidEntity> { return f; }
  async delete(id: string): Promise<void> { await this.db.delete(firstAidItems).where(eq(firstAidItems.id, id)); }
  private toEntity(row: Record<string, unknown>): FirstAidEntity {
    return new FirstAidEntity(String(row.id), String(row.familyId), String(row.title), String(row.description),
      (row.symptoms as string) ?? null, (row.treatment as string) ?? null, String(row.emergencyLevel ?? 'info'),
      String(row.lang ?? 'uz'), (row.tags as string[]) ?? null, row.createdAt as Date, row.updatedAt as Date);
  }
}
