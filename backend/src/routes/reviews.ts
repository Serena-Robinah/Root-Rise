import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';

export function createAdminReviewRoutes() {
  const router = Router();

  // GET all reviews
  router.get('/', async (req: Request, res: Response) => {
    try {
      const reviews = await prisma.productReview.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          product: { select: { id: true, name: true } },
        },
        orderBy: { created_at: 'desc' },
      });
      res.json(reviews);
    } catch {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  // DELETE a review
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      await prisma.productReview.delete({ where: { id: Number(req.params.id) } });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: 'Failed to delete review' });
    }
  });

  return router;
}