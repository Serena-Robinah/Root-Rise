# Refactoring & Migration Guide

## 📋 Summary of Changes

This refactoring reorganizes your monolithic Root-Rise project into a clean, modular architecture following **SOLID**, **DRY**, and **KISS** principles.

### Directory Structure

**Before:**
```
Root-Rise/
├── src/ (everything mixed)
├── public/
├── server.ts (400+ lines, everything in one file)
└── package.json
```

**After:**
```
Root-Rise/
├── backend/
│   ├── src/
│   │   ├── server.ts (clean entry point)
│   │   ├── routes/    (API route definitions)
│   │   ├── controllers/ (HTTP request handlers)
│   │   ├── services/  (business logic)
│   │   ├── models/    (database queries)
│   │   ├── middleware/ (auth, error handling)
│   │   ├── config/    (database, environment)
│   │   └── types/     (TypeScript interfaces)
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── pages/     (full page components)
│   │   ├── components/ (reusable UI components)
│   │   ├── services/  (API service layer ✨ NEW)
│   │   ├── store/     (Zustand stores)
│   │   ├── hooks/     (custom hooks)
│   │   ├── config/    (constants & env)
│   │   ├── utils/     (utilities)
│   │   ├── types/     (TypeScript interfaces)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── assets/
│   ├── package.json
│   └── tsconfig.json
├── shared/
│   ├── types/         (shared types ✨ NEW)
│   ├── constants/     (shared constants ✨ NEW)
│   └── package.json
├── package.json       (root orchestrator)
└── README.md
```

---

## 🎯 Key Improvements

### 1. **DRY Principle - Eliminated Code Duplication**

**Problem:** API calls repeated 5+ times across pages
```typescript
// ❌ Before (in every page)
fetch('/api/products').then(r => r.json())
fetch('/api/products/:id').then(r => r.json())
```

**Solution:** Centralized service layer
```typescript
// ✅ After (single source of truth)
import { productService } from '@/services';
const products = await productService.getAll();
const product = await productService.getById(id);
```

### 2. **SOLID Principle - Separation of Concerns**

#### Backend

**Before:** 400+ line monolithic `server.ts`
```
server.ts (400+ lines)
├── DB initialization
├── Auth routes
├── Product routes
├── Order routes
├── Admin routes
└── Error handling
```

**After:** Modular structure
```
server.ts (clean entry point, 100 lines)
├── config/database.ts (DB setup)
├── routes/ (route definitions)
├── controllers/ (HTTP handlers)
├── services/ (business logic)
└── middleware/ (auth, errors)
```

#### Frontend

**Before:** Pages directly call `fetch()`
```typescript
// ❌ Hard to test, tightly coupled
const Login = () => {
  const handleLogin = async (email, password) => {
    const res = await fetch('/api/auth/login', {...});
  };
};
```

**After:** Services handle API calls
```typescript
// ✅ Easy to test, mockable
import { authService } from '@/services';
const Login = () => {
  const handleLogin = async (email, password) => {
    const user = await authService.login(email, password);
  };
};
```

### 3. **KISS Principle - Simplicity**

- Clear folder structure
- Self-documenting code organization
- Easy to locate features
- Minimal dependencies

---

## 🚀 Migration Steps

### Step 1: Move Frontend Files
```bash
# Copy existing frontend files to new location
cp -r src/* frontend/src/
cp public frontend/
cp vite.config.ts frontend/
cp tsconfig.json frontend/

# Update imports in frontend files
# Change: import types from '../types'
# To:     import types from '@/types'
```

### Step 2: Install Dependencies
```bash
cd backend
npm install

cd ../frontend
npm install

cd ..
npm install
```

### Step 3: Update Environment
```bash
cp .env.example .env
# Set GEMINI_API_KEY if needed
```

### Step 4: Test Setup
```bash
# From root directory
npm run dev

# This runs:
# - Backend on http://localhost:3000
# - Frontend on http://localhost:5173
```

---

## 📦 Database Recommendations

### Current: SQLite
✅ **Pros:**
- Zero setup
- Perfect for development
- Good for small/medium projects

❌ **Cons:**
- Not ideal for production at scale
- No advanced features
- Limited concurrency

### Suggested Alternatives

#### 1. **PostgreSQL** (Recommended for production)
```bash
npm install pg
```

**Why:** 
- Production-ready
- Better performance at scale
- Advanced features (JSONB, Full-text search)
- Reliable transactions
- Cost-effective

**Setup:**
```bash
# Using Docker
docker run -e POSTGRES_PASSWORD=password -d postgres
```

