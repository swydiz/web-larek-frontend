import { CartItem } from './product';

export interface Order {
  cartItems: CartItem[];
  shippingAddress: string;
  paymentMethod: string;
  customerEmail: string;
  customerPhone: string;
}