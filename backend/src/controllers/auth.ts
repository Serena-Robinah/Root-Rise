import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import type { Request, Response } from 'express';
import { JWT_SECRET, FRONTEND_URL } from '../config/env';
import { AuthService } from '../services';
import { authenticateToken } from '../middleware/auth';
import { sendVerificationEmail } from '../services/emailService';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthController {
  constructor(private db?: any) { }

  // Dedup map: email → timestamp of last email sent. Prevents double-sends from StrictMode/retries.
  private static recentEmailSends = new Map<string, number>();

  private shouldSendEmail(email: string): boolean {
    const last = AuthController.recentEmailSends.get(email);
    if (last && Date.now() - last < 15_000) return false; // 15-second cooldown
    AuthController.recentEmailSends.set(email, Date.now());
    return true;
  }

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

      // Send verification email (with dedup guard)
      try {
        if (this.shouldSendEmail(email)) {
          const baseUrl = `${req.protocol}://${req.get('host')}`;
          await sendVerificationEmail(email, { name, token: verificationToken, baseUrl });
        } else {
          console.log(`[Email] Skipped duplicate send to ${email}`);
        }
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
    } catch (error: any) {
      if (error?.message?.includes('verify your email')) {
        res.status(403).json({ error: error.message });
        return;
      }
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
      res.redirect(`${FRONTEND_URL}?verified=true`);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Verification failed' });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) { res.status(400).json({ error: 'Missing email' }); return; }
      const baseUrl = FRONTEND_URL;
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

  async resendVerification(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) { res.status(400).json({ error: 'Missing email' }); return; }
      if (!this.shouldSendEmail(email)) {
        // Still return success to avoid revealing timing info, but skip the actual send
        res.json({ message: 'If that email is registered and unverified, a new verification email has been sent.' });
        return;
      }
      const authService = new AuthService(this.db);
      await authService.resendVerificationEmail(email, FRONTEND_URL);
      res.json({ message: 'If that email is registered and unverified, a new verification email has been sent.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to resend verification email' });
    }
  }

  async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const { credential } = req.body;
      if (!credential) { res.status(400).json({ error: 'Missing Google credential' }); return; }

      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.sub || !payload.email) {
        res.status(401).json({ error: 'Invalid Google token' });
        return;
      }

      const authService = new AuthService(this.db);
      const user = await authService.loginWithGoogle(payload.sub, payload.email, payload.name || payload.email);
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
      res.json({ user, token });
    } catch (error: any) {
      console.error('[GoogleAuth] Error:', error.message);
      res.status(401).json({ error: error.message || 'Google authentication failed' });
    }
  }
}