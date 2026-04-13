import { apiClient } from './apiClient';
import type { Order, OrderStatus } from '@shared/types';
import { API_ENDPOINTS } from '@shared/constants';
import { authService } from './auth';

export class OrderServiceClient {
  async createOrder(data: {
    userId: number;
    items: Array<{ id: number; quantity: number; price: number }>;
    totalAmount: number;
    shippingInfo: { fullName: string; phone: string; address: string };
  }): Promise<{ success: boolean; orderId: number }> {
    return await apiClient.post<{ success: boolean; orderId: number }>(API_ENDPOINTS.CREATE_ORDER, data);
  }

  // Admin methods
  getAll(): Promise<Order[]> {
    const token = authService.getToken();
    return apiClient.get<Order[]>(API_ENDPOINTS.ADMIN_ORDERS, token || undefined);
  }

  getById(id: number): Promise<Order & { items: any[] }> {
    const token = authService.getToken();
    return apiClient.get<Order & { items: any[] }>(API_ENDPOINTS.ADMIN_ORDER_DETAIL(id), token || undefined);
  }

  updateStatus(id: number, status: OrderStatus): Promise<{ success: boolean }> {
    const token = authService.getToken();
    return apiClient.patch<{ success: boolean }>(API_ENDPOINTS.ADMIN_ORDER_STATUS(id), { status }, token || undefined);
  }

  delete(id: number): Promise<{ success: boolean }> {
    const token = authService.getToken();
    return apiClient.delete<{ success: boolean }>(API_ENDPOINTS.ADMIN_DELETE_ORDER(id), token || undefined);
  }

  getStats(): Promise<any> {
    const token = authService.getToken();
    return apiClient.get<any>('/api/admin/stats', token || undefined);
  }
}

export const orderService = new OrderServiceClient();
