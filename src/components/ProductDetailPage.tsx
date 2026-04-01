import React, { useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Facebook, Gift, Heart, Minus, Plus, Share2, ShoppingCart, Star, Twitter } from 'lucide-react';
import { Product, Review } from '../types';
import { formatCurrency } from '../utils/currency';

export const ProductDetailPage = ({ 
  products, 
  onAddToCart, 
  onToggleWishlist, 
  wishlist,
  onAddReview,
  onQuickView,
  onAddToRecentlyViewed
}: { 
  products: Product[], 
  onAddToCart: (product: Product, quantity: number) => void, 
  onToggleWishlist: (product: Product) => void, 
  wishlist: Product[],
  onAddReview: (productId: number, review: Omit<Review, 'id' | 'date'>) => void,
  onQuickView: (product: Product) => void,
  onAddToRecentlyViewed: (product: Product) => void
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === Number(id));
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', name: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  React.useEffect(() => {
    if (product) {
      onAddToRecentlyViewed(product);
    }
  }, [product, onAddToRecentlyViewed]);

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h2>
        <button onClick={() => navigate('/')} className="text-primary font-bold hover:underline">Back to Home</button>
      </div>
    );
  }

  const images = product.images || [product.image];
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) return;
    
    onAddReview(product.id, {
      userName: reviewForm.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment
    });
    
    setReviewForm({ rating: 5, comment: '', name: '' });
    setShowReviewForm(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 group w-fit"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-6">
              <motion.div 
                layoutId={`product-image-${product.id}`}
                className="aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 relative group"
              >
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    src={images[activeImage]} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                {product.originalPrice && (
                  <div className="absolute top-6 left-6 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-rose-500/30">
                    Sale
                  </div>
                )}
                <button 
                  onClick={() => onToggleWishlist(product)}
                  className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Heart size={24} className={wishlist.some(w => w.id === product.id) ? 'text-rose-500 fill-rose-500' : 'text-slate-400'} />
                </button>
              </motion.div>
              
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                  {images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-primary p-1' : 'border-transparent'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-primary uppercase tracking-widest bg-secondary/25 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-400 bg-amber-50 px-3 py-1 rounded-full">
                  <Star size={14} className="fill-amber-400" />
                  <span className="text-xs font-bold text-amber-700">{product.rating}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight mb-6">
                {product.name}
              </h1>

              <div className="flex items-end gap-4 mb-8">
                {product.originalPrice ? (
                  <>
                    <span className="text-4xl font-display font-bold text-rose-500">{formatCurrency(product.price)}</span>
                    <span className="text-xl text-slate-400 line-through mb-1">{formatCurrency(product.originalPrice)}</span>
                  </>
                ) : (
                  <span className="text-4xl font-display font-bold text-slate-900">{formatCurrency(product.price)}</span>
                )}
              </div>

              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                {product.description}
              </p>

              {/* Free Gift Banner */}
              {(product.freeGift || product.selectableGifts) && (
                <div className="bg-secondary/25 border border-secondary/70 rounded-2xl p-4 mb-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/55 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Gift size={24} className="text-primary-dark" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-dark">Free Gift Included!</h4>
                    <p className="text-sm text-primary-dark">
                      {product.freeGift ? `Includes ${product.freeGift.name}` : 'Choose a free gift when you add to cart'}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-2 sm:w-40">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                <button 
                  onClick={() => onAddToCart(product, quantity)}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-secondary/70 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <ShoppingCart size={24} />
                  Add to Cart
                </button>
              </div>

              <div className="flex items-center gap-6 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <CheckCircle2 size={18} className="text-primary" />
                  In Stock
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <CheckCircle2 size={18} className="text-primary" />
                  Free Shipping
                </div>
                
                <div className="relative ml-auto">
                  <button 
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                  
                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-xl border border-slate-100 p-2 flex gap-2"
                      >
                        <button className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                          <Facebook size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-lg bg-secondary/25 text-primary flex items-center justify-center hover:bg-secondary/45 transition-colors">
                          <Twitter size={18} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 mb-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900">Customer Reviews</h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={20} className={`${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <span className="font-bold text-slate-900">{product.rating} out of 5</span>
                <span className="text-slate-500">({product.reviews} reviews)</span>
              </div>
            </div>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Write a Review
            </button>
          </div>

          <AnimatePresence>
            {showReviewForm && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-10"
              >
                <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Your Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({...reviewForm, rating: star})}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star size={24} className={`${star <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={reviewForm.name}
                        onChange={e => setReviewForm({...reviewForm, name: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Your Review</label>
                      <textarea 
                        required
                        value={reviewForm.comment}
                        onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all h-32 resize-none"
                        placeholder="What did you like or dislike?"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button 
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-md shadow-secondary/70 hover:bg-primary-dark transition-colors"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-8">
            {product.reviewsList && product.reviewsList.length > 0 ? (
              product.reviewsList.map(review => (
                <div key={review.id} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/55 text-primary-dark rounded-full flex items-center justify-center font-bold text-sm">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{review.userName}</p>
                        <p className="text-xs text-slate-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className={`${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 py-8">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display font-bold text-slate-900">You Might Also Like</h2>
              <button 
                onClick={() => navigate('/collection')}
                className="text-primary font-bold hover:underline flex items-center gap-1"
              >
                View All <ArrowRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(related => (
                <div key={related.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 group cursor-pointer" onClick={() => navigate(`/product/${related.id}`)}>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4 relative">
                    <img src={related.image} alt={related.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(related);
                      }}
                      className="absolute inset-x-4 bottom-4 bg-white/90 backdrop-blur-sm text-slate-900 py-3 rounded-xl font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
                    >
                      Quick View
                    </button>
                  </div>
                  <div className="px-2">
                    <h3 className="font-bold text-slate-900 truncate mb-1">{related.name}</h3>
                    <div className="flex items-center gap-2">
                      {related.originalPrice ? (
                        <>
                          <span className="font-bold text-rose-500">{formatCurrency(related.price)}</span>
                          <span className="text-xs text-slate-400 line-through">{formatCurrency(related.originalPrice)}</span>
                        </>
                      ) : (
                        <span className="font-bold text-slate-900">{formatCurrency(related.price)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

