// Shared constants between frontend and backend

export const AGE_GROUPS = ['0–1', '2–4', '5–7', '8–10', '11–14'] as const;

export const GENDERS = ['Boys', 'Girls', 'Unisex'] as const;

export const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
] as const;

export const CATEGORIES = [
  'Onesies',
  'Bottoms',
  'Dresses',
  'Tops',
  'Outerwear',
] as const;

export const API_BASE_URL = (() => {
  const viaImportMeta = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL);
  return viaImportMeta ?? '';
})();

export const API_ENDPOINTS = {
  // Auth
  SIGNUP: '/api/auth/signup',
  LOGIN: '/api/auth/login',

  // Products
  PRODUCTS: '/api/products',
  PRODUCT_DETAIL: (id: number) => `/api/products/${id}`,

  // Orders
  CREATE_ORDER: '/api/orders',

  // Admin
  ADMIN_STATS: '/api/admin/orders/stats',
  ADMIN_ORDERS: '/api/admin/orders',
  ADMIN_ORDER_DETAIL: (id: number) => `/api/admin/orders/${id}`,
  ADMIN_ORDER_STATUS: (id: number) => `/api/admin/orders/${id}/status`,
  ADMIN_DELETE_ORDER: (id: number) => `/api/admin/orders/${id}`,
  ADMIN_PRODUCTS: '/api/admin/products',
  ADMIN_UPDATE_PRODUCT: (id: number) => `/api/admin/products/${id}`,
  ADMIN_DELETE_PRODUCT: (id: number) => `/api/admin/products/${id}`,
} as const;

export const JWT_TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user'