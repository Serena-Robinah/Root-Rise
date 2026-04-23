import { Router } from 'express';
import { AuthController } from '../controllers/auth';

export function createAuthRoutes(_db?: any) {
  const router = Router();
  const authController = new AuthController();

  router.post('/signup', (req, res) => authController.signup(req, res));
  router.post('/login', (req, res) => authController.login(req, res));
  router.get('/verify-email', (req, res) => authController.verifyEmail(req, res));

  return router;
}