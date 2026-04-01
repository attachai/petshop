import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart, Star, Gift } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onQuickView: (product: Product) => void;
}

export const ProductCard = React.memo(({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onQuickView
}: ProductCardProps) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [showReviews, setShowReviews] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);

  const handleCardClick = useCallback(() => {
    navigate(`/product/${product.id}`);
  }, [navigate, product.id]);

  const handleWishlistClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  }, [onToggleWishlist, product]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
  }, [onAddToCart, product, quantity]);

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  }, [onQuickView, product]);

  const hasDiscount = product.originalPrice && product.price < product.originalPrice;
  const badgeText = product.badge || (hasDiscount ? 'SALE' : (product.freeGift || product.selectableGifts) ? 'FREE GIFT' : null);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 cursor-pointer" onClick={handleCardClick}>
        {badgeText && (
          <div className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm flex items-center gap-1 ${
            badgeText.toUpperCase() === 'SALE' ? 'bg-rose-500' :
            badgeText.toUpperCase() === 'FREE GIFT' ? 'bg-primary' :
            'bg-slate-900'
          }`}>
            {badgeText.toUpperCase() === 'FREE GIFT' && <Gift size={10} />}
            {badgeText}
          </div>
        )}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform"
        >
          <Heart size={15} className={isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Hover Overlay - non-touch devices only */}
        {!isTouch && <div className="absolute inset-0 bg-slate-900/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-between py-4 px-3">
          {/* Quick View - center */}
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={handleQuickView}
              className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary"
            >
              Quick View
            </button>
          </div>

          {/* Quantity + Add to Cart - bottom */}
          <div
            className="w-full flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center bg-white rounded-xl shadow-md overflow-hidden">
              <button
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); setQuantity((q: number) => Math.max(1, q - 1)); }}
                className="px-3 py-2 text-slate-700 hover:bg-slate-100 transition-colors font-bold text-base leading-none"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-3 py-2 text-sm font-bold text-slate-900 min-w-[2rem] text-center">{quantity}</span>
              <button
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); setQuantity((q: number) => q + 1); }}
                className="px-3 py-2 text-slate-700 hover:bg-slate-100 transition-colors font-bold text-base leading-none"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingCart size={14} />
              Add to Cart
            </button>
          </div>
        </div>}

        {/* Add to Cart - touch devices (mobile + tablet) */}
        {isTouch && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-slate-900/60 to-transparent">
            <button
              onClick={handleAddToCart}
              className="w-full bg-slate-900 text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 shadow-md"
            >
              <ShoppingCart size={14} />
              Add to Cart
            </button>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex items-center text-amber-400">
            <Star size={13} className="fill-amber-400" />
            <span className="ml-1 text-[13px] font-bold text-slate-700">{product.rating}</span>
          </div>
          <span className="text-[13px] text-slate-400">({product.reviews})</span>
        </div>

        <h3 className="font-display font-bold text-[15px] text-slate-900 leading-tight cursor-pointer hover:text-primary transition-colors mb-1" onClick={handleCardClick}>
          {product.name}
        </h3>
        <p className="text-xs font-medium text-primary mb-2.5">{product.category}</p>

        <div className="flex items-center justify-between mt-auto mb-2.5">
          <div className="flex items-center gap-2">
            <p className={`font-bold text-[15px] ${product.originalPrice ? 'text-rose-600' : 'text-slate-900'}`}>
              ${product.price.toFixed(2)}
            </p>
            {product.originalPrice && (
              <p className="text-[13px] text-slate-400 line-through">${product.originalPrice.toFixed(2)}</p>
            )}
          </div>
          {product.reviewsList && product.reviewsList.length > 0 && (
            <button
              onClick={() => setShowReviews(!showReviews)}
              className="text-[13px] font-bold text-primary hover:text-primary-dark transition-colors"
            >
              {showReviews ? 'Hide Reviews' : 'Show Reviews'}
            </button>
          )}
        </div>

        <AnimatePresence>
          {showReviews && product.reviewsList && product.reviewsList.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-2.5"
            >
              <div className="space-y-2">
                {product.reviewsList.map((review) => (
                  <div key={review.id} className="bg-slate-50 rounded-lg px-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-bold text-slate-800">{review.userName}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 fill-slate-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[12px] text-slate-500 leading-snug">{review.comment}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';


