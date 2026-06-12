function getToken(): string | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}


import { apiClient } from './apiClient';
import type { Product } from '@shared/types';
import { API_ENDPOINTS } from '@shared/constants';
import { authService } from './auth';

export class ProductServiceClient {
  getAll(): Promise<Product[]> {
    return apiClient.get(API_ENDPOINTS.PRODUCTS);
  }

  getById(id: number): Promise<Product> {
    return apiClient.get(API_ENDPOINTS.PRODUCT_DETAIL(id));
  }

  // Likes
  getLikes(productId: number): Promise<{ count: number; liked: boolean }> {
    const token = getToken();
    return apiClient.get(`/api/products/${productId}/likes`, token || undefined);
  }

  toggleLike(productId: number): Promise<{ liked: boolean; count: number }> {
    const token = getToken();
    return apiClient.post(`/api/products/${productId}/likes`, {}, token || undefined);
  }

  // Reviews
  getReviews(productId: number): Promise<{
    reviews: { id: number; rating: number; comment: string; created_at: string; user: { id: number; name: string } }[];
    avgRating: number;
    hasReviewed: boolean;
  }> {
    const token = getToken();
    return apiClient.get(`/api/products/${productId}/reviews`, token || undefined);
  }

  submitReview(productId: number, rating: number, comment: string): Promise<{
    success: boolean;
    reviews: any[];
    avgRating: number;
  }> {
    const token = getToken();
    return apiClient.post(`/api/products/${productId}/reviews`, { rating, comment }, token || undefined);
  }

  // Admin methods
  create(product: Omit<Product, 'id'>): Promise<{ success: boolean; id: number }> {
    const token = authService.getToken();
    return apiClient.post(API_ENDPOINTS.ADMIN_PRODUCTS, product, token || undefined);
  }

  update(id: number, product: Partial<Omit<Product, 'id'>>): Promise<{ success: boolean }> {
    const token = authService.getToken();
    return apiClient.put(API_ENDPOINTS.ADMIN_UPDATE_PRODUCT(id), product, token || undefined);
  }

  delete(id: number): Promise<{ success: boolean }> {
    const token = authService.getToken();
    return apiClient.delete(API_ENDPOINTS.ADMIN_DELETE_PRODUCT(id), token || undefined);
  }
}

export const productService = new ProductServiceClient();