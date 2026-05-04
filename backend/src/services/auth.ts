import bcrypt from 'bcryptjs';
import { UserModel } from '../models';
import type { User } from '@shared/types';
import { prisma } from '../config/database';

export class AuthService {
  private userModel: UserModel;

  constructor(db: any) {
    this.userModel = new UserModel(db);
  }

  async signup(name: string, email: string, password: string, verificationToken: string): Promise<Omit<User, 'password'>> {
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
