import React from 'react';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Clock,
  ArrowUpRight,
  ArrowDownRight
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
import { motion } from 'motion/react';

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

  if (!stats) {
    return (
      <div className="p-6 md:p-8 text-center">
        <div className="inline-block">
          <div className="w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-zinc-400 font-semibold mt-4 text-sm md:text-base">Loading Dashboard...</p>
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: '+12%',
      isPositive: true
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      trend: '+3%',
      isPositive: false
    },
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      trend: '+2',
      isPositive: true
    },
    {
      label: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      trend: stats.lowStockItems > 0 ? '⚠️ Action needed' : '✓ Healthy',
      isPositive: stats.lowStockItems === 0
    },
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6 md:space-y-12 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between md:items-end gap-4"
      >
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-2xl md:text-4xl font-display font-bold text-primary-green">
            Dashboard Overview
          </h1>
          <p className="text-xs md:text-base text-zinc-500">
            Welcome back, here's what's happening today.
          </p>
        </div>
      </motion.div>

      {/* Stats Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {cards.map((card, i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
              <motion.div variants={itemVariants}>
                <Card className="rounded-xl md:rounded-2xl lg:rounded-3xl shadow-sm border border-zinc-100 hover:shadow-md transition-all duration-300 h-full">
                  <CardContent className="p-4 md:p-6 lg:p-8 space-y-3 md:space-y-4 h-full flex flex-col justify-between">
                    {/* Icon & Trend */}
                    <div className="flex items-start justify-between">
                      <div className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 ${card.bg} ${card.color} rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <card.icon className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
                      </div>
                      <div className={`flex items-center space-x-1 text-xs md:text-sm font-semibold ${card.isPositive ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {typeof card.trend === 'string' && card.trend.includes('%') ? (
                          <>
                            {card.isPositive ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                          </>
                        ) : null}
                        <span>{card.trend}</span>
                      </div>
                    </div>

                    {/* Label & Value */}
                    <div className="space-y-1 md:space-y-2">
                      <p className="text-[10px] md:text-xs lg:text-sm font-bold text-zinc-400 uppercase tracking-wider">
                        {card.label}
                      </p>
                      <p className={`text-2xl md:text-3xl lg:text-4xl font-bold ${card.color}`}>
                        {card.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Recent Orders & Inventory Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8"
      >
        {/* Recent Orders */}
        <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl shadow-sm border border-zinc-100 space-y-4 md:space-y-6">
          <h3 className="text-lg md:text-xl font-display font-bold text-primary-green">
            Recent Orders
          </h3>
          {recentOrders.length === 0 ? (
            <p className="text-zinc-400 text-xs md:text-sm py-8 text-center">No orders yet.</p>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {recentOrders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 md:p-4 bg-zinc-50 rounded-lg md:rounded-xl hover:bg-zinc-100 transition-colors duration-200"
                >
                  <div className="flex items-start sm:items-center space-x-3 flex-grow min-w-0">
                    <div className="w-2 h-2 bg-accent-orange rounded-full shrink-0 mt-1 sm:mt-0" />
                    <div className="min-w-0 flex-grow">
                      <p className="text-xs md:text-sm font-bold text-zinc-800 truncate">
                        #ORD-{order.id} — {order.full_name}
                      </p>
                      <p className="text-[10px] md:text-xs text-zinc-400">
                        {new Date(order.created_at).toLocaleDateString('en-UG', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3 sm:justify-end">
                    <span className="text-xs md:text-sm font-bold text-primary-green whitespace-nowrap">
                      UGX {order.total_amount.toLocaleString()}
                    </span>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                      className="font-bold uppercase text-[9px] md:text-[10px] shrink-0"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Inventory Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl shadow-sm border border-zinc-100 space-y-4 md:space-y-6"
        >
          <h3 className="text-lg md:text-xl font-display font-bold text-primary-green">
            Inventory Status
          </h3>
          <div className="space-y-4 md:space-y-6">
            {/* Status Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-medium text-zinc-600">Stock Health</span>
              <span className={`text-xs md:text-sm font-bold px-3 py-1 rounded-full ${
                stats.lowStockItems > 0
                  ? 'bg-orange-50 text-orange-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}>
                {stats.lowStockItems > 0 ? `${stats.lowStockItems} items low` : '✓ Good'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-zinc-100 h-2 md:h-3 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.max(10, 100 - (stats.lowStockItems / stats.totalProducts) * 100)}%`
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full transition-colors ${
                    stats.lowStockItems > 0 ? 'bg-orange-400' : 'bg-emerald-500'
                  }`}
                />
              </div>
              <p className="text-[10px] md:text-xs text-zinc-400">
                {stats.totalProducts - stats.lowStockItems} of {stats.totalProducts} products are in healthy stock levels.
              </p>
            </div>

            {/* Stock Details Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-zinc-100">
              <div className="space-y-1 md:space-y-2">
                <p className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Healthy Stock
                </p>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-emerald-600">
                  {stats.totalProducts - stats.lowStockItems}
                </p>
              </div>
              <div className="space-y-1 md:space-y-2">
                <p className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Low Stock
                </p>
                <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${
                  stats.lowStockItems > 0 ? 'text-orange-600' : 'text-zinc-300'
                }`}>
                  {stats.lowStockItems}
                </p>
              </div>
            </div>

            {/* Action Alert */}
            {stats.lowStockItems > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 md:mt-6 p-3 md:p-4 bg-orange-50 rounded-lg md:rounded-xl border border-orange-200"
              >
                <div className="flex items-start space-x-2 md:space-x-3">
                  <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-orange-800">
                      Low Stock Alert
                    </p>
                    <p className="text-[10px] md:text-xs text-orange-700 mt-0.5">
                      {stats.lowStockItems} {stats.lowStockItems === 1 ? 'item needs' : 'items need'} reordering
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
