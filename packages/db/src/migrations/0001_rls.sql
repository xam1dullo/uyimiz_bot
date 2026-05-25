-- RLS for all family-scoped tables

-- Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_family_isolation ON users
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- Budget Records
ALTER TABLE budget_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY budget_records_family_isolation ON budget_records
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- Tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tasks_family_isolation ON tasks
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- Reminders
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY reminders_family_isolation ON reminders
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- Birthdays
ALTER TABLE birthdays ENABLE ROW LEVEL SECURITY;
CREATE POLICY birthdays_family_isolation ON birthdays
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- Children
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
CREATE POLICY children_family_isolation ON children
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- Health Records
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY health_records_family_isolation ON health_records
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- Medications
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY medications_family_isolation ON medications
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- Diet Plans
ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY diet_plans_family_isolation ON diet_plans
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- Important Tasks
ALTER TABLE important_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY important_tasks_family_isolation ON important_tasks
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- Audit Logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_logs_family_isolation ON audit_logs
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- First Aid Items (viewable by all family members)
ALTER TABLE first_aid_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY first_aid_items_family_isolation ON first_aid_items
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY categories_family_isolation ON categories
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- Invite Codes (family-scoped)
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY invite_codes_family_isolation ON invite_codes
  USING (family_id = current_setting('app.current_family_id', true)::uuid);

-- Child Activities (via child → family)
ALTER TABLE child_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY child_activities_family_isolation ON child_activities
  USING (
    child_id IN (
      SELECT id FROM children
      WHERE family_id = current_setting('app.current_family_id', true)::uuid
    )
  );

-- User Points (via user → family)
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_points_family_isolation ON user_points
  USING (
    user_id IN (
      SELECT id FROM users
      WHERE family_id = current_setting('app.current_family_id', true)::uuid
    )
  );
