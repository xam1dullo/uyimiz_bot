#!/usr/bin/env bash
# ─── Database Backup (pg_dump cron) ───
# Schedule: 0 3 * * * /path/to/scripts/db-backup.sh
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/uyimiz}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
DB_URL="${DATABASE_URL:-postgres://postgres:postgres@localhost:5432/uyimiz}"

mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="uyimiz_${TIMESTAMP}.sql.gz"

echo "[$(date)] Starting backup..."

pg_dump "$DB_URL" | gzip > "${BACKUP_DIR}/${FILENAME}"

if [ $? -eq 0 ]; then
  echo "[$(date)] ✅ Backup created: ${FILENAME}"
  echo "   Size: $(du -h "${BACKUP_DIR}/${FILENAME}" | cut -f1)"
else
  echo "[$(date)] ❌ Backup FAILED"
  exit 1
fi

# Cleanup old backups
find "$BACKUP_DIR" -name "uyimiz_*.sql.gz" -mtime "+${RETENTION_DAYS}" -delete
echo "[$(date)] Cleaned backups older than ${RETENTION_DAYS} days"

# Keep last 7 daily backups minimum
BACKUP_COUNT=$(ls "$BACKUP_DIR"/*.sql.gz 2>/dev/null | wc -l)
echo "[$(date)] Total backups: ${BACKUP_COUNT}"
