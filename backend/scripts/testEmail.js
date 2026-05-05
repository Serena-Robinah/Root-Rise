require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function run() {
  const to = process.argv[2] || process.env.BREVO_SENDER_EMAIL;
  console.log('Sending test email to:', to);
  console.log('From:', process.env.BREVO_SENDER_EMAIL);
  console.log('SMTP host:', process.env.SMTP_HOST, ':', process.env.SMTP_PORT);
  console.log('SMTP user:', process.env.SMTP_USER);

  try {
    const info = await transporter.sendMail({
      from: '"Root Rise Kids" <' + process.env.BREVO_SENDER_EMAIL + '>',
      replyTo: process.env.BREVO_REPLY_TO || process.env.BREVO_SENDER_EMAIL,
      to,
      subject: 'TEST - Root Rise Kids email check',
      html: '<h2>Email delivery test</h2><p>If you receive this, Brevo SMTP is working correctly.</p>',
    });
    console.log('SUCCESS - MessageId:', info.messageId);
    console.log('Response:', info.response);
  } catch (err) {
    console.error('FAILED:', err.message);
  }
}

run();
