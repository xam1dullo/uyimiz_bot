-- ═══ Performance Indexes (Audit-Driven) ═══
-- Applied after RLS hardening migration

-- ─── Reminders: due scan (partial index) ───
-- Only indexes active, unsnoozed reminders that are due
-- Dramatically reduces rows scanned by findDue()
DROP INDEX IF EXISTS reminders_due_scan_idx;
CREATE INDEX reminders_due_idx 
  ON reminders (scheduled_at) 
  WHERE is_active = true AND snoozed_until IS NULL;

-- Family-scoped reminder list
CREATE INDEX IF NOT EXISTS reminders_family_list_idx
  ON reminders (family_id, scheduled_at)
  WHERE is_active = true;

-- ─── Tasks: filter + sort indexes ───
-- Status filter sorted by creation date (most common list pattern)
DROP INDEX IF EXISTS tasks_status_idx;
CREATE INDEX tasks_family_status_created_idx
  ON tasks (family_id, status, created_at DESC);

-- Assignee filter sorted by creation date
CREATE INDEX tasks_family_assignee_created_idx
  ON tasks (family_id, assigned_to, created_at DESC)
  WHERE status != 'completed';

-- ─── Budget: category/type histories ───
-- Category filter (for budget drill-down by category)
CREATE INDEX IF NOT EXISTS budget_family_category_date_idx
  ON budget_records (family_id, category_id, tx_date DESC);

-- Type filter (income vs expense history)
CREATE INDEX IF NOT EXISTS budget_family_type_date_idx
  ON budget_records (family_id, type, tx_date DESC);

-- ─── Birthdays: month-day expression index ───
-- Enables efficient "whose birthday is coming up" queries
-- without full-table scan over birth_date
CREATE INDEX IF NOT EXISTS birthdays_month_day_idx 
  ON birthdays (family_id, 
    EXTRACT(MONTH FROM birth_date),
    EXTRACT(DAY FROM birth_date));

-- ─── Audit: family timeline ───
CREATE INDEX IF NOT EXISTS audit_family_created_idx
  ON audit_logs (family_id, created_at DESC);

-- ─── User points: leaderboard ───
-- Family weekly ranking sorted by points descending
CREATE INDEX IF NOT EXISTS user_points_week_leaderboard_idx
  ON user_points (week_start, points DESC);
