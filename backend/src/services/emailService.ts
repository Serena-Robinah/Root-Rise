//import nodemailer from 'nodemailer';



const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER || '';
const SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Root & Rise Kids';
const REPLY_TO = process.env.BREVO_REPLY_TO || SENDER_EMAIL;

async function sendEmail(to: string, subject: string, html: string) {
  console.log(`[Email] Sending "${subject}" to ${to} via Brevo API`);

  try {
    const response = await fetch(
      'https://api.brevo.com/v3/smtp/email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY || '',
        },
        body: JSON.stringify({
          sender: {
            name: SENDER_NAME,
            email: SENDER_EMAIL,
          },
          replyTo: {
            email: REPLY_TO,
          },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    console.log(`[Email] Sent successfully to ${to}`);
  } catch (err) {
    console.error(`[Email] Failed to send to ${to}:`, err);
    throw err;
  }
}

export async function sendOrderConfirmation(to: string, order: {
  id: number;
  full_name: string;
  total_amount: number;
  items: { product: { name: string; price: number }; quantity: number }[];
}) {
  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${item.product.name}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; text-align: right;">$${(item.product.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #2d6a4f; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Root & Rise Kids</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #2d6a4f;">Order Confirmed! 🎉</h2>
          <p>Hi ${order.full_name},</p>
          <p>Thank you for shopping with Root & Rise Kids! Your order has been received and is being processed.</p>
          
          <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h3 style="color: #2d6a4f; margin-top: 0;">Order #${order.id}</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="color: #999; font-size: 12px; text-transform: uppercase;">
                  <th style="text-align: left; padding-bottom: 8px;">Item</th>
                  <th style="text-align: center; padding-bottom: 8px;">Qty</th>
                  <th style="text-align: right; padding-bottom: 8px;">Price</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>
            <div style="text-align: right; margin-top: 16px; font-size: 18px; font-weight: bold; color: #2d6a4f;">
              Total: $${order.total_amount.toFixed(2)}
            </div>
          </div>

          <p style="color: #666;">We'll send you another email when your order is on its way!</p>
          <p style="color: #666;">Thank you for choosing Root & Rise Kids 💚</p>
        </div>
        <div style="background: #f5f5f5; padding: 16px; text-align: center; font-size: 12px; color: #999;">
          © 2024 Root & Rise Kids. All rights reserved.
        </div>
      </div>
    `;

  await sendEmail(to, `Order Confirmed #${order.id} — Root & Rise Kids`, html);
}

export async function sendOrderStatusUpdate(to: string, data: {
  full_name: string;
  order_id: number;
  status: string;
}) {
  const statusMessages: Record<string, { emoji: string; message: string }> = {
    'Confirmed': { emoji: '✅', message: 'Your order has been confirmed and is being prepared.' },
    'Out for Delivery': { emoji: '🚚', message: 'Great news! Your order is on its way to you.' },
    'Delivered': { emoji: '📦', message: 'Your order has been delivered. Enjoy!' },
    'Cancelled': { emoji: '❌', message: 'Your order has been cancelled. Contact us if you have questions.' },
  };

  const { emoji, message } = statusMessages[data.status] ?? { emoji: '📋', message: `Your order status has been updated to ${data.status}.` };

  const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #2d6a4f; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Root & Rise Kids</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #2d6a4f;">Order Update ${emoji}</h2>
          <p>Hi ${data.full_name},</p>
          <p>${message}</p>
          
          <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
            <p style="margin: 0; color: #999; font-size: 12px; text-transform: uppercase;">Order</p>
            <p style="margin: 4px 0; font-size: 24px; font-weight: bold; color: #2d6a4f;">#${data.order_id}</p>
            <p style="margin: 0; color: #999; font-size: 12px; text-transform: uppercase;">Status</p>
            <p style="margin: 4px 0; font-size: 20px; font-weight: bold; color: #f4845f;">${data.status}</p>
          </div>

          <p style="color: #666;">Thank you for choosing Root & Rise Kids 💚</p>
        </div>
        <div style="background: #f5f5f5; padding: 16px; text-align: center; font-size: 12px; color: #999;">
          © 2024 Root & Rise Kids. All rights reserved.
        </div>
      </div>
    `;

  await sendEmail(to, `Order #${data.order_id} Update: ${data.status} ${emoji}`, html);
}

export async function sendVerificationEmail(to: string, data: {
  name: string;
  token: string;
  baseUrl: string;
}) {
  const verificationLink = `${data.baseUrl}/api/auth/verify-email?token=${data.token}`;
  const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #2d6a4f; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Root & Rise Kids</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #2d6a4f;">Verify your email 📧</h2>
          <p>Hi ${data.name},</p>
          <p>Thank you for signing up! Please verify your email address to start shopping.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verificationLink}" style="background-color: #f4845f; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Verify Email
            </a>
          </div>
          <p style="color: #666;">If you didn't create an account, you can ignore this email.</p>
          <p style="color: #666;">Thank you for choosing Root & Rise Kids 💚</p>
        </div>
        <div style="background: #f5f5f5; padding: 16px; text-align: center; font-size: 12px; color: #999;">
          © 2024 Root & Rise Kids. All rights reserved.
        </div>
      </div>
    `;

  await sendEmail(to, `Verify your email — Root & Rise Kids`, html);
}

export async function sendPasswordResetEmail(to: string, data: { name: string; token: string; baseUrl: string }) {
  const resetLink = `${data.baseUrl}/reset-password?token=${data.token}`;
  console.log('[Email] Password reset link for', to, resetLink);
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #2d6a4f; padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Root & Rise Kids</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #2d6a4f;">Reset your password</h2>
        <p>Hi ${data.name},</p>
        <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="background-color: #f4845f; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">Reset Password</a>
        </div>
        <p style="color: #666;">If you didn't request a password reset, ignore this email.</p>
      </div>
    </div>
  `;

  await sendEmail(to, `Reset your password — Root & Rise Kids`, html);
}