import { ProductModel } from '../models';
import type { Product } from '@shared/types';

export class ProductService {
  private productModel: ProductModel;

  constructor(db: any) {
    this.productModel = new ProductModel(db);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  async getProductById(id: number): Promise<Product | null> {
    return this.productModel.findById(id);
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<number> {
    return this.productModel.create(product);
  }

  async updateProduct(id: number, product: Partial<Omit<Product, 'id'>>): Promise<void> {
    await this.productModel.update(id, product);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productModel.delete(id);
  }

  async getProductCount(): Promise<number> {
    return this.productModel.count();
  }

  async getLowStockCount(): Promise<number> {
    return this.productModel.countLowStock();
  }

  async hasOrders(productId: number): Promise<boolean> {
    return (await this.productModel.countWithOrders(productId)) > 0;
  }
}