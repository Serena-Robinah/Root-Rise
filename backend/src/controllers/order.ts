import { OrderService } from '../services';
import type { Response } from 'express';

export class OrderController {
  constructor(private db?: any) {}

  async getAll(req, res) {
    try {
      const orderService = new OrderService(this.db);
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  async getById(req, res) {
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

  async create(req, res) {
    try {
      const { userId, items, totalAmount, shippingInfo } = req.body;

      if (!items || !totalAmount || !shippingInfo) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const orderService = new OrderService(this.db);
      const orderId = await orderService.createOrder(userId, items, totalAmount, shippingInfo);

      res.json({ success: true, orderId });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create order' });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = [
        'Pending',
        'Confirmed',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ];

      if (!validStatuses.includes(status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }

      const orderService = new OrderService(this.db);
      await orderService.updateOrderStatus(Number(id), status as any);

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const orderService = new OrderService(this.db);
      await orderService.deleteOrder(Number(id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete order' });
    }
  }

  async getStats(req: any, res: Response): Promise<void> {
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

