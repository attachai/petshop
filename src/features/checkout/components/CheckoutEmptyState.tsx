interface CheckoutEmptyStateProps {
  onStartShopping: () => void;
}

export const CheckoutEmptyState = ({ onStartShopping }: CheckoutEmptyStateProps) => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
      <button onClick={onStartShopping} className="text-emerald-600 font-bold hover:underline">
        Start Shopping
      </button>
    </div>
  );
};
