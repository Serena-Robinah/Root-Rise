import { ProductService } from '../services';
import Database from 'better-sqlite3';

export class ProductController {
  constructor(private db: Database.Database) {}

  getAll(req, res) {
    try {
      const productService = new ProductService(this.db);
      const products = productService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  getById(req, res) {
    try {
      const { id } = req.params;
      const productService = new ProductService(this.db);
      const product = productService.getProductById(Number(id));

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  create(req, res) {
    try {
      const { name, description, price, category, age_group, gender, stock, image_url } = req.body;

      if (!name || !price) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const productService = new ProductService(this.db);
      const id = productService.createProduct({
        name,
        description,
        price,
        category,
        age_group,
        gender,
        stock,
        image_url,
      });

      res.json({ success: true, id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  }

  update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, category, age_group, gender, stock, image_url } = req.body;

      const productService = new ProductService(this.db);
      productService.updateProduct(Number(id), {
        name,
        description,
        price,
        category,
        age_group,
        gender,
        stock,
        image_url,
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  }

  delete(req, res) {
    try {
      const { id } = req.params;
      const productService = new ProductService(this.db);

      if (productService.hasOrders(Number(id))) {
        res.status(400).json({
          error: 'Cannot delete product that has been ordered. Try setting stock to 0 instead.',
        });
        return;
      }

      productService.deleteProduct(Number(id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
}
