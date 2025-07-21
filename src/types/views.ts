import { Product } from './product';

export interface MainPageView {
  render(products: Product[]): void;
  setBasketCount(count: number): void;
}

export interface CartView {
  render(cartItemElements: HTMLElement[]): void;
  setTotalPrice(totalPrice: number): void;
}

