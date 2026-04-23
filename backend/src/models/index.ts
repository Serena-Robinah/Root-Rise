import type { Product, User, Order, OrderItem } from '@shared/types';
import { prisma } from '../config/database';
//import { API_ENDPOINTS } from '@shared/constants';


export class UserModel {
  constructor(private db: any) {}

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } }) as Promise<User | null>;
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } }) as Promise<User | null>;
  }

  async create(name: string, email: string, passwordHash: string, role: string = 'customer'): Promise<number> {
    const u = await prisma.user.create({ data: { name, email, password_hash: passwordHash, role } });
    return u.id;
  }

  async countByRole(role: string): Promise<number> {
    return prisma.user.count({ where: { role } });
  }
}

export class ProductModel {
  constructor(private db: any) {}

  async findAll(): Promise<Product[]> {
    return prisma.product.findMany() as Promise<Product[]>;
  }

  async findById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } }) as Promise<Product | null>;
  }

  async create(product: Omit<Product, 'id'>): Promise<number> {
    const p = await prisma.product.create({ data: product as any });
    return p.id;
  }

  async update(id: number, product: Partial<Omit<Product, 'id'>>): Promise<void> {
    await prisma.product.update({ where: { id }, data: product as any });
  }

  async delete(id: number): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return prisma.product.count();
  }

  async countLowStock(): Promise<number> {
    return prisma.product.count({ where: { stock: { lt: 5 } } });
  }

  async countWithOrders(productId: number): Promise<number> {
    return prisma.orderItem.count({ where: { productId } });
  }
}

export class OrderModel {
  constructor(private db: any) {}

  async findAll(): Promise<Order[]> {
    const orders = await prisma.order.findMany({ orderBy: { created_at: 'desc' } });
    return orders.map((o: any) => ({ ...o, user_id: o.userId })) as unknown as Promise<Order[]>;
  }

  async findById(id: number): Promise<Order | null> {
  const o: any = await prisma.order.findUnique({ 
    where: { id },
    include: { user: true }
  });
  if (!o) return null;
  return { ...o, user_id: o.userId } as unknown as Order;
}

  async create(
    userId: number | null,
    totalAmount: number,
    fullName: string,
    phone: string,
    address: string
  ): Promise<number> {
    const o = await prisma.order.create({ data: { userId, total_amount: totalAmount, full_name: fullName, phone, address } as any });
    return o.id;
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await prisma.order.update({ where: { id }, data: { status } });
  }

  async delete(id: number): Promise<void> {
    await prisma.order.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return prisma.order.count();
  }

  async countByStatus(status: string): Promise<number> {
    return prisma.order.count({ where: { status } });
  }

  async sumRevenue(): Promise<number> {
    const r = await prisma.order.aggregate({ _sum: { total_amount: true }, where: { status: { not: 'Cancelled' } } as any });
    return (r._sum.total_amount as number) || 0;
  }
}

export class OrderItemModel {
  constructor(private db: any) {}

  async findByOrderId(orderId: number): Promise<OrderItem[]> {
    const items = await prisma.orderItem.findMany({ where: { orderId }, include: { product: true } });
    return items.map((i: any) => ({
      ...i,
      order_id: i.orderId,
      product_id: i.productId,
      product_name: i.product.name,
      image_url: i.product.image_url
    })) as unknown as OrderItem[];
  }

  async create(orderId: number, productId: number, quantity: number, price: number): Promise<void> {
    await prisma.orderItem.create({ data: { orderId, productId, quantity, price } });
  }

  async deleteByOrderId(orderId: number): Promise<void> {
    await prisma.orderItem.deleteMany({ where: { orderId } });
  }
}
export function formatPrice(amount: number): string {
  return `UGX ${amount.toLocaleString('en-UG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
