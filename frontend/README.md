# Root & Rise Frontend

React + TypeScript SPA for Root & Rise ecommerce platform.

## Architecture

Following **SOLID**, **DRY**, and **KISS** principles:

```
src/
├── components/      # React components (reusable UI)
├── pages/          # Page components (full pages)
├── services/       # API service layer (HTTP calls)
├── store/          # Zustand stores (state management)
├── hooks/          # Custom React hooks
├── config/         # Configuration & constants
├── types/          # TypeScript interfaces
├── utils/          # Utility functions
├── assets/         # Images, fonts
├── App.tsx         # Root component
└── main.tsx        # App entry point
```

## Setup

```bash
# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:3000" > .env.local

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Service Layer (DRY Principle)

Services handle all API calls, eliminating code duplication:

```typescript
// Before (❌ repeated in every component)
const products = await fetch('/api/products').then(r => r.json());

// After (✅ single source of truth)
import { productService } from '@/services';
const products = await productService.getAll();
```

## Key Libraries

- **React Router** - Page navigation
- **Zustand** - State management (auth, cart)
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **TailwindCSS** - Styling
- **Material-UI** - Components & data grids
- **Notistack** - Notifications

## Features

### Customer
- Browse & filter products by age group, gender, category
- View product details
- Add to cart
- Checkout & order placement
- User authentication (signup/login)

### Admin
- Dashboard with statistics
- Order management
- Product management
- Inventory tracking

## Environment Variables

```env
VITE_API_URL=http://localhost:3000
```

## Code Principles Applied

### Single Responsibility
- Services handle API calls
- Components handle UI only
- Stores manage state

### DRY
- Shared types in `/shared`
- Service layer eliminates code duplication
- Utility functions for common operations

### KISS
- Simple folder structure
- Clear naming conventions
- Minimal dependencies
