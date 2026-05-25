import { Injectable, Inject } from '@nestjs/common';
import { medications, withFamilyContext, type DB } from '@uyimiz/db';
import { eq, and } from 'drizzle-orm';
import { MedicationEntity } from '../../domain/entities/medication.entity';
import { DB_TOKEN } from '../../../../infrastructure/database/database.module';

export interface IMedicationRepository { create(m: MedicationEntity): Promise<MedicationEntity>; findByFamilyId(fid: string, activeOnly?: boolean): Promise<MedicationEntity[]>; update(m: MedicationEntity): Promise<MedicationEntity>; delete(id: string): Promise<void>; }

@Injectable()
export class DrizzleMedicationRepository implements IMedicationRepository {
  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}
  async create(m: MedicationEntity): Promise<MedicationEntity> {
    return withFamilyContext(m.familyId, async (tx) => {
      const [row] = await tx.insert(medications).values({
        id: m.id, familyId: m.familyId, name: m.name, description: m.description,
        dosage: m.dosage, schedule: m.schedule, assignedTo: m.assignedTo,
        isActive: m.isActive, createdAt: m.createdAt, updatedAt: m.updatedAt,
      }).returning();
      return this.toEntity(row);
    });
  }
  async findByFamilyId(fid: string, activeOnly = true): Promise<MedicationEntity[]> {
    const conds = [eq(medications.familyId, fid)];
    if (activeOnly) conds.push(eq(medications.isActive, true));
    const rows = await this.db.select().from(medications).where(and(...conds));
    return rows.map((r) => this.toEntity(r));
  }
  async update(m: MedicationEntity): Promise<MedicationEntity> { return m; }
  async delete(id: string): Promise<void> { await this.db.delete(medications).where(eq(medications.id, id)); }
  private toEntity(row: Record<string, unknown>): MedicationEntity {
    return new MedicationEntity(String(row.id), String(row.familyId), String(row.name),
      (row.description as string) ?? null, (row.dosage as string) ?? null,
      (row.schedule as Record<string, unknown>) ?? null, (row.assignedTo as string) ?? null,
      Boolean(row.isActive), row.createdAt as Date, row.updatedAt as Date);
  }
}
