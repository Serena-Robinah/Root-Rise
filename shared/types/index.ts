// Shared types between frontend and backend
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  age_group: string;
  gender: string;
  stock: number;
  image_url: string;
  sizes?: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  email_verified: boolean;
  verification_token?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface Order {
  id: number;
  user_id: number | null;
  total_amount: number;
  status: OrderStatus;
  full_name: string;
  phone: string;
  address: string;
  created_at: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name?: string;
  image_url?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  orderId?: number;
}