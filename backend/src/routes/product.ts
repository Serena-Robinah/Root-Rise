import { Router, Request, Response, NextFunction } from 'express';
import { ProductController } from '../controllers/product';
import { upload } from '../middleware/upload';

export function createProductRoutes(_db?: any) {
  const router = Router();
  const productController = new ProductController(_db);

  router.get('/', (req: Request, res: Response, next: NextFunction) => productController.getAll(req, res, next));
  router.get('/:id', (req: Request, res: Response, next: NextFunction) => productController.getById(req, res, next));

  return router;
}

export function createAdminProductRoutes(_db?: any) {
  const router = Router();
  const productController = new ProductController(_db);

  router.post('/', upload.single('image'), (req: Request, res: Response, next: NextFunction) => productController.create(req, res, next));
  router.put('/:id', upload.single('image'), (req: Request, res: Response, next: NextFunction) => productController.update(req, res, next));
  router.delete('/:id', (req: Request, res: Response, next: NextFunction) => productController.delete(req, res, next));

  return router;
}
