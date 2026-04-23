import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Plus,
  LayoutDashboard,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  User as UserIcon,
  Phone,
  MapPin as MapPinIcon
} from 'lucide-react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar
} from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { Product, Order } from '../types';
import AdminLayout from '../components/AdminLayout';
import { useSnackbar, SnackbarProvider } from 'notistack';

const formatUGX = (amount: number) => `UGX ${amount.toLocaleString()}`;

export default function Admin() {
  return (
    <SnackbarProvider maxSnack={3}>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/orders" element={<AdminOrders />} />
        </Routes>
      </AdminLayout>
    </SnackbarProvider>
  );
}

function AdminDashboard() {
  const [stats, setStats] = React.useState<any>(null);
  const { token } = useAuthStore();

  React.useEffect(() => {
    fetch('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setStats);
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
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Revenue</p>
            <p className="text-xl font-bold text-primary-green">{formatUGX(stats.totalRevenue)}</p>
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

function AdminProducts() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<number | null>(null);
  const { token } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price as string),
          stock: parseInt(data.stock as string)
        })
      });

      if (res.ok) {
        enqueueSnackbar(editingProduct ? 'Product updated!' : 'Product added!', { variant: 'success' });
        setIsModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        const err = await res.json();
        enqueueSnackbar(err.error || 'Failed to save product', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await fetch(`/api/admin/products/${productToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        enqueueSnackbar('Product deleted!', { variant: 'success' });
        setIsDeleteDialogOpen(false);
        fetchProducts();
      } else {
        const err = await res.json();
        enqueueSnackbar(err.error || 'Failed to delete', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold text-primary-green">Manage Products</h1>
          <p className="text-zinc-500">Add, edit, or remove products from your catalog.</p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
      </div>

      <TableContainer component={Paper} className="rounded-3xl shadow-sm border-none overflow-hidden">
        <Table>
          <TableHead className="bg-zinc-50">
            <TableRow>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs">Product</TableCell>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs">Category</TableCell>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs">Price</TableCell>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs">Stock</TableCell>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs text-right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id} className={`hover:bg-zinc-50/50 transition-colors ${product.stock < 5 ? 'bg-red-50/30' : ''}`}>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Avatar
                      src={product.image_url}
                      variant="rounded"
                      className="w-12 h-12 shadow-sm"
                    />
                    <div>
                      <p className="font-bold text-primary-green">{product.name}</p>
                      <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest">{product.age_group} Yrs • {product.gender}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-500 font-medium">{product.category}</TableCell>
                <TableCell className="font-bold text-primary-green">{formatUGX(product.price)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.stock < 5
                        ? 'bg-red-100 text-red-600'
                        : 'bg-emerald-100 text-emerald-600'
                      }`}>
                      {product.stock} in stock
                    </span>
                    {product.stock < 5 && (
                      <Chip
                        label="Low Stock"
                        size="small"
                        color="error"
                        className="font-bold text-[10px] uppercase"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell align="right">
                  <div className="flex justify-end space-x-2">
                    <IconButton
                      onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                      className="text-primary-green hover:bg-primary-green/10"
                    >
                      <Edit className="w-5 h-5" />
                    </IconButton>
                    <IconButton
                      onClick={() => { setProductToDelete(product.id); setIsDeleteDialogOpen(true); }}
                      className="text-red-400 hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: 'rounded-3xl p-4' }}
      >
        <DialogTitle className="text-2xl font-display font-bold text-primary-green">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent className="space-y-6">
            <TextField
              name="name"
              label="Product Name"
              fullWidth
              defaultValue={editingProduct?.name}
              required
              variant="outlined"
              className="rounded-xl"
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={3}
              defaultValue={editingProduct?.description}
              variant="outlined"
            />
            <div className="grid grid-cols-2 gap-4">
              <TextField
                name="price"
                label="Price (UGX)"
                type="number"
                fullWidth
                defaultValue={editingProduct?.price}
                required
              />
              <TextField
                name="stock"
                label="Stock Quantity"
                type="number"
                fullWidth
                defaultValue={editingProduct?.stock}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select name="category" defaultValue={editingProduct?.category || 'Tops'} label="Category">
                  <MenuItem value="Tops">Tops</MenuItem>
                  <MenuItem value="Bottoms">Bottoms</MenuItem>
                  <MenuItem value="Dresses">Dresses</MenuItem>
                  <MenuItem value="Onesies">Onesies</MenuItem>
                  <MenuItem value="Outerwear">Outerwear</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Age Group</InputLabel>
                <Select name="age_group" defaultValue={editingProduct?.age_group || '0–1'} label="Age Group">
                  <MenuItem value="0–1">0–1</MenuItem>
                  <MenuItem value="2–4">2–4</MenuItem>
                  <MenuItem value="5–7">5–7</MenuItem>
                  <MenuItem value="8–10">8–10</MenuItem>
                  <MenuItem value="11–14">11–14</MenuItem>
                </Select>
              </FormControl>
            </div>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select name="gender" defaultValue={editingProduct?.gender || 'Unisex'} label="Gender">
                <MenuItem value="Boys">Boys</MenuItem>
                <MenuItem value="Girls">Girls</MenuItem>
                <MenuItem value="Unisex">Unisex</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="image_url"
              label="Image URL"
              fullWidth
              defaultValue={editingProduct?.image_url}
            />
          </DialogContent>
          <DialogActions className="p-6">
            <Button onClick={() => setIsModalOpen(false)} className="text-zinc-500 font-bold">Cancel</Button>
            <Button type="submit" className="btn-primary">Save Product</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} PaperProps={{ className: 'rounded-3xl' }}>
        <DialogTitle className="font-display font-bold text-primary-green">Delete Product?</DialogTitle>
        <DialogContent>
          <p className="text-zinc-500">Are you sure you want to delete this product? This action cannot be undone.</p>
        </DialogContent>
        <DialogActions className="p-6">
          <Button onClick={() => setIsDeleteDialogOpen(false)} className="text-zinc-500 font-bold">Cancel</Button>
          <Button onClick={handleDelete} className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function AdminOrders() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState('All');
  const { token } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();

  const fetchOrders = () => {
    fetch('/api/admin/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setOrders);
  };

  React.useEffect(() => {
    fetchOrders();
  }, [token]);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        enqueueSnackbar(`Order status updated to ${status}`, { variant: 'success' });
        fetchOrders();
        if (selectedOrder?.id === id) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      }
    } catch (err) {
      enqueueSnackbar('Failed to update status', { variant: 'error' });
    }
  };

  const viewOrderDetails = async (id: number) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setSelectedOrder(data);
    setIsDetailsOpen(true);
  };

  const getStatusColor = (status: string) => {
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
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold text-primary-green">Order Management</h1>
          <p className="text-zinc-500">Track and manage customer orders and delivery status.</p>
        </div>
        <div className="flex items-center space-x-4">
          <FormControl size="small" className="w-48">
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

      <TableContainer component={Paper} className="rounded-3xl shadow-sm border-none overflow-hidden">
        <Table>
          <TableHead className="bg-zinc-50">
            <TableRow>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs">Order ID</TableCell>
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
                <TableCell className="font-bold text-primary-green">{formatUGX(order.total_amount)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status) as any}
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
                color={getStatusColor(selectedOrder.status) as any}
                className="font-bold uppercase"
              />
            </DialogTitle>
            <DialogContent className="space-y-8 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Customer Information</h4>
                  <div className="bg-zinc-50 p-6 rounded-2xl space-y-3">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="w-4 h-4 text-primary-green" />
                      <span className="font-bold">{selectedOrder.full_name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-primary-green" />
                      <span className="text-zinc-600">{selectedOrder.phone}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="w-4 h-4 text-primary-green mt-1" />
                      <span className="text-zinc-600">{selectedOrder.address}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Order Summary</h4>
                  <div className="bg-soft-cream p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Items Total</span>
                      <span className="font-bold">{formatUGX(selectedOrder.total_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Shipping</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </div>
                    <div className="pt-3 border-t border-primary-green/10 flex justify-between items-end">
                      <span className="font-bold text-primary-green">Grand Total</span>
                      <span className="text-2xl font-bold text-primary-green">{formatUGX(selectedOrder.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Ordered Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white border rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <img src={item.image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-primary-green">{item.product_name}</p>
                          <p className="text-xs text-zinc-400">Qty: {item.quantity} × {formatUGX(item.price)}</p>
                        </div>
                      </div>
                      <p className="font-bold text-primary-green">{formatUGX(item.quantity * item.price)}</p>
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
