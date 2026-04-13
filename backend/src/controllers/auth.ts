import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { AuthService } from '../services';
import Database from 'better-sqlite3';
// @ts-ignore

export class AuthController {
  constructor(private db?: any) {}

  async signup(req, res) {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const authService = new AuthService(this.db);
      const user = await authService.signup(name, email, password);
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message || 'Email already exists' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Missing email or password' });
        return;
      }

      const authService = new AuthService(this.db);
      const user = await authService.login(email, password);

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
}
