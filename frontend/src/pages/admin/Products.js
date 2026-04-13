import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, Avatar, Chip } from '@mui/material';
import { useSnackbar } from 'notistack';
import { adminService } from '../../services';
import { AGE_GROUPS, GENDERS, CATEGORIES } from '@shared/constants';
export default function AdminProducts() {
    const [products, setProducts] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [productToDelete, setProductToDelete] = React.useState(null);
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
    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        try {
            if (editingProduct) {
                await adminService.updateProduct(editingProduct.id, {
                    name: data.name,
                    description: data.description,
                    price: parseFloat(data.price),
                    stock: parseInt(data.stock),
                    category: data.category,
                    age_group: data.age_group,
                    gender: data.gender,
                    image_url: data.image_url,
                });
                enqueueSnackbar('Product updated!', { variant: 'success' });
            }
            else {
                await adminService.createProduct({
                    name: data.name,
                    description: data.description,
                    price: parseFloat(data.price),
                    stock: parseInt(data.stock),
                    category: data.category,
                    age_group: data.age_group,
                    gender: data.gender,
                    image_url: data.image_url,
                });
                enqueueSnackbar('Product added!', { variant: 'success' });
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            fetchProducts();
        }
        catch (err) {
            enqueueSnackbar(err instanceof Error ? err.message : 'Failed to save product', { variant: 'error' });
        }
    };
    const handleDelete = async () => {
        if (!productToDelete)
            return;
        try {
            await adminService.deleteProduct(productToDelete);
            enqueueSnackbar('Product deleted!', { variant: 'success' });
            setIsDeleteDialogOpen(false);
            fetchProducts();
        }
        catch (err) {
            enqueueSnackbar(err instanceof Error ? err.message : 'Failed to delete', { variant: 'error' });
        }
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h1", { className: "text-3xl font-display font-bold text-primary-green", children: "Manage Products" }), _jsx("p", { className: "text-zinc-500", children: "Add, edit, or remove products from your catalog." })] }), _jsxs("button", { onClick: () => { setEditingProduct(null); setIsModalOpen(true); }, className: "btn-primary flex items-center space-x-2", children: [_jsx(Plus, { className: "w-5 h-5" }), _jsx("span", { children: "Add New Product" })] })] }), _jsx(TableContainer, { component: Paper, className: "rounded-3xl shadow-sm border-none overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHead, { className: "bg-zinc-50", children: _jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-bold text-zinc-400 uppercase text-xs", children: "Product" }), _jsx(TableCell, { className: "font-bold text-zinc-400 uppercase text-xs", children: "Category" }), _jsx(TableCell, { className: "font-bold text-zinc-400 uppercase text-xs", children: "Price" }), _jsx(TableCell, { className: "font-bold text-zinc-400 uppercase text-xs", children: "Stock" }), _jsx(TableCell, { className: "font-bold text-zinc-400 uppercase text-xs text-right", children: "Actions" })] }) }), _jsx(TableBody, { children: products.map(product => (_jsxs(TableRow, { className: `hover:bg-zinc-50/50 transition-colors ${product.stock < 5 ? 'bg-red-50/30' : ''}`, children: [_jsx(TableCell, { children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Avatar, { src: product.image_url, variant: "rounded", className: "w-12 h-12 shadow-sm" }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-primary-green", children: product.name }), _jsxs("p", { className: "text-xs text-zinc-400 uppercase font-bold tracking-widest", children: [product.age_group, " Yrs \u2022 ", product.gender] })] })] }) }), _jsx(TableCell, { className: "text-zinc-500 font-medium", children: product.category }), _jsxs(TableCell, { className: "font-bold text-primary-green", children: ["$", product.price.toFixed(2)] }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("span", { className: `text-xs font-bold px-3 py-1 rounded-full ${product.stock < 5
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-emerald-100 text-emerald-600'}`, children: [product.stock, " in stock"] }), product.stock < 5 && (_jsx(Chip, { label: "Low Stock", size: "small", color: "error", className: "font-bold text-[10px] uppercase" }))] }) }), _jsx(TableCell, { align: "right", children: _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(IconButton, { onClick: () => { setEditingProduct(product); setIsModalOpen(true); }, className: "text-primary-green hover:bg-primary-green/10", children: _jsx(Edit, { className: "w-5 h-5" }) }), _jsx(IconButton, { onClick: () => { setProductToDelete(product.id); setIsDeleteDialogOpen(true); }, className: "text-red-400 hover:bg-red-50", children: _jsx(Trash2, { className: "w-5 h-5" }) })] }) })] }, product.id))) })] }) }), _jsxs(Dialog, { open: isModalOpen, onClose: () => setIsModalOpen(false), maxWidth: "sm", fullWidth: true, PaperProps: { className: 'rounded-3xl p-4' }, children: [_jsx(DialogTitle, { className: "text-2xl font-display font-bold text-primary-green", children: editingProduct ? 'Edit Product' : 'Add New Product' }), _jsxs("form", { onSubmit: handleSave, children: [_jsxs(DialogContent, { className: "space-y-6", children: [_jsx(TextField, { name: "name", label: "Product Name", fullWidth: true, defaultValue: editingProduct?.name, required: true, variant: "outlined", className: "rounded-xl" }), _jsx(TextField, { name: "description", label: "Description", fullWidth: true, multiline: true, rows: 3, defaultValue: editingProduct?.description, variant: "outlined" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(TextField, { name: "price", label: "Price ($)", type: "number", fullWidth: true, defaultValue: editingProduct?.price, required: true }), _jsx(TextField, { name: "stock", label: "Stock Quantity", type: "number", fullWidth: true, defaultValue: editingProduct?.stock, required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Category" }), _jsx(Select, { name: "category", defaultValue: editingProduct?.category || CATEGORIES[0], label: "Category", children: CATEGORIES.map(cat => _jsx(MenuItem, { value: cat, children: cat }, cat)) })] }), _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Age Group" }), _jsx(Select, { name: "age_group", defaultValue: editingProduct?.age_group || AGE_GROUPS[0], label: "Age Group", children: AGE_GROUPS.map(age => _jsx(MenuItem, { value: age, children: age }, age)) })] })] }), _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Gender" }), _jsx(Select, { name: "gender", defaultValue: editingProduct?.gender || GENDERS[0], label: "Gender", children: GENDERS.map(gender => _jsx(MenuItem, { value: gender, children: gender }, gender)) })] }), _jsx(TextField, { name: "image_url", label: "Image URL", fullWidth: true, defaultValue: editingProduct?.image_url, required: true })] }), _jsxs(DialogActions, { className: "p-6", children: [_jsx(Button, { onClick: () => setIsModalOpen(false), className: "text-zinc-500 font-bold", children: "Cancel" }), _jsx(Button, { type: "submit", className: "btn-primary", children: "Save Product" })] })] })] }), _jsxs(Dialog, { open: isDeleteDialogOpen, onClose: () => setIsDeleteDialogOpen(false), PaperProps: { className: 'rounded-3xl' }, children: [_jsx(DialogTitle, { className: "font-display font-bold text-primary-green", children: "Delete Product?" }), _jsx(DialogContent, { children: _jsx("p", { className: "text-zinc-500", children: "Are you sure you want to delete this product? This action cannot be undone." }) }), _jsxs(DialogActions, { className: "p-6", children: [_jsx(Button, { onClick: () => setIsDeleteDialogOpen(false), className: "text-zinc-500 font-bold", children: "Cancel" }), _jsx(Button, { onClick: handleDelete, className: "bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600", children: "Delete" })] })] })] }));
}
//# sourceMappingURL=Products.js.map