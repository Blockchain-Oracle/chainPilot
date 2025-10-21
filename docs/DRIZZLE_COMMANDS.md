# Updated Drizzle Kit Commands

## What Changed

Drizzle Kit deprecated the old `:pg`, `:mysql`, `:sqlite` suffixes. Now you configure the dialect in `drizzle.config.ts` instead.

### Old (Deprecated) ❌
```bash
pnpm db:generate  # Was: drizzle-kit generate:pg
pnpm db:push      # Was: drizzle-kit push:pg
```

### New (Current) ✅
```bash
pnpm db:generate  # Now: drizzle-kit generate
pnpm db:push      # Now: drizzle-kit push
```

## Fixed Issues

1. ✅ Updated `package.json` scripts to use new commands
2. ✅ Fixed `drizzle.config.ts` schema paths (`./src/lib/` → `./lib/`)

## Database Setup Commands

### Quick Setup (Recommended for Development)
```bash
# Make sure PostgreSQL is running
pg_isready

# Create database if needed
createdb adk_terminal

# Push schema directly to database (fast, no migration files)
pnpm db:push
```

### Production Setup (With Migrations)
```bash
# Generate migration files
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Or run the custom migration script
tsx lib/db/migrate.ts
```

### Database Management
```bash
# Open Drizzle Studio (visual database browser)
pnpm db:studio

# View database tables
psql adk_terminal -c "\dt"

# Reset database
dropdb adk_terminal && createdb adk_terminal && pnpm db:push
```

## Configuration

Your `drizzle.config.ts` is now correctly configured:

```typescript
export default {
  schema: './lib/db/schema.ts',           // ✅ Correct path
  out: './lib/db/migrations',             // ✅ Migration folder
  dialect: 'postgresql',                  // ✅ Specified here, not in command
  dbCredentials: {
    url: process.env.DATABASE_URL,        // ✅ From .env.local
  },
} satisfies Config;
```

## Environment Variables Required

Make sure `.env.local` has:
```env
DATABASE_URL="postgresql://apple@localhost:5432/adk_terminal"
```

## Troubleshooting

### Error: "dialect" is required
**Solution:** Already fixed! Updated `drizzle.config.ts` with `dialect: 'postgresql'`

### Error: Cannot find module './src/lib/db/schema.ts'
**Solution:** Already fixed! Changed path to `./lib/db/schema.ts`

### Error: relation "User" does not exist
**Solution:** Run `pnpm db:push` to create tables

### Want to see what changed?
```bash
# Generate migrations to see SQL
pnpm db:generate

# Check the generated SQL files in
cat lib/db/migrations/*.sql
```

## Current Database Schema

Tables that will be created:
- **User** - Wallet addresses and user IDs
- **Chat** - Chat sessions with titles and timestamps
- **Message_v2** - Chat messages with roles and attachments
- **Stream** - Streaming session tracking

## Next Steps

Run this now to set up your database:
```bash
cd /Users/apple/dev/hackathon/ADK/adk-coinbase-terminal
pnpm db:push
```

Then restart your dev server and the database errors should be gone!
