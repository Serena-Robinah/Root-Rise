import { Router } from 'express';
import { AuthController } from '../controllers/auth';
import { authenticateToken } from '../middleware/auth';

export function createAuthRoutes(_db?: any) {
  const router = Router();
  const authController = new AuthController();

  router.post('/signup', (req, res) => authController.signup(req, res));
  router.post('/login', (req, res) => authController.login(req, res));
  router.post('/google', (req, res) => authController.googleAuth(req, res));
  router.get('/verify-email', (req, res) => authController.verifyEmail(req, res));
  router.post('/resend-verification', (req, res) => authController.resendVerification(req, res));
  router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));
  router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

  // Protected routes
  router.get('/me', authenticateToken, (req, res) => authController.me(req, res));
  router.put('/profile', authenticateToken, (req, res) => authController.updateProfile(req, res));

  return router;
}