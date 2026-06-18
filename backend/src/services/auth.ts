import bcrypt from 'bcryptjs';
import { UserModel } from '../models';
import type { User } from '@shared/types';
import { prisma } from '../config/database';
import crypto from 'crypto';
import { sendPasswordResetEmail, sendVerificationEmail } from './emailService';

export class AuthService {
  private userModel: UserModel;

  constructor(db: any) {
    this.userModel = new UserModel(db);
  }

  async signup(name: string, email: string, password: string, verificationToken: string): Promise<Omit<User, 'password'>> {
  const existing = await this.userModel.findByEmail(email) as any;
  if (existing) {
    // If email exists but is not yet verified, allow re-signup:
    // update the name, password and token so they can try again
    if (!existing.email_verified) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await prisma.user.update({
        where: { id: existing.id },
        data: { name, password_hash: hashedPassword, verification_token: verificationToken } as any,
      });
      return { id: existing.id, name, email, role: existing.role, email_verified: false };
    }
    throw new Error('Email already in use');
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = await this.userModel.create(name, email, hashedPassword, 'customer', verificationToken);
  return { id, name, email, role: 'customer', email_verified: false };
}

async verifyEmail(token: string): Promise<void> {
  const user = await prisma.user.findFirst({ where: { verification_token: token } as any });
  if (!user) throw new Error('Invalid or expired verification token');
  await prisma.user.update({
    where: { id: user.id },
    data: { email_verified: true, verification_token: null } as any
  });
}

  async requestPasswordReset(email: string, baseUrl: string): Promise<void> {
    const user = await this.userModel.findByEmail(email) as any;
    if (!user) return; // don't reveal user existence
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await prisma.user.update({ where: { id: user.id }, data: { password_reset_token: token, password_reset_expires: expires } as any });
    console.log('[AuthService] Password reset requested for', email, 'token=', token, 'expires=', expires.toISOString());
    try {
      await sendPasswordResetEmail(user.email, { name: user.name, token, baseUrl });
    } catch (emailErr) {
      console.error('[Email] Failed to send password reset email:', emailErr);
      // Don't fail the request if email sending fails — token is stored and can be used for testing.
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findFirst({ where: { password_reset_token: token } as any }) as any;
    if (!user) throw new Error('Invalid or expired reset token');
    if (!user.password_reset_expires || new Date(user.password_reset_expires) < new Date()) throw new Error('Reset token expired');
    const hashed = bcrypt.hashSync(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password_hash: hashed, password_reset_token: null, password_reset_expires: null } as any });
  }

  async updateProfile(id: number, updates: { name?: string; email?: string; password?: string }): Promise<Omit<User, 'password'>> {
    const data: any = {};
    if (updates.name) data.name = updates.name;
    if (updates.email) {
      data.email = updates.email;
      data.email_verified = false;
    }
    if (updates.password) data.password_hash = bcrypt.hashSync(updates.password, 10);
    const updated = await prisma.user.update({ where: { id }, data } as any) as any;
    const { password_hash, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  async login(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = (await this.userModel.findByEmail(email)) as any;
    if (!user) return null;
    if (!user.password_hash) {
      // This is a Google-only account
      throw new Error('This account uses Google Sign-In. Please click "Continue with Google".');
    }
    if (!bcrypt.compareSync(password, user.password_hash)) return null;
    // Admins can always log in regardless of email_verified
    if (user.role !== 'admin' && !user.email_verified) {
      throw new Error('Please verify your email before logging in. Check your inbox or resend the verification email.');
    }
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(id: number): Promise<Omit<User, 'password/passwordHash'> | null> {
    return this.userModel.findById(id) as Promise<any>;
  }

  async loginWithGoogle(googleId: string, email: string, name: string): Promise<Omit<User, 'password'>> {
    // Try to find by google_id first, then by email
    let user = await prisma.user.findFirst({ where: { googleId: googleId } as any }) as any;
    if (!user) {
      user = await prisma.user.findFirst({ where: { email } }) as any;
      if (user) {
        // Existing email/password account — link it to Google
        await prisma.user.update({ where: { id: user.id }, data: { googleId: googleId, email_verified: true } as any });
        user.googleId = googleId;
        user.email_verified = true;
      } else {
        // Brand new user via Google
        user = await prisma.user.create({
          data: { name, email, password_hash: null, googleId: googleId, email_verified: true, role: 'customer' } as any,
        }) as any;
      }
    }
    const { password_hash, verification_token, password_reset_token, password_reset_expires, ...safeUser } = user;
    return safeUser;
  }

  async resendVerificationEmail(email: string, frontendUrl: string): Promise<void> {
    const user = await this.userModel.findByEmail(email) as any;
    if (!user || user.email_verified) return; // silently ignore if not found or already verified
    const token = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({ where: { id: user.id }, data: { verification_token: token } as any });
    await sendVerificationEmail(user.email, { name: user.name, token, baseUrl: frontendUrl });
  }
}
