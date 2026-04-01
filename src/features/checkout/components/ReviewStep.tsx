import { motion } from 'motion/react';
import { CheckCircle2, Clock, CreditCard, MapPin, Phone } from 'lucide-react';

import { DeliveryMethod, DeliveryType, PaymentMethod, PickupBranch, ShippingService, AddressForm } from '../types';
import { formatCurrency } from '../../../utils/currency';

interface ReviewStepProps {
  deliveryMethod: DeliveryMethod;
  deliveryType: DeliveryType;
  address: AddressForm;
  selectedBranch?: PickupBranch;
  selectedShippingService?: ShippingService;
  paymentMethod: PaymentMethod;
  orderNote: string;
  total: number;
  isProcessing: boolean;
  onOrderNoteChange: (value: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

const getPaymentLabel = (paymentMethod: PaymentMethod) => {
  if (paymentMethod === 'card') return 'Credit Card';
  if (paymentMethod === 'qr') return 'PromptPay';
  return 'Bank Transfer';
};

const getPaymentMeta = (paymentMethod: PaymentMethod) => {
  if (paymentMethod === 'card') return 'Visa **** 4242';
  if (paymentMethod === 'qr') return 'Scan QR Code';
  return 'K-Bank 012-3-45678-9';
};

const getPaymentIcon = (paymentMethod: PaymentMethod) => {
  if (paymentMethod === 'card') return <CreditCard size={20} />;
  if (paymentMethod === 'qr') return 'QR';
  return 'BK';
};

export const ReviewStep = ({
  deliveryMethod,
  deliveryType,
  address,
  selectedBranch,
  selectedShippingService,
  paymentMethod,
  orderNote,
  total,
  isProcessing,
  onOrderNoteChange,
  onBack,
  onConfirm,
}: ReviewStepProps) => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
      <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-secondary/25 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="text-primary" size={20} />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900">Final Review</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Delivery to</h3>
              {deliveryMethod === 'delivery' ? (
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                  <p className="font-bold text-slate-900 text-lg">{address.name}</p>
                  <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    {address.phone}
                  </p>
                  <p className="text-sm text-slate-500 mt-3 leading-relaxed flex items-start gap-2">
                    <MapPin size={14} className="text-slate-400 mt-1 flex-shrink-0" />
                    <span>{address.details}, {address.province}, {address.zip}</span>
                  </p>
                  <div className="mt-5 pt-5 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-xl">{selectedShippingService?.icon}</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service</p>
                        <p className="text-xs font-bold text-slate-900">{selectedShippingService?.name}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-secondary/55 text-primary-dark text-[10px] font-bold rounded-full uppercase tracking-widest">
                      {deliveryType === 'instant' ? 'Express' : 'Standard'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                  <p className="font-bold text-slate-900 text-lg">{selectedBranch?.name}</p>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed flex items-start gap-2">
                    <MapPin size={14} className="text-slate-400 mt-1 flex-shrink-0" />
                    <span>{selectedBranch?.address}</span>
                  </p>
                  <div className="mt-5 pt-5 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pickup Time</p>
                        <p className="text-xs font-bold text-slate-900">Ready in 30-60 mins</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-secondary/55 text-primary-dark text-[10px] font-bold rounded-full uppercase tracking-widest">Self-Pickup</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Payment via</h3>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  {getPaymentIcon(paymentMethod)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{getPaymentLabel(paymentMethod)}</p>
                  <p className="text-xs text-slate-500 mt-1">{getPaymentMeta(paymentMethod)}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Order Notes</h3>
              <textarea
                placeholder="Add special instructions for your order..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary h-24 resize-none"
                value={orderNote}
                onChange={(event) => onOrderNoteChange(event.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex gap-4">
        <button onClick={onBack} className="flex-1 bg-white border border-slate-200 text-slate-600 py-5 rounded-3xl font-bold hover:bg-slate-50 transition-all">
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={isProcessing}
          className="flex-[2] bg-primary text-white py-5 rounded-3xl font-bold shadow-xl shadow-secondary/70 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Clock size={20} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle2 size={20} />
              Confirm & Pay {formatCurrency(total)}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};




