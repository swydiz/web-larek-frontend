import { Product, CartItem } from './product';

export interface ProductModel {
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Product | undefined;
}

export interface CartModel {
  items: CartItem[];
  addItem(product: Product): void;
  removeItem(productId: number): void;
  getTotalPrice(): number;
}
