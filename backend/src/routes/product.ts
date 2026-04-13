import { Router } from 'express';
import { ProductController } from '../controllers/product';
import Database from 'better-sqlite3';

export function createProductRoutes(db: Database.Database) {
  const router = Router();
  const productController = new ProductController(db);

  router.get('/', (req, res) => productController.getAll(req, res));
  router.get('/:id', (req, res) => productController.getById(req, res));

  return router;
}

export function createAdminProductRoutes(db: Database.Database) {
  const router = Router();
  const productController = new ProductController(db);

  router.post('/', (req, res) => productController.create(req, res));
  router.put('/:id', (req, res) => productController.update(req, res));
  router.delete('/:id', (req, res) => productController.delete(req, res));

  return router;
}
