import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function run(email: string, newPassword: string) {
  if (!email || !newPassword) {
    console.error('Usage: npx tsx scripts/setAdminPassword.ts <email> <newPassword>');
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error('User not found:', email);
      process.exit(1);
    }

    const hash = bcrypt.hashSync(newPassword, 10);
    await prisma.user.update({ where: { email }, data: { password_hash: hash } });
    console.log('Password updated for', email);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run(process.argv[2], process.argv[3]);
