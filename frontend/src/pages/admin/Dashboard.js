import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Package, ShoppingBag, AlertTriangle, DollarSign, ChevronRight, Clock } from 'lucide-react';
import { Card, CardContent, Grid, } from '@mui/material';
import { useAuthStore } from '../../store/authStore';
import { adminService } from '../../services';
export default function AdminDashboard() {
    const [stats, setStats] = React.useState(null);
    const { token } = useAuthStore();
    React.useEffect(() => {
        adminService.getStats()
            .then(setStats)
            .catch(err => console.error('Failed to fetch stats:', err));
    }, [token]);
    if (!stats)
        return _jsx("div", { className: "p-8 text-center text-zinc-400 font-bold", children: "Loading Dashboard..." });
    const cards = [
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Low Stock Items', value: stats.lowStockItems, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    ];
    return (_jsxs("div", { className: "space-y-12", children: [_jsxs("div", { className: "flex justify-between items-end", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h1", { className: "text-4xl font-display font-bold text-primary-green", children: "Dashboard Overview" }), _jsx("p", { className: "text-zinc-500", children: "Welcome back, here's what's happening today." })] }), _jsxs("div", { className: "bg-white px-6 py-3 rounded-2xl shadow-sm border flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600", children: _jsx(DollarSign, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-zinc-400 uppercase tracking-widest", children: "Total Revenue" }), _jsxs("p", { className: "text-xl font-bold text-primary-green", children: ["$", stats.totalRevenue.toFixed(2)] })] })] })] }), _jsx(Grid, { container: true, spacing: 4, children: cards.map((card, i) => (_jsx(Grid, { size: { xs: 12, sm: 6, lg: 3 }, children: _jsx(Card, { className: "rounded-3xl shadow-sm border-none hover:shadow-md transition-shadow", children: _jsxs(CardContent, { className: "p-8 space-y-4", children: [_jsx("div", { className: `w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center`, children: _jsx(card.icon, { className: "w-8 h-8" }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-sm font-bold text-zinc-400 uppercase tracking-widest", children: card.label }), _jsx("p", { className: `text-4xl font-bold ${card.color}`, children: card.value })] })] }) }) }, i))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white p-8 rounded-3xl shadow-sm space-y-6", children: [_jsx("h3", { className: "text-xl font-display font-bold text-primary-green", children: "Recent Activity" }), _jsx("div", { className: "space-y-6", children: [1, 2, 3].map(i => (_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "w-2 h-2 bg-accent-orange rounded-full" }), _jsxs("div", { className: "flex-grow", children: [_jsxs("p", { className: "text-sm font-medium text-zinc-800", children: ["New order #ORD-", 100 + i, " received"] }), _jsx("p", { className: "text-xs text-zinc-400", children: "2 hours ago" })] }), _jsx(ChevronRight, { className: "w-4 h-4 text-zinc-300" })] }, i))) })] }), _jsxs("div", { className: "bg-white p-8 rounded-3xl shadow-sm space-y-6", children: [_jsx("h3", { className: "text-xl font-display font-bold text-primary-green", children: "Inventory Status" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium text-zinc-600", children: "Stock Health" }), _jsx("span", { className: "text-sm font-bold text-emerald-600", children: "Good" })] }), _jsx("div", { className: "w-full bg-zinc-100 h-2 rounded-full overflow-hidden", children: _jsx("div", { className: "bg-emerald-500 h-full w-[85%]" }) }), _jsx("p", { className: "text-xs text-zinc-400", children: "85% of your catalog is in healthy stock levels." })] })] })] })] }));
}
//# sourceMappingURL=Dashboard.js.map