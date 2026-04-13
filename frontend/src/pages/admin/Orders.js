import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Avatar, Chip, } from '@mui/material';
import { Visibility as Eye } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { adminService } from '../../services';
export default function AdminOrders() {
    const [orders, setOrders] = React.useState([]);
    const [selectedOrder, setSelectedOrder] = React.useState(null);
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
    const updateStatus = async (id, status) => {
        try {
            await adminService.updateOrderStatus(id, status);
            enqueueSnackbar(`Order status updated to ${status}`, { variant: 'success' });
            fetchOrders();
            if (selectedOrder?.id === id) {
                setSelectedOrder({ ...selectedOrder, status });
            }
        }
        catch (err) {
            enqueueSnackbar(err instanceof Error ? err.message : 'Failed to update status', { variant: 'error' });
        }
    };
    const viewOrderDetails = async (id) => {
        try {
            const data = await adminService.getOrderDetails(id);
            setSelectedOrder(data);
            setIsDetailsOpen(true);
        }
        catch (err) {
            enqueueSnackbar(err instanceof Error ? err.message : 'Failed to load order details', { variant: 'error' });
        }
    };
    const getStatusColor = (status) => {
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
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h1", { className: "text-3xl font-display font-bold text-primary-green", children: "Order Management" }), _jsx("p", { className: "text-zinc-500", children: "Track and manage customer orders and delivery status." })] }), _jsx("div", { className: "flex items-center space-x-4", children: _jsxs(FormControl, { size: "small", className: "w-48", children: [_jsx(InputLabel, { children: "Filter Status" }), _jsxs(Select, { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), label: "Filter Status", className: "rounded-xl bg-white", children: [_jsx(MenuItem, { value: "All", children: "All Orders" }), _jsx(MenuItem, { value: "Pending", children: "Pending" }), _jsx(MenuItem, { value: "Confirmed", children: "Confirmed" }), _jsx(MenuItem, { value: "Out for Delivery", children: "Out for Delivery" }), _jsx(MenuItem, { value: "Delivered", children: "Delivered" }), _jsx(MenuItem, { value: "Cancelled", children: "Cancelled" })] })] }) })] }), _jsx(TableContainer, { component: Paper, className: "rounded-3xl shadow-sm border-none overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHead, { className: "bg-zinc-50", children: _jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-bold text-zinc-400 uppercase text-xs", children: "Order" }), _jsx(TableCell, { className: "font-bold text-zinc-400 uppercase text-xs", children: "Customer" }), _jsx(TableCell, { className: "font-bold text-zinc-400 uppercase text-xs", children: "Total" }), _jsx(TableCell, { className: "font-bold text-zinc-400 uppercase text-xs", children: "Status" }), _jsx(TableCell, { className: "font-bold text-zinc-400 uppercase text-xs", children: "Date" }), _jsx(TableCell, { className: "font-bold text-zinc-400 uppercase text-xs text-right", children: "Actions" })] }) }), _jsx(TableBody, { children: filteredOrders.map(order => (_jsxs(TableRow, { className: "hover:bg-zinc-50/50 transition-colors", children: [_jsxs(TableCell, { className: "font-bold text-primary-green", children: ["#ORD-", order.id] }), _jsx(TableCell, { children: _jsxs("div", { className: "text-sm", children: [_jsx("p", { className: "font-bold text-zinc-800", children: order.full_name }), _jsx("p", { className: "text-xs text-zinc-400", children: order.phone })] }) }), _jsxs(TableCell, { className: "font-bold text-primary-green", children: ["$", order.total_amount.toFixed(2)] }), _jsx(TableCell, { children: _jsx(Chip, { label: order.status, color: getStatusColor(order.status), size: "small", className: "font-bold uppercase text-[10px] tracking-wider" }) }), _jsx(TableCell, { className: "text-sm text-zinc-400", children: new Date(order.created_at).toLocaleDateString() }), _jsx(TableCell, { align: "right", children: _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(IconButton, { onClick: () => viewOrderDetails(order.id), className: "text-primary-green hover:bg-primary-green/10", children: _jsx(Eye, { className: "w-5 h-5" }) }), _jsx(FormControl, { size: "small", className: "w-32", children: _jsxs(Select, { value: order.status, onChange: (e) => updateStatus(order.id, e.target.value), className: "text-xs font-bold rounded-lg h-8", children: [_jsx(MenuItem, { value: "Pending", children: "Pending" }), _jsx(MenuItem, { value: "Confirmed", children: "Confirmed" }), _jsx(MenuItem, { value: "Out for Delivery", children: "Out" }), _jsx(MenuItem, { value: "Delivered", children: "Delivered" }), _jsx(MenuItem, { value: "Cancelled", children: "Cancelled" })] }) })] }) })] }, order.id))) })] }) }), _jsx(Dialog, { open: isDetailsOpen, onClose: () => setIsDetailsOpen(false), maxWidth: "md", fullWidth: true, PaperProps: { className: 'rounded-3xl p-4' }, children: selectedOrder && (_jsxs(_Fragment, { children: [_jsxs(DialogTitle, { className: "flex justify-between items-center", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("h2", { className: "text-2xl font-display font-bold text-primary-green", children: ["Order #ORD-", selectedOrder.id] }), _jsx("p", { className: "text-sm text-zinc-400", children: new Date(selectedOrder.created_at).toLocaleString() })] }), _jsx(Chip, { label: selectedOrder.status, color: getStatusColor(selectedOrder.status), className: "font-bold uppercase" })] }), _jsxs(DialogContent, { className: "space-y-8 pt-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "text-sm font-bold text-zinc-400 uppercase tracking-widest", children: "Customer Information" }), _jsxs("div", { className: "bg-zinc-50 p-6 rounded-2xl space-y-3", children: [_jsx("div", { className: "font-bold", children: selectedOrder.full_name }), _jsx("div", { className: "text-zinc-600", children: selectedOrder.phone }), _jsx("div", { className: "text-zinc-600", children: selectedOrder.address })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "text-sm font-bold text-zinc-400 uppercase tracking-widest", children: "Order Summary" }), _jsxs("div", { className: "bg-soft-cream p-6 rounded-2xl space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-zinc-600", children: "Items Total" }), _jsxs("span", { className: "font-bold", children: ["$", selectedOrder.total_amount.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-zinc-600", children: "Shipping" }), _jsx("span", { className: "font-bold text-emerald-600", children: "FREE" })] }), _jsxs("div", { className: "pt-3 border-t border-primary-green/10 flex justify-between items-end", children: [_jsx("span", { className: "font-bold text-primary-green", children: "Grand Total" }), _jsxs("span", { className: "text-2xl font-bold text-primary-green", children: ["$", selectedOrder.total_amount.toFixed(2)] })] })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "text-sm font-bold text-zinc-400 uppercase tracking-widest", children: "Ordered Items" }), _jsx("div", { className: "space-y-3", children: selectedOrder.items?.map((item) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-white border rounded-2xl", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Avatar, { src: item.image_url, variant: "rounded", className: "w-12 h-12" }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-primary-green", children: item.product_name }), _jsxs("p", { className: "text-xs text-zinc-400", children: ["Qty: ", item.quantity, " \u00D7 $", item.price.toFixed(2)] })] })] }), _jsxs("p", { className: "font-bold text-primary-green", children: ["$", (item.quantity * item.price).toFixed(2)] })] }, item.id))) })] })] }), _jsxs(DialogActions, { className: "p-6", children: [_jsx(Button, { onClick: () => setIsDetailsOpen(false), className: "text-zinc-500 font-bold", children: "Close" }), _jsxs("div", { className: "flex space-x-2", children: [selectedOrder.status === 'Pending' && (_jsx(Button, { onClick: () => updateStatus(selectedOrder.id, 'Confirmed'), className: "btn-primary", children: "Confirm Order" })), selectedOrder.status === 'Confirmed' && (_jsx(Button, { onClick: () => updateStatus(selectedOrder.id, 'Out for Delivery'), className: "btn-accent", children: "Ship Order" }))] })] })] })) })] }));
}
//# sourceMappingURL=Orders.js.map