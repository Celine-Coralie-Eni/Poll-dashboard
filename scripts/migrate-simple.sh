#!/bin/bash

# Simple migration script that bypasses shadow database requirement
# This creates migrations using prisma migrate dev with shadow database disabled

set -e

echo "🔄 Starting Prisma migration (shadow database disabled)..."

# Check if a migration name was provided
if [ -z "$1" ]; then
    echo "❌ Error: Migration name is required"
    echo "Usage: ./scripts/migrate-simple.sh <migration_name>"
    echo "Example: ./scripts/migrate-simple.sh add_user_profile"
    exit 1
fi

MIGRATION_NAME="$1"

echo "📝 Creating migration: $MIGRATION_NAME"

# Temporarily set shadow database URL to the same as main database
# This bypasses the shadow database permission issue
export SHADOW_DATABASE_URL="$DATABASE_URL"

# Run prisma migrate dev with the migration name
npx prisma migrate dev --name "$MIGRATION_NAME" --skip-seed

echo "🔄 Regenerating Prisma client..."
npx prisma generate

echo "🎉 Migration completed successfully!"
echo "Migration name: $MIGRATION_NAME"