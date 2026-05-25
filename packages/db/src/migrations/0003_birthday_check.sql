-- Daily birthday check via pg_cron
-- Requires: CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Function: check today's birthdays and notify
CREATE OR REPLACE FUNCTION check_daily_birthdays()
RETURNS void AS $$
DECLARE
  b RECORD;
  days_until INT;
BEGIN
  FOR b IN
    SELECT id, family_id, name, birth_date, notify_days_before, created_by
    FROM birthdays
  LOOP
    -- Calculate days until next birthday (handles leap year via PostgreSQL date math)
    days_until := (
      (date_trunc('year', b.birth_date) + 
       (date_trunc('year', CURRENT_DATE) - date_trunc('year', b.birth_date)) +
       (CASE WHEN (date_trunc('year', b.birth_date) + 
             (date_trunc('year', CURRENT_DATE) - date_trunc('year', b.birth_date))) < CURRENT_DATE
         THEN INTERVAL '1 year' ELSE INTERVAL '0' END) -
       CURRENT_DATE)
    );
    
    -- Notify if days_until matches any notify_days_before value
    IF days_until = ANY(b.notify_days_before) THEN
      PERFORM pg_notify('birthday_reminder', json_build_object(
        'birthday_id', b.id,
        'family_id', b.family_id,
        'name', b.name,
        'days_until', days_until
      )::text);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Schedule: run daily at 08:00
-- Uncomment when pg_cron is installed:
-- SELECT cron.schedule('daily-birthday-check', '0 8 * * *', 'SELECT check_daily_birthdays();');
