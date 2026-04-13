import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCcw, Star } from 'lucide-react';
import { productService } from '../services';
import { useCartStore } from '../store/cartStore';
import { motion } from 'motion/react';
export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const { addItem } = useCartStore();
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
    if (loading)
        return _jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Loading..." });
    if (!product)
        return _jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Product not found" });
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12", children: [_jsxs("button", { onClick: () => navigate(-1), className: "flex items-center space-x-2 text-zinc-500 hover:text-primary-green font-bold transition-colors", children: [_jsx(ArrowLeft, { className: "w-5 h-5" }), _jsx("span", { children: "Back to Shop" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, className: "space-y-4", children: [_jsx("div", { className: "aspect-[4/5] rounded-3xl overflow-hidden shadow-xl", children: _jsx("img", { src: product.image_url, alt: product.name, className: "w-full h-full object-cover", referrerPolicy: "no-referrer" }) }), _jsx("div", { className: "grid grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => (_jsx("div", { className: "aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-accent-orange cursor-pointer transition-all", children: _jsx("img", { src: `${product.image_url}?v=${i}`, alt: "", className: "w-full h-full object-cover", referrerPolicy: "no-referrer" }) }, i))) })] }), _jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "space-y-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "bg-soft-cream text-primary-green px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", children: product.category }), _jsx("div", { className: "flex text-accent-orange", children: [1, 2, 3, 4, 5].map(i => _jsx(Star, { className: "w-4 h-4 fill-current" }, i)) }), _jsx("span", { className: "text-xs text-zinc-400 font-medium", children: "(48 Reviews)" })] }), _jsx("h1", { className: "text-5xl font-display font-bold", children: product.name }), _jsxs("p", { className: "text-3xl font-bold text-primary-green", children: ["$", product.price.toFixed(2)] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-zinc-600 leading-relaxed text-lg", children: product.description }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-2xl border border-zinc-100", children: [_jsx("p", { className: "text-xs text-zinc-400 font-bold uppercase", children: "Age Group" }), _jsxs("p", { className: "font-bold text-primary-green", children: [product.age_group, " Years"] })] }), _jsxs("div", { className: "bg-white p-4 rounded-2xl border border-zinc-100", children: [_jsx("p", { className: "text-xs text-zinc-400 font-bold uppercase", children: "Gender" }), _jsx("p", { className: "font-bold text-primary-green", children: product.gender })] })] })] }), _jsxs("div", { className: "space-y-6 pt-4 border-t", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-sm font-bold text-zinc-800", children: "Availability" }), _jsx("p", { className: `text-sm ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'} font-medium`, children: product.stock > 0 ? `${product.stock} items in stock` : 'Out of Stock' })] }) }), _jsxs("button", { onClick: () => addItem(product), disabled: product.stock === 0, className: "w-full btn-accent py-5 text-xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(ShoppingCart, { className: "w-6 h-6" }), _jsx("span", { children: "Add to Cart" })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4 pt-8", children: [_jsxs("div", { className: "text-center space-y-2", children: [_jsx(ShieldCheck, { className: "w-8 h-8 text-primary-green mx-auto" }), _jsx("p", { className: "text-[10px] font-bold text-zinc-500 uppercase", children: "100% Safe" })] }), _jsxs("div", { className: "text-center space-y-2", children: [_jsx(Truck, { className: "w-8 h-8 text-primary-green mx-auto" }), _jsx("p", { className: "text-[10px] font-bold text-zinc-500 uppercase", children: "Fast Ship" })] }), _jsxs("div", { className: "text-center space-y-2", children: [_jsx(RefreshCcw, { className: "w-8 h-8 text-primary-green mx-auto" }), _jsx("p", { className: "text-[10px] font-bold text-zinc-500 uppercase", children: "14 Day Return" })] })] })] })] })] }));
}
//# sourceMappingURL=ProductDetails.js.map