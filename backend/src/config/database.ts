import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function initializeDatabase() {
  try {
    await prisma.$connect();
    console.log('Database connected');
  } catch (err) {
    console.error('Failed to connect to database at startup:', err);
    // Don't rethrow — allow server to start for local dev and return useful
    // error messages from endpoints that depend on the DB.
  }
}

export function getDatabase() {
  // For backward compatibility with code that expects a DB instance argument,
  // return the Prisma client directly.
  return prisma;
}

export { prisma };
