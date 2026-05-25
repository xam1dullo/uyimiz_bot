-- pg_notify triggers for real-time updates

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Budget changes
CREATE OR REPLACE FUNCTION notify_budget_change()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('budget_changes', json_build_object(
    'family_id', NEW.family_id,
    'action', TG_OP,
    'record_id', NEW.id
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER budget_updated_at
  BEFORE UPDATE ON budget_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER budget_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON budget_records
  FOR EACH ROW EXECUTE FUNCTION notify_budget_change();

-- Tasks changes
CREATE OR REPLACE FUNCTION notify_task_change()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('task_changes', json_build_object(
    'family_id', COALESCE(NEW.family_id, OLD.family_id),
    'action', TG_OP,
    'record_id', COALESCE(NEW.id, OLD.id)
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER task_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON tasks
  FOR EACH ROW EXECUTE FUNCTION notify_task_change();

-- Reminders changes
CREATE OR REPLACE FUNCTION notify_reminder_change()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('reminder_changes', json_build_object(
    'family_id', NEW.family_id,
    'action', TG_OP,
    'record_id', NEW.id
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER reminder_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reminders
  FOR EACH ROW EXECUTE FUNCTION notify_reminder_change();

-- Family changes (for member updates)
CREATE OR REPLACE FUNCTION notify_family_change()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('family_changes', json_build_object(
    'family_id', COALESCE(NEW.family_id, OLD.family_id),
    'action', TG_OP,
    'user_id', COALESCE(NEW.id, OLD.id)
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER family_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION notify_family_change();
