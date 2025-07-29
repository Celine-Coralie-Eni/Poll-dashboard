# Database Migration Guide

This project now uses Prisma migrations instead of `db push` for better version control of database schema changes.

## Migration Workflow

### Current Status
- ✅ Initial migration has been created and applied
- ✅ Migration system is set up and ready to use
- ✅ Database is in sync with the current schema

### Available Commands

#### Create a new migration
```bash
# Using the simple migration script (recommended)
npm run db:migrate <migration_name>

# Example:
npm run db:migrate add_user_profile
```

#### Alternative migration method
```bash
# Using the custom migration script (for complex scenarios)
npm run db:migrate:custom <migration_name>
```

#### Other migration commands
```bash
# Check migration status
npm run db:migrate:status

# Deploy migrations (for production)
npm run db:migrate:deploy

# Reset database and apply all migrations
npm run db:migrate:reset

# Generate Prisma client
npm run db:generate

# Open Prisma Studio
npm run db:studio
```

### How to Make Schema Changes

1. **Edit the schema**: Modify `prisma/schema.prisma`
2. **Create migration**: Run `npm run db:migrate <descriptive_name>`
3. **Review the migration**: Check the generated SQL in `prisma/migrations/`
4. **Commit changes**: Add both schema and migration files to git

### Example Workflow

```bash
# 1. Edit prisma/schema.prisma (add a new field, table, etc.)
# 2. Create and apply the migration
npm run db:migrate add_user_avatar

# 3. The script will:
#    - Generate the migration SQL
#    - Apply it to the database
#    - Update the Prisma client
#    - Show you the changes
```

### Migration Files

Migrations are stored in `prisma/migrations/` with the following structure:
```
prisma/migrations/
├── 20250729110430_init/
│   └── migration.sql
└── 20250729120000_add_user_avatar/
    └── migration.sql
```

### Benefits of Using Migrations

1. **Version Control**: All database changes are tracked in git
2. **Rollback Support**: Easy to revert changes if needed
3. **Team Collaboration**: Everyone gets the same database structure
4. **Production Safety**: Controlled deployment of schema changes
5. **Change History**: Clear audit trail of all database modifications

### Troubleshooting

#### Shadow Database Issues
If you encounter shadow database permission errors, the migration scripts automatically handle this by using alternative approaches.

#### Migration Conflicts
If you have migration conflicts:
1. Check `npm run db:migrate:status`
2. Resolve conflicts manually
3. Use `npm run db:migrate:reset` if needed (⚠️ destructive)

#### Database Out of Sync
If your database gets out of sync:
1. Run `npm run db:migrate:status` to check
2. Use `npm run db:migrate:deploy` to apply pending migrations
3. Run `npm run db:generate` to update the client

### Best Practices

1. **Descriptive Names**: Use clear, descriptive migration names
2. **Small Changes**: Keep migrations focused on single changes
3. **Review SQL**: Always review generated SQL before applying
4. **Backup**: Backup production data before major migrations
5. **Test**: Test migrations on development/staging first

### Migration Scripts Explained

- **migrate-simple.sh**: Uses Prisma's built-in migration system with shadow database workarounds
- **migrate-dev.sh**: Custom migration script for complex scenarios where Prisma migrations don't work

Both scripts ensure your database schema stays in sync with your Prisma schema while providing version control for all changes.