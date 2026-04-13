// Re-export types from shared
export type { Product, User, CartItem, Order, OrderItem, AuthResponse, ApiResponse, OrderStatus } from '@shared/types';

// Frontend-specific types
export interface FormErrors {
  [key: string]: string;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}
