import React from 'react';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  ChevronRight,
  Clock
} from 'lucide-react';
import {
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { useAuthStore } from '../../store/authStore';
import { adminService } from '../../services';

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<any>(null);
  const { token } = useAuthStore();

  React.useEffect(() => {
    adminService.getStats()
      .then(setStats)
      .catch(err => console.error('Failed to fetch stats:', err));
  }, [token]);

  if (!stats) return <div className="p-8 text-center text-zinc-400 font-bold">Loading Dashboard...</div>;

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Low Stock Items', value: stats.lowStockItems, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-primary-green">Dashboard Overview</h1>
          <p className="text-zinc-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Revenue</p>
            <p className="text-xl font-bold text-primary-green">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <Grid container spacing={4}>
        {cards.map((card, i) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
            <Card className="rounded-3xl shadow-sm border-none hover:shadow-md transition-shadow">
              <CardContent className="p-8 space-y-4">
                <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center`}>
                  <card.icon className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{card.label}</p>
                  <p className={`text-4xl font-bold ${card.color}`}>{card.value}</p>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
          <h3 className="text-xl font-display font-bold text-primary-green">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-accent-orange rounded-full" />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-zinc-800">New order #ORD-{100 + i} received</p>
                  <p className="text-xs text-zinc-400">2 hours ago</p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
          <h3 className="text-xl font-display font-bold text-primary-green">Inventory Status</h3>
          <div className="space-y-6">
             <div className="flex items-center justify-between">
               <span className="text-sm font-medium text-zinc-600">Stock Health</span>
               <span className="text-sm font-bold text-emerald-600">Good</span>
             </div>
             <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
               <div className="bg-emerald-500 h-full w-[85%]" />
             </div>
             <p className="text-xs text-zinc-400">85% of your catalog is in healthy stock levels.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
