import React from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Chip
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '../../store/authStore';
import { adminService } from '../../services';
import type { Product } from '@shared/types';
import { AGE_GROUPS, GENDERS, CATEGORIES } from '@shared/constants';

export default function AdminProducts() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<number | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchProducts = () => {
    adminService.getProducts()
      .then(setProducts)
      .catch(err => {
        console.error('Failed to fetch products:', err);
        enqueueSnackbar('Failed to load products', { variant: 'error' });
      });
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, formData);
        enqueueSnackbar('Product updated!', { variant: 'success' });
      } else {
        await adminService.createProduct(formData);
        enqueueSnackbar('Product added!', { variant: 'success' });
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Failed to save product', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await adminService.deleteProduct(productToDelete);
      enqueueSnackbar('Product deleted!', { variant: 'success' });
      setIsDeleteDialogOpen(false);
      fetchProducts();
    } catch (err) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Failed to delete', { variant: 'error' });
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
                <TableCell className="font-bold text-primary-green">${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      product.stock < 5 
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
                label="Price ($)" 
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
                 <Select name="category" defaultValue={editingProduct?.category || CATEGORIES[0]} label="Category">
                   {CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                 </Select>
               </FormControl>
               <FormControl fullWidth>
                 <InputLabel>Age Group</InputLabel>
                 <Select name="age_group" defaultValue={editingProduct?.age_group || AGE_GROUPS[0]} label="Age Group">
                   {AGE_GROUPS.map(age => <MenuItem key={age} value={age}>{age}</MenuItem>)}
                 </Select>
               </FormControl>
            </div>
            <FormControl fullWidth>
               <InputLabel>Gender</InputLabel>
               <Select name="gender" defaultValue={editingProduct?.gender || GENDERS[0]} label="Gender">
                 {GENDERS.map(gender => <MenuItem key={gender} value={gender}>{gender}</MenuItem>)}
               </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel shrink>Product Image</InputLabel>
              <input 
                type="file" 
                name="image" 
                accept="image/*"
                className="mt-6 w-full p-2 border border-zinc-300 rounded-xl"
              />
              {editingProduct?.image_url && (
                <p className="text-xs text-zinc-500 mt-2">Current: {editingProduct.image_url}</p>
              )}
            </FormControl>
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
