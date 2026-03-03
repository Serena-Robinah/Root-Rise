import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck, MapPin, Phone, User, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import AuthModal from '../components/AuthModal';
import { motion } from 'motion/react';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(10, 'Full delivery address is required'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>();

  React.useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      navigate('/cart');
    }
    if (!user) {
      setIsAuthModalOpen(true);
    }
  }, [user, items.length, navigate, isSuccess]);

  const onSubmit = async (data: CheckoutForm) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items,
          totalAmount: getTotal(),
          shippingInfo: data,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        clearCart();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-bold text-primary-green">Order Placed Successfully!</h2>
          <p className="text-zinc-500">Thank you for shopping with Root & Rise Kids. Your order is being processed.</p>
        </div>
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/')} className="btn-primary">Return Home</button>
          <button onClick={() => navigate('/shop')} className="btn-accent">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-display font-bold mb-12">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Form */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm space-y-8">
            <div className="flex items-center space-x-3 text-primary-green">
              <Truck className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold">Shipping Information</h2>
            </div>

            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input 
                    {...register('fullName')}
                    type="text" 
                    placeholder="Jane Doe"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-green/20"
                  />
                </div>
                {errors.fullName && <p className="text-xs text-red-500 ml-1">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input 
                    {...register('phone')}
                    type="tel" 
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-green/20"
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 ml-1">Delivery Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-zinc-400" />
                  <textarea 
                    {...register('address')}
                    placeholder="Street address, City, State, ZIP"
                    rows={4}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-green/20"
                  />
                </div>
                {errors.address && <p className="text-xs text-red-500 ml-1">{errors.address.message}</p>}
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center space-x-3 text-primary-green">
              <ShoppingBag className="w-6 h-6" />
              <h2 className="text-2xl font-display font-bold">Order Summary</h2>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={item.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold text-sm text-primary-green line-clamp-1">{item.name}</p>
                      <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-primary-green">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t space-y-4">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-800">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Shipping</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="pt-4 border-t flex justify-between items-end">
                <span className="font-bold text-lg">Total</span>
                <span className="text-3xl font-bold text-primary-green">${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <button 
              form="checkout-form"
              type="submit"
              disabled={loading}
              className="w-full btn-accent py-5 text-xl disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
            
            <p className="text-xs text-zinc-400 text-center">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => {
          setIsAuthModalOpen(false);
          if (!user) navigate('/cart');
        }} 
      />
    </div>
  );
}
