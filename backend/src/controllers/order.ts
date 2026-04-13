import { OrderService } from '../services';
import Database from 'better-sqlite3';
import type { Response } from 'express';

export class OrderController {
  constructor(private db: Database.Database) {}

  getAll(req, res) {
    try {
      const orderService = new OrderService(this.db);
      const orders = orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  getById(req, res) {
    try {
      const { id } = req.params;
      const orderService = new OrderService(this.db);
      const order = orderService.getOrderById(Number(id));

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  }

  create(req, res) {
    try {
      const { userId, items, totalAmount, shippingInfo } = req.body;

      if (!items || !totalAmount || !shippingInfo) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const orderService = new OrderService(this.db);
      const orderId = orderService.createOrder(userId, items, totalAmount, shippingInfo);

      res.json({ success: true, orderId });
    } catch (error) {
      res.status(500).json({ error: error.message || 'Failed to create order' });
    }
  }

  updateStatus(req, res) {
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
      orderService.updateOrderStatus(Number(id), status);

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  }

  delete(req, res) {
    try {
      const { id } = req.params;
      const orderService = new OrderService(this.db);
      orderService.deleteOrder(Number(id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete order' });
    }
  }

  async getStats(req: any, res: Response): Promise<void> {
    try {
      const orderService = new OrderService(this.db);
      const stats = orderService.getStats();
      const productService = new (await import('../services')).ProductService(this.db);

      res.json({
        totalOrders: stats.totalOrders,
        pendingOrders: stats.pendingOrders,
        totalProducts: productService.getProductCount(),
        lowStockItems: productService.getLowStockCount(),
        totalRevenue: stats.totalRevenue,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }
}

