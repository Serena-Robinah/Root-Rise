import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';
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
  private db: any;

  constructor(db: any) {
    this.db = db;
    this.orderModel = new OrderModel(db);
    this.orderItemModel = new OrderItemModel(db);
    this.productModel = new ProductModel(db);
  }
  async getAllOrders(): Promise<Order[]> {
    return this.orderModel.findAll();
  }

  async getOrderById(id: number): Promise<(Order & { items: any[] }) | null> {
    const order = await this.orderModel.findById(id);
    if (!order) return null;
    const items = await this.orderItemModel.findByOrderId(id);
    return { ...order, items } as any;
  }

  async createOrder(
    userId: number | null,
    items: Array<{ id: number; quantity: number; price: number }>,
    totalAmount: number,
    shippingInfo: { fullName: string; phone: string; address: string }
  ): Promise<number> {
    const result = await prisma.$transaction(async (tx: any) => {
      const o = await tx.order.create({ data: { userId, total_amount: totalAmount, full_name: shippingInfo.fullName, phone: shippingInfo.phone, address: shippingInfo.address } as any });
      for (const item of items) {
        await tx.orderItem.create({ data: { orderId: o.id, productId: item.id, quantity: item.quantity, price: item.price } });
        // decrement stock
        const prod = await tx.product.findUnique({ where: { id: item.id } });
        if (prod) {
          await tx.product.update({ where: { id: item.id }, data: { stock: prod.stock - item.quantity } as any });
        }
      }
      return o.id;
    });

    return result as number;
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<void> {
    await this.orderModel.updateStatus(id, status);
  }

  async deleteOrder(id: number): Promise<void> {
    await this.orderItemModel.deleteByOrderId(id);
    await this.orderModel.delete(id);
  }

  async getStats(): Promise<OrderStats> {
    return {
      totalOrders: await this.orderModel.count(),
      pendingOrders: await this.orderModel.countByStatus('Pending'),
      totalRevenue: await this.orderModel.sumRevenue(),
    };
  }
}
