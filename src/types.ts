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

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  email_verified: boolean;
}

export interface Order {
  id: number;
  user_id: number | null;
  total_amount: number;
  status: 'Pending' | 'Confirmed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  full_name: string;
  phone: string;
  address: string;
  created_at: string;
}