import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models';
import type { User } from '@shared/types';

export class AuthService {
  private userModel: UserModel;

  constructor(db: Database.Database) {
    this.userModel = new UserModel(db);
  }

  async signup(name: string, email: string, password: string): Promise<Omit<User, 'password'>> {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const id = this.userModel.create(name, email, hashedPassword, 'customer');
    return { id, name, email, role: 'customer' };
  }

  async login(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = this.userModel.findByEmail(email) as any;
    if (user && bcrypt.compareSync(password, user.password_hash)) {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  getUserById(id: number): Omit<User, 'password/passwordHash'> | undefined {
    return this.userModel.findById(id);
  }
}
