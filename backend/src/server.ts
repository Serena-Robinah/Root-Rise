import express from 'express';
import cors from 'cors';
import path from 'path';
import { getDatabase, initializeDatabase } from './config/database';
import { PORT } from './config/env';
import { createProductRoutes, createAdminProductRoutes } from './routes/product';
import { createAuthRoutes } from './routes/auth';
import { createOrderRoutes, createAdminOrderRoutes } from './routes/order';
import { authenticateAdmin } from './middleware/auth';

const app = express();

// Restrict CORS to the frontend origin if provided, fallback to localhost:5173 for dev
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));

// Add COOP header to allow Google postMessage flows (One Tap / popup communication)
app.use((_req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

async function startServer() {
  // Initialize database and schema
  await initializeDatabase();
  const db = getDatabase();

  // Public API
  app.use('/api/products', createProductRoutes(db));
  app.use('/api/auth', createAuthRoutes(db));
  app.use('/api/orders', createOrderRoutes(db));

  // Admin API
  app.use('/api/admin/products', authenticateAdmin, createAdminProductRoutes(db));
  app.use('/api/admin/orders', authenticateAdmin, createAdminOrderRoutes(db));

  app.get('/', (_req, res) => res.json({ status: 'ok' }));

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
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});