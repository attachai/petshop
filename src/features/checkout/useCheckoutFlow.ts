import { useCallback, useMemo, useState } from 'react';

import { authStore } from '../../services/authService';
import { dataService, handleDataError, OperationType } from '../../services/dataService';
import { CartItem } from '../../types';
import { calculateCartSubtotal, calculateCartTotal, calculatePointsDiscount } from '../shop/cartUtils';
import { BRANCHES, INSTANT_SERVICES, STANDARD_SERVICES } from './constants';
import { AddressForm, CheckoutStep, DeliveryMethod, DeliveryType, PaymentMethod } from './types';
import { getSelectedBranch, getSelectedShippingService, getShippingCarrier, getShippingFee } from './utils';

const initialAddress: AddressForm = {
  name: '',
  phone: '',
  details: '',
  province: '',
  zip: '',
};

interface UseCheckoutFlowOptions {
  cart: CartItem[];
  pointsRedeemed: number;
  onOrderComplete: (pointsRedeemed: number) => void;
}

export const useCheckoutFlow = ({ cart, pointsRedeemed, onOrderComplete }: UseCheckoutFlowOptions) => {
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('standard');
  const [selectedBranchId, setSelectedBranchId] = useState(1);
  const [selectedInstantService, setSelectedInstantService] = useState('grab');
  const [selectedStandardService, setSelectedStandardService] = useState('kerry');
  const [address, setAddress] = useState<AddressForm>(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>(1);
  const [orderNote, setOrderNote] = useState('');

  const subtotal = useMemo(() => calculateCartSubtotal(cart), [cart]);
  const discount = useMemo(() => calculatePointsDiscount(pointsRedeemed), [pointsRedeemed]);
  const shippingFee = useMemo(
    () => getShippingFee(deliveryMethod, deliveryType, selectedInstantService, selectedStandardService),
    [deliveryMethod, deliveryType, selectedInstantService, selectedStandardService]
  );
  const total = useMemo(
    () => calculateCartTotal(subtotal, pointsRedeemed, shippingFee),
    [subtotal, pointsRedeemed, shippingFee]
  );
  const selectedBranch = useMemo(() => getSelectedBranch(selectedBranchId), [selectedBranchId]);
  const selectedShippingService = useMemo(
    () => getSelectedShippingService(deliveryType, selectedInstantService, selectedStandardService),
    [deliveryType, selectedInstantService, selectedStandardService]
  );

  const updateAddress = useCallback((field: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }, []);

  const validateStep1 = useCallback(() => {
    setError(null);

    if (deliveryMethod === 'delivery') {
      if (!address.name || !address.phone || !address.details || !address.province || !address.zip) {
        setError('Please fill in all address fields');
        return false;
      }

      if (!/^\d{9,10}$/.test(address.phone.replace(/[-\s]/g, ''))) {
        setError('Please enter a valid phone number');
        return false;
      }
    }

    return true;
  }, [address, deliveryMethod]);

  const goToStep = useCallback((step: CheckoutStep) => {
    setCheckoutStep(step);
  }, []);

  const goToNextStep = useCallback(() => {
    if (checkoutStep === 1) {
      if (validateStep1()) {
        setCheckoutStep(2);
      }
      return;
    }

    if (checkoutStep === 2) {
      setCheckoutStep(3);
    }
  }, [checkoutStep, validateStep1]);

  const placeOrder = useCallback(async () => {
    setError(null);

    if (!validateStep1()) {
      setCheckoutStep(1);
      return;
    }

    if (!authStore.currentUser) {
      setError('Please sign in to place an order');
      return;
    }

    setIsProcessing(true);

    const orderNumber = `TPS${Date.now().toString().slice(-8)}`;
    const trackingNumber = `TH${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const shippingCarrier = getShippingCarrier(deliveryMethod, deliveryType, selectedInstantService, selectedStandardService);
    const orderItems = cart.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice || null,
      quantity: item.quantity,
      image: item.image,
      isFreeGift: item.isFreeGift || false,
      freeGift: item.freeGift || null,
      selectableGifts: item.selectableGifts || null,
      badge: item.badge || null,
    }));

    try {
      await dataService.createOrder(authStore.currentUser.uid, {
        id: `ord-${Date.now()}`,
        orderNumber,
        status: 'pending',
        totalAmount: total,
        currency: 'THB',
        trackingNumber,
        carrier: shippingCarrier,
        createdAtMs: Date.now(),
        items: orderItems,
      });

      setCompletedOrderNumber(orderNumber);
      setIsSuccess(true);
      onOrderComplete(pointsRedeemed);
    } catch (err) {
      handleDataError(err, OperationType.CREATE, 'orders');
      setError('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [
    cart,
    deliveryMethod,
    deliveryType,
    onOrderComplete,
    pointsRedeemed,
    selectedInstantService,
    selectedStandardService,
    total,
    validateStep1,
  ]);

  return {
    address,
    branches: BRANCHES,
    checkoutStep,
    completedOrderNumber,
    deliveryMethod,
    deliveryType,
    discount,
    error,
    instantServices: INSTANT_SERVICES,
    isProcessing,
    isSuccess,
    orderNote,
    paymentMethod,
    selectedBranch,
    selectedBranchId,
    selectedInstantService,
    selectedShippingService,
    selectedStandardService,
    shippingFee,
    standardServices: STANDARD_SERVICES,
    subtotal,
    total,
    goToNextStep,
    goToStep,
    placeOrder,
    setDeliveryMethod,
    setDeliveryType,
    setOrderNote,
    setPaymentMethod,
    setSelectedBranchId,
    setSelectedInstantService,
    setSelectedStandardService,
    updateAddress,
  };
};

export type CheckoutFlowState = ReturnType<typeof useCheckoutFlow>;

