export const QUEUES = {
  REMINDERS: 'reminders',
  NOTIFICATIONS: 'notifications',
  BIRTHDAY: 'birthday',
  REPORTS: 'reports',
  CLEANUP: 'cleanup',
} as const;

export const DEFAULT_JOB_OPTIONS = {
  attempts: 3,
  backoff: { type: 'exponential' as const, delay: 2000 },
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 },
};
