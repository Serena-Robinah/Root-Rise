import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck, MapPin, Phone, User, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { orderService } from '../services';
import AuthModal from '../components/AuthModal';
import { motion } from 'motion/react';
const checkoutSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    address: z.string().min(10, 'Full delivery address is required'),
});
export default function Checkout() {
    const navigate = useNavigate();
    const { items, getTotal, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    React.useEffect(() => {
        if (items.length === 0 && !isSuccess) {
            navigate('/cart');
        }
        if (!user) {
            setIsAuthModalOpen(true);
        }
    }, [user, items.length, navigate, isSuccess]);
    const onSubmit = async (data) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        setLoading(true);
        try {
            await orderService.createOrder({
                userId: user.id,
                items,
                totalAmount: getTotal(),
                shippingInfo: data,
            });
            setIsSuccess(true);
            clearCart();
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    if (isSuccess) {
        return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-24 text-center space-y-8", children: [_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, className: "w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm", children: _jsx(CheckCircle2, { className: "w-12 h-12" }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-4xl font-display font-bold text-primary-green", children: "Order Placed Successfully!" }), _jsx("p", { className: "text-zinc-500", children: "Thank you for shopping with Root & Rise Kids. Your order is being processed." })] }), _jsxs("div", { className: "flex justify-center gap-4", children: [_jsx("button", { onClick: () => navigate('/'), className: "btn-primary", children: "Return Home" }), _jsx("button", { onClick: () => navigate('/shop'), className: "btn-accent", children: "Continue Shopping" })] })] }));
    }
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [_jsx("h1", { className: "text-4xl font-display font-bold mb-12", children: "Checkout" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12", children: [_jsx("div", { className: "space-y-8", children: _jsxs("div", { className: "bg-white p-8 rounded-3xl shadow-sm space-y-8", children: [_jsxs("div", { className: "flex items-center space-x-3 text-primary-green", children: [_jsx(Truck, { className: "w-6 h-6" }), _jsx("h2", { className: "text-2xl font-display font-bold", children: "Shipping Information" })] }), _jsxs("form", { id: "checkout-form", onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-bold text-zinc-700 ml-1", children: "Full Name" }), _jsxs("div", { className: "relative", children: [_jsx(User, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" }), _jsx("input", { ...register('fullName'), type: "text", placeholder: "Jane Doe", className: "w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-green/20" })] }), errors.fullName && _jsx("p", { className: "text-xs text-red-500 ml-1", children: errors.fullName.message })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-bold text-zinc-700 ml-1", children: "Phone Number" }), _jsxs("div", { className: "relative", children: [_jsx(Phone, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" }), _jsx("input", { ...register('phone'), type: "tel", placeholder: "+1 (555) 000-0000", className: "w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-green/20" })] }), errors.phone && _jsx("p", { className: "text-xs text-red-500 ml-1", children: errors.phone.message })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-bold text-zinc-700 ml-1", children: "Delivery Address" }), _jsxs("div", { className: "relative", children: [_jsx(MapPin, { className: "absolute left-4 top-4 w-5 h-5 text-zinc-400" }), _jsx("textarea", { ...register('address'), placeholder: "Street address, City, State, ZIP", rows: 4, className: "w-full pl-12 pr-4 py-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-green/20" })] }), errors.address && _jsx("p", { className: "text-xs text-red-500 ml-1", children: errors.address.message })] })] })] }) }), _jsx("div", { className: "space-y-8", children: _jsxs("div", { className: "bg-white p-8 rounded-3xl shadow-sm space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-3 text-primary-green", children: [_jsx(ShoppingBag, { className: "w-6 h-6" }), _jsx("h2", { className: "text-2xl font-display font-bold", children: "Order Summary" })] }), _jsx("div", { className: "max-h-64 overflow-y-auto space-y-4 pr-2", children: items.map(item => (_jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("img", { src: item.image_url, alt: "", className: "w-12 h-12 rounded-lg object-cover", referrerPolicy: "no-referrer" }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-sm text-primary-green line-clamp-1", children: item.name }), _jsxs("p", { className: "text-xs text-zinc-400", children: ["Qty: ", item.quantity] })] })] }), _jsxs("p", { className: "font-bold text-sm text-primary-green", children: ["$", (item.price * item.quantity).toFixed(2)] })] }, item.id))) }), _jsxs("div", { className: "pt-6 border-t space-y-4", children: [_jsxs("div", { className: "flex justify-between text-zinc-500", children: [_jsx("span", { children: "Subtotal" }), _jsxs("span", { className: "font-bold text-zinc-800", children: ["$", getTotal().toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between text-zinc-500", children: [_jsx("span", { children: "Shipping" }), _jsx("span", { className: "font-bold text-emerald-600", children: "FREE" })] }), _jsxs("div", { className: "pt-4 border-t flex justify-between items-end", children: [_jsx("span", { className: "font-bold text-lg", children: "Total" }), _jsxs("span", { className: "text-3xl font-bold text-primary-green", children: ["$", getTotal().toFixed(2)] })] })] }), _jsx("button", { form: "checkout-form", type: "submit", disabled: loading, className: "w-full btn-accent py-5 text-xl disabled:opacity-50", children: loading ? 'Processing...' : 'Place Order' }), _jsx("p", { className: "text-xs text-zinc-400 text-center", children: "By placing your order, you agree to our Terms of Service and Privacy Policy." })] }) })] }), _jsx(AuthModal, { isOpen: isAuthModalOpen, onClose: () => {
                    setIsAuthModalOpen(false);
                    if (!user)
                        navigate('/cart');
                } })] }));
}
//# sourceMappingURL=Checkout.js.map