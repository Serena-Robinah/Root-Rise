import { Router } from 'express';
import { ProductController } from '../controllers/product';

export function createProductRoutes(_db?: any) {
  const router = Router();
  const productController = new ProductController();

  router.get('/', (req, res) => productController.getAll(req, res));
  router.get('/:id', (req, res) => productController.getById(req, res));

  return router;
}

export function createAdminProductRoutes(_db?: any) {
  const router = Router();
  const productController = new ProductController();

  router.post('/', (req, res) => productController.create(req, res));
  router.put('/:id', (req, res) => productController.update(req, res));
  router.delete('/:id', (req, res) => productController.delete(req, res));

  return router;
}
