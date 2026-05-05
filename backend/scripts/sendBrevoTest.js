const { sendVerificationEmail } = require('../dist/services/emailService') || require('../src/services/emailService');

async function main() {
  const to = process.argv[2];
  if (!to) {
    console.error('Usage: node sendBrevoTest.js <recipient-email>');
    process.exit(2);
  }

  const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
  try {
    await sendVerificationEmail(to, { name: 'Brevo Test', token: 'test-token', baseUrl });
    console.log('Test email sent (via Brevo if configured) to', to);
  } catch (err) {
    console.error('Failed to send test email:', err);
    process.exit(1);
  }
}

main();
