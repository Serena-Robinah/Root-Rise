import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-8">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-zinc-300 shadow-sm">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-bold">Your cart is empty</h2>
          <p className="text-zinc-500">Looks like you haven't added anything to your cart yet.</p>
        </div>
        <Link to="/shop" className="btn-primary inline-block">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 md:mb-12">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center gap-6"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                
                <div className="flex-grow space-y-1 text-center sm:text-left">
                  <h3 className="font-display font-bold text-xl text-primary-green">{item.name}</h3>
                  <p className="text-sm text-zinc-500">{item.category} • {item.age_group} Years</p>
                  <p className="font-bold text-primary-green">UGX {item.price.toLocaleString()}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-soft-cream rounded-xl p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:text-accent-orange transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-primary-green">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:text-accent-orange transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-3 text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6 sticky top-24">
            <h3 className="text-2xl font-display font-bold">Order Summary</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-800">UGX {getTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Shipping</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="pt-4 border-t flex justify-between items-end">
                <span className="font-bold text-lg">Total</span>
                <span className="text-2xl md:text-3xl font-bold text-primary-green">UGX {getTotal().toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full btn-accent py-4 text-lg flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <p className="text-[10px] text-zinc-400 text-center uppercase font-bold tracking-widest">
              Secure Checkout • No Payment Needed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
