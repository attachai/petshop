import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const promoId = searchParams.get('promo');

  // Find matching promo; fall back to first promo if not found
  const promo: Promotion = PROMOTIONS.find(p => p.id === promoId) ?? PROMOTIONS[0];

  // Filter products by the promo's category (or show all)
  const collectionProducts = promo.categoryFilter === 'All'
    ? products
    : products.filter(p => p.category === promo.categoryFilter);

  // If a specific category yields nothing, fall back to all products
  const displayProducts = collectionProducts.length > 0 ? collectionProducts : products;
  const isFallback = collectionProducts.length === 0 && promo.categoryFilter !== 'All';

  return (
    <div className="min-h-screen">

      {/* ── Promotion Banner ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ minHeight: '320px' }}>
        {/* Background image */}
        <img
          src={promo.image}
          alt={promo.collectionHeading}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Tinted overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${promo.bannerTint} 0%, rgba(0,0,0,0.55) 100%)`,
          }}
        />

        {/* Back link */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-10 flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-bold transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Shop
        </Link>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-3"
            >
              <span className={`${promo.labelColor} font-bold tracking-widest text-xs uppercase`}>
                {promo.label}
              </span>
              {promo.badge && (
                <span className={`${promo.badgeColor} text-white text-[11px] font-bold px-3 py-1 rounded-full`}>
                  {promo.badge}
                </span>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 }}
              className="text-3xl md:text-5xl font-display font-bold text-white leading-tight mb-3"
            >
              {promo.collectionHeading}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="text-white/65 max-w-xl text-sm md:text-base leading-relaxed"
            >
              {promo.collectionSubheading}
            </motion.p>
          </div>

          {/* Promo selector pills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 md:flex-col md:items-end"
          >
            {PROMOTIONS.map(p => (
              <Link
                key={p.id}
                to={`/collection?promo=${p.id}`}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  p.id === promo.id
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {p.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Product grid ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 pb-24">

        {/* Count + fallback notice */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-sm font-bold text-slate-500">
            {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''}
          </span>
          {isFallback && (
            <span className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              <Tag size={11} />
              No {promo.categoryFilter} items yet — showing full catalogue
            </span>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: Math.min(index * 0.06, 0.4) }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.some(item => item.id === product.id)}
                  onQuickView={onQuickView}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Footer CTA */}
        <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-center relative overflow-hidden">
          <img
            src="https://picsum.photos/seed/collection-footer/1200/400"
            alt="Collection Footer"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Explore More Promotions</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Browse other curated collections — there's always something new to discover.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {PROMOTIONS.filter(p => p.id !== promo.id).map(p => (
                <Link
                  key={p.id}
                  to={`/collection?promo=${p.id}`}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold transition-all text-sm"
                >
                  {p.label}
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
