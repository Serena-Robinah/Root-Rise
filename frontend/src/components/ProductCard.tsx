import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import type { Product } from '@shared/types';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { motion } from 'motion/react';
import AuthModal from './AuthModal';
import { API_BASE_URL } from '../config';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);

  const availableSizes: string[] = (product as any).sizes?.length
    ? (product as any).sizes
    : SIZES;

  const imageUrl = product.image_url?.startsWith('http')
    ? product.image_url
    : `${API_BASE_URL}${product.image_url}`;

  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    if (!user.email_verified) { alert('Please verify your email before adding to cart.'); return; }
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="group flex flex-col"
      >
        {/* Image block — aspect-[4/5] instead of [3/4] = shorter cards */}
        <div
          className="relative overflow-hidden rounded-xl cursor-pointer aspect-[4/5]"
          style={{ backgroundColor: '#f0f0f0' }}
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          {/* Wishlist */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center transition-transform hover:scale-110 z-10"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
          </button>

          {product.stock > 0 && product.stock < 5 && (
            <span className="absolute top-2 left-2 z-10 bg-accent-orange text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 left-2 z-10 bg-zinc-800 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
              Sold Out
            </span>
          )}

          {/* Quick-add slides up on hover */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <div className="bg-white/95 backdrop-blur-sm px-2.5 pt-2.5 pb-2.5 space-y-1.5">
              <div className="flex gap-1 justify-center flex-wrap">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedSize(size); setSizeError(false); }}
                    className={`w-7 h-7 rounded-lg text-[10px] font-black border-2 transition-all ${
                      selectedSize === size
                        ? 'bg-primary-green text-white border-primary-green'
                        : 'bg-white text-zinc-500 border-zinc-200 hover:border-primary-green'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && <p className="text-[9px] text-red-500 text-center">Pick a size first</p>}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                disabled={!inStock}
                className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-black transition-all ${
                  added
                    ? 'bg-primary-green text-white'
                    : inStock
                    ? 'bg-zinc-900 text-white hover:bg-primary-green'
                    : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-3 h-3" />
                {added ? '✓ Added' : inStock ? 'Add to Cart' : 'Sold Out'}
              </button>
            </div>
          </div>
        </div>

        {/* Info below image — compact */}
        <div className="pt-2 px-0.5">
          <Link to={`/product/${product.id}`}>
            <p className="text-xs font-bold text-zinc-800 hover:text-primary-green transition-colors line-clamp-1">
              {product.name}
            </p>
          </Link>
          <p className="text-xs font-black text-primary-green mt-0.5">
            UGX {product.price.toLocaleString()}
          </p>
        </div>
      </motion.div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}