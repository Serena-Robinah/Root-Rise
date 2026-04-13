import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@shared/constants';
import { authService } from './auth';
export class ProductServiceClient {
    getAll() {
        return apiClient.get(API_ENDPOINTS.PRODUCTS);
    }
    getById(id) {
        return apiClient.get(API_ENDPOINTS.PRODUCT_DETAIL(id));
    }
    // Admin methods
    create(product) {
        const token = authService.getToken();
        return apiClient.post(API_ENDPOINTS.ADMIN_PRODUCTS, product, token || undefined);
    }
    update(id, product) {
        const token = authService.getToken();
        return apiClient.put(API_ENDPOINTS.ADMIN_UPDATE_PRODUCT(id), product, token || undefined);
    }
    delete(id) {
        const token = authService.getToken();
        return apiClient.delete(API_ENDPOINTS.ADMIN_DELETE_PRODUCT(id), token || undefined);
    }
}
export const productService = new ProductServiceClient();
//# sourceMappingURL=product.js.map