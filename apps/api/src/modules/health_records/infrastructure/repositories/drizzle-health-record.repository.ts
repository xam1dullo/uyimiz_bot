import { Injectable, Inject } from '@nestjs/common';
import { healthRecords, withFamilyContext, type DB } from '@uyimiz/db';
import { eq, desc } from 'drizzle-orm';
import { HealthRecordEntity } from '../../domain/entities/health-record.entity';
import { DB_TOKEN } from '../../../../infrastructure/database/database.module';

export interface IHealthRecordRepository { create(r: HealthRecordEntity): Promise<HealthRecordEntity>; findByFamilyId(fid: string, limit?: number): Promise<HealthRecordEntity[]>; }

@Injectable()
export class DrizzleHealthRecordRepository implements IHealthRecordRepository {
  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}
  async create(r: HealthRecordEntity): Promise<HealthRecordEntity> {
    return withFamilyContext(r.familyId, async (tx) => {
      const [row] = await tx.insert(healthRecords).values({
        id: r.id, familyId: r.familyId, userId: r.userId,
        type: r.type as any, value: r.value, recordedAt: r.recordedAt,
        notes: r.notes, createdAt: r.createdAt,
      }).returning();
      return this.toEntity(row);
    });
  }
  async findByFamilyId(fid: string, limit = 50): Promise<HealthRecordEntity[]> {
    const rows = await this.db.select().from(healthRecords)
      .where(eq(healthRecords.familyId, fid)).orderBy(desc(healthRecords.recordedAt)).limit(limit);
    return rows.map((r) => this.toEntity(r));
  }
  private toEntity(row: Record<string, unknown>): HealthRecordEntity {
    return new HealthRecordEntity(String(row.id), String(row.familyId), String(row.userId),
      String(row.type), (row.value as Record<string, unknown>) ?? {}, row.recordedAt as Date,
      (row.notes as string) ?? null, row.createdAt as Date);
  }
}
