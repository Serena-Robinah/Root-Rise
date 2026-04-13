import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import AdminLayout from '../components/AdminLayout';
import AdminDashboard from './admin/Dashboard';
import AdminProducts from './admin/Products';
import AdminOrders from './admin/Orders';
export default function Admin() {
    return (_jsx(SnackbarProvider, { maxSnack: 3, children: _jsx(AdminLayout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "/products", element: _jsx(AdminProducts, {}) }), _jsx(Route, { path: "/orders", element: _jsx(AdminOrders, {}) })] }) }) }));
}
//# sourceMappingURL=Admin.js.map