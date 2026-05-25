export type ReminderType = 'one_time' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export class CreateReminderCommand {
  constructor(
    public readonly familyId: string,
    public readonly title: string,
    public readonly type: ReminderType,
    public readonly scheduledAt: Date,
    public readonly createdBy: string,
    public readonly description?: string,
  ) {}
}
