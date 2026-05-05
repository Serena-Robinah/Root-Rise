require('dotenv').config({ override: true });
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function run() {
  const users = await p.user.findMany({
    where: { email: { in: ['kisirinyasiraje@gmail.com', 'serena.robin2323@gmail.com'] } },
    select: { id: true, name: true, email: true, email_verified: true, verification_token: true }
  });
  console.log('Users in DB:');
  users.forEach(u => {
    console.log(`  id=${u.id} email=${u.email} verified=${u.email_verified} token=${u.verification_token ? u.verification_token.slice(0,16)+'...' : 'null'}`);
  });
  await p.$disconnect();
}

run().catch(e => { console.error(e.message); process.exit(1); });
