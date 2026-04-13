import { Router } from 'express';
import { OrderController } from '../controllers/order';
import Database from 'better-sqlite3';

export function createOrderRoutes(db: Database.Database) {
  const router = Router();
  const orderController = new OrderController(db);

  router.post('/', (req, res) => orderController.create(req, res));

  return router;
}

export function createAdminOrderRoutes(db: Database.Database) {
  const router = Router();
  const orderController = new OrderController(db);

  router.get('/', (req, res) => orderController.getAll(req, res));
  router.get('/:id', (req, res) => orderController.getById(req, res));
  router.patch('/:id/status', (req, res) => orderController.updateStatus(req, res));
  router.delete('/:id', (req, res) => orderController.delete(req, res));

  return router;
}
