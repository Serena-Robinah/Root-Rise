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
