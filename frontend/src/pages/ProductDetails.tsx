import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCcw, Star, Heart } from 'lucide-react';
import type { Product } from '@shared/types';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { motion } from 'motion/react';
import AuthModal from '../components/AuthModal';
import { productService } from '@/services';

const formatUGX = (amount: number) => `UGX ${amount.toLocaleString()}`;

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

type Review = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: { id: number; name: string };
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  // Likes
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  React.useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) return;
        const data = await productService.getById(parseInt(id));
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  React.useEffect(() => {
    if (!id) return;
    productService.getLikes(parseInt(id))
      .then(data => { setLikeCount(data.count); setLiked(data.liked); })
      .catch(() => {});
    productService.getReviews(parseInt(id))
      .then(data => { setReviews(data.reviews); setAvgRating(data.avgRating); setHasReviewed(data.hasReviewed); })
      .catch(() => {});
  }, [id]);

  const handleToggleLike = async () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const result = await productService.toggleLike(parseInt(id!));
      setLiked(result.liked);
      setLikeCount(result.count);
    } catch {
      // silent
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    if (!user.email_verified) { alert('Please verify your email before adding to cart.'); return; }
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addItem(product!, selectedSize);
  };

  const handleSubmitReview = async () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    if (reviewRating === 0) { setReviewError('Please select a star rating.'); return; }
    setReviewLoading(true);
    setReviewError(null);
    try {
      const result = await productService.submitReview(parseInt(id!), reviewRating, reviewComment);
      setReviews(result.reviews);
      setAvgRating(result.avgRating);
      setHasReviewed(true);
      setReviewRating(0);
      setReviewComment('');
    } catch (err: any) {
      setReviewError(err?.message || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const availableSizes: string[] = (product as any).sizes?.length ? (product as any).sizes : SIZES;
  const displayRating = avgRating > 0 ? avgRating : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-zinc-500 hover:text-primary-green font-bold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Shop</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-24">
        {/* Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl relative">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <button
              onClick={handleToggleLike}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${liked ? 'bg-red-500 text-white' : 'bg-white text-zinc-400 hover:text-red-400'}`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-accent-orange cursor-pointer transition-all">
                <img src={`${product.image_url}?v=${i}`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="bg-soft-cream text-primary-green px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{product.category}</span>
              <div className="flex text-accent-orange">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= Math.round(displayRating) ? 'fill-current' : 'text-zinc-300'}`} />
                ))}
              </div>
              <span className="text-xs text-zinc-400 font-medium">
                {reviews.length > 0 ? `(${reviews.length} review${reviews.length !== 1 ? 's' : ''})` : 'No reviews yet'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold">{product.name}</h1>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-primary-green">{formatUGX(product.price)}</p>
              <div className="flex items-center gap-1 text-zinc-500 text-sm">
                <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
              </div>
            </div>
          </div>

          <p className="text-zinc-600 leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-zinc-100">
              <p className="text-xs text-zinc-400 font-bold uppercase">Age Group</p>
              <p className="font-bold text-primary-green">{product.age_group} Years</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-zinc-100">
              <p className="text-xs text-zinc-400 font-bold uppercase">Gender</p>
              <p className="font-bold text-primary-green">{product.gender}</p>
            </div>
          </div>

          {/* Size selector */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-zinc-700">
              Select Size {selectedSize && <span className="text-primary-green font-bold">— {selectedSize}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                    selectedSize === size
                      ? 'border-primary-green bg-primary-green text-white'
                      : 'border-zinc-200 text-zinc-600 hover:border-primary-green'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && <p className="text-xs text-red-500">Please select a size before adding to cart.</p>}
          </div>

          <div className="space-y-4 pt-2 border-t">
            <div>
              <p className="text-sm font-bold text-zinc-800">Availability</p>
              <p className={`text-sm font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} items in stock` : 'Out of Stock'}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full btn-accent py-5 text-xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-6 h-6" />
              <span>Add to Cart</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-primary-green mx-auto" />
              <p className="text-[10px] font-bold text-zinc-500 uppercase">100% Safe</p>
            </div>
            <div className="text-center space-y-2">
              <Truck className="w-8 h-8 text-primary-green mx-auto" />
              <p className="text-[10px] font-bold text-zinc-500 uppercase">Fast Ship</p>
            </div>
            <div className="text-center space-y-2">
              <RefreshCcw className="w-8 h-8 text-primary-green mx-auto" />
              <p className="text-[10px] font-bold text-zinc-500 uppercase">14 Day Return</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-8 border-t pt-12">
        <div className="flex items-end gap-4">
          <h2 className="text-2xl font-display font-bold">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 pb-1">
              <div className="flex text-accent-orange">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= Math.round(avgRating) ? 'fill-current' : 'text-zinc-300'}`} />
                ))}
              </div>
              <span className="text-sm text-zinc-500">{avgRating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {!hasReviewed ? (
          <div className="bg-white rounded-2xl p-6 border border-zinc-100 space-y-4">
            <p className="font-bold text-zinc-700">Write a Review</p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <button
                  key={i}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setReviewRating(i)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={`w-7 h-7 ${i <= (hoverRating || reviewRating) ? 'fill-accent-orange text-accent-orange' : 'text-zinc-300'}`} />
                </button>
              ))}
            </div>
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/20 resize-none"
            />
            {reviewError && <p className="text-xs text-red-500">{reviewError}</p>}
            <button
              onClick={handleSubmitReview}
              disabled={reviewLoading}
              className="btn-primary px-6 py-2 text-sm disabled:opacity-50"
            >
              {reviewLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 text-emerald-700 rounded-2xl px-5 py-4 text-sm font-medium">
            ✅ You've already reviewed this product. Thank you!
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-zinc-400 text-sm">No reviews yet — be the first!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-white rounded-2xl p-5 border border-zinc-100 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-primary-green">{review.user.name}</p>
                  <p className="text-xs text-zinc-400">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex text-accent-orange">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'fill-current' : 'text-zinc-300'}`} />
                  ))}
                </div>
                {review.comment && <p className="text-sm text-zinc-600 leading-relaxed">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}