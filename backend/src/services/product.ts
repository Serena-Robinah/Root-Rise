import Database from 'better-sqlite3';
import { ProductModel } from '../models';
import type { Product } from '@shared/types';

export class ProductService {
  private productModel: ProductModel;

  constructor(db: Database.Database) {
    this.productModel = new ProductModel(db);
  }

  getAllProducts(): Product[] {
    return this.productModel.findAll();
  }

  getProductById(id: number): Product | undefined {
    return this.productModel.findById(id);
  }

  createProduct(product: Omit<Product, 'id'>): number {
    return this.productModel.create(product);
  }

  updateProduct(id: number, product: Partial<Omit<Product, 'id'>>): void {
    this.productModel.update(id, product);
  }

  deleteProduct(id: number): void {
    this.productModel.delete(id);
  }

  getProductCount(): number {
    return this.productModel.count();
  }

  getLowStockCount(): number {
    return this.productModel.countLowStock();
  }

  hasOrders(productId: number): boolean {
    return this.productModel.countWithOrders(productId) > 0;
  }
}
