import { motion } from 'motion/react';
import { Award, Truck } from 'lucide-react';

import { CartItem } from '../../../types';
import { CheckoutStep } from '../types';

interface OrderSummaryProps {
  cart: CartItem[];
  subtotal: number;
  discount: number;
  pointsRedeemed: number;
  shippingFee: number;
  total: number;
  error: string | null;
  checkoutStep: CheckoutStep;
}

export const OrderSummary = ({
  cart,
  subtotal,
  discount,
  pointsRedeemed,
  shippingFee,
  total,
  error,
  checkoutStep,
}: OrderSummaryProps) => {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 sticky top-32">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-bold text-slate-900">Summary</h2>
        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          {itemCount} Items
        </span>
      </div>

      <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
        {cart.map((item) => {
          const hasDiscount = item.originalPrice && item.price < item.originalPrice;
          const badgeText = item.badge || (hasDiscount ? 'SALE' : (item.freeGift || item.selectableGifts) ? 'FREE GIFT' : null);

          return (
            <div key={item.isFreeGift ? `gift-${item.id}-${item.linkedToProductId}` : item.id} className="flex gap-4 group">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-50 relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {badgeText && !item.isFreeGift && (
                  <div className={`absolute top-0.5 left-0.5 z-10 px-1 py-0.5 rounded text-[6px] font-bold text-white shadow-sm flex items-center gap-1 ${
                    badgeText.toUpperCase() === 'SALE'
                      ? 'bg-rose-500'
                      : badgeText.toUpperCase() === 'FREE GIFT'
                        ? 'bg-primary'
                        : 'bg-slate-900'
                  }`}>
                    {badgeText}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  <span className="text-sm font-bold text-slate-900">
                    {item.isFreeGift ? <span className="text-primary">FREE</span> : `$${(item.price * item.quantity).toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4 pt-8 border-t border-slate-100">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 font-medium">Subtotal</span>
          <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
        </div>
        {pointsRedeemed > 0 && (
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <Award size={14} className="text-primary" />
              <span className="text-primary font-medium">Points Discount</span>
            </div>
            <span className="font-bold text-primary">-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <Truck size={14} className="text-slate-400" />
            <span className="text-slate-500 font-medium">Shipping</span>
          </div>
          <span className="font-bold text-slate-900">
            {shippingFee === 0 ? <span className="text-primary">Free</span> : `$${shippingFee.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between pt-6 border-t border-slate-100">
          <span className="text-xl font-display font-bold text-slate-900">Total</span>
          <div className="text-right">
            <span className="text-3xl font-display font-bold text-primary block">${total.toFixed(2)}</span>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Incl. VAT</p>
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-3"
        >
          <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">!</div>
          {error}
        </motion.div>
      )}

      {checkoutStep === 3 && (
        <p className="text-[10px] text-center text-slate-400 mt-6 leading-relaxed">
          By confirming your order, you agree to our <br />
          <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>
        </p>
      )}
    </div>
  );
};


