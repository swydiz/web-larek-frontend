import { Product, CartItem } from './product';

export interface MainPageView {
  render(products: Product[]): void;
  setBasketCount(count: number): void;
}

export interface CartView {
  render(cartItemElements: HTMLElement[], totalPrice: number): void;
  setTotalPrice(totalPrice: number): void;
}

