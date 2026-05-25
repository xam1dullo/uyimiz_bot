export const REMINDER_TYPES = ['one_time', 'daily', 'weekly', 'monthly', 'yearly'] as const;
export type ReminderType = (typeof REMINDER_TYPES)[number];

export interface Reminder {
  id: string;
  familyId: string;
  title: string;
  description?: string;
  type: ReminderType;
  scheduledAt: Date;
  jobId?: string;
  snoozedUntil?: Date;
  createdBy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
