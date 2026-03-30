import { CartItem, FreeGift, Product } from '../../types';

export const POINTS_REDEMPTION_RATE = 0.01;

export const addProductToCart = (
  cart: CartItem[],
  product: Product,
  quantity: number,
  selectedGift?: FreeGift
) => {
  const existingProduct = cart.find((item) => item.id === product.id && !item.isFreeGift);
  let nextCart = existingProduct
    ? cart.map((item) =>
        item.id === product.id && !item.isFreeGift
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    : [...cart, { ...product, quantity }];

  const giftToApply = selectedGift ?? product.freeGift ?? product.selectableGifts?.[0];
  if (!giftToApply) {
    return nextCart;
  }

  const existingGift = nextCart.find(
    (item) =>
      item.id === giftToApply.id &&
      item.isFreeGift &&
      item.linkedToProductId === product.id
  );

  if (!existingGift) {
    nextCart = [
      ...nextCart,
      {
        id: giftToApply.id,
        name: `[FREE] ${giftToApply.name}`,
        price: 0,
        category: 'Gift',
        image: giftToApply.image,
        rating: 5,
        reviews: 0,
        description: `Free gift with ${product.name}`,
        quantity,
        isFreeGift: true,
        linkedToProductId: product.id,
      },
    ];
  } else {
    nextCart = nextCart.map((item) =>
      item.id === giftToApply.id &&
      item.isFreeGift &&
      item.linkedToProductId === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }

  return nextCart;
};

export const updateCartItemQuantity = (cart: CartItem[], id: number, delta: number) => {
  const itemToUpdate = cart.find((item) => item.id === id && !item.isFreeGift);
  if (!itemToUpdate) {
    return cart;
  }

  const nextQuantity = Math.max(1, itemToUpdate.quantity + delta);
  return cart.map((item) => {
    if (item.id === id && !item.isFreeGift) {
      return { ...item, quantity: nextQuantity };
    }

    if (item.isFreeGift && item.linkedToProductId === id) {
      return { ...item, quantity: nextQuantity };
    }

    return item;
  });
};

export const removeCartItemGroup = (cart: CartItem[], id: number) => {
  return cart.filter((item) => item.id !== id && item.linkedToProductId !== id);
};

export const calculateCartSubtotal = (cart: CartItem[]) => {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const calculatePointsDiscount = (pointsRedeemed: number) => {
  return pointsRedeemed * POINTS_REDEMPTION_RATE;
};

export const calculateCartTotal = (subtotal: number, pointsRedeemed: number, extraCharges: number = 0) => {
  return Math.max(0, subtotal - calculatePointsDiscount(pointsRedeemed) + extraCharges);
};

export const calculatePointsEarned = (total: number) => {
  return Math.floor(Math.max(0, total));
};
