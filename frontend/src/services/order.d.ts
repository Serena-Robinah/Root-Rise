import type { Order, OrderStatus } from '@shared/types';
export declare class OrderServiceClient {
    createOrder(data: {
        userId: number;
        items: Array<{
            id: number;
            quantity: number;
            price: number;
        }>;
        totalAmount: number;
        shippingInfo: {
            fullName: string;
            phone: string;
            address: string;
        };
    }): Promise<{
        success: boolean;
        orderId: number;
    }>;
    getAll(): Promise<Order[]>;
    getById(id: number): Promise<Order & {
        items: any[];
    }>;
    updateStatus(id: number, status: OrderStatus): Promise<{
        success: boolean;
    }>;
    delete(id: number): Promise<{
        success: boolean;
    }>;
    getStats(): Promise<any>;
}
export declare const orderService: OrderServiceClient;
//# sourceMappingURL=order.d.ts.map