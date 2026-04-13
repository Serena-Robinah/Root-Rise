import { Request } from 'express';
import type { User } from '@shared/types';

export interface AuthRequest extends Request {
  user?: User;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  age_group: string;
  gender: string;
  stock: number;
  image_url: string;
}

export interface CreateOrderRequest {
  userId: number | null;
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
}
