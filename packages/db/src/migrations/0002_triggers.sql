-- pg_notify triggers for real-time updates

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

CREATE TRIGGER task_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON tasks
  FOR EACH ROW EXECUTE FUNCTION notify_task_change();
