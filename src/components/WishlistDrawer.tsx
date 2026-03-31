import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { Product } from '../types';

export const WishlistDrawer = ({ 
  isOpen, 
  onClose, 
  wishlist, 
  onAddToCart, 
  onRemove 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  wishlist: Product[], 
  onAddToCart: (product: Product) => void, 
  onRemove: (id: number) => void 
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
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Heart size={20} className="text-rose-500 fill-rose-500" />
                Wishlist
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Close wishlist">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center">
                    <Heart size={32} className="text-rose-300" />
                  </div>
                  <p className="text-slate-500 font-medium">Your wishlist is empty</p>
                  <button 
                    onClick={onClose}
                    className="text-rose-500 font-semibold hover:underline"
                  >
                    Discover favorites
                  </button>
                </div>
              ) : (
                wishlist.map(item => (
                  <div key={item.id} className="flex gap-4 group p-3 rounded-2xl transition-colors hover:bg-slate-50 border border-transparent hover:border-slate-100">
                    <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      {item.originalPrice && (
                        <div className="absolute top-1 left-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter">
                          Sale
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900 truncate">{item.name}</h4>
                        <p className="text-sm text-slate-500 mb-2 line-clamp-1">{item.category}</p>
                        <div className="flex items-center gap-2">
                          {item.originalPrice ? (
                            <>
                              <span className="text-sm font-bold text-rose-500">${item.price.toFixed(2)}</span>
                              <span className="text-xs text-slate-400 line-through">${item.originalPrice.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-slate-900">${item.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <button 
                          onClick={() => onAddToCart(item)}
                          className="flex items-center gap-1.5 text-xs font-bold text-primary bg-secondary/25 hover:bg-secondary/45 px-3 py-1.5 rounded-lg transition-colors"
                          aria-label={`Add ${item.name} to cart`}
                        >
                          <ShoppingCart size={14} />
                          Add to Cart
                        </button>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors"
                          aria-label={`Remove ${item.name} from wishlist`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

