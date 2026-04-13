import { Router } from 'express';
import { AuthController } from '../controllers/auth';
import Database from 'better-sqlite3';

export function createAuthRoutes(db: Database.Database) {
  const router = Router();
  const authController = new AuthController(db);

  router.post('/signup', (req, res) => authController.signup(req, res));
  router.post('/login', (req, res) => authController.login(req, res));

  return router;
}
