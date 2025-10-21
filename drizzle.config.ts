import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set in .env.local');
  console.warn('Database migrations will not work until DATABASE_URL is configured');
}

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://placeholder',
  },
  verbose: true,
  strict: true,
} satisfies Config;