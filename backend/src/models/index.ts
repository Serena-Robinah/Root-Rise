import Database from 'better-sqlite3';
import type { Product, User, Order, OrderItem } from '@shared/types';
//import { API_ENDPOINTS } from '@shared/constants';

export class UserModel {
  constructor(private db: Database.Database) {}

  findByEmail(email: string): User | undefined {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | undefined;
  }

  findById(id: number): User | undefined {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | undefined;
  }

  create(name: string, email: string, passwordHash: string, role: string = 'customer'): number {
    const stmt = this.db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
    const result = stmt.run(name, email, passwordHash, role);
    return result.lastInsertRowid as number;
  }

  countByRole(role: string): number {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?');
    const result = stmt.get(role) as { count: number };
    return result.count;
  }
}

export class ProductModel {
  constructor(private db: Database.Database) {}

  findAll(): Product[] {
    const stmt = this.db.prepare('SELECT * FROM products');
    return stmt.all() as Product[];
  }

  findById(id: number): Product | undefined {
    const stmt = this.db.prepare('SELECT * FROM products WHERE id = ?');
    return stmt.get(id) as Product | undefined;
  }

  create(product: Omit<Product, 'id'>): number {
    const stmt = this.db.prepare(`
      INSERT INTO products (name, description, price, category, age_group, gender, stock, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      product.name,
      product.description,
      product.price,
      product.category,
      product.age_group,
      product.gender,
      product.stock,
      product.image_url
    );
    return result.lastInsertRowid as number;
  }

  update(id: number, product: Partial<Omit<Product, 'id'>>): void {
    const fields = Object.keys(product)
      .map(k => `${k} = ?`)
      .join(', ');
    const values = Object.values(product);
    const stmt = this.db.prepare(`UPDATE products SET ${fields} WHERE id = ?`);
    stmt.run(...values, id);
  }

  delete(id: number): void {
    const stmt = this.db.prepare('DELETE FROM products WHERE id = ?');
    stmt.run(id);
  }

  count(): number {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM products');
    const result = stmt.get() as { count: number };
    return result.count;
  }

  countLowStock(): number {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM products WHERE stock < 5');
    const result = stmt.get() as { count: number };
    return result.count;
  }

  countWithOrders(productId: number): number {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM order_items WHERE product_id = ?');
    const result = stmt.get(productId) as { count: number };
    return result.count;
  }
}

export class OrderModel {
  constructor(private db: Database.Database) {}

  findAll(): Order[] {
    const stmt = this.db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
    return stmt.all() as Order[];
  }

  findById(id: number): Order | undefined {
    const stmt = this.db.prepare('SELECT * FROM orders WHERE id = ?');
    return stmt.get(id) as Order | undefined;
  }

  create(
    userId: number | null,
    totalAmount: number,
    fullName: string,
    phone: string,
    address: string
  ): number {
    const stmt = this.db.prepare(`
      INSERT INTO orders (user_id, total_amount, full_name, phone, address)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(userId, totalAmount, fullName, phone, address);
    return result.lastInsertRowid as number;
  }

  updateStatus(id: number, status: string): void {
    const stmt = this.db.prepare('UPDATE orders SET status = ? WHERE id = ?');
    stmt.run(status, id);
  }

  delete(id: number): void {
    const stmt = this.db.prepare('DELETE FROM orders WHERE id = ?');
    stmt.run(id);
  }

  count(): number {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM orders');
    const result = stmt.get() as { count: number };
    return result.count;
  }

  countByStatus(status: string): number {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM orders WHERE status = ?');
    const result = stmt.get(status) as { count: number };
    return result.count;
  }

  sumRevenue(): number {
    const stmt = this.db.prepare("SELECT SUM(total_amount) as total FROM orders WHERE status != 'Cancelled'");
    const result = stmt.get() as { total: number | null };
    return result.total || 0;
  }
}

export class OrderItemModel {
  constructor(private db: Database.Database) {}

  findByOrderId(orderId: number): OrderItem[] {
    const stmt = this.db.prepare(`
      SELECT oi.*, p.name as product_name, p.image_url 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ?
    `);
    return stmt.all(orderId) as OrderItem[];
  }

  create(orderId: number, productId: number, quantity: number, price: number): void {
    const stmt = this.db.prepare(`
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(orderId, productId, quantity, price);
  }

  deleteByOrderId(orderId: number): void {
    const stmt = this.db.prepare('DELETE FROM order_items WHERE order_id = ?');
    stmt.run(orderId);
  }
}
