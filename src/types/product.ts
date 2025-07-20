export interface Product {
  id: number;
  name: string;
  description: string;
  price: number | null;
  image: string;
  category: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
}