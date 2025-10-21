# Database Setup Guide

## Current Errors
1. ❌ `relation "User" does not exist` - Database tables not created
2. ❌ `require-in-the-middle` version conflict
3. ⚠️  React key warning in messages component

## Quick Fix Commands

### Step 1: Check if PostgreSQL is Running
```bash
# Check if postgres is running
pg_isready

# If not running, start it (macOS with Homebrew)
brew services start postgresql@14

# Or if using different version
brew services start postgresql
```

### Step 2: Verify Database Exists
```bash
# Check if database exists
psql -l | grep adk_terminal

# If it doesn't exist, create it
createdb adk_terminal

# Verify you can connect
psql adk_terminal -c "\dt"
```

### Step 3: Generate and Run Migrations
```bash
cd /Users/apple/dev/hackathon/ADK/adk-coinbase-terminal

# Generate migration files from schema
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# OR use push for quick dev setup (overwrites without migrations)
pnpm db:push
```

### Step 4: Verify Tables Were Created
```bash
# List all tables in database
psql adk_terminal -c "\dt"

# You should see:
# - User
# - Chat
# - Message_v2
# - Stream
```

## Database Schema

Based on `lib/db/schema.ts`:

```sql
-- User table
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "address" TEXT NOT NULL
);

-- Chat table
CREATE TABLE "Chat" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "title" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "visibility" TEXT NOT NULL DEFAULT 'private'
);

-- Message table
CREATE TABLE "Message_v2" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "chatId" TEXT NOT NULL REFERENCES "Chat"("id"),
  "role" TEXT NOT NULL,
  "parts" TEXT NOT NULL,
  "attachments" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL
);

-- Stream table
CREATE TABLE "Stream" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "chatId" TEXT NOT NULL REFERENCES "Chat"("id"),
  "createdAt" TIMESTAMP NOT NULL
);
```

## Package.json Scripts

Your available database commands:
```json
{
  "db:generate": "drizzle-kit generate:pg",
  "db:migrate": "drizzle-kit migrate",
  "db:push": "drizzle-kit push:pg",
  "db:studio": "drizzle-kit studio"
}
```

## Environment Variables

Make sure `.env.local` has:
```env
DATABASE_URL="postgresql://apple@localhost:5432/adk_terminal"
```

## Troubleshooting

### Error: "database does not exist"
```bash
createdb adk_terminal
```

### Error: "role does not exist"
```bash
# Create user if needed
createuser -s apple
```

### Error: "connection refused"
```bash
# Start PostgreSQL
brew services start postgresql
```

### Want to start fresh?
```bash
# Drop and recreate database
dropdb adk_terminal
createdb adk_terminal
pnpm db:push
```

## After Database Setup

Restart your dev server:
```bash
# Stop current server (Ctrl+C)
pnpm dev
```

The error should be gone and you should be able to:
- ✅ Connect wallet
- ✅ Create chat sessions
- ✅ Send messages
- ✅ Store chat history
