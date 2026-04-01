import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Gift, Heart, Minus, Plus, ShoppingCart, Star, X } from 'lucide-react';
import { Product, FreeGift } from '../types';
import { formatCurrency } from '../utils/currency';

export const QuickViewModal: React.FC<{ 
  product: Product | null, 
  isOpen: boolean, 
  onClose: () => void, 
  onAddToCart: (product: Product, quantity: number, selectedGift?: FreeGift) => void,
  products: Product[],
  onQuickView: (product: Product) => void,
  onToggleWishlist: (product: Product) => void,
  wishlist: Product[],
  onAddReview: (productId: number, review: any) => void
}> = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  products,
  onQuickView,
  onToggleWishlist,
  wishlist,
  onAddReview
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedGift, setSelectedGift] = useState<FreeGift | null>(null);
  const navigate = useNavigate();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedGift || undefined);
    onClose();
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Image Gallery */}
          <div className="w-full md:w-1/2 bg-slate-50 p-6 flex flex-col">
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-white shadow-sm">
              <img 
                src={images[activeImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                  {product.badge}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 snap-start transition-all ${activeImageIndex === idx ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-primary font-bold tracking-wide uppercase text-sm">{product.category}</p>
                <div className="flex items-center gap-1 text-amber-400 bg-amber-50 px-2 py-1 rounded-lg">
                  <Star size={14} className="fill-amber-400" />
                  <span className="text-sm font-bold text-amber-700">{product.rating}</span>
                  <span className="text-sm text-amber-600/60">({product.reviews})</span>
                </div>
              </div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-4 leading-tight">{product.name}</h2>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-bold text-slate-900">{formatCurrency(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-slate-400 line-through mb-1">{formatCurrency(product.originalPrice)}</span>
                    <span className="text-sm font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-lg mb-1">
                      Save {formatCurrency(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Free Gift Section */}
            {product.freeGift && (
              <div className="mb-8 bg-secondary/25 border border-secondary/70 rounded-2xl p-4 flex items-start gap-4">
                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                  <img src={product.freeGift.image} alt={product.freeGift.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Free Gift</span>
                  </div>
                  <h4 className="font-bold text-primary-dark">{product.freeGift.name}</h4>
                  <p className="text-sm text-primary-dark mt-1">Included automatically with your purchase.</p>
                </div>
              </div>
            )}

            {/* Selectable Gifts Section */}
            {product.selectableGifts && (
              <div className="mb-8">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="bg-secondary/55 text-primary-dark w-6 h-6 rounded-full flex items-center justify-center">
                    <Gift size={14} />
                  </span>
                  Select Your Free Gift
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.selectableGifts.map(gift => (
                    <button
                      key={gift.id}
                      onClick={() => setSelectedGift(gift)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${selectedGift?.id === gift.id ? 'border-primary bg-secondary/25' : 'border-slate-100 hover:border-secondary hover:bg-slate-50'}`}
                    >
                      <img src={gift.image} alt={gift.name} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 line-clamp-2">{gift.name}</p>
                      </div>
                      {selectedGift?.id === gift.id && (
                        <CheckCircle2 size={20} className="text-primary flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100 w-full sm:w-auto">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-bold text-lg text-slate-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={product.selectableGifts && !selectedGift}
                className="flex-1 w-full bg-primary text-white h-14 rounded-2xl font-bold shadow-xl shadow-secondary/70 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button 
                onClick={() => onToggleWishlist(product)}
                className="w-14 h-14 flex-shrink-0 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors group"
              >
                <Heart size={24} className={wishlist.some(w => w.id === product.id) ? 'text-rose-500 fill-rose-500' : 'text-slate-400 group-hover:text-rose-500'} />
              </button>
            </div>

            <button 
              onClick={() => {
                onClose();
                navigate(`/product/${product.id}`);
              }}
              className="w-full py-4 text-slate-600 font-bold hover:text-primary transition-colors flex items-center justify-center gap-2 border-t border-slate-100"
            >
              View Full Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

