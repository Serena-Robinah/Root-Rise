const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node printResetToken.js <email>');
    process.exit(2);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error('User not found');
    process.exit(1);
  }

  console.log(JSON.stringify({ email: user.email, resetToken: user.password_reset_token, expires: user.password_reset_expires }, null, 2));
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
