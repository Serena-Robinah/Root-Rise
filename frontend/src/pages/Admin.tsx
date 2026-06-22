import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import AdminLayout from '../components/AdminLayout';
import AdminDashboard from './admin/Dashboard';
import AdminProducts from './admin/Products';
import AdminOrders from './admin/Orders';
import AdminReviews from './admin/Reviews';

export default function Admin() {
  return (
    <SnackbarProvider maxSnack={3}>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/reviews" element={<AdminReviews />} />
        </Routes>
      </AdminLayout>
    </SnackbarProvider>
  );
}
