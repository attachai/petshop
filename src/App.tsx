import { ShoppingBag, Search, User, Menu, X, Star, ArrowRight, Heart, ShoppingCart, Filter, ChevronDown, Plus, Minus, Award, Share2, Facebook, Twitter, ArrowLeft, MapPin, Truck, Package, CreditCard, CheckCircle2, Clock, ExternalLink, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback, useMemo, useRef, FormEvent, ChangeEvent, MouseEvent } from 'react';
import { Routes, Route, useParams, useNavigate, Link, useLocation } from 'react-router-dom';

import ProfilePage from './components/ProfilePage';
import { CheckoutPage } from './components/CheckoutPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { QuickViewModal } from './components/QuickViewModal';
import { GiftSelectionModal } from './components/GiftSelectionModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { FilterDrawer } from './components/FilterDrawer';
import { CollectionPage } from './components/CollectionPage';
import { HeroCarousel } from './components/HeroCarousel';
import { Product, CartItem, Review, FreeGift } from './types';
import { PRODUCTS, CATEGORIES } from './data';

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [minRating, setMinRating] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [giftSelectionProduct, setGiftSelectionProduct] = useState<Product | null>(null);
  const [giftSelectionQuantity, setGiftSelectionQuantity] = useState(1);
  const [loyaltyPoints, setLoyaltyPoints] = useState(250); // Initial points
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const addToRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 4);
    });
    // Add to recent searches if not already there
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== product.name);
      return [product.name, ...filtered].slice(0, 5);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const addToCart = useCallback((product: Product, quantity: number = 1, selectedGift?: FreeGift) => {
    // If product has selectable gifts and none is selected, open modal
    if (product.selectableGifts && !selectedGift) {
      setGiftSelectionProduct(product);
      setGiftSelectionQuantity(quantity);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && !item.isFreeGift);
      let newCart = [...prev];

      if (existing) {
        newCart = prev.map(item => 
          (item.id === product.id && !item.isFreeGift) 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        newCart = [...prev, { ...product, quantity }];
      }

      // Handle Free Gift (Automatic or Selected)
      const giftToApply = selectedGift || product.freeGift || product.selectableGifts?.[0];
      
      if (giftToApply) {
        const giftId = giftToApply.id;
        const existingGift = newCart.find(item => item.id === giftId && item.isFreeGift && item.linkedToProductId === product.id);
        
        if (!existingGift) {
          const giftItem: CartItem = {
            id: giftId,
            name: `[FREE] ${giftToApply.name}`,
            price: 0,
            category: "Gift",
            image: giftToApply.image,
            rating: 5,
            reviews: 0,
            description: `Free gift with ${product.name}`,
            quantity: quantity,
            isFreeGift: true,
            linkedToProductId: product.id
          };
          newCart.push(giftItem);
        } else {
          newCart = newCart.map(item => 
            (item.id === giftId && item.isFreeGift && item.linkedToProductId === product.id)
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
      }

      return newCart;
    });
    setIsCartOpen(true);
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      const isExist = prev.find(item => item.id === product.id);
      if (isExist) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const addReview = useCallback((productId: number, review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedReviews = [...(p.reviewsList || []), newReview];
        const newRating = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
        return {
          ...p,
          reviewsList: updatedReviews,
          reviews: updatedReviews.length,
          rating: newRating
        };
      }
      return p;
    }));
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCart(prev => {
      const itemToUpdate = prev.find(item => item.id === id && !item.isFreeGift);
      if (!itemToUpdate) return prev;

      const newQty = Math.max(1, itemToUpdate.quantity + delta);

      return prev.map(item => {
        if (item.id === id && !item.isFreeGift) {
          return { ...item, quantity: newQty };
        }
        // Sync linked free gift quantity
        if (item.isFreeGift && item.linkedToProductId === id) {
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setCart(prev => prev.filter(item => item.id !== id && item.linkedToProductId !== id));
  }, []);

  const handleCheckout = useCallback((pointsRedeemed: number) => {
    setIsCartOpen(false);
    navigate('/checkout', { state: { pointsRedeemed } });
  }, [navigate]);

  const filteredProducts = useMemo(() =>
    products
      .filter(p => {
        const matchesCategory = activeCategory === "All" || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRating = p.rating >= minRating;
        return matchesCategory && matchesSearch && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "name-az") return a.name.localeCompare(b.name);
        if (sortBy === "name-za") return b.name.localeCompare(a.name);
        return 0;
      }),
    [products, activeCategory, searchQuery, minRating, sortBy]
  );

  const HomePage = () => (
    <>
      {/* Hero Carousel */}
      <HeroCarousel />

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
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                aria-label="Search products"
              />
              {isSearchFocused && (
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}

              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(4px)" }}
                    transition={{ duration: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="max-h-[450px] overflow-y-auto">
                      {searchQuery.length > 0 ? (
                        <div className="p-2">
                          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Products</div>
                          {products.filter(p => 
                            p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchQuery.toLowerCase())
                          ).slice(0, 6).length > 0 ? (
                            products.filter(p => 
                              p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.category.toLowerCase().includes(searchQuery.toLowerCase())
                            ).slice(0, 6).map(product => (
                              <button
                                key={product.id}
                                onClick={() => {
                                  navigate(`/product/${product.id}`);
                                  setIsSearchFocused(false);
                                }}
                                className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                              >
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">
                                    {product.name}
                                  </h4>
                                  <p className="text-xs text-slate-500">${product.price.toFixed(2)}</p>
                                </div>
                                <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
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
                                {recentSearches.map((search, i) => (
                                  <button
                                    key={i}
                                    onClick={() => setSearchQuery(search)}
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
                                {CATEGORIES.filter(c => c !== "All").map(cat => (
                                  <button
                                    key={cat}
                                    onClick={() => {
                                      setActiveCategory(cat);
                                      setIsSearchFocused(false);
                                    }}
                                    className="px-4 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-xs font-semibold text-slate-600 transition-colors"
                                    aria-label={`Category ${cat}`}
                                  >
                                    {cat}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}

                          {recentlyViewed.length > 0 && (
                            <div className="mt-4">
                              <div className="px-2 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recently Viewed</div>
                              <div className="grid grid-cols-2 gap-3">
                                {recentlyViewed.map(product => (
                                  <button
                                    key={product.id}
                                    onClick={() => {
                                      navigate(`/product/${product.id}`);
                                      setIsSearchFocused(false);
                                    }}
                                    className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                                    aria-label={`View details for recently viewed ${product.name}`}
                                  >
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-[11px] font-bold text-slate-900 truncate">{product.name}</h4>
                                      <p className="text-[10px] text-emerald-600 font-bold">${product.price.toFixed(2)}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {recentlyViewed.length === 0 && (
                            <div className="mt-4">
                              <div className="px-2 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Trending Now</div>
                              <div className="grid grid-cols-2 gap-3">
                                {products.slice(0, 4).map(product => (
                                  <button
                                    key={product.id}
                                    onClick={() => {
                                      navigate(`/product/${product.id}`);
                                      setIsSearchFocused(false);
                                    }}
                                    className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                                    aria-label={`View details for trending ${product.name}`}
                                  >
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-[11px] font-bold text-slate-900 truncate">{product.name}</h4>
                                      <p className="text-[10px] text-emerald-600 font-bold">${product.price.toFixed(2)}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {searchQuery.length > 0 && products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 6 && (
                      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                        <button 
                          onClick={() => setIsSearchFocused(false)}
                          className="text-xs font-bold text-slate-600 hover:text-emerald-600"
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
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-slate-100 rounded-full px-6 py-2.5 pr-10 text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer transition-all"
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
              onClick={() => setIsFilterOpen(true)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                minRating > 0 || activeCategory !== "All"
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
              }`}
              aria-label="Open filters"
            >
              <Filter size={16} />
              Filters
              {(minRating > 0 || activeCategory !== "All") && (
                <span className="w-5 h-5 bg-emerald-600 text-white text-[10px] rounded-full flex items-center justify-center">
                  {(minRating > 0 ? 1 : 0) + (activeCategory !== "All" ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

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
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
            <p className="text-slate-500 max-w-xs">
              We couldn't find anything matching "{searchQuery}". Try a different term or category.
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-6 text-emerald-600 font-semibold hover:underline"
              aria-label="Clear all filters"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </>
  );

  return (
    <div className="min-h-screen">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        wishlistCount={wishlist.length}
        loyaltyPoints={loyaltyPoints}
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onCategorySelect={setActiveCategory}
        activeCategory={activeCategory}
      />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collection" element={
          <CollectionPage
            products={products}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlist={wishlist}
            onQuickView={setQuickViewProduct}
          />
        } />
        <Route path="/checkout" element={
          <CheckoutPage 
            cart={cart} 
            loyaltyPoints={loyaltyPoints}
            onOrderComplete={(pointsRedeemed) => {
              const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
              const discount = pointsRedeemed * 0.01;
              const total = Math.max(0, subtotal - discount);
              const pointsEarned = Math.floor(total);
              setLoyaltyPoints(prev => prev - pointsRedeemed + pointsEarned);
              setCart([]);
            }}
          />
        } />
        <Route 
          path="/product/:id" 
          element={
            <ProductDetailPage 
              products={products}
              onAddToCart={addToCart}
              onAddReview={addReview}
              onAddToRecentlyViewed={addToRecentlyViewed}
              onToggleWishlist={toggleWishlist}
              wishlist={wishlist}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          } 
        />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <a href="#" className="text-2xl font-display font-bold tracking-tight text-slate-900 mb-6 block">
              Pet Shop<span className="text-orange-500">.</span>
            </a>
            <p className="text-slate-500 text-sm leading-relaxed">
              Curating the finest essentials for your modern lifestyle. Quality meets minimalist design.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">All Products</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Discounts</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Newsletter</h4>
            <p className="text-sm text-slate-500 mb-4">Subscribe to get special offers and first look at new products.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-600 transition-colors"
                aria-label="Newsletter email"
              />
              <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors" aria-label="Subscribe to newsletter">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
          <p>© 2026 Pet Shop. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
          </div>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        loyaltyPoints={loyaltyPoints}
        onCheckout={handleCheckout}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onAddToCart={addToCart}
        onRemove={(id) => setWishlist(prev => prev.filter(item => item.id !== id))}
      />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
        minRating={minRating}
        onRatingSelect={setMinRating}
        onClearAll={() => {
          setActiveCategory("All");
          setMinRating(0);
        }}
      />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
        products={products}
        onQuickView={(p) => setQuickViewProduct(p)}
        onToggleWishlist={toggleWishlist}
        wishlist={wishlist}
        onAddReview={addReview}
      />

      <GiftSelectionModal
        isOpen={!!giftSelectionProduct}
        onClose={() => setGiftSelectionProduct(null)}
        gifts={giftSelectionProduct?.selectableGifts || []}
        onSelect={(gift) => {
          if (giftSelectionProduct) {
            addToCart(giftSelectionProduct, giftSelectionQuantity, gift);
            setGiftSelectionProduct(null);
          }
        }}
      />
    </div>
  );
}
