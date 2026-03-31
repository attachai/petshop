import { CheckCircle2, Package } from 'lucide-react';

interface CheckoutSuccessStateProps {
  orderNumber: string | null;
  onViewOrderStatus: () => void;
  onBackHome: () => void;
}

export const CheckoutSuccessState = ({ orderNumber, onViewOrderStatus, onBackHome }: CheckoutSuccessStateProps) => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto bg-white rounded-[2.5rem] p-10 text-center shadow-xl border border-slate-100">
        <div className="w-20 h-20 bg-secondary/55 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-primary" />
        </div>
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Order placed successfully!</h2>
        {orderNumber && <p className="text-xs font-mono text-slate-400 mb-4">Reference #{orderNumber}</p>}
        <p className="text-slate-500 mb-8">
          Thank you for shopping with us. Your order has been confirmed and is now being processed.
        </p>
        <div className="space-y-3">
          <button
            onClick={onViewOrderStatus}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          >
            <Package size={18} />
            View order status
          </button>
          <button
            onClick={onBackHome}
            className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

