import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
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
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!user.email_verified) {
      alert('Please verify your email before adding to cart.');
      return;
    }

    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    setSizeError(false);

    addItem(product, selectedSize);

    // ✅ feedback to user
    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  const availableSizes: string[] = (product as any).sizes?.length
    ? (product as any).sizes
    : SIZES;

  const imageUrl = product.image_url?.startsWith('http')
    ? product.image_url
    : `${API_BASE_URL}${product.image_url}`;

  const inStock = product.stock > 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <div className="card group h-full flex flex-col bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">

          {/* Image */}
          <Link to={`/product/${product.id}`} className="block">
            <div className="relative aspect-[4/5] overflow-hidden bg-soft-cream flex-shrink-0">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <div className="w-11 h-11 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-primary-green hover:bg-primary-green hover:text-white transition-all shadow-lg">
                  <Eye className="w-5 h-5 md:w-6 h-6" />
                </div>
              </div>

              <div className="absolute top-3 left-3 z-10">
                {product.stock === 0 && (
                  <span className="inline-block bg-red-500 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                    Out of Stock
                  </span>
                )}

                {product.stock < 5 && product.stock > 0 && (
                  <span className="inline-block bg-accent-orange text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                    Only {product.stock} left
                  </span>
                )}

                {product.stock >= 5 && (
                  <span className="inline-block bg-primary-green text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                    In Stock
                  </span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsWishlisted(!isWishlisted);
                }}
                className="absolute top-3 right-3 z-10 w-10 h-10 md:w-11 md:h-11 bg-white rounded-full shadow-md hover:bg-primary-green hover:text-white transition-all flex items-center justify-center"
              >
                <Heart
                  className={`w-4 h-4 md:w-5 h-5 ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-zinc-400'
                  }`}
                />
              </button>
            </div>
          </Link>

          {/* Content */}
          <div className="p-3 md:p-4 space-y-3 flex-grow flex flex-col justify-between">

            <div>
              <Link to={`/product/${product.id}`}>
                <h3 className="font-bold text-sm md:text-base text-primary-green">
                  {product.name}
                </h3>
              </Link>

              <p className="text-zinc-500 text-xs md:text-sm line-clamp-1">
                {product.description}
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-100">
              <p className="font-bold text-sm md:text-base text-primary-green">
                UGX {product.price.toLocaleString()}
              </p>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex flex-wrap gap-1">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                      selectedSize === size
                        ? 'bg-primary-green text-white'
                        : 'border-zinc-200 text-zinc-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {sizeError && (
                <p className="text-[10px] text-red-500 mt-1">
                  Please select a size
                </p>
              )}
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                inStock
                  ? addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-accent-orange text-white hover:bg-accent-orange/90'
                  : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {!inStock
                  ? 'Out of Stock'
                  : addedToCart
                  ? 'Added ✓'
                  : 'Add to Cart'}
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}