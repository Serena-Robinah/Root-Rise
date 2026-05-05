require('dotenv').config({ override: true });
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function run() {
  const users = await p.user.findMany({
    where: { email: { in: ['kisirinyasiraje@gmail.com', 'serena.robin2323@gmail.com'] } },
    select: { id: true, email: true, email_verified: true, verification_token: true }
  });

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  console.log('\n=== Verification Links ===');
  users.forEach(u => {
    if (!u.email_verified && u.verification_token) {
      console.log(`\n${u.email}:`);
      console.log(`  http://localhost:3000/api/auth/verify-email?token=${u.verification_token}`);
    } else {
      console.log(`\n${u.email}: already verified=${u.email_verified}`);
    }
  });
  await p.$disconnect();
}

run().catch(e => { console.error(e.message); process.exit(1); });
