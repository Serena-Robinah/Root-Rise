import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

  await transporter.sendMail({
    from: `"Root & Rise Kids" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Order Confirmed #${order.id} — Root & Rise Kids`,
    html: `
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
    `,
  });
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

  await transporter.sendMail({
    from: `"Root & Rise Kids" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Order #${data.order_id} Update: ${data.status} ${emoji}`,
    html: `
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
    `,
  });
}