import { ProductService } from '../services';
import type { Request, Response } from 'express';

export class ProductController {
  constructor(private db?: any) { }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const productService = new ProductService(this.db);
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error('[Error in ProductController.getAll]:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productService = new ProductService(this.db);
      const product = await productService.getProductById(Number(id));

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  async create(req: Request & { file?: Express.Multer.File }, res: Response): Promise<void> {
    try {
      const { name, description, category, age_group, gender } = req.body;
      const price = parseFloat(req.body.price);
      const stock = parseInt(req.body.stock, 10);
      let image_url = req.body.image_url;

      if (req.file) {
        image_url = (req.file as any).path;
      }

      if (!name || isNaN(price)) {
        res.status(400).json({ error: 'Missing required fields or invalid price' });
        return;
      }

      const productService = new ProductService(this.db);
      const id = await productService.createProduct({
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

  async update(req: Request & { file?: Express.Multer.File }, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, category, age_group, gender } = req.body;
      const price = req.body.price !== undefined ? parseFloat(req.body.price) : undefined;
      const stock = req.body.stock !== undefined ? parseInt(req.body.stock, 10) : undefined;
      let image_url = req.body.image_url;

      if (req.file) {
        image_url = (req.file as any).path;
      }

      const productService = new ProductService(this.db);
      await productService.updateProduct(Number(id), {
        name,
        description,
        ...(price !== undefined && !isNaN(price) && { price }),
        category,
        age_group,
        gender,
        ...(stock !== undefined && !isNaN(stock) && { stock }),
        ...(image_url && { image_url }),
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productService = new ProductService(this.db);

      if (await productService.hasOrders(Number(id))) {
        res.status(400).json({
          error: 'Cannot delete product that has been ordered. Try setting stock to 0 instead.',
        });
        return;
      }

      await productService.deleteProduct(Number(id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
}