export const LIMITS = {
  FREE: {
    familyMembers: 5,
    budgetRecordsPerMonth: 100,
    tasksPerFamily: 20,
    remindersPerFamily: 10,
  },
  PREMIUM: {
    familyMembers: 20,
    budgetRecordsPerMonth: 5000,
    tasksPerFamily: 200,
    remindersPerFamily: 100,
  },
} as const;
