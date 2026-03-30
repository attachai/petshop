import React, { useEffect, useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ShoppingBag, X, ChevronDown, ChevronUp } from 'lucide-react';
import { CartItem } from '../types';
import { calculateCartSubtotal, calculateCartTotal, calculatePointsDiscount, calculatePointsEarned } from '../features/shop/cartUtils';
import { useAuth } from '../contexts/AuthContext';

const CartItemCard: React.FC<{ item: CartItem, updateQuantity: (id: number, delta: number) => void, removeItem: (id: number) => void }> = ({ item, updateQuantity, removeItem }) => {
  const [showGift, setShowGift] = useState(false);
  const hasDiscount = item.originalPrice && item.price < item.originalPrice;
  const badgeText = item.badge || (hasDiscount ? 'SALE' : (item.freeGift || item.selectableGifts) ? 'FREE GIFT' : null);

  return (
    <div className={`flex flex-col gap-2 group p-3 rounded-2xl transition-colors ${item.isFreeGift ? 'bg-emerald-50/50 border border-emerald-100/50' : ''}`}>
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          {badgeText && !item.isFreeGift && (
            <div className={`absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded text-[8px] font-bold text-white shadow-sm flex items-center gap-1 ${
              badgeText.toUpperCase() === 'SALE' ? 'bg-rose-500' : 
              badgeText.toUpperCase() === 'FREE GIFT' ? 'bg-emerald-500' : 
              'bg-slate-900'
            }`}>
              {badgeText}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-slate-900 truncate">{item.name}</h4>
            {item.isFreeGift && (
              <span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter flex-shrink-0">Gift</span>
            )}
          </div>
          <p className="text-sm text-slate-500 mb-2 flex items-center gap-2">
            {item.isFreeGift ? (
              <span className="text-emerald-600 font-bold">FREE</span>
            ) : (
              <>
                <span className={item.originalPrice ? 'text-rose-500 font-bold' : 'text-slate-900 font-bold'}>
                  ${item.price.toFixed(2)}
                </span>
                {item.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">${item.originalPrice.toFixed(2)}</span>
                )}
              </>
            )}
          </p>
          <div className="flex items-center justify-between">
            {item.isFreeGift ? (
              <span className="text-xs text-slate-400 font-medium">Qty: {item.quantity}</span>
            ) : (
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  className="px-2 py-1 hover:bg-slate-50 text-slate-600"
                  aria-label={`Decrease quantity for ${item.name}`}
                >
                  -
                </button>
                <span className="px-3 py-1 text-sm font-medium border-x border-slate-200" aria-label="Current quantity">
                  {item.quantity}
                </span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)}
                  className="px-2 py-1 hover:bg-slate-50 text-slate-600"
                  aria-label={`Increase quantity for ${item.name}`}
                >
                  +
                </button>
              </div>
            )}
            {!item.isFreeGift && (
              <button 
                onClick={() => removeItem(item.id)}
                className="text-xs font-semibold text-rose-500 hover:underline"
                aria-label={`Remove ${item.name} from cart`}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {!item.isFreeGift && (item.freeGift || item.selectableGifts) && (
        <div className="mt-2">
          <button 
            onClick={() => setShowGift(!showGift)}
            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
          >
            {showGift ? 'Hide Gift Details' : 'Show Gift Details'}
            {showGift ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          
          <AnimatePresence>
            {showGift && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2">
                  {item.freeGift && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2 flex items-start gap-2">
                      <img src={item.freeGift.image} alt="Free Gift" className="w-8 h-8 rounded object-cover" />
                      <div>
                        <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">Free Gift Included</p>
                        <p className="text-xs text-emerald-900 font-medium">{item.freeGift.name}</p>
                      </div>
                    </div>
                  )}

                  {item.selectableGifts && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2">
                      <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Selectable Gift</p>
                      <p className="text-xs text-emerald-900 font-medium">Gift selected at checkout</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export const CartDrawer = ({ isOpen, onClose, cart, updateQuantity, removeItem, loyaltyPoints, onCheckout }: { 
  isOpen: boolean, 
  onClose: () => void, 
  cart: CartItem[],
  updateQuantity: (id: number, delta: number) => void,
  removeItem: (id: number) => void,
  loyaltyPoints: number,
  onCheckout: (pointsRedeemed: number) => void
}) => {
  const [redeemPoints, setRedeemPoints] = useState(0);
  const { user } = useAuth();
  const subtotal = calculateCartSubtotal(cart);
  const discount = calculatePointsDiscount(redeemPoints);
  const total = calculateCartTotal(subtotal, redeemPoints);

  useEffect(() => {
    if (!user && redeemPoints !== 0) {
      setRedeemPoints(0);
    }
  }, [redeemPoints, user]);

  const handleRedeemChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(loyaltyPoints, Math.max(0, parseInt(e.target.value) || 0));
    setRedeemPoints(val);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">Your cart is empty</p>
                  <button 
                    onClick={onClose}
                    className="text-emerald-600 font-semibold hover:underline"
                  >
                    Start shopping
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <CartItemCard 
                    key={item.isFreeGift ? `gift-${item.id}-${item.linkedToProductId}` : item.id} 
                    item={item} 
                    updateQuantity={updateQuantity} 
                    removeItem={removeItem} 
                  />
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 space-y-4">
                {user && loyaltyPoints > 0 && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-emerald-600" />
                        <span className="text-sm font-bold text-slate-900">Redeem Points</span>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{loyaltyPoints} available</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        value={redeemPoints}
                        onChange={handleRedeemChange}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
                        placeholder="Points to use"
                        aria-label="Loyalty points to redeem"
                      />
                      <button 
                        onClick={() => setRedeemPoints(loyaltyPoints)}
                        className="text-xs font-bold text-emerald-600 hover:underline"
                        aria-label="Redeem maximum available points"
                      >
                        Max
                      </button>
                    </div>
                    {redeemPoints > 0 && (
                      <p className="text-[10px] text-emerald-600 font-bold">
                        -${discount.toFixed(2)} discount applied
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>
                  {redeemPoints > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-600 font-medium">Discount (Points)</span>
                      <span className="font-bold text-emerald-600">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-slate-900 font-bold">Total</span>
                    <span className="text-xl font-bold text-slate-900">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onCheckout(redeemPoints)}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors"
                  aria-label="Proceed to checkout"
                >
                  Checkout Now
                </button>
                <p className="text-[10px] text-center text-slate-400">
                  You will earn {calculatePointsEarned(total)} points on this order
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
