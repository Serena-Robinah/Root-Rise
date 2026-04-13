import { apiClient } from './apiClient';
import type { Product, Order } from '@shared/types';

export const adminService = {
  async getStats() {
    return await apiClient.get<any>('/admin/stats');
  },

  async getProducts() {
    return await apiClient.get<Product[]>('/products');
  },

  async createProduct(data: Omit<Product, 'id'>) {
    return await apiClient.post<Product>('/admin/products', data);
  },

  async updateProduct(id: number, data: Partial<Product>) {
    return await apiClient.put<Product>(`/admin/products/${id}`, data);
  },

  async deleteProduct(id: number) {
    await apiClient.delete(`/admin/products/${id}`);
  },

  async getOrders() {
    return await apiClient.get<Order[]>('/admin/orders');
  },

  async getOrderDetails(id: number) {
    return await apiClient.get<Order>(`/admin/orders/${id}`);
  },

  async updateOrderStatus(id: number, status: string) {
    return await apiClient.patch<Order>(`/admin/orders/${id}/status`, { status });
  },
};
