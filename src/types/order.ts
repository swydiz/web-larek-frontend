export interface ContactFormData {
  email: string;
  phone: string;
}

export interface DeliveryAddressFormData {
  shippingAddress: string;
  paymentMethod: 'online' | 'cash';
}