import { CheckCircle2, CreditCard, Truck } from 'lucide-react';

import { CheckoutStep, PickupBranch, ShippingService } from './types';

export const BRANCHES: PickupBranch[] = [
  { id: 1, name: 'Pet Shop Central World', address: '999/9 Rama I Rd, Pathum Wan, Bangkok 10330', lat: 13.7462, lng: 100.5399, phone: '02-640-7000' },
  { id: 2, name: 'Pet Shop Siam Paragon', address: '991 Rama I Rd, Pathum Wan, Bangkok 10330', lat: 13.7468, lng: 100.535, phone: '02-610-8000' },
  { id: 3, name: 'Pet Shop EmQuartier', address: '693 Sukhumvit Rd, Khlong Tan Nuea, Watthana, Bangkok 10110', lat: 13.7317, lng: 100.5698, phone: '02-269-1000' },
];

export const INSTANT_SERVICES: ShippingService[] = [
  { id: 'grab', name: 'GrabExpress', icon: 'GE', price: 50 },
  { id: 'lalamove', name: 'Lalamove', icon: 'LM', price: 45 },
  { id: 'lineman', name: 'LINE MAN', icon: 'LN', price: 40 },
];

export const STANDARD_SERVICES: ShippingService[] = [
  { id: 'kerry', name: 'Kerry Express', icon: 'KE', price: 25 },
  { id: 'flash', name: 'Flash Express', icon: 'FE', price: 20 },
  { id: 'thai-post', name: 'Thailand Post', icon: 'TP', price: 15 },
];

export const CHECKOUT_STEPS: Array<{
  step: CheckoutStep;
  label: string;
  icon: typeof Truck;
}> = [
  { step: 1, label: 'Delivery', icon: Truck },
  { step: 2, label: 'Payment', icon: CreditCard },
  { step: 3, label: 'Review', icon: CheckCircle2 },
];
