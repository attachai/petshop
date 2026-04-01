import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronDown, Filter, Search, X } from 'lucide-react';

import { HeroCarousel } from './HeroCarousel';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data';
import { FreeGift, Product } from '../types';
import { formatCurrency } from '../utils/currency';

interface HomePageProps {
  products: Product[];
  filteredProducts: Product[];
  activeCategory: string;
  searchQuery: string;
  sortBy: string;
  minRating: number;
  wishlist: Product[];
  recentSearches: string[];
  recentlyViewed: Product[];
  isSearchFocused: boolean;
  onCategorySelect: (category: string) => void;
  onSearchQueryChange: (query: string) => void;
  onSearchFocusChange: (isFocused: boolean) => void;
  onSortChange: (sortBy: string) => void;
  onOpenFilters: () => void;
  onAddToCart: (product: Product, quantity?: number, selectedGift?: FreeGift) => void;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onNavigateToProduct: (productId: number) => void;
  onClearFilters: () => void;
}

export const HomePage = ({
  products,
  filteredProducts,
  activeCategory,
  searchQuery,
  sortBy,
  minRating,
  wishlist,
  recentSearches,
  recentlyViewed,
  isSearchFocused,
  onCategorySelect,
  onSearchQueryChange,
  onSearchFocusChange,
  onSortChange,
  onOpenFilters,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  onNavigateToProduct,
  onClearFilters,
}: HomePageProps) => {
  const normalizedSearchQuery = searchQuery.toLowerCase();
  const searchMatches = products
    .filter((product) =>
      product.name.toLowerCase().includes(normalizedSearchQuery) ||
      product.category.toLowerCase().includes(normalizedSearchQuery)
    )
    .slice(0, 6);
  const totalSearchMatches = products.filter((product) =>
    product.name.toLowerCase().includes(normalizedSearchQuery)
  ).length;
  const trendingProducts = products.slice(0, 4);

  return (
    <>
      <HeroCarousel />

      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            onClick={() => onSearchFocusChange(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[40]"
          />
        )}
      </AnimatePresence>

      <section className={`px-4 md:px-8 max-w-7xl mx-auto mb-12 relative ${isSearchFocused ? 'z-50' : 'z-10'}`}>
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className={`flex flex-col md:flex-row md:items-start gap-6 flex-1 relative min-h-[48px] ${isSearchFocused ? 'z-50' : 'z-10'}`}>
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onFocus={() => onSearchFocusChange(true)}
                onChange={(event) => {
                  onSearchQueryChange(event.target.value);
                  onSearchFocusChange(true);
                }}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                aria-label="Search products"
              />
              {isSearchFocused && (
                <button
                  onClick={() => {
                    onSearchQueryChange('');
                    onSearchFocusChange(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}

              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 10, scale: 0.98, filter: 'blur(4px)' }}
                    transition={{ duration: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="max-h-[450px] overflow-y-auto">
                      {searchQuery.length > 0 ? (
                        <div className="p-2">
                          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Products</div>
                          {searchMatches.length > 0 ? (
                            searchMatches.map((product) => (
                              <button
                                key={product.id}
                                onClick={() => {
                                  onNavigateToProduct(product.id);
                                  onSearchFocusChange(false);
                                }}
                                className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                              >
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
                                    {product.name}
                                  </h4>
                                  <p className="text-xs text-slate-500">{formatCurrency(product.price)}</p>
                                </div>
                                <ArrowRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                              </button>
                            ))
                          ) : (
                            <div className="p-8 text-center">
                              <p className="text-sm text-slate-500">No products found for "{searchQuery}"</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4">
                          {recentSearches.length > 0 ? (
                            <>
                              <div className="px-2 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recent Searches</div>
                              <div className="space-y-1 mb-6">
                                {recentSearches.map((search) => (
                                  <button
                                    key={search}
                                    onClick={() => onSearchQueryChange(search)}
                                    className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg text-sm text-slate-600 transition-colors"
                                    aria-label={`Search for ${search}`}
                                  >
                                    <Search size={14} className="text-slate-300" />
                                    {search}
                                  </button>
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="px-2 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Popular Categories</div>
                              <div className="flex flex-wrap gap-2 mb-6">
                                {CATEGORIES.filter((category) => category !== 'All').map((category) => (
                                  <button
                                    key={category}
                                    onClick={() => {
                                      onCategorySelect(category);
                                      onSearchFocusChange(false);
                                    }}
                                    className="px-4 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-xs font-semibold text-slate-600 transition-colors"
                                    aria-label={`Category ${category}`}
                                  >
                                    {category}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}

                          {recentlyViewed.length > 0 ? (
                            <div className="mt-4">
                              <div className="px-2 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recently Viewed</div>
                              <div className="grid grid-cols-2 gap-3">
                                {recentlyViewed.map((product) => (
                                  <button
                                    key={product.id}
                                    onClick={() => {
                                      onNavigateToProduct(product.id);
                                      onSearchFocusChange(false);
                                    }}
                                    className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                                    aria-label={`View details for recently viewed ${product.name}`}
                                  >
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-[11px] font-bold text-slate-900 truncate">{product.name}</h4>
                                      <p className="text-[10px] text-primary font-bold">{formatCurrency(product.price)}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="mt-4">
                              <div className="px-2 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Trending Now</div>
                              <div className="grid grid-cols-2 gap-3">
                                {trendingProducts.map((product) => (
                                  <button
                                    key={product.id}
                                    onClick={() => {
                                      onNavigateToProduct(product.id);
                                      onSearchFocusChange(false);
                                    }}
                                    className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                                    aria-label={`View details for trending ${product.name}`}
                                  >
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-[11px] font-bold text-slate-900 truncate">{product.name}</h4>
                                      <p className="text-[10px] text-primary font-bold">{formatCurrency(product.price)}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {searchQuery.length > 0 && totalSearchMatches > 6 && (
                      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                        <button
                          onClick={() => onSearchFocusChange(false)}
                          className="text-xs font-bold text-slate-600 hover:text-primary"
                          aria-label="View all results"
                        >
                          View all results
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(event) => onSortChange(event.target.value)}
                className="appearance-none bg-white border border-slate-100 rounded-full px-6 py-2.5 pr-10 text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name-az">Name: A to Z</option>
                <option value="name-za">Name: Z to A</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <button
              onClick={onOpenFilters}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                minRating > 0 || activeCategory !== 'All'
                  ? 'bg-secondary/25 text-primary border-secondary/70'
                  : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
              }`}
              aria-label="Open filters"
            >
              <Filter size={16} />
              Filters
              {(minRating > 0 || activeCategory !== 'All') && (
                <span className="w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
                  {(minRating > 0 ? 1 : 0) + (activeCategory !== 'All' ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      <main className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.some((item) => item.id === product.id)}
                  onQuickView={onQuickView}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
            <p className="text-slate-500 max-w-xs">
              We couldn&apos;t find anything matching &quot;{searchQuery}&quot;. Try a different term or category.
            </p>
            <button
              onClick={onClearFilters}
              className="mt-6 text-primary font-semibold hover:underline"
              aria-label="Clear all filters"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </>
  );
};

