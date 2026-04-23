import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '@shared/types';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { motion } from 'motion/react';
import AuthModal from './AuthModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card group"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image_url?.startsWith('http') ? product.image_url : `http://localhost:3000${product.image_url}`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
          <Link
            to={`/product/${product.id}`}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-green hover:bg-primary-green hover:text-white transition-all shadow-lg"
          >
            <Eye className="w-6 h-6" />
          </Link>
          <button
            onClick={() => {
              if (!user) { setIsAuthModalOpen(true); return; }
              if (!user.email_verified) { alert('Please verify your email before adding to cart.'); return; }
              addItem(product);
            }}
            className="w-12 h-12 bg-accent-orange rounded-full flex items-center justify-center text-white hover:scale-110 transition-all shadow-lg"
          >
            <ShoppingCart className="w-6 h-6" />
          </button>
        </div>
        {product.stock < 5 && product.stock > 0 && (
          <span className="absolute top-4 left-4 bg-accent-orange text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-4 left-4 bg-zinc-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Out of Stock
          </span>
        )}
      </div>

      <div className="p-4 space-y-1">
        <div className="flex justify-between items-start">
          <Link to={`/product/${product.id}`} className="font-display font-bold text-lg text-primary-green hover:text-accent-orange transition-colors">
            {product.name}
          </Link>
          <span className="font-bold text-primary-green">UGX {product.price.toLocaleString()}</span>
        </div>
        <p className="text-zinc-500 text-sm line-clamp-1">{product.description}</p>
        <div className="flex items-center space-x-2 pt-2">
          <span className="text-[10px] font-bold bg-soft-cream text-primary-green px-2 py-0.5 rounded uppercase">{product.age_group} yrs</span>
          <span className="text-[10px] font-bold bg-soft-cream text-primary-green px-2 py-0.5 rounded uppercase">{product.gender}</span>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </motion.div>
  );
}
