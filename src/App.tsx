import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { CartDrawer } from './components/CartDrawer';
import { CheckoutPage } from './components/CheckoutPage';
import { CollectionPage } from './components/CollectionPage';
import { FilterDrawer } from './components/FilterDrawer';
import { GiftSelectionModal } from './components/GiftSelectionModal';
import { HomePage } from './components/HomePage';
import { Navbar } from './components/Navbar';
import ProfilePage from './components/ProfilePage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { QuickViewModal } from './components/QuickViewModal';
import { SiteFooter } from './components/SiteFooter';
import { WishlistDrawer } from './components/WishlistDrawer';
import { PRODUCTS } from './data';
import {
  addProductToCart,
  calculateCartSubtotal,
  calculateCartTotal,
  calculatePointsEarned,
  removeCartItemGroup,
  updateCartItemQuantity,
} from './features/shop/cartUtils';
import { CartItem, FreeGift, Product, Review } from './types';

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
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
  const [loyaltyPoints, setLoyaltyPoints] = useState(250);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const addToRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id);
      return [product, ...filtered].slice(0, 4);
    });

    setRecentSearches((prev) => {
      const filtered = prev.filter((term) => term !== product.name);
      return [product.name, ...filtered].slice(0, 5);
    });
  }, []);

  const addToCart = useCallback((product: Product, quantity: number = 1, selectedGift?: FreeGift) => {
    if (product.selectableGifts && !selectedGift) {
      setGiftSelectionProduct(product);
      setGiftSelectionQuantity(quantity);
      return;
    }

    setCart((prev) => addProductToCart(prev, product, quantity, selectedGift));
    setIsCartOpen(true);
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      return existingItem
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product];
    });
  }, []);

  const addReview = useCallback((productId: number, review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).slice(2, 11),
      date: new Date().toISOString().split('T')[0],
    };

    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== productId) {
          return product;
        }

        const updatedReviews = [...(product.reviewsList || []), newReview];
        const rating = Number(
          (updatedReviews.reduce((sum, item) => sum + item.rating, 0) / updatedReviews.length).toFixed(1)
        );

        return {
          ...product,
          reviewsList: updatedReviews,
          reviews: updatedReviews.length,
          rating,
        };
      })
    );
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCart((prev) => updateCartItemQuantity(prev, id, delta));
  }, []);

  const removeItem = useCallback((id: number) => {
    setCart((prev) => removeCartItemGroup(prev, id));
  }, []);

  const handleCheckout = useCallback((pointsRedeemed: number) => {
    setIsCartOpen(false);
    navigate('/checkout', { state: { pointsRedeemed } });
  }, [navigate]);

  const handleOrderComplete = useCallback((pointsRedeemed: number) => {
    const subtotal = calculateCartSubtotal(cart);
    const total = calculateCartTotal(subtotal, pointsRedeemed);
    const pointsEarned = calculatePointsEarned(total);

    setLoyaltyPoints((prev) => prev - pointsRedeemed + pointsEarned);
    setCart([]);
  }, [cart]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setActiveCategory('All');
    setMinRating(0);
  }, []);

  const filteredProducts = useMemo(
    () =>
      products
        .filter((product) => {
          const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
          const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesRating = product.rating >= minRating;

          return matchesCategory && matchesSearch && matchesRating;
        })
        .sort((a, b) => {
          if (sortBy === 'price-low') return a.price - b.price;
          if (sortBy === 'price-high') return b.price - a.price;
          if (sortBy === 'rating') return b.rating - a.rating;
          if (sortBy === 'name-az') return a.name.localeCompare(b.name);
          if (sortBy === 'name-za') return b.name.localeCompare(a.name);
          return 0;
        }),
    [products, activeCategory, searchQuery, minRating, sortBy]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <div className="min-h-screen">
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        loyaltyPoints={loyaltyPoints}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onCategorySelect={setActiveCategory}
        activeCategory={activeCategory}
      />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              products={products}
              filteredProducts={filteredProducts}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              sortBy={sortBy}
              minRating={minRating}
              wishlist={wishlist}
              recentSearches={recentSearches}
              recentlyViewed={recentlyViewed}
              isSearchFocused={isSearchFocused}
              onCategorySelect={setActiveCategory}
              onSearchQueryChange={setSearchQuery}
              onSearchFocusChange={setIsSearchFocused}
              onSortChange={setSortBy}
              onOpenFilters={() => setIsFilterOpen(true)}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
              onQuickView={setQuickViewProduct}
              onNavigateToProduct={(productId) => navigate(`/product/${productId}`)}
              onClearFilters={handleClearFilters}
            />
          }
        />
        <Route
          path="/collection"
          element={
            <CollectionPage
              products={products}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
              wishlist={wishlist}
              onQuickView={setQuickViewProduct}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cart={cart}
              onOrderComplete={handleOrderComplete}
            />
          }
        />
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
              onQuickView={setQuickViewProduct}
            />
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      <SiteFooter />

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
        onRemove={(id) => setWishlist((prev) => prev.filter((item) => item.id !== id))}
      />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
        minRating={minRating}
        onRatingSelect={setMinRating}
        onClearAll={handleClearFilters}
      />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
        products={products}
        onQuickView={setQuickViewProduct}
        onToggleWishlist={toggleWishlist}
        wishlist={wishlist}
        onAddReview={addReview}
      />

      <GiftSelectionModal
        isOpen={!!giftSelectionProduct}
        onClose={() => setGiftSelectionProduct(null)}
        gifts={giftSelectionProduct?.selectableGifts || []}
        onSelect={(gift) => {
          if (!giftSelectionProduct) {
            return;
          }

          addToCart(giftSelectionProduct, giftSelectionQuantity, gift);
          setGiftSelectionProduct(null);
        }}
      />
    </div>
  );
}
