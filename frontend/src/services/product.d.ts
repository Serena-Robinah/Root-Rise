import type { Product } from '@shared/types';
export declare class ProductServiceClient {
    getAll(): Promise<Product[]>;
    getById(id: number): Promise<Product>;
    create(product: Omit<Product, 'id'>): Promise<{
        success: boolean;
        id: number;
    }>;
    update(id: number, product: Partial<Omit<Product, 'id'>>): Promise<{
        success: boolean;
    }>;
    delete(id: number): Promise<{
        success: boolean;
    }>;
}
export declare const productService: ProductServiceClient;
//# sourceMappingURL=product.d.ts.map