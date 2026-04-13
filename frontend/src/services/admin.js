import { apiClient } from './apiClient';
export const adminService = {
    async getStats() {
        return await apiClient.get('/admin/stats');
    },
    async getProducts() {
        return await apiClient.get('/products');
    },
    async createProduct(data) {
        return await apiClient.post('/admin/products', data);
    },
    async updateProduct(id, data) {
        return await apiClient.put(`/admin/products/${id}`, data);
    },
    async deleteProduct(id) {
        await apiClient.delete(`/admin/products/${id}`);
    },
    async getOrders() {
        return await apiClient.get('/admin/orders');
    },
    async getOrderDetails(id) {
        return await apiClient.get(`/admin/orders/${id}`);
    },
    async updateOrderStatus(id, status) {
        return await apiClient.patch(`/admin/orders/${id}/status`, { status });
    },
};
//# sourceMappingURL=admin.js.map