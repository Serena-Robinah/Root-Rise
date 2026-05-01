import { Router, Request, Response } from 'express';
import { ProductController } from '../controllers/product';
import { upload } from '../middleware/upload';

export function createProductRoutes(_db?: any) {
  const router = Router();
  const productController = new ProductController(_db);

  router.get('/', (req: Request, res: Response) => productController.getAll(req, res));
  router.get('/:id', (req: Request, res: Response) => productController.getById(req, res));

  return router;
}

export function createAdminProductRoutes(_db?: any) {
  const router = Router();
  const productController = new ProductController(_db);

  router.post('/', upload.single('image'), (req: Request, res: Response) => productController.create(req as any, res));
  router.put('/:id', upload.single('image'), (req: Request, res: Response) => productController.update(req as any, res));
  router.delete('/:id', (req: Request, res: Response) => productController.delete(req, res));

  return router;
}