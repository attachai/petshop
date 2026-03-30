import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Tag, ChevronLeft } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { PROMOTIONS, Promotion } from '../promotions';

interface CollectionPageProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
  onQuickView: (product: Product) => void;
}

export const CollectionPage = ({
  products,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  onQuickView,
}: CollectionPageProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const promoId = searchParams.get('promo');

  const handleBackToShop = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  const promo: Promotion = PROMOTIONS.find((item) => item.id === promoId) ?? PROMOTIONS[0];

  const collectionProducts = promo.categoryFilter === 'All'
    ? products
    : products.filter((product) => product.category === promo.categoryFilter);

  const displayProducts = collectionProducts.length > 0 ? collectionProducts : products;
  const isFallback = collectionProducts.length === 0 && promo.categoryFilter !== 'All';

  return (
    <div className="collection-page min-h-screen">
      <div className="collection-banner relative overflow-hidden" style={{ minHeight: '320px' }}>
        <img
          src={promo.image}
          alt={promo.collectionHeading}
          className="collection-banner__media absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div
          className="collection-banner__overlay absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${promo.bannerTint} 0%, rgba(0,0,0,0.55) 100%)`,
          }}
        />

        <button
          type="button"
          onClick={handleBackToShop}
          className="collection-banner__back-link absolute top-24 left-6 md:top-28 z-[60] flex items-center gap-1.5 rounded-full bg-black/20 px-4 py-2 text-sm font-bold text-white/85 backdrop-blur-sm transition-colors hover:text-white"
        >
          <ChevronLeft size={16} />
          Back to Shop
        </button>

        <div className="collection-banner__inner relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-16">
          <div className="collection-banner__content">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="collection-banner__eyebrow flex items-center gap-3 mb-3"
            >
              <span className={`collection-banner__label ${promo.labelColor} font-bold tracking-widest text-xs uppercase`}>
                {promo.label}
              </span>
              {promo.badge && (
                <span className={`collection-banner__badge ${promo.badgeColor} text-white text-[11px] font-bold px-3 py-1 rounded-full`}>
                  {promo.badge}
                </span>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 }}
              className="collection-banner__heading text-3xl md:text-5xl font-display font-bold text-white leading-tight mb-3"
            >
              {promo.collectionHeading}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="collection-banner__subheading text-white/65 max-w-xl text-sm md:text-base leading-relaxed"
            >
              {promo.collectionSubheading}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="collection-promo-switcher relative z-20 -mt-7 mb-6">
        <div className="collection-promo-switcher__inner max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="collection-promo-switcher__panel bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/60 p-3 md:p-4 flex flex-wrap gap-2"
          >
            {PROMOTIONS.map((item) => (
              <Link
                key={item.id}
                to={`/collection?promo=${item.id}`}
                className={`collection-promo-switcher__link px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  item.id === promo.id
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="collection-product-grid max-w-7xl mx-auto px-4 md:px-8 py-12 pb-24">
        <div className="collection-product-grid__summary flex items-center gap-3 mb-8">
          <span className="collection-product-grid__count text-sm font-bold text-slate-500">
            {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''}
          </span>
          {isFallback && (
            <span className="collection-product-grid__fallback flex items-center gap-1.5 text-xs text-amber-600 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              <Tag size={11} />
              No {promo.categoryFilter} items yet — showing full catalogue
            </span>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          <div className="collection-product-grid__items grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: Math.min(index * 0.06, 0.4) }}
                className="collection-product-grid__item"
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.some((item) => item.id === product.id)}
                  onQuickView={onQuickView}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <div className="collection-footer-cta mt-20 p-12 bg-slate-900 rounded-[3rem] text-center relative overflow-hidden">
          <img
            src="https://picsum.photos/seed/collection-footer/1200/400"
            alt="Collection Footer"
            className="collection-footer-cta__media absolute inset-0 w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="collection-footer-cta__content relative z-10">
            <h2 className="collection-footer-cta__heading text-3xl font-display font-bold text-white mb-4">Explore More Promotions</h2>
            <p className="collection-footer-cta__subheading text-slate-400 mb-8 max-w-md mx-auto">
              Browse other curated collections — there's always something new to discover.
            </p>
            <div className="collection-footer-cta__links flex flex-wrap justify-center gap-3">
              {PROMOTIONS.filter((item) => item.id !== promo.id).map((item) => (
                <Link
                  key={item.id}
                  to={`/collection?promo=${item.id}`}
                  className="collection-footer-cta__link flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold transition-all text-sm"
                >
                  {item.label}
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
