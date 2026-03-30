export type CheckoutStep = 1 | 2 | 3;

export type DeliveryMethod = 'pickup' | 'delivery';
export type DeliveryType = 'standard' | 'instant';
export type PaymentMethod = 'card' | 'transfer' | 'qr';

export interface AddressForm {
  name: string;
  phone: string;
  details: string;
  province: string;
  zip: string;
}

export interface PickupBranch {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
}

export interface ShippingService {
  id: string;
  name: string;
  icon: string;
  price: number;
}
