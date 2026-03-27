export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FreeGift {
  id: number;
  name: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  category: string;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  description: string;
  reviewsList?: Review[];
  freeGift?: FreeGift;
  selectableGifts?: FreeGift[];
}

export interface CartItem extends Product {
  quantity: number;
  isFreeGift?: boolean;
  linkedToProductId?: number;
}

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  phoneNumber?: string;
  role: 'admin' | 'customer';
}
