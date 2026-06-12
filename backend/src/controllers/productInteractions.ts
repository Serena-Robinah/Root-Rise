import type { Request, Response } from 'express';
import { ProductLikeModel, ProductReviewModel } from '../models';

const likeModel = new ProductLikeModel();
const reviewModel = new ProductReviewModel();

export class ProductInteractionsController {
  // GET /api/products/:id/likes
  async getLikes(req: Request, res: Response): Promise<void> {
    try {
      const productId = Number(req.params.id);
      const userId = (req as any).user?.id;
      const count = await likeModel.getLikeCount(productId);
      const liked = userId ? await likeModel.isLikedByUser(productId, userId) : false;
      res.json({ count, liked });
    } catch {
      res.status(500).json({ error: 'Failed to fetch likes' });
    }
  }

  // POST /api/products/:id/likes
  async toggleLike(req: Request, res: Response): Promise<void> {
    try {
      const productId = Number(req.params.id);
      const userId = (req as any).user?.id;
      if (!userId) { res.status(401).json({ error: 'Login required' }); return; }
      const result = await likeModel.toggleLike(productId, userId);
      res.json(result);
    } catch {
      res.status(500).json({ error: 'Failed to toggle like' });
    }
  }

  // GET /api/products/:id/reviews
  async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const productId = Number(req.params.id);
      const userId = (req as any).user?.id;
      const reviews = await reviewModel.getByProductId(productId);
      const avgRating = await reviewModel.getAverageRating(productId);
      const hasReviewed = userId ? await reviewModel.hasReviewed(productId, userId) : false;
      res.json({ reviews, avgRating, hasReviewed });
    } catch {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }

  // POST /api/products/:id/reviews
  async createReview(req: Request, res: Response): Promise<void> {
    try {
      const productId = Number(req.params.id);
      const userId = (req as any).user?.id;
      if (!userId) { res.status(401).json({ error: 'Login required' }); return; }
      const { rating, comment } = req.body;
      if (!rating || rating < 1 || rating > 5) {
        res.status(400).json({ error: 'Rating must be between 1 and 5' });
        return;
      }
      const alreadyReviewed = await reviewModel.hasReviewed(productId, userId);
      if (alreadyReviewed) {
        res.status(400).json({ error: 'You have already reviewed this product' });
        return;
      }
      await reviewModel.create(productId, userId, rating, comment || '');
      const reviews = await reviewModel.getByProductId(productId);
      const avgRating = await reviewModel.getAverageRating(productId);
      res.json({ success: true, reviews, avgRating });
    } catch {
      res.status(500).json({ error: 'Failed to submit review' });
    }
  }
}