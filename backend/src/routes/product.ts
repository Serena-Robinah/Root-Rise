import { Router, Request, Response } from 'express';
import { ProductController } from '../controllers/product';
import { ProductInteractionsController } from '../controllers/productInteractions';

import { upload } from '../middleware/upload';
import { authenticateToken } from '../middleware/auth';
export function createProductRoutes(_db?: any) {
  const router = Router();
  const productController = new ProductController(_db);
  const interactionsController = new ProductInteractionsController();

  router.get('/', (req: Request, res: Response) => productController.getAll(req, res));
  router.get('/:id', (req: Request, res: Response) => productController.getById(req, res));

  // Likes
  router.get('/:id/likes', authenticateToken, (req: Request, res: Response) => interactionsController.getLikes(req, res));
  router.post('/:id/likes', authenticateToken, (req: Request, res: Response) => interactionsController.toggleLike(req, res));

  // Reviews
  router.get('/:id/reviews', authenticateToken, (req: Request, res: Response) => interactionsController.getReviews(req, res));
  router.post('/:id/reviews', authenticateToken, (req: Request, res: Response) => interactionsController.createReview(req, res));

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