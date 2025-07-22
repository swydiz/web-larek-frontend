import { Product} from './product';

export interface ProductModel {
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Product | undefined;
}

export interface CartModel {
  items: Product[];
  addItem(product: Product): void;
  removeItem(productId: number): void;
  getTotalPrice(): number;
}
