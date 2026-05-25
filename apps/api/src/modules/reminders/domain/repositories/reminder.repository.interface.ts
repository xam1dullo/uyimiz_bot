import { ReminderEntity } from '../entities/reminder.entity';

export interface IReminderRepository {
  create(reminder: ReminderEntity): Promise<ReminderEntity>;
  findById(id: string): Promise<ReminderEntity | null>;
  findByFamilyId(familyId: string): Promise<ReminderEntity[]>;
  findDue(): Promise<ReminderEntity[]>;
  update(reminder: ReminderEntity): Promise<ReminderEntity>;
  delete(id: string): Promise<void>;
  findByJobId(jobId: string): Promise<ReminderEntity | null>;
}
