import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run(email: string) {
  if (!email) {
    console.error('Usage: npx tsx scripts/promoteAdmin.ts <email>');
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error('User not found:', email);
      process.exit(1);
    }

    const updated = await prisma.user.update({ where: { email }, data: { role: 'admin' } });
    console.log('Promoted', updated.email, 'to admin');
  } catch (err) {
    console.error('Error promoting user:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run(process.argv[2]);
