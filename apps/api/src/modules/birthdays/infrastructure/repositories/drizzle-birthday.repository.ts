import { Injectable, Inject } from '@nestjs/common';
import { birthdays, withFamilyContext, type DB } from '@uyimiz/db';
import { eq } from 'drizzle-orm';
import { BirthdayEntity } from '../../domain/entities/birthday.entity';
import { IBirthdayRepository } from '../../domain/repositories/birthday.repository.interface';
import { DB_TOKEN } from '../../../../infrastructure/database/database.module';

@Injectable()
export class DrizzleBirthdayRepository implements IBirthdayRepository {
  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}

  async create(b: BirthdayEntity): Promise<BirthdayEntity> {
    return withFamilyContext(b.familyId, async (tx) => {
      const [row] = await tx.insert(birthdays).values({
        id: b.id, familyId: b.familyId, userId: b.userId,
        name: b.name, birthDate: b.birthDate,
        notifyDaysBefore: b.notifyDaysBefore, createdBy: b.createdBy,
        createdAt: b.createdAt, updatedAt: b.updatedAt,
      }).returning();
      return this.toEntity(row);
    });
  }

  async findByFamilyId(familyId: string): Promise<BirthdayEntity[]> {
    const rows = await this.db.select().from(birthdays)
      .where(eq(birthdays.familyId, familyId))
      .orderBy(birthdays.birthDate)
      .limit(200);
    return rows.map((r) => this.toEntity(r));
  }

  async update(b: BirthdayEntity): Promise<BirthdayEntity> {
    return withFamilyContext(b.familyId, async (tx) => {
      const [row] = await tx.update(birthdays)
        .set({ name: b.name, notifyDaysBefore: b.notifyDaysBefore, updatedAt: b.updatedAt })
        .where(eq(birthdays.id, b.id)).returning();
      return this.toEntity(row);
    });
  }

  async delete(id: string, familyId: string): Promise<void> {
    return withFamilyContext(familyId, async (tx) => {
      await tx.delete(birthdays).where(eq(birthdays.id, id));
    }, this.db);
  }

  private toEntity(row: Record<string, unknown>): BirthdayEntity {
    return new BirthdayEntity(
      String(row.id), String(row.familyId), (row.userId as string) ?? null,
      String(row.name), String(row.birthDate),
      (row.notifyDaysBefore as number[]) ?? [7, 3, 1],
      String(row.createdBy), row.createdAt as Date, row.updatedAt as Date,
    );
  }
}
