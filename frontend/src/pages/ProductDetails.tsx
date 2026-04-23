import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCcw, Star } from 'lucide-react';
import { productService } from '../services';
import { useCartStore } from '../store/cartStore';
import { motion } from 'motion/react';
import type { Product } from '@shared/types';
import { useAuthStore } from '@/store/authStore';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  React.useEffect(() => {
    productService.getById(Number(id))
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch product:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-zinc-500 hover:text-primary-green font-bold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Shop</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-accent-orange cursor-pointer transition-all">
                <img src={`${product.image_url}?v=${i}`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="bg-soft-cream text-primary-green px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{product.category}</span>
              <div className="flex text-accent-orange">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-xs text-zinc-400 font-medium">(48 Reviews)</span>
            </div>
            <h1 className="text-5xl font-display font-bold">{product.name}</h1>
            <p className="text-3xl font-bold text-primary-green">UGX {product.price.toLocaleString()}</p>
          </div>

          <div className="space-y-4">
            <p className="text-zinc-600 leading-relaxed text-lg">{product.description}</p>
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
          </div>

          <div className="space-y-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-zinc-800">Availability</p>
                <p className={`text-sm ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'} font-medium`}>
                  {product.stock > 0 ? `${product.stock} items in stock` : 'Out of Stock'}
                </p>
              </div>
            </div>

            <button 
  onClick={() => {
    if (!user) return;
    if (!user.email_verified) { alert('Please verify your email before adding to cart.'); return; }
    addItem(product);
  }}
  disabled={product.stock === 0}
  className="w-full btn-accent py-5 text-xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
>
              <ShoppingCart className="w-6 h-6" />
              <span>Add to Cart</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-8">
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
    </div>
  );
}
