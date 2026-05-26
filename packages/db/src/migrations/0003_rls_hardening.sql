-- ═══ RLS Hardening: FORCE ROW LEVEL SECURITY ═══
-- Ensures RLS is never bypassed, even for table owners

-- Create app role (no superuser privileges)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'uyimiz_app') THEN
    CREATE ROLE uyimiz_app WITH LOGIN PASSWORD 'uyimiz_app_password' NOINHERIT;
  END IF;
END
$$;

-- Grant necessary privileges to app role
GRANT CONNECT ON DATABASE uyimiz_dev TO uyimiz_app;
GRANT USAGE ON SCHEMA public TO uyimiz_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO uyimiz_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO uyimiz_app;

-- Alter default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO uyimiz_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO uyimiz_app;

-- ═══ FORCE ROW LEVEL SECURITY on all family-scoped tables ═══
-- This ensures even the table owner cannot bypass RLS

ALTER TABLE families FORCE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE budget_records FORCE ROW LEVEL SECURITY;
ALTER TABLE categories FORCE ROW LEVEL SECURITY;
ALTER TABLE tasks FORCE ROW LEVEL SECURITY;
ALTER TABLE reminders FORCE ROW LEVEL SECURITY;
ALTER TABLE birthdays FORCE ROW LEVEL SECURITY;
ALTER TABLE user_points FORCE ROW LEVEL SECURITY;
ALTER TABLE audit_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE invite_codes FORCE ROW LEVEL SECURITY;

-- ═══ Additional Performance Indexes ═══
-- Reminders: due scan
CREATE INDEX IF NOT EXISTS reminders_due_scan_idx 
  ON reminders (family_id, is_active, scheduled_at, snoozed_until) 
  WHERE is_active = true;

-- Tasks: assignee within family
CREATE INDEX IF NOT EXISTS tasks_family_assignee_idx 
  ON tasks (family_id, assigned_to) 
  WHERE status != 'completed';

-- Budget: monthly report
CREATE INDEX IF NOT EXISTS budget_monthly_idx 
  ON budget_records (family_id, tx_date, type);
