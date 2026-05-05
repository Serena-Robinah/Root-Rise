import dotenv from 'dotenv';
dotenv.config({ override: true });

export const DB_PATH = process.env.DB_PATH || 'database.db';
export const JWT_SECRET = process.env.JWT_SECRET || 'root-and-rise-secret-key';
export const PORT = parseInt(process.env.PORT || '3000', 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rootandrise.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
