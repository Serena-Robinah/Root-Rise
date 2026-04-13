import type { Product, Order } from '@shared/types';
export declare const adminService: {
    getStats(): Promise<any>;
    getProducts(): Promise<Product[]>;
    createProduct(data: Omit<Product, "id">): Promise<Product>;
    updateProduct(id: number, data: Partial<Product>): Promise<Product>;
    deleteProduct(id: number): Promise<void>;
    getOrders(): Promise<Order[]>;
    getOrderDetails(id: number): Promise<Order>;
    updateOrderStatus(id: number, status: string): Promise<Order>;
};
//# sourceMappingURL=admin.d.ts.map