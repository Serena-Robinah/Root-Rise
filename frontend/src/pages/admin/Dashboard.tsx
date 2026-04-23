import React from 'react';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Clock
} from 'lucide-react';
import {
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import { useAuthStore } from '../../store/authStore';
import { adminService } from '../../services';
import type { Order } from '@shared/types';

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<any>(null);
  const [recentOrders, setRecentOrders] = React.useState<Order[]>([]);
  const { token } = useAuthStore();

  React.useEffect(() => {
    adminService.getStats()
      .then(setStats)
      .catch(err => console.error('Failed to fetch stats:', err));

    adminService.getOrders()
      .then(orders => setRecentOrders(orders.slice(0, 5)))
      .catch(err => console.error('Failed to fetch orders:', err));
  }, [token]);

  if (!stats) return <div className="p-8 text-center text-zinc-400 font-bold">Loading Dashboard...</div>;

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Low Stock Items', value: stats.lowStockItems, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const getStatusColor = (status: string): 'warning' | 'info' | 'secondary' | 'success' | 'error' | 'default' => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Confirmed': return 'info';
      case 'Out for Delivery': return 'secondary';
      case 'Delivered': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-primary-green">Dashboard Overview</h1>
          <p className="text-zinc-500">Welcome back, here's what's happening today.</p>
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
          <h3 className="text-xl font-display font-bold text-primary-green">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="text-zinc-400 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-accent-orange rounded-full shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-zinc-800">#ORD-{order.id} — {order.full_name}</p>
                      <p className="text-xs text-zinc-400">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-primary-green">UGX {order.total_amount.toLocaleString()}</span>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                      className="font-bold uppercase text-[10px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
          <h3 className="text-xl font-display font-bold text-primary-green">Inventory Status</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-600">Stock Health</span>
              <span className={`text-sm font-bold ${stats.lowStockItems > 0 ? 'text-orange-500' : 'text-emerald-600'}`}>
                {stats.lowStockItems > 0 ? `${stats.lowStockItems} items low` : 'Good'}
              </span>
            </div>
            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${stats.lowStockItems > 0 ? 'bg-orange-400' : 'bg-emerald-500'}`}
                style={{ width: `${Math.max(10, 100 - (stats.lowStockItems / stats.totalProducts) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-zinc-400">
              {stats.totalProducts - stats.lowStockItems} of {stats.totalProducts} products are in healthy stock levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
