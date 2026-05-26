import { Injectable, Inject } from '@nestjs/common';
import { reminders, withFamilyContext, type DB } from '@uyimiz/db';
import { eq, and, lte, isNull } from 'drizzle-orm';
import { ReminderEntity } from '../../domain/entities/reminder.entity';
import { IReminderRepository } from '../../domain/repositories/reminder.repository.interface';
import { DB_TOKEN } from '../../../../infrastructure/database/database.module';

@Injectable()
export class DrizzleReminderRepository implements IReminderRepository {
  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}

  async create(reminder: ReminderEntity): Promise<ReminderEntity> {
    return withFamilyContext(reminder.familyId, async (tx) => {
      const [row] = await tx.insert(reminders).values({
      id: reminder.id,
      familyId: reminder.familyId,
      title: reminder.title,
      description: reminder.description,
      type: reminder.type as any,
      scheduledAt: reminder.scheduledAt,
      jobId: reminder.jobId,
      snoozedUntil: reminder.snoozedUntil,
      createdBy: reminder.createdBy,
      isActive: reminder.isActive,
      createdAt: reminder.createdAt,
      updatedAt: reminder.updatedAt,
    }).returning();
    return this.toEntity(row);
    }, this.db);
  }

  async findById(id: string, familyId: string): Promise<ReminderEntity | null> {
    return withFamilyContext(familyId, async (tx) => {
      const [row] = await tx.select().from(reminders).where(eq(reminders.id, id));
      return row ? this.toEntity(row) : null;
    }, this.db);
  }

  async findByFamilyId(familyId: string): Promise<ReminderEntity[]> {
    const rows = await this.db.select().from(reminders)
      .where(eq(reminders.familyId, familyId))
      .orderBy(reminders.scheduledAt);
    return rows.map(this.toEntity);
  }

  async findDue(limit = 100): Promise<ReminderEntity[]> {
    const rows = await this.db.select().from(reminders)
      .where(
        and(
          eq(reminders.isActive, true),
          lte(reminders.scheduledAt, new Date()),
          isNull(reminders.snoozedUntil),
        ),
      )
      .orderBy(reminders.scheduledAt)
      .limit(limit);
    return rows.map(this.toEntity);
  }

  async update(reminder: ReminderEntity): Promise<ReminderEntity> {
    return withFamilyContext(reminder.familyId, async (tx) => {
      const [row] = await tx.update(reminders)
      .set({
        title: reminder.title,
        description: reminder.description,
        scheduledAt: reminder.scheduledAt,
        jobId: reminder.jobId,
        snoozedUntil: reminder.snoozedUntil,
        isActive: reminder.isActive,
        updatedAt: reminder.updatedAt,
      })
      .where(eq(reminders.id, reminder.id))
      .returning();
      return this.toEntity(row);
    }, this.db);
  }

  async delete(id: string, familyId: string): Promise<void> {
    return withFamilyContext(familyId, async (tx) => {
      await tx.delete(reminders).where(eq(reminders.id, id));
    }, this.db);
  }

  async findByJobId(jobId: string): Promise<ReminderEntity | null> {
    const [row] = await this.db.select().from(reminders).where(eq(reminders.jobId, jobId));
    return row ? this.toEntity(row) : null;
  }

  private toEntity(row: any): ReminderEntity {
    return new ReminderEntity(
      row.id, row.familyId, row.title, row.description, row.type,
      row.scheduledAt, row.jobId, row.snoozedUntil, row.createdBy,
      row.isActive, row.createdAt, row.updatedAt,
    );
  }
}
