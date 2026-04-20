
import express from 'express';
import cors from 'cors';
import { getDatabase, initializeDatabase } from './config/database';
import { PORT } from './config/env';
import { createProductRoutes, createAdminProductRoutes } from './routes/product';
import { createAuthRoutes } from './routes/auth';
import { createOrderRoutes, createAdminOrderRoutes } from './routes/order';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
import path from 'path';
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

// Initialize database and schema
await initializeDatabase();
const db = getDatabase();

// Public API
app.use('/api/products', createProductRoutes(db));
app.use('/api/auth', createAuthRoutes(db));
app.use('/api/orders', createOrderRoutes(db));

import { authenticateAdmin } from './middleware/auth';

// Admin API
app.use('/api/admin/products', authenticateAdmin, createAdminProductRoutes(db));
app.use('/api/admin/orders', authenticateAdmin, createAdminOrderRoutes(db));

app.get('/', (_req, res) => res.json({ status: 'ok' }));

// Global Express Error Handler to prevent HTML proxy fallback locally
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Global Express Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

