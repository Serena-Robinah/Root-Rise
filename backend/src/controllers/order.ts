import { OrderService } from '../services';
import type { Request, Response } from 'express';
import type { OrderStatus } from '@shared/types';

export class OrderController {
  constructor(private db?: any) { }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const orderService = new OrderService(this.db);
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const orderService = new OrderService(this.db);
      const order = await orderService.getOrderById(Number(id));

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { userId, items, totalAmount, shippingInfo } = req.body;

      if (!items || !totalAmount || !shippingInfo) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const orderService = new OrderService(this.db);
      const orderId = await orderService.createOrder(userId, items, totalAmount, shippingInfo);

      // Send confirmation email
      try {
        const { sendOrderConfirmation } = await import('../services/emailService');
        const order = await orderService.getOrderById(orderId);
        if (order && shippingInfo.email) {
          await sendOrderConfirmation(shippingInfo.email, {
            id: orderId,
            full_name: shippingInfo.fullName,
            total_amount: totalAmount,
            items: order.items,
          });
        }
      } catch (emailErr) {
        console.error('[Email] Failed to send confirmation:', emailErr);
      }

      res.json({ success: true, orderId });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create order' });
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];

      if (!validStatuses.includes(status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }

      const orderService = new OrderService(this.db);
      await orderService.updateOrderStatus(Number(id), status as OrderStatus);

      // Send status update email
      try {
        const { sendOrderStatusUpdate } = await import('../services/emailService');
        const order = await orderService.getOrderById(Number(id));
        if (order && (order as any).user?.email) {
          await sendOrderStatusUpdate((order as any).user.email, {
            full_name: order.full_name || 'Customer',
            order_id: Number(id),
            status,
          });
        }
      } catch (emailErr) {
        console.error('[Email] Failed to send status update:', emailErr);
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const orderService = new OrderService(this.db);
      await orderService.deleteOrder(Number(id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete order' });
    }
  }

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const orderService = new OrderService(this.db);
      const stats = await orderService.getStats();
      const { ProductService } = await import('../services');
      const productService = new ProductService(this.db);

      res.json({
        totalOrders: stats.totalOrders,
        pendingOrders: stats.pendingOrders,
        totalProducts: await productService.getProductCount(),
        lowStockItems: await productService.getLowStockCount(),
        totalRevenue: stats.totalRevenue,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }
}