export type Role = 'OWNER' | 'MEMBER' | 'CHILD';

export interface FamilyMember {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  points: number;
  lastActive: string;
  isSelf?: boolean;
}

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface BudgetEntry {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  icon: string;
  note?: string;
  date: string; // ISO String or simple relative string
  addedBy: string; // Member name or ID
}

export type TaskStatus = 'NEW' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  category: string; // e.g. '🛒', '🧹'
  assignedTo: string; // Member ID or "all"
  dueDate: string; // Relative like "Bugun, 20:00" or simple date
  repeat: string; // "Har kuni", "Har hafta", "Bir marta"
  points: number;
  status: TaskStatus;
}

export interface Reminder {
  id: string;
  title: string;
  note?: string;
  assignedTo: string; // ID or "all"
  time: string; // "Bugun, 18:00"
  repeat: string;
  snoozedCount?: number;
  isPast?: boolean;
}

export interface Birthday {
  id: string;
  name: string;
  relationship: string; // "Ota", "Ona", "Aka/opa", "Do'st", "Bobo/Buvi", "Boshqa"
  date: string; // "12-iyun"
  birthDate?: string; // "1988-06-12"
  daysLeft: number;
  age: number;
}

export type Language = 'uz' | 'ru' | 'en';
export type Currency = 'UZS' | 'USD' | 'RUB' | 'EUR';

export interface TranslationSet {
  welcome: string;
  chooseLang: string;
  langNotice: string;
  subtitle: string;
  continue: string;
  back: string;
  cancel: string;
  save: string;
  
  // Onboarding
  hasFamilyQuestion: string;
  createFamilyOpt: string;
  createFamilyDesc: string;
  joinFamilyOpt: string;
  joinFamilyDesc: string;
  enterFamilyName: string;
  familyNamePlaceholder: string;
  addEmojiButton: string;
  enterInviteCode: string;
  otpDescription: string;
  qrCodeButton: string;
  waitingApproval: string;
  waitingDesc: string;
  sentNotification: string;
  successTitle: string;
  successDesc: string;
  
  // Tabs
  tabHome: string;
  tabBudget: string;
  tabTasks: string;
  tabReminders: string;
  tabMe: string;
  tabRating: string;
  
  // Dashboard
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  membersCount: string;
  thisMonth: string;
  income: string;
  expense: string;
  balance: string;
  viewReport: string;
  tasksWidgetTitle: string;
  noTasksToday: string;
  upcomingReminder: string;
  noRemindersToday: string;
  upcomingBirthday: string;
  daysLeftText: string;
  yearsOldText: string;
  weeklyLeaderboard: string;
  viewFullRating: string;
  fastActions: string;
  addExpenseAction: string;
  addTaskAction: string;
  addReminderAction: string;
  
  // Budget
  all: string;
  budgetTitle: string;
  budgetSettings: string;
  periodThisMonth: string;
  periodLastMonth: string;
  periodWeekly: string;
  deleteText: string;
  reportsTab: string;
  generalTab: string;
  categoriesTitle: string;
  daysExpenseChart: string;
  addTransactionTitle: string;
  whatToAdd: string;
  amountText: string;
  selectCategory: string;
  finishAndSave: string;
  optionalNote: string;
  transactionDate: string;
  addedSuccess: string;
  
  // Tasks
  tasksTitle: string;
  tabNew: string;
  tabInProgress: string;
  tabDone: string;
  filterMy: string;
  filterAll: string;
  sortBy: string;
  taskDoneBtn: string;
  congratsPoints: string;
  addTaskTitle: string;
  taskTitlePlaceholder: string;
  assignTo: string;
  childOnlyTasks: string;
  pointsText: string;
  pointsAuto: string;
  repeatOnce: string;
  repeatDaily: string;
  repeatWeekly: string;
  
  // Reminders
  remindersTitle: string;
  sectionUpcoming: string;
  sectionPast: string;
  noRemindersMsg: string;
  btnSnooze: string;
  snoozeTitle: string;
  minutesAgo: string;
  minutesLater: string;
  snoozeAdded: string;
  
  // Profile
  pointsScore: string;
  tasksStat: string;
  remindersStat: string;
  familySection: string;
  birthdaysSection: string;
  notificationsSection: string;
  languageSection: string;
  helpSection: string;
  logoutBtn: string;
  memberJoined: string;
  inviteLinkTitle: string;
  copyBtn: string;
  copiedMsg: string;
  shareBtn: string;
  ownerOnlyMsg: string;
  cantAccessMsg: string;
  
  // Leaderboard
  leaderboardTitle: string;
  statThisWeek: string;
  statTotal: string;
  heroBadge: string;
}
