import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if DATABASE_URL is properly configured
const databaseUrl = process.env.DATABASE_URL;
const isValidDatabaseUrl = databaseUrl && !databaseUrl.includes('[YOUR-PASSWORD]');

export const prisma = globalForPrisma.prisma ?? (() => {
  if (!isValidDatabaseUrl) {
    console.warn('⚠️  DATABASE_URL not configured properly. Database operations will fail.');
    // Return a mock client that throws helpful errors
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error('Database not configured. Please set a valid DATABASE_URL in your .env file.');
      }
    });
  }
  
  // For Prisma 7, use pg adapter
  const pool = new pg.Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
})();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
