import { apiClient } from './apiClient';
import type { Product, Order } from '@shared/types';
import { useAuthStore } from '../store/authStore';
import { API_ENDPOINTS } from '@shared/constants';

export const adminService = {
  async getStats() {
    return await apiClient.get<any>(API_ENDPOINTS.ADMIN_STATS, useAuthStore.getState().token || undefined);
  },

  async getProducts() {
    return await apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS);
  },

  async createProduct(data: Omit<Product, 'id'> | FormData) {
    return await apiClient.post<Product>(API_ENDPOINTS.ADMIN_PRODUCTS, data, useAuthStore.getState().token || undefined);
  },

  async updateProduct(id: number, data: Partial<Product> | FormData) {
    return await apiClient.put<Product>(API_ENDPOINTS.ADMIN_UPDATE_PRODUCT(id), data, useAuthStore.getState().token || undefined);
  },

  async deleteProduct(id: number) {
    await apiClient.delete(API_ENDPOINTS.ADMIN_DELETE_PRODUCT(id), useAuthStore.getState().token || undefined);
  },

  async getOrders() {
    return await apiClient.get<Order[]>(API_ENDPOINTS.ADMIN_ORDERS, useAuthStore.getState().token || undefined);
  },

  async getOrderDetails(id: number) {
    return await apiClient.get<Order>(API_ENDPOINTS.ADMIN_ORDER_DETAIL(id), useAuthStore.getState().token || undefined);
  },

  async updateOrderStatus(id: number, status: string) {
    return await apiClient.patch<Order>(API_ENDPOINTS.ADMIN_ORDER_STATUS(id), { status }, useAuthStore.getState().token || undefined);
  },

  async getReviews() {
    return await apiClient.get<any[]>('/api/admin/reviews', useAuthStore.getState().token || undefined);
  },

  async deleteReview(id: number) {
    return await apiClient.delete(`/api/admin/reviews/${id}`, useAuthStore.getState().token || undefined);
  },
};