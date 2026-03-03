import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.db");
const JWT_SECRET = process.env.JWT_SECRET || "root-and-rise-secret-key";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    age_group TEXT,
    gender TEXT,
    stock INTEGER DEFAULT 0,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'Pending',
    full_name TEXT,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  );
`);

// Seed initial products if empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products (name, description, price, category, age_group, gender, stock, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialProducts = [
    ["Organic Cotton Onesie", "Soft organic cotton for your newborn.", 25.00, "Onesies", "0–1", "Unisex", 50, "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=400&h=500&auto=format&fit=crop"],
    ["Denim Overalls", "Classic denim overalls for active toddlers.", 35.00, "Bottoms", "2–4", "Unisex", 30, "https://images.unsplash.com/photo-1519233940173-69272332650d?q=80&w=400&h=500&auto=format&fit=crop"],
    ["Floral Summer Dress", "Beautiful floral print dress for sunny days.", 45.00, "Dresses", "5–7", "Girls", 20, "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=400&h=500&auto=format&fit=crop"],
    ["Graphic Tee - Space Explorer", "Cool space-themed graphic tee.", 18.00, "Tops", "8–10", "Boys", 40, "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=400&h=500&auto=format&fit=crop"],
    ["Cozy Knit Sweater", "Warm knit sweater for chilly evenings.", 55.00, "Outerwear", "11–14", "Unisex", 15, "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=400&h=500&auto=format&fit=crop"],
    ["Linen Shorts", "Lightweight linen shorts for summer comfort.", 22.00, "Bottoms", "2–4", "Boys", 25, "https://images.unsplash.com/photo-1591335297743-533298868677?q=80&w=400&h=500&auto=format&fit=crop"],
    ["Tutu Skirt", "Sparkly tutu skirt for little princesses.", 30.00, "Bottoms", "5–7", "Girls", 18, "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=400&h=500&auto=format&fit=crop"],
    ["Hooded Raincoat", "Waterproof raincoat with cute patterns.", 40.00, "Outerwear", "8–10", "Unisex", 12, "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=400&h=500&auto=format&fit=crop"],
  ];

  initialProducts.forEach(p => insertProduct.run(...p));
}

// Seed admin user if empty
const adminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get() as { count: number };
if (adminCount.count === 0) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)").run("Admin", "admin@rootandrise.com", hashedPassword, "admin");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Auth
  app.post("/api/auth/signup", (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      // Default role is 'customer'
      const result = db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)").run(name, email, hashedPassword, 'customer');
      const user = { id: result.lastInsertRowid, name, email, role: 'customer' };
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (user && bcrypt.compareSync(password, user.password_hash)) {
      const { password_hash, ...userWithoutPassword } = user;
      const token = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: '7d' });
      res.json({ user: userWithoutPassword, token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Products (Public)
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.get("/api/products/:id", (req, res) => {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ error: "Product not found" });
  });

  // Orders (Public/Authenticated)
  app.post("/api/orders", (req, res) => {
    const { userId, items, totalAmount, shippingInfo } = req.body;
    const { fullName, phone, address } = shippingInfo;

    const transaction = db.transaction(() => {
      const result = db.prepare(`
        INSERT INTO orders (user_id, total_amount, full_name, phone, address)
        VALUES (?, ?, ?, ?, ?)
      `).run(userId, totalAmount, fullName, phone, address);

      const orderId = result.lastInsertRowid;

      const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `);

      for (const item of items) {
        insertItem.run(orderId, item.id, item.quantity, item.price);
        db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").run(item.quantity, item.id);
      }

      return orderId;
    });

    try {
      const orderId = transaction();
      res.json({ success: true, orderId });
    } catch (error) {
      res.status(500).json({ error: "Failed to place order" });
    }
  });

  // --- Admin Middleware ---
  const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'admin') return res.status(403).json({ error: "Forbidden: Admin access required" });
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // --- Admin API Routes ---

  // Dashboard Stats
  app.get("/api/admin/stats", authenticateAdmin, (req, res) => {
    const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get() as any;
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'").get() as any;
    const totalProducts = db.prepare("SELECT COUNT(*) as count FROM products").get() as any;
    const lowStockItems = db.prepare("SELECT COUNT(*) as count FROM products WHERE stock < 5").get() as any;
    const totalRevenue = db.prepare("SELECT SUM(total_amount) as total FROM orders WHERE status != 'Cancelled'").get() as any;

    res.json({
      totalOrders: totalOrders.count,
      pendingOrders: pendingOrders.count,
      totalProducts: totalProducts.count,
      lowStockItems: lowStockItems.count,
      totalRevenue: totalRevenue.total || 0
    });
  });

  // Admin Orders
  app.get("/api/admin/orders", authenticateAdmin, (req, res) => {
    const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
    res.json(orders);
  });

  app.get("/api/admin/orders/:id", authenticateAdmin, (req, res) => {
    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id) as any;
    if (!order) return res.status(404).json({ error: "Order not found" });
    
    const items = db.prepare(`
      SELECT oi.*, p.name as product_name, p.image_url 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ?
    `).all(req.params.id);
    
    res.json({ ...order, items });
  });

  app.patch("/api/admin/orders/:id/status", authenticateAdmin, (req, res) => {
    const { status } = req.body;
    const validStatuses = ["Pending", "Confirmed", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });
    
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/orders/:id", authenticateAdmin, (req, res) => {
    db.prepare("DELETE FROM order_items WHERE order_id = ?").run(req.params.id);
    db.prepare("DELETE FROM orders WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Admin Products
  app.post("/api/admin/products", authenticateAdmin, (req, res) => {
    const { name, description, price, category, age_group, gender, stock, image_url } = req.body;
    const result = db.prepare(`
      INSERT INTO products (name, description, price, category, age_group, gender, stock, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, description, price, category, age_group, gender, stock, image_url);
    res.json({ success: true, id: result.lastInsertRowid });
  });

  app.put("/api/admin/products/:id", authenticateAdmin, (req, res) => {
    const { name, description, price, category, age_group, gender, stock, image_url } = req.body;
    db.prepare(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, category = ?, age_group = ?, gender = ?, stock = ?, image_url = ?
      WHERE id = ?
    `).run(name, description, price, category, age_group, gender, stock, image_url, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/products/:id", authenticateAdmin, (req, res) => {
    // Check if product is in any orders
    const orderCount = db.prepare("SELECT COUNT(*) as count FROM order_items WHERE product_id = ?").get(req.params.id) as any;
    if (orderCount.count > 0) {
      return res.status(400).json({ error: "Cannot delete product that has been ordered. Try setting stock to 0 instead." });
    }
    db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
