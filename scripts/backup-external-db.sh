#!/bin/bash
# Backup external database before migration

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="swing_events_backup_${TIMESTAMP}.sql"

echo "🔄 Creating backup of swing_events database..."

# Create backup
pg_dump -h localhost -U scraper -d swing_events > "backups/${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully: backups/${BACKUP_FILE}"
    echo "📊 Backup file size: $(du -h "backups/${BACKUP_FILE}" | cut -f1)"
else
    echo "❌ Backup failed!"
    exit 1
fi

echo "🔍 Quick backup validation..."
echo "📝 Lines in backup: $(wc -l < "backups/${BACKUP_FILE}")"
echo "🗃️ Tables in backup: $(grep -c "CREATE TABLE" "backups/${BACKUP_FILE}")"