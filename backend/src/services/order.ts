import Database from 'better-sqlite3';
import { OrderModel, OrderItemModel, ProductModel } from '../models';
import type { Order, OrderStatus } from '@shared/types';

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

export class OrderService {
  private orderModel: OrderModel;
  private orderItemModel: OrderItemModel;
  private productModel: ProductModel;
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
    this.orderModel = new OrderModel(db);
    this.orderItemModel = new OrderItemModel(db);
    this.productModel = new ProductModel(db);
  }

  getAllOrders(): Order[] {
    return this.orderModel.findAll();
  }

  getOrderById(id: number): (Order & { items: any[] }) | null {
    const order = this.orderModel.findById(id);
    if (!order) return null;
    const items = this.orderItemModel.findByOrderId(id);
    return { ...order, items };
  }

  createOrder(
    userId: number | null,
    items: Array<{ id: number; quantity: number; price: number }>,
    totalAmount: number,
    shippingInfo: { fullName: string; phone: string; address: string }
  ): number {
    const transaction = this.db.transaction(() => {
      const orderId = this.orderModel.create(
        userId,
        totalAmount,
        shippingInfo.fullName,
        shippingInfo.phone,
        shippingInfo.address
      );

      for (const item of items) {
        this.orderItemModel.create(orderId, item.id, item.quantity, item.price);
        // Update product stock
        const product = this.productModel.findById(item.id);
        if (product) {
          this.productModel.update(item.id, {
            ...product,
            stock: product.stock - item.quantity,
          });
        }
      }

      return orderId;
    });

    return transaction();
  }

  updateOrderStatus(id: number, status: OrderStatus): void {
    this.orderModel.updateStatus(id, status);
  }

  deleteOrder(id: number): void {
    this.orderItemModel.deleteByOrderId(id);
    this.orderModel.delete(id);
  }

  getStats(): OrderStats {
    return {
      totalOrders: this.orderModel.count(),
      pendingOrders: this.orderModel.countByStatus('Pending'),
      totalRevenue: this.orderModel.sumRevenue(),
    };
  }
}
