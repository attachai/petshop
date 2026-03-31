import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X } from 'lucide-react';
import { FreeGift } from '../types';

export const GiftSelectionModal = ({ 
  isOpen, 
  onClose, 
  gifts, 
  onSelect 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  gifts: FreeGift[], 
  onSelect: (gift: FreeGift) => void 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white z-[110] rounded-[3rem] shadow-2xl p-10"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900">Choose Your Gift</h2>
                <p className="text-sm text-slate-500 mt-1">Select one free item to add to your order</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {gifts.map(gift => (
                <button
                  key={gift.id}
                  onClick={() => {
                    onSelect(gift);
                    onClose();
                  }}
                  className="flex items-center gap-6 p-5 rounded-3xl border-2 border-slate-100 hover:border-primary hover:bg-secondary/30 transition-all text-left group"
                >
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={gift.image} alt={gift.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-lg">{gift.name}</h4>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest mt-1 block">Free Gift</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                    <Plus size={20} />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

