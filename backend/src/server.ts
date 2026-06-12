import './config/env'; 
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

// Read allowed origins from env FRONTEND_URLS (comma-separated)
const allowed = (process.env.FRONTEND_URLS || 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, cb) => {
    // allow non-browser tools (e.g., curl) by default when origin is undefined
    if (!origin) return cb(null, true);
    return cb(null, allowed.includes(origin) ? origin : false);
  },
  credentials: true
}));

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