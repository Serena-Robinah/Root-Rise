# Root & Rise Backend

Express.js REST API server for Root & Rise ecommerce platform.

## Architecture

Following **SOLID**, **DRY**, and **KISS** principles:

```
src/
├── config/          # Configuration (database, environment)
├── controllers/     # Request handlers (HTTP layer)
├── models/          # Database queries (Data layer)
├── routes/          # API route definitions
├── services/        # Business logic (Service layer)
├── middleware/      # Auth, error handling
├── types/           # TypeScript interfaces
└── server.ts        # App entry point
```

## Setup

```bash
# Install dependencies
npm install

# Create .env file
cp ../.env.example .env

# Run development server (with auto-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## API Structure

### Authentication Routes (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - Login user

### Product Routes (`/api/products`)
- `GET /` - Get all products
- `GET /:id` - Get product by ID

### Order Routes (`/api/orders`)
- `POST /` - Create order

### Admin Routes (`/api/admin/*`)
- `GET /stats` - Dashboard statistics
- `GET /orders` - List all orders
- `GET /orders/:id` - Get order details
- `PATCH /orders/:id/status` - Update order status
- `DELETE /orders/:id` - Delete order
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

## Database

SQLite with 4 tables:
- **users** - User accounts (role: 'customer' or 'admin')
- **products** - Product inventory
- **orders** - Customer orders
- **order_items** - Order line items

## Code Principles Applied

### Single Responsibility Principle
- Models handle DB queries only
- Services contain business logic
- Controllers handle HTTP requests
- Routes define endpoints

### DRY (Don't Repeat Yourself)
- Shared types in `/shared` folder
- Centralized configuration
- Reusable database models

### KISS (Keep It Simple, Stupid)
- No over-engineering
- Clear separation of concerns
- Easy to test and maintain

## Admin Credentials

Default admin user:
- Email: `admin@rootandrise.com`
- Password: `admin123`

**Change in production!**

## Environment Variables

See `../.env.example` for all available options.
