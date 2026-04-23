import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { Request, Response } from 'express';
import { JWT_SECRET } from '../config/env';
import { AuthService } from '../services';

export class AuthController {
  constructor(private db?: any) {}

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      const authService = new AuthService(this.db);
      const user = await authService.signup(name, email, password, verificationToken);
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

      // Send verification email
      try {
        const { sendVerificationEmail } = await import('../services/emailService');
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        await sendVerificationEmail(email, { name, token: verificationToken, baseUrl });
      } catch (emailErr) {
        console.error('[Email] Failed to send verification email:', emailErr);
      }

      res.json({ user, token, message: 'Please check your email to verify your account.' });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Email already exists' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
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

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.query;

      if (!token) {
        res.status(400).json({ error: 'Missing verification token' });
        return;
      }

      const authService = new AuthService(this.db);
      await authService.verifyEmail(token as string);

      // Redirect to frontend with success message
      res.redirect('http://localhost:5173?verified=true');
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Verification failed' });
    }
  }
}