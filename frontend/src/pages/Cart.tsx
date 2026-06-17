import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-zinc-300 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-bold">Your cart is empty</h2>
          <p className="text-zinc-400 text-sm">You haven't added anything yet.</p>
        </div>
        <Link to="/shop" className="btn-primary inline-block">Start Shopping</Link>
      </div>
    );
  }

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-bold">Shopping Cart</h1>
        <p className="text-zinc-400 text-sm mt-0.5">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={`${item.id}-${(item as any).selectedSize}`}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 cursor-pointer"
                    style={{ backgroundColor: '#f0f0f0' }}
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className="font-bold text-sm md:text-base text-primary-green leading-tight cursor-pointer hover:text-accent-orange transition-colors line-clamp-2"
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          {item.name}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">{item.category} · {item.age_group} yrs</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 p-1.5 text-zinc-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Size badge */}
                    {(item as any).selectedSize && (
                      <div className="flex items-center gap-1 mt-2">
                        <Tag className="w-3 h-3 text-primary-green" />
                        <span className="text-[11px] font-black text-primary-green bg-soft-cream px-2 py-0.5 rounded-full">
                          Size: {(item as any).selectedSize}
                        </span>
                      </div>
                    )}

                    {/* Price + quantity */}
                    <div className="flex items-center justify-between mt-3">
                      <p className="font-black text-sm text-primary-green">
                        UGX {(item.price * item.quantity).toLocaleString()}
                      </p>

                      <div className="flex items-center bg-zinc-100 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-accent-orange hover:bg-zinc-200 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-black text-primary-green">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-accent-orange hover:bg-zinc-200 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5 sticky top-24">
            <h3 className="text-lg font-display font-bold">Order Summary</h3>

            {/* Item list summary */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {items.map(item => (
                <div key={`${item.id}-${(item as any).selectedSize}`} className="flex items-center justify-between text-xs text-zinc-500">
                  <span className="line-clamp-1 flex-grow mr-2">
                    {item.name}
                    {(item as any).selectedSize && (
                      <span className="text-primary-green font-bold"> ({(item as any).selectedSize})</span>
                    )}
                    {' '}× {item.quantity}
                  </span>
                  <span className="font-bold text-zinc-700 shrink-0">UGX {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-100 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-800">UGX {getTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Shipping</span>
                <span className="font-black text-emerald-600">FREE</span>
              </div>
              <div className="pt-3 border-t border-zinc-100 flex justify-between items-center">
                <span className="font-black text-base">Total</span>
                <span className="text-xl font-black text-primary-green">UGX {getTotal().toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-accent-orange text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-accent-orange/90 active:scale-[0.98] transition-all shadow-lg shadow-accent-orange/20"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-zinc-400 text-center uppercase font-bold tracking-widest">
              Secure Checkout · No Payment Needed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}