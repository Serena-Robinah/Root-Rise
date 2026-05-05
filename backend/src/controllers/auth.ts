import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { Request, Response } from 'express';
import { JWT_SECRET } from '../config/env';
import { AuthService } from '../services';
import { authenticateToken } from '../middleware/auth';

export class AuthController {
  constructor(private db?: any) { }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      console.log('[Signup] Token generated:', verificationToken);

      const authService = new AuthService(this.db);
      const user = await authService.signup(name, email, password, verificationToken);

      // Send verification email
      try {
        const { sendVerificationEmail } = require('../services/emailService');
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        await sendVerificationEmail(email, { name, token: verificationToken, baseUrl });
      } catch (emailErr) {
        console.error('[Email] Failed to send verification email:', emailErr);
      }

      // Do not auto-login users on signup. Require email verification first.
      res.status(201).json({ message: 'Account created. Please check your email to verify your account.' });
    } catch (error: any) {
      if (error?.message === 'Email already in use') {
        res.status(409).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: error.message || 'Signup failed' });
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

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) { res.status(400).json({ error: 'Missing email' }); return; }
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const authService = new AuthService(this.db);
      await authService.requestPasswordReset(email, baseUrl);
      res.json({ message: 'If that email is registered, a reset link has been sent.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to process request' });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;
      if (!token || !password) { res.status(400).json({ error: 'Missing token or password' }); return; }
      const authService = new AuthService(this.db);
      await authService.resetPassword(token, password);
      res.json({ message: 'Password reset successful' });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Reset failed' });
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) { res.status(401).json({ error: 'Unauthorized' }); return; }
      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) { res.status(401).json({ error: 'Unauthorized' }); return; }
      const { name, email, password } = req.body;
      const authService = new AuthService(this.db);
      const updated = await authService.updateProfile(user.id, { name, email, password });
      res.json({ user: updated });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Update failed' });
    }
  }
}