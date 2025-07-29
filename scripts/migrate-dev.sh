#!/bin/bash

# Custom migration script for development that works around shadow database limitations
# This script creates migrations manually and applies them

set -e

echo "🔄 Starting custom migration process..."

# Check if a migration name was provided
if [ -z "$1" ]; then
    echo "❌ Error: Migration name is required"
    echo "Usage: ./scripts/migrate-dev.sh <migration_name>"
    echo "Example: ./scripts/migrate-dev.sh add_user_profile"
    exit 1
fi

MIGRATION_NAME="$1"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
MIGRATION_DIR="prisma/migrations/${TIMESTAMP}_${MIGRATION_NAME}"

echo "📁 Creating migration directory: $MIGRATION_DIR"
mkdir -p "$MIGRATION_DIR"

echo "🔍 Generating migration SQL..."
# Generate the migration SQL by comparing current schema to database
npx prisma migrate diff \
    --from-url="$DATABASE_URL" \
    --to-schema-datamodel prisma/schema.prisma \
    --script > "$MIGRATION_DIR/migration.sql"

# Check if migration is empty
if [ ! -s "$MIGRATION_DIR/migration.sql" ]; then
    echo "✅ No changes detected - removing empty migration directory"
    rm -rf "$MIGRATION_DIR"
    echo "🎉 Database is already up to date!"
    exit 0
fi

echo "📝 Migration SQL generated:"
echo "----------------------------------------"
cat "$MIGRATION_DIR/migration.sql"
echo "----------------------------------------"

# Ask for confirmation
read -p "🤔 Do you want to apply this migration? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Migration cancelled - removing migration directory"
    rm -rf "$MIGRATION_DIR"
    exit 1
fi

echo "🚀 Applying migration to database..."
# Apply the migration directly to the database
mysql -h $(echo $DATABASE_URL | sed 's/.*@\([^:]*\):.*/\1/') \
      -P $(echo $DATABASE_URL | sed 's/.*:\([0-9]*\)\/.*/\1/') \
      -u $(echo $DATABASE_URL | sed 's/.*\/\/\([^:]*\):.*/\1/') \
      -p$(echo $DATABASE_URL | sed 's/.*\/\/[^:]*:\([^@]*\)@.*/\1/') \
      $(echo $DATABASE_URL | sed 's/.*\/\([^?]*\).*/\1/') < "$MIGRATION_DIR/migration.sql"

echo "✅ Migration applied successfully!"

echo "📋 Marking migration as applied in Prisma..."
npx prisma migrate resolve --applied "${TIMESTAMP}_${MIGRATION_NAME}"

echo "🔄 Regenerating Prisma client..."
npx prisma generate

echo "🎉 Migration completed successfully!"
echo "Migration: ${TIMESTAMP}_${MIGRATION_NAME}"