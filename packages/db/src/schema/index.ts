// ─── @uyimiz/db — Drizzle Schema (MVP: TZ v2.0) ───
import { pgTable, uuid, text, timestamp, pgEnum, integer, boolean, jsonb, date, uniqueIndex, index } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['OWNER', 'MEMBER', 'CHILD']);
export const userLangEnum = pgEnum('user_lang', ['uz', 'ru', 'en']);
export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);
export const taskStatusEnum = pgEnum('task_status', ['pending', 'in_progress', 'completed', 'cancelled']);
export const taskPriorityEnum = pgEnum('task_priority', ['low', 'medium', 'high', 'urgent']);
export const repeatTypeEnum = pgEnum('repeat_type', ['none', 'daily', 'weekly', 'monthly']);
export const reminderTypeEnum = pgEnum('reminder_type', ['one_time', 'daily', 'weekly', 'monthly', 'yearly']);

// ═══ CORE ═══
export const families = pgTable('families', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  codeIdx: uniqueIndex('families_code_idx').on(t.code),
}));

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  telegramId: text('telegram_id').notNull().unique(),
  familyId: uuid('family_id').references(() => families.id, { onDelete: 'set null' }),
  role: userRoleEnum('role').notNull().default('MEMBER'),
  lang: userLangEnum('lang').notNull().default('uz'),
  name: text('name').notNull(),
  username: text('username'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  telegramIdx: uniqueIndex('users_telegram_idx').on(t.telegramId),
  familyIdx: index('users_family_idx').on(t.familyId),
}));

export const inviteCodes = pgTable('invite_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  code: text('code').notNull().unique(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  isUsed: boolean('is_used').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  codeIdx: uniqueIndex('invite_codes_code_idx').on(t.code),
}));

// ═══ BUDGET ═══
export const categoryTypeEnum = pgEnum('category_type', ['income', 'expense']);

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  icon: text('icon'),
  color: text('color'),
  type: categoryTypeEnum('type').notNull(),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  familyTypeIdx: index('categories_family_type_idx').on(t.familyId, t.type),
}));

export const budgetRecords = pgTable('budget_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  type: transactionTypeEnum('type').notNull(),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  amount: integer('amount').notNull(),
  description: text('description'),
  txDate: timestamp('tx_date', { withTimezone: true }).notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  familyDateIdx: index('budget_family_date_idx').on(t.familyId, t.txDate),
  categoryIdx: index('budget_category_idx').on(t.categoryId),
}));

// ═══ TASKS ═══
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: taskStatusEnum('status').notNull().default('pending'),
  priority: taskPriorityEnum('priority').notNull().default('medium'),
  repeat: repeatTypeEnum('repeat').notNull().default('none'),
  points: integer('points').notNull().default(0),
  assignedTo: uuid('assigned_to').references(() => users.id),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  statusIdx: index('tasks_status_idx').on(t.status),
  familyStatusIdx: index('tasks_family_status_idx').on(t.familyId, t.status),
  assigneeIdx: index('tasks_assignee_idx').on(t.assignedTo),
}));

// ═══ REMINDERS ═══
export const reminders = pgTable('reminders', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  type: reminderTypeEnum('type').notNull().default('one_time'),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
  jobId: text('job_id'),
  snoozedUntil: timestamp('snoozed_until', { withTimezone: true }),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  scheduledIdx: index('reminders_scheduled_idx').on(t.scheduledAt),
  familyActiveIdx: index('reminders_family_active_idx').on(t.familyId, t.isActive),
  jobIdIdx: index('reminders_job_id_idx').on(t.jobId),
}));

// ═══ BIRTHDAYS ═══
export const birthdays = pgTable('birthdays', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  birthDate: date('birth_date').notNull(),
  notifyDaysBefore: integer('notify_days_before').array().notNull().default([7, 3, 1]),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  familyIdx: index('birthdays_family_idx').on(t.familyId),
  dateIdx: index('birthdays_date_idx').on(t.birthDate),
}));

// ═══ GAMIFICATION ═══
export const userPoints = pgTable('user_points', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  points: integer('points').notNull().default(0),
  weekStart: date('week_start').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  userWeekIdx: uniqueIndex('user_points_user_week_idx').on(t.userId, t.weekStart),
}));

// ═══ AUDIT ═══
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').references(() => families.id),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: text('entity_id'),
  oldValue: jsonb('old_value'),
  newValue: jsonb('new_value'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  familyActionIdx: index('audit_family_action_idx').on(t.familyId, t.action),
  createdAtIdx: index('audit_created_at_idx').on(t.createdAt),
}));
