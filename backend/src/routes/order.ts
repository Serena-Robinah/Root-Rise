import { Router } from 'express';
import { OrderController } from '../controllers/order';

export function createOrderRoutes(_db?: any) {
  const router = Router();
  const orderController = new OrderController();

  router.post('/', (req, res) => orderController.create(req, res));

  return router;
}

export function createAdminOrderRoutes(_db?: any) {
  const router = Router();
  const orderController = new OrderController();

  router.get('/stats', (req, res) => orderController.getStats(req, res));
  router.get('/', (req, res) => orderController.getAll(req, res));
  router.get('/:id', (req, res) => orderController.getById(req, res));
  router.patch('/:id/status', (req, res) => orderController.updateStatus(req, res));
  router.delete('/:id', (req, res) => orderController.delete(req, res));

  return router;
}