export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const APP_NAME = 'Root & Rise';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
} as const;
