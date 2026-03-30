import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { CheckoutEmptyState } from '../features/checkout/components/CheckoutEmptyState';
import { CheckoutProgress } from '../features/checkout/components/CheckoutProgress';
import { CheckoutStepRenderer } from '../features/checkout/components/CheckoutStepRenderer';
import { CheckoutSuccessState } from '../features/checkout/components/CheckoutSuccessState';
import { OrderSummary } from '../features/checkout/components/OrderSummary';
import { useCheckoutFlow } from '../features/checkout/useCheckoutFlow';
import { CartItem } from '../types';

interface CheckoutPageProps {
  cart: CartItem[];
  onOrderComplete: (pointsRedeemed: number) => void;
}

export const CheckoutPage = ({ cart, onOrderComplete }: CheckoutPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pointsRedeemed = (location.state as { pointsRedeemed?: number } | null)?.pointsRedeemed || 0;
  const checkout = useCheckoutFlow({ cart, pointsRedeemed, onOrderComplete });

  if (checkout.isSuccess) {
    return (
      <CheckoutSuccessState
        orderNumber={checkout.completedOrderNumber}
        onViewOrderStatus={() => navigate('/profile')}
        onBackHome={() => navigate('/')}
      />
    );
  }

  if (cart.length === 0) {
    return <CheckoutEmptyState onStartShopping={() => navigate('/')} />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group w-fit"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Cart</span>
          </button>

          <CheckoutProgress currentStep={checkout.checkoutStep} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <CheckoutStepRenderer checkout={checkout} />
        </div>

        <div className="lg:col-span-4">
          <OrderSummary
            cart={cart}
            subtotal={checkout.subtotal}
            discount={checkout.discount}
            pointsRedeemed={pointsRedeemed}
            shippingFee={checkout.shippingFee}
            total={checkout.total}
            error={checkout.error}
            checkoutStep={checkout.checkoutStep}
          />
        </div>
      </div>
    </div>
  );
};
