import { Product } from './product';
import { CartItem } from './product';

export interface ProductListView {
  render(products: Product[]): void;
}

export interface ProductView {
  render(product: Product): void;
}

export interface CartView {
  render(cartItems: CartItem[], totalPrice: number): void;
}

export interface CheckoutView {
  render(): void;
  displayError(message: string): void;
  displaySuccess(): void;
}