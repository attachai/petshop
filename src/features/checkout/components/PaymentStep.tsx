import { motion } from 'motion/react';
import { ArrowRight, CreditCard } from 'lucide-react';

import { PaymentMethod } from '../types';

const paymentOptions = [
  { id: 'card' as const, name: 'Credit Card', iconLabel: 'card', desc: 'Visa, Mastercard, JCB' },
  { id: 'qr' as const, name: 'PromptPay', iconLabel: 'QR', desc: 'Instant QR Payment' },
  { id: 'transfer' as const, name: 'Bank Transfer', iconLabel: 'BK', desc: 'K-Bank, SCB, BBL' },
];

interface PaymentStepProps {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const PaymentStep = ({ paymentMethod, onPaymentMethodChange, onBack, onContinue }: PaymentStepProps) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <CreditCard className="text-emerald-600" size={20} />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900">Payment Method</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {paymentOptions.map((method) => (
            <button
              key={method.id}
              onClick={() => onPaymentMethodChange(method.id)}
              className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 text-center group ${paymentMethod === method.id ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:border-emerald-100'}`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold transition-all ${paymentMethod === method.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500'}`}>
                {method.iconLabel === 'card' ? <CreditCard size={32} /> : <span className="text-xl">{method.iconLabel}</span>}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{method.name}</h3>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">{method.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
          {paymentMethod === 'card' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                <input type="text" placeholder="e.g. JOHN DOE" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                <div className="relative">
                  <input type="text" placeholder="**** **** **** ****" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                    <div className="w-8 h-5 bg-slate-100 rounded border border-slate-200" />
                    <div className="w-8 h-5 bg-slate-100 rounded border border-slate-200" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                  <input type="password" placeholder="***" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'qr' && (
            <div className="text-center space-y-6">
              <div className="w-48 h-48 bg-white p-4 rounded-3xl mx-auto shadow-sm border border-slate-100 flex items-center justify-center">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PromptPay_PetShop_Store" alt="PromptPay QR" className="w-full h-full" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Scan with any Banking App</p>
                <p className="text-sm text-slate-500 mt-1">Pet Shop Co., Ltd.</p>
              </div>
            </div>
          )}

          {paymentMethod === 'transfer' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank Name</p>
                  <p className="font-bold text-slate-900">Kasikorn Bank (K-Bank)</p>
                </div>
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">KB</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Number</p>
                  <p className="font-bold text-slate-900">012-3-45678-9</p>
                </div>
                <button className="text-xs font-bold text-emerald-600 hover:underline">Copy</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Name</p>
                  <p className="font-bold text-slate-900">Pet Shop Co., Ltd.</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 text-center italic">Please upload your transfer slip after placing the order.</p>
            </div>
          )}
        </div>
      </section>

      <div className="flex gap-4">
        <button onClick={onBack} className="flex-1 bg-white border border-slate-200 text-slate-600 py-5 rounded-3xl font-bold hover:bg-slate-50 transition-all">
          Back
        </button>
        <button onClick={onContinue} className="flex-[2] bg-slate-900 text-white py-5 rounded-3xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
          Review Order
          <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );
};
