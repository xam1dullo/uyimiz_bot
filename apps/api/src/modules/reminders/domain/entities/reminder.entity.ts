import { v4 as uuid } from 'uuid';

export type ReminderType = 'one_time' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export class ReminderEntity {
  constructor(
    public readonly id: string,
    public readonly familyId: string,
    public title: string,
    public description: string | undefined,
    public readonly type: ReminderType,
    public scheduledAt: Date,
    public jobId: string | undefined,
    public snoozedUntil: Date | undefined,
    public readonly createdBy: string,
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(
    familyId: string,
    title: string,
    type: ReminderType,
    scheduledAt: Date,
    createdBy: string,
    description?: string,
  ): ReminderEntity {
    return new ReminderEntity(
      uuid(), familyId, title, description, type, scheduledAt,
      undefined, undefined, createdBy, true, new Date(), new Date(),
    );
  }

  snooze(until: Date): void {
    this.snoozedUntil = until;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  setJobId(jobId: string): void {
    this.jobId = jobId;
    this.updatedAt = new Date();
  }

  reschedule(newDate: Date): void {
    this.scheduledAt = newDate;
    this.updatedAt = new Date();
  }
}
