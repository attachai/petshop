import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

import { CHECKOUT_STEPS } from '../constants';
import { CheckoutStep } from '../types';

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
}

export const CheckoutProgress = ({ currentStep }: CheckoutProgressProps) => {
  return (
    <div className="flex items-center gap-4 flex-1 max-w-md">
      {CHECKOUT_STEPS.map((step, index) => (
        <div key={step.step} className="flex items-center gap-4 flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-2 relative">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: currentStep >= step.step ? '#00A8E2' : '#ffffff',
                color: currentStep >= step.step ? '#ffffff' : '#cbd5e1',
                scale: currentStep === step.step ? 1.1 : 1,
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 ${
                currentStep >= step.step ? 'border-primary shadow-lg shadow-secondary/55' : 'border-slate-200'
              }`}
            >
              <step.icon size={20} />
            </motion.div>
            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
              currentStep >= step.step ? 'text-primary' : 'text-slate-400'
            }`}>
              {step.label}
            </span>

            {currentStep > step.step && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white"
              >
                <CheckCircle2 size={10} />
              </motion.div>
            )}
          </div>

          {index < CHECKOUT_STEPS.length - 1 && (
            <div className="h-[2px] flex-1 rounded-full bg-slate-200 overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: currentStep > step.step ? '100%' : '0%' }}
                className="h-full bg-primary"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};