**Migration from SQLite:**
```typescript
// Use tools like pgloader or write custom migration
// Simple schema translation
```

#### 2. **MongoDB** (If flexible schema needed)
- Good for: Content with varying structure
- Not ideal for: Transactional ecommerce

#### 3. **Supabase** (PostgreSQL + Backend-as-a-Service)
- PostgreSQL database
- Easy deployment
- Built-in auth
- Real-time capabilities

### Current Schema (Works with all DBs)

```typescript
users {
  id: number (PK)
  name: string
  email: string (UNIQUE)
  password_hash: string
  role: 'customer' | 'admin'
}

products {
  id: number (PK)
  name: string
  description: string
  price: number
  category: string
  age_group: string
  gender: string
  stock: number
  image_url: string
}

orders {
  id: number (PK)
  user_id: number (FK → users)
  total_amount: number
  status: 'Pending' | 'Confirmed' | 'Out for Delivery' | 'Delivered' | 'Cancelled'
  full_name: string
  phone: string
  address: string
  created_at: datetime
}

order_items {
  id: number (PK)
  order_id: number (FK → orders)
  product_id: number (FK → products)
  quantity: number
  price: number
}
```

### Suggested Enhancements

#### 1. Add Shipping Address Table (Normalize)
```sql
CREATE TABLE shipping_addresses (
  id INTEGER PRIMARY KEY,
  order_id INTEGER FK,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT
);
```

#### 2. Add Created/Updated Timestamps
```sql
-- For all tables
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

#### 3. Add User Email Verification
```sql
CREATE TABLE email_verifications (
  id INTEGER PRIMARY KEY,
  user_id INTEGER FK,
  token TEXT UNIQUE,
  expires_at DATETIME,
  verified_at DATETIME
);
```

#### 4. Add Product Reviews/Ratings
```sql
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY,
  product_id INTEGER FK,
  user_id INTEGER FK,
  rating INTEGER (1-5),
  comment TEXT,
  created_at DATETIME
);
```

---

## ✨ New Features Enabled by This Structure

### 1. Easy to Add Features
```typescript
// Create new service
export class CartServiceClient {
  getCart() { }
  addItem() { }
  removeItem() { }
}

// Use in components
import { cartService } from '@/services';
```

### 2. Easy to Mock for Testing
```typescript
// Mock for testing
jest.mock('@/services', () => ({
  productService: {
    getAll: jest.fn(() => Promise.resolve([...]))
  }
}));
```

### 3. Easy to Change API URL
```typescript
// One place to change
// shared/constants/index.ts
export const API_BASE_URL = process.env.REACT_APP_API_URL
```

### 4. Shared Types Between Frontend & Backend
```typescript
// Both use same types from /shared
import type { Order, Product, User } from '@shared/types';
```

---

## 📝 Next Steps

### Short Term
1. ✅ Refactor code structure (DONE)
2. Copy existing frontend files to new location
3. Install dependencies for both packages
4. Test that dev server works
5. Update components to use new services

### Medium Term
1. Add unit tests
2. Add error boundary
3. Improve error handling UI
4. Add loading states

### Long Term
1. Consider database migration to PostgreSQL
2. Add API rate limiting
3. Add caching layer
4. Docker containerization
5. CI/CD pipeline

---

## 🔗 File Mappings

After this refactoring, here's where things moved:

| File | Old Location | New Location |
|------|-------------|--------------|
| React components | `src/components/` | `frontend/src/components/` |
| Pages | `src/pages/` | `frontend/src/pages/` |
| Stores | `src/store/` | `frontend/src/store/` |
| Types | `src/types.ts` | `shared/types/index.ts` |
| Auth route | `server.ts` line 80+ | `backend/src/routes/auth.ts` |
| Product route | `server.ts` line 120+ | `backend/src/routes/product.ts` |
| Order route | `server.ts` line 150+ | `backend/src/routes/order.ts` |

---

## ❓ FAQ

**Q: Do I need to delete old files?**
A: Yes, after confirming everything works:
- Delete old `src/` folder
- Delete old `server.ts`
- Delete old `vite.config.ts`

**Q: Can I still use SQLite?**
A: Yes! Keep using SQLite for development. The new structure works with any database.

**Q: How do I move existing data?**
A: SQLite stores data in `database.db`. Copy this file to the root directory, and it will work with the new backend.

**Q: What about environment variables?**
A: Use `.env` in root. Backend reads from here.

---

## 📚 Resources

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [DRY Principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
- [KISS Principle](https://en.wikipedia.org/wiki/KISS_principle)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Best Practices](https://react.dev/learn)
