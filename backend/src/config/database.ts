import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function initializeDatabase() {
  await prisma.$connect();
}

export function getDatabase() {
  // For backward compatibility with code that expects a DB instance argument,
  // return the Prisma client directly.
  return prisma;
}

export { prisma };
