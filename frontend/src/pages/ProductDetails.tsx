import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCcw, Star, Heart, Tag, Users } from 'lucide-react';
import type { Product } from '@shared/types';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { motion } from 'motion/react';
import AuthModal from '../components/AuthModal';
import ProductCard from '../components/ProductCard';
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
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  React.useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) return;
        const data = await productService.getById(parseInt(id));
        setProduct(data);
        if (data.age_group && data.category) {
          fetch(`/api/products/${id}/related?age_group=${encodeURIComponent(data.age_group)}&category=${encodeURIComponent(data.category)}`)
            .then(res => res.json()).then(setRelatedProducts).catch(() => {});
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  React.useEffect(() => {
    if (!id) return;
    productService.getLikes(parseInt(id)).then(d => { setLikeCount(d.count); setLiked(d.liked); }).catch(() => {});
    productService.getReviews(parseInt(id)).then(d => { setReviews(d.reviews); setAvgRating(d.avgRating); setHasReviewed(d.hasReviewed); }).catch(() => {});
  }, [id]);

  const handleToggleLike = async () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const result = await productService.toggleLike(parseInt(id!));
      setLiked(result.liked); setLikeCount(result.count);
    } catch { } finally { setLikeLoading(false); }
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
    setReviewLoading(true); setReviewError(null);
    try {
      const result = await productService.submitReview(parseInt(id!), reviewRating, reviewComment);
      setReviews(result.reviews); setAvgRating(result.avgRating);
      setHasReviewed(true); setReviewRating(0); setReviewComment('');
    } catch (err: any) {
      setReviewError(err?.message || 'Failed to submit review.');
    } finally { setReviewLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Product not found</div>;

  const availableSizes: string[] = (product as any).sizes?.length ? (product as any).sizes : SIZES;
  const displayRating = avgRating > 0 ? avgRating : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">

      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-zinc-400 hover:text-primary-green transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        {/* Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="aspect-[4/5] rounded-2xl overflow-hidden relative" style={{ backgroundColor: '#f0f0f0' }}>
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
            <button
              onClick={handleToggleLike}
              className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${liked ? 'bg-red-500 text-white' : 'bg-white text-zinc-400 hover:text-red-400'}`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5">

          {/* Category + rating */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-soft-cream text-primary-green px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{product.category}</span>
            <div className="flex text-accent-orange">
              {[1,2,3,4,5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(displayRating) ? 'fill-current' : 'text-zinc-300'}`} />)}
            </div>
            <span className="text-xs text-zinc-400">{reviews.length > 0 ? `(${reviews.length} review${reviews.length !== 1 ? 's' : ''})` : 'No reviews yet'}</span>
          </div>

          {/* Name */}
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <p className="text-xl font-black text-primary-green">{formatUGX(product.price)}</p>
              <button onClick={handleToggleLike} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-red-400 transition-colors">
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
              </button>
            </div>
          </div>

          {/* Modern description block */}
          {product.description && (
            <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
              <div className="bg-zinc-50 border-b border-zinc-100 px-4 py-2 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-primary-green" />
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">About this piece</p>
              </div>
              <p className="px-4 py-3 text-sm text-zinc-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Age + Gender as inline tags */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">{product.age_group} Years</span>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl">
              <span className="text-xs font-bold">{product.gender}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${product.stock > 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </div>
          </div>

          {/* Size picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-zinc-700">Select Size</p>
              {selectedSize && <span className="text-xs font-black text-primary-green bg-soft-cream px-2 py-0.5 rounded-full">Selected: {selectedSize}</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  className={`w-11 h-11 rounded-xl border-2 text-sm font-bold transition-all ${
                    selectedSize === size
                      ? 'border-primary-green bg-primary-green text-white shadow-md'
                      : 'border-zinc-200 text-zinc-500 hover:border-primary-green hover:text-primary-green bg-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && <p className="text-xs text-red-500 flex items-center gap-1">⚠ Please select a size first.</p>}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-accent-orange text-white font-black py-3.5 rounded-2xl text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-orange/90 active:scale-[0.98] transition-all shadow-lg shadow-accent-orange/20"
          >
            <ShoppingCart className="w-5 h-5" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {/* Trust badges */}
          <div className="grid grid-cols-3 divide-x divide-zinc-100 border border-zinc-100 rounded-2xl overflow-hidden bg-white">
            {[
              { icon: ShieldCheck, label: '100% Safe' },
              { icon: Truck, label: 'Fast Ship' },
              { icon: RefreshCcw, label: '14 Day Return' },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-1 py-3">
                <b.icon className="w-5 h-5 text-primary-green" />
                <p className="text-[9px] font-bold text-zinc-400 uppercase">{b.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reviews */}
      <div className="space-y-5 border-t pt-8">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-display font-bold">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex text-accent-orange">
                {[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= Math.round(avgRating) ? 'fill-current' : 'text-zinc-300'}`} />)}
              </div>
              <span className="text-xs text-zinc-400">{avgRating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {!hasReviewed ? (
          <div className="bg-white rounded-2xl p-5 border border-zinc-100 space-y-3">
            <p className="font-bold text-zinc-700 text-sm">Write a Review</p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <button key={i} onMouseEnter={() => setHoverRating(i)} onMouseLeave={() => setHoverRating(0)} onClick={() => setReviewRating(i)} className="transition-transform hover:scale-110">
                  <Star className={`w-6 h-6 ${i <= (hoverRating || reviewRating) ? 'fill-accent-orange text-accent-orange' : 'text-zinc-200'}`} />
                </button>
              ))}
            </div>
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green/20 resize-none bg-zinc-50"
            />
            {reviewError && <p className="text-xs text-red-500">{reviewError}</p>}
            <button onClick={handleSubmitReview} disabled={reviewLoading} className="bg-primary-green text-white font-bold px-5 py-2 rounded-xl text-sm disabled:opacity-50 hover:bg-primary-green/90 transition-colors">
              {reviewLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 text-emerald-700 rounded-2xl px-4 py-3 text-sm font-medium">
            ✅ You've already reviewed this product. Thank you!
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-zinc-400 text-sm">No reviews yet — be the first!</p>
        ) : (
          <div className="space-y-3">
            {reviews.map(review => (
              <div key={review.id} className="bg-white rounded-2xl p-4 border border-zinc-100">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-bold text-sm text-primary-green">{review.user.name}</p>
                  <p className="text-xs text-zinc-400">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex text-accent-orange mb-1.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? 'fill-current' : 'text-zinc-200'}`} />)}
                </div>
                {review.comment && <p className="text-sm text-zinc-600">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Complete the Look */}
      {relatedProducts.length > 0 && (
        <div className="space-y-5 border-t pt-8">
          <div>
            <p className="text-accent-orange text-xs font-black uppercase tracking-widest">Style It Up</p>
            <h2 className="text-lg font-display font-bold">Complete the Look</h2>
            <p className="text-zinc-400 text-xs mt-0.5">Pair with these pieces from the same age group.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}