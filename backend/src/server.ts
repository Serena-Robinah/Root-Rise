
import express from 'express';
import cors from 'cors';
import { getDatabase, initializeDatabase } from './config/database';
import { PORT } from './config/env';
import { createProductRoutes, createAdminProductRoutes } from './routes/product';
import { createAuthRoutes } from './routes/auth';
import { createOrderRoutes, createAdminOrderRoutes } from './routes/order';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database and schema
await initializeDatabase();
const db = getDatabase();

// Public API
app.use('/api/products', createProductRoutes(db));
app.use('/api/auth', createAuthRoutes(db));
app.use('/api/orders', createOrderRoutes(db));

// Admin API
app.use('/api/admin/products', createAdminProductRoutes(db));
app.use('/api/admin/orders', createAdminOrderRoutes(db));

app.get('/', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
	console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
	console.error('Unhandled rejection:', reason);
});

