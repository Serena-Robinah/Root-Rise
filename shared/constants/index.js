// Shared constants between frontend and backend
export const AGE_GROUPS = ['0–1', '2–4', '5–7', '8–10', '11–14'];
export const GENDERS = ['Boys', 'Girls', 'Unisex'];
export const ORDER_STATUSES = [
    'Pending',
    'Confirmed',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
];
export const CATEGORIES = [
    'Onesies',
    'Bottoms',
    'Dresses',
    'Tops',
    'Outerwear',
];
export const API_BASE_URL = (typeof process !== 'undefined' && process.env?.API_URL) ? process.env.API_URL : '';
export const API_ENDPOINTS = {
    // Auth
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    // Products
    PRODUCTS: '/api/products',
    PRODUCT_DETAIL: (id) => `/api/products/${id}`,
    // Orders
    CREATE_ORDER: '/api/orders',
    // Admin
    ADMIN_STATS: '/api/admin/orders/stats',
    ADMIN_ORDERS: '/api/admin/orders',
    ADMIN_ORDER_DETAIL: (id) => `/api/admin/orders/${id}`,
    ADMIN_ORDER_STATUS: (id) => `/api/admin/orders/${id}/status`,
    ADMIN_DELETE_ORDER: (id) => `/api/admin/orders/${id}`,
    ADMIN_PRODUCTS: '/api/admin/products',
    ADMIN_UPDATE_PRODUCT: (id) => `/api/admin/products/${id}`,
    ADMIN_DELETE_PRODUCT: (id) => `/api/admin/products/${id}`,
};
export const JWT_TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user';
//# sourceMappingURL=index.js.map