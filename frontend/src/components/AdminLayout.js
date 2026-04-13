import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X, ChevronRight, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'motion/react';
export default function AdminLayout({ children }) {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    React.useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [user, navigate]);
    if (!user || user.role !== 'admin')
        return null;
    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Products', path: '/admin/products', icon: Package },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-zinc-50 flex", children: [_jsxs("aside", { className: `bg-primary-green text-white transition-all duration-300 flex flex-col z-50 ${isSidebarOpen ? 'w-64' : 'w-20'} fixed inset-y-0 left-0 md:relative`, children: [_jsxs("div", { className: "p-6 flex items-center justify-between", children: [_jsxs(Link, { to: "/", className: `flex items-center space-x-2 ${!isSidebarOpen && 'hidden'}`, children: [_jsx("div", { className: "w-8 h-8 bg-white rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-primary-green font-bold text-lg", children: "R" }) }), _jsxs("span", { className: "text-xl font-display font-bold", children: ["Admin ", _jsx("span", { className: "text-accent-orange", children: "Panel" })] })] }), _jsx("button", { onClick: () => setIsSidebarOpen(!isSidebarOpen), className: "p-2 hover:bg-white/10 rounded-lg transition-colors", children: isSidebarOpen ? _jsx(X, { className: "w-5 h-5 md:hidden" }) : _jsx(Menu, { className: "w-5 h-5" }) })] }), _jsx("nav", { className: "flex-grow px-4 py-4 space-y-2", children: menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (_jsxs(Link, { to: item.path, className: `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-accent-orange text-white shadow-lg'
                                    : 'text-soft-cream/70 hover:bg-white/10 hover:text-white'}`, children: [_jsx(item.icon, { className: "w-5 h-5 shrink-0" }), isSidebarOpen && _jsx("span", { className: "font-medium", children: item.name }), isActive && isSidebarOpen && _jsx(ChevronRight, { className: "w-4 h-4 ml-auto" })] }, item.name));
                        }) }), _jsx("div", { className: "p-4 border-t border-white/10", children: _jsxs("button", { onClick: () => { logout(); navigate('/login'); }, className: `flex items-center space-x-3 px-4 py-3 rounded-xl text-soft-cream/70 hover:bg-red-500/20 hover:text-red-400 transition-all w-full`, children: [_jsx(LogOut, { className: "w-5 h-5 shrink-0" }), isSidebarOpen && _jsx("span", { className: "font-medium", children: "Logout" })] }) })] }), _jsxs("div", { className: "flex-grow flex flex-col min-w-0", children: [_jsxs("header", { className: "h-20 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-40", children: [_jsx("h2", { className: "text-xl font-display font-bold text-primary-green", children: menuItems.find(i => i.path === location.pathname)?.name || 'Admin' }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "text-right hidden sm:block", children: [_jsx("p", { className: "text-sm font-bold text-zinc-800", children: user.name }), _jsx("p", { className: "text-xs text-zinc-400 uppercase tracking-widest font-bold", children: "Administrator" })] }), _jsx("div", { className: "w-10 h-10 bg-soft-cream rounded-full flex items-center justify-center text-primary-green", children: _jsx(UserIcon, { className: "w-6 h-6" }) })] })] }), _jsx("main", { className: "p-8 overflow-y-auto", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: children }, location.pathname) }) })] })] }));
}
//# sourceMappingURL=AdminLayout.js.map