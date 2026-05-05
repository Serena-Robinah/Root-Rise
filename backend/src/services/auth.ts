import bcrypt from 'bcryptjs';
import { UserModel } from '../models';
import type { User } from '@shared/types';
import { prisma } from '../config/database';
import crypto from 'crypto';
import { sendPasswordResetEmail } from './emailService';

export class AuthService {
  private userModel: UserModel;

  constructor(db: any) {
    this.userModel = new UserModel(db);
  }

  async signup(name: string, email: string, password: string, verificationToken: string): Promise<Omit<User, 'password'>> {
  // Prevent creating duplicate users — check first
  const existing = await this.userModel.findByEmail(email) as any;
  if (existing) throw new Error('Email already in use');
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
    if (user && bcrypt.compareSync(password, user.password_hash)) {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async getUserById(id: number): Promise<Omit<User, 'password/passwordHash'> | null> {
    return this.userModel.findById(id) as Promise<any>;
  }
}
