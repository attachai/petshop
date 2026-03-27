import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Filter, Search, X } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product, FreeGift } from '../types';
import { CATEGORIES } from '../data';

export const HomePage = ({
  products,
  filteredProducts,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  setIsSearchFocused,
  recentSearches,
  setRecentSearches,
  recentlyViewed,
  addToCart,
  toggleWishlist,
  wishlist,
  setQuickViewProduct,
  setIsFilterOpen,
  sortBy,
  setSortBy
}: {
  products: Product[],
  filteredProducts: Product[],
  activeCategory: string,
  setActiveCategory: (c: string) => void,
  searchQuery: string,
  setSearchQuery: (q: string) => void,
  isSearchFocused: boolean,
  setIsSearchFocused: (f: boolean) => void,
  recentSearches: string[],
  setRecentSearches: (s: string[]) => void,
  recentlyViewed: Product[],
  addToCart: (product: Product, quantity?: number, selectedGift?: FreeGift) => void,
  toggleWishlist: (product: Product) => void,
  wishlist: Product[],
  setQuickViewProduct: (p: Product | null) => void,
  setIsFilterOpen: (o: boolean) => void,
  sortBy: string,
  setSortBy: (s: string) => void
}) => {
  const searchRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Hero Section */}
      <header className="pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 aspect-[21/9] md:aspect-[21/7]">
          <img 
            src="https://picsum.photos/seed/hero/1200/600" 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-emerald-400 font-bold tracking-widest text-xs uppercase mb-4"
            >
              โปรโมชั่น
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight"
            >
              Elevate Your Daily <br /> Lifestyle Essentials
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/collection" className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-50 transition-colors w-fit group" aria-label="Shop the collection">
                Shop the Collection
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Search Backdrop Overlay */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            onClick={() => setIsSearchFocused(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[40]"
          />
        )}
      </AnimatePresence>

      {/* Categories & Filter */}
      <section className={`px-4 md:px-8 max-w-7xl mx-auto mb-12 relative ${isSearchFocused ? 'z-50' : 'z-10'}`}>
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className={`flex flex-col md:flex-row md:items-start gap-6 flex-1 relative min-h-[48px] ${isSearchFocused ? 'z-50' : 'z-10'}`}>
            <div 
              className="relative flex-1 w-full" 
              ref={searchRef}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm text-slate-900 placeholder-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={16} />
                </button>
              )}
              
              {/* Search Dropdown */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                  >
                    {recentSearches.length > 0 && !searchQuery && (
                      <div className="p-4 border-b border-slate-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Searches</h4>
                          <button 
                            onClick={() => setRecentSearches([])}
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((term, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setSearchQuery(term);
                                setIsSearchFocused(false);
                              }}
                              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Search size={12} className="text-slate-400" />
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Search Results Preview */}
                    {searchQuery && (
                      <div className="p-2">
                        {filteredProducts.slice(0, 4).map(product => (
                          <button
                            key={product.id}
                            onClick={() => {
                              setQuickViewProduct(product);
                              setIsSearchFocused(false);
                            }}
                            className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                          >
                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-medium text-slate-900">{product.name}</p>
                              <p className="text-sm text-emerald-600 font-bold">${product.price}</p>
                            </div>
                          </button>
                        ))}
                        {filteredProducts.length === 0 && (
                          <div className="p-8 text-center text-slate-500">
                            No products found matching "{searchQuery}"
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
              <button 
                onClick={() => setActiveCategory("All")}
                className={`px-6 py-3.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${activeCategory === "All" ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                All Products
              </button>
              {CATEGORIES.map(category => (
                <button 
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${activeCategory === category ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 lg:flex-none px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name-az">Name: A to Z</option>
              <option value="name-za">Name: Z to A</option>
            </select>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 font-bold flex-shrink-0"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
      </section>

      {/* Recently Viewed (Horizontal Scroll) */}
      {recentlyViewed.length > 0 && (
        <section className="px-4 md:px-8 max-w-7xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-slate-900">Recently Viewed</h2>
            <button 
              onClick={() => setRecentSearches([])} // Assuming clear recently viewed is handled or not needed, using clear searches as placeholder
              className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
            >
              Clear
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
            {recentlyViewed.map(product => (
              <div key={product.id} className="w-48 flex-shrink-0 snap-start">
                <ProductCard 
                  product={product} 
                  onAddToCart={addToCart} 
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.some(item => item.id === product.id)}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Product Grid */}
      <main className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.some(item => item.id === product.id)}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Search size={40} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500 max-w-md">We couldn't find any products matching your current filters. Try adjusting your search or category selection.</p>
            <button 
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>
    </>
  );
};
