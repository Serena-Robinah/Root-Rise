import bcrypt from 'bcryptjs';
import { UserModel } from '../models';
import type { User } from '@shared/types';

export class AuthService {
  private userModel: UserModel;

  constructor(db: any) {
    this.userModel = new UserModel(db);
  }

  async signup(name: string, email: string, password: string): Promise<Omit<User, 'password'>> {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const id = await this.userModel.create(name, email, hashedPassword, 'customer');
    return { id, name, email, role: 'customer' };
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
