import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

 
async function connectWithRetry(attempts = 5, delayMs = 2000): Promise<void> {
  for (let i = 1; i <= attempts; i++) {
    try {
      await prisma.$connect();
      console.log('Database connected');
      return;
    } catch (err: any) {
      console.warn(`[DB] Connection attempt ${i}/${attempts} failed: ${err.message}`);
      if (i < attempts) await new Promise(r => setTimeout(r, delayMs));
    }
  }
  console.error('[DB] Could not connect after', attempts, 'attempts. Server will start anyway.');
}

export async function initializeDatabase() {
  await connectWithRetry();
}

export function getDatabase() {
  return prisma;
}

export { prisma };
