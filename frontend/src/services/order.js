import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@shared/constants';
import { authService } from './auth';
export class OrderServiceClient {
    async createOrder(data) {
        return await apiClient.post(API_ENDPOINTS.CREATE_ORDER, data);
    }
    // Admin methods
    getAll() {
        const token = authService.getToken();
        return apiClient.get(API_ENDPOINTS.ADMIN_ORDERS, token || undefined);
    }
    getById(id) {
        const token = authService.getToken();
        return apiClient.get(API_ENDPOINTS.ADMIN_ORDER_DETAIL(id), token || undefined);
    }
    updateStatus(id, status) {
        const token = authService.getToken();
        return apiClient.patch(API_ENDPOINTS.ADMIN_ORDER_STATUS(id), { status }, token || undefined);
    }
    delete(id) {
        const token = authService.getToken();
        return apiClient.delete(API_ENDPOINTS.ADMIN_DELETE_ORDER(id), token || undefined);
    }
    getStats() {
        const token = authService.getToken();
        return apiClient.get('/api/admin/stats', token || undefined);
    }
}
export const orderService = new OrderServiceClient();
//# sourceMappingURL=order.js.map