import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip,
} from '@mui/material';
import { Visibility as Eye } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '../../store/authStore';
import { adminService } from '../../services';
import type { Order } from '@shared/types';

export default function AdminOrders() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState('All');
  const { enqueueSnackbar } = useSnackbar();

  const fetchOrders = () => {
    adminService.getOrders()
      .then(setOrders)
      .catch(err => {
        console.error('Failed to fetch orders:', err);
        enqueueSnackbar('Failed to load orders', { variant: 'error' });
      });
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await adminService.updateOrderStatus(id, status);
      enqueueSnackbar(`Order status updated to ${status}`, { variant: 'success' });
      fetchOrders();
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Failed to update status', { variant: 'error' });
    }
  };

  const viewOrderDetails = async (id: number) => {
    try {
      const data = await adminService.getOrderDetails(id);
      setSelectedOrder(data);
      setIsDetailsOpen(true);
    } catch (err) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Failed to load order details', { variant: 'error' });
    }
  };

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

  const filteredOrders = statusFilter === 'All' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-green">Order Management</h1>
          <p className="text-sm text-zinc-500">Track and manage customer orders and delivery status.</p>
        </div>
        <div className="flex items-center space-x-4">
          <FormControl size="small" className="w-full sm:w-48">
            <InputLabel>Filter Status</InputLabel>
            <Select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Filter Status"
              className="rounded-xl bg-white"
            >
              <MenuItem value="All">All Orders</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <TableContainer component={Paper} className="rounded-3xl shadow-sm border-none overflow-x-auto">
        <Table>
          <TableHead className="bg-zinc-50">
            <TableRow>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs">Order</TableCell>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs">Customer</TableCell>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs">Total</TableCell>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs">Status</TableCell>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs">Date</TableCell>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs text-right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map(order => (
              <TableRow key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                <TableCell className="font-bold text-primary-green">#ORD-{order.id}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="font-bold text-zinc-800">{order.full_name}</p>
                    <p className="text-xs text-zinc-400">{order.phone}</p>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-primary-green">UGX {order.total_amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    color={getStatusColor(order.status)}
                    size="small"
                    className="font-bold uppercase text-[10px] tracking-wider"
                  />
                </TableCell>
                <TableCell className="text-sm text-zinc-400">
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <div className="flex justify-end space-x-2">
                    <IconButton onClick={() => viewOrderDetails(order.id)} className="text-primary-green hover:bg-primary-green/10">
                      <Eye className="w-5 h-5" />
                    </IconButton>
                    <FormControl size="small" className="w-32">
                      <Select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-xs font-bold rounded-lg h-8"
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Confirmed">Confirmed</MenuItem>
                        <MenuItem value="Out for Delivery">Out</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Details Modal */}
      <Dialog 
        open={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ className: 'rounded-3xl p-4' }}
      >
        {selectedOrder && (
          <>
            <DialogTitle className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-display font-bold text-primary-green">Order #ORD-{selectedOrder.id}</h2>
                <p className="text-sm text-zinc-400">{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <Chip 
                label={selectedOrder.status} 
                color={getStatusColor(selectedOrder.status)}
                className="font-bold uppercase"
              />
            </DialogTitle>
            <DialogContent className="space-y-8 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Customer Information</h4>
                  <div className="bg-zinc-50 p-6 rounded-2xl space-y-3">
                    <div className="font-bold">{selectedOrder.full_name}</div>
                    <div className="text-zinc-600">{selectedOrder.phone}</div>
                    <div className="text-zinc-600">{selectedOrder.address}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Order Summary</h4>
                  <div className="bg-soft-cream p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Items Total</span>
                      <span className="font-bold">UGX {selectedOrder.total_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Shipping</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </div>
                    <div className="pt-3 border-t border-primary-green/10 flex justify-between items-end">
                      <span className="font-bold text-primary-green">Grand Total</span>
                      <span className="text-2xl font-bold text-primary-green">UGX {selectedOrder.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Ordered Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white border rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <Avatar src={item.image_url} variant="rounded" className="w-12 h-12" />
                        <div>
                          <p className="font-bold text-primary-green">{item.product_name}</p>
                          <p className="text-xs text-zinc-400">Qty: {item.quantity} × UGX {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="font-bold text-primary-green">UGX {(item.quantity * item.price).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
            <DialogActions className="p-6">
              <Button onClick={() => setIsDetailsOpen(false)} className="text-zinc-500 font-bold">Close</Button>
              <div className="flex space-x-2">
                {selectedOrder.status === 'Pending' && (
                  <Button 
                    onClick={() => updateStatus(selectedOrder.id, 'Confirmed')}
                    className="btn-primary"
                  >
                    Confirm Order
                  </Button>
                )}
                {selectedOrder.status === 'Confirmed' && (
                  <Button 
                    onClick={() => updateStatus(selectedOrder.id, 'Out for Delivery')}
                    className="btn-accent"
                  >
                    Ship Order
                  </Button>
                )}
              </div>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
