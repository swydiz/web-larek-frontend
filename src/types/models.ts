import { Product, CartItem } from './product';
import { Order } from './order';
import { ApiListResponse } from '../components/base/api';

export interface ProductModel {
  getProducts(): Promise<ApiListResponse<Product>>;
  getProductById(id: number): Product | undefined;
}

export interface CartModel {
  items: CartItem[];
  addItem(product: Product, quantity: number): void;
  removeItem(productId: number): void;
  updateQuantity(productId: number, quantity: number): void;
  getTotalPrice(): number;
}

export interface CheckoutModel {
  validateShippingAddress(address: string): boolean;
  validateCustomerInfo(email: string, phone: string): boolean;
  submitOrder(order: Order): Promise<void>;
}