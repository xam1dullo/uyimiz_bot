import { describe, it, expect } from 'vitest';
import { ReminderEntity } from '../reminder.entity';

describe('ReminderEntity', () => {
  it('creates one-time reminder', () => {
    const r = ReminderEntity.create('f1', 'Meeting', 'one_time', new Date('2026-06-01'), 'u1');
    expect(r.title).toBe('Meeting');
    expect(r.type).toBe('one_time');
    expect(r.isActive).toBe(true);
    expect(r.snoozedUntil).toBeUndefined();
  });

  it('snooze sets snoozedUntil', () => {
    const r = ReminderEntity.create('f1', 'Test', 'one_time', new Date(), 'u1');
    const future = new Date(Date.now() + 30 * 60 * 1000);
    r.snooze(future);
    expect(r.snoozedUntil).toEqual(future);
  });

  it('deactivate marks inactive', () => {
    const r = ReminderEntity.create('f1', 'Test', 'daily', new Date(), 'u1');
    r.deactivate();
    expect(r.isActive).toBe(false);
  });

  it('reschedule changes date', () => {
    const r = ReminderEntity.create('f1', 'Test', 'weekly', new Date('2026-01-01'), 'u1');
    const newDate = new Date('2026-06-15');
    r.reschedule(newDate);
    expect(r.scheduledAt).toEqual(newDate);
  });

  it('setJobId tracks BullMQ job', () => {
    const r = ReminderEntity.create('f1', 'Test', 'one_time', new Date(), 'u1');
    r.setJobId('job-123');
    expect(r.jobId).toBe('job-123');
  });
});
