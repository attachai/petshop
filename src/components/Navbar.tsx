import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ChevronDown, Filter, Heart, Menu, PawPrint, Search, ShoppingBag, User } from 'lucide-react';
import { CATEGORIES } from '../data';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = ({ 
  cartCount, 
  wishlistCount, 
  onOpenCart, 
  onOpenWishlist, 
  activeCategory,
  onCategorySelect,
  loyaltyPoints
}: { 
  cartCount: number, 
  wishlistCount: number, 
  onOpenCart: () => void, 
  onOpenWishlist: () => void, 
  activeCategory: string,
  onCategorySelect: (c: string) => void,
  loyaltyPoints: number
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visibleCategories = CATEGORIES.slice(0, 5);
  const moreCategories = CATEGORIES.slice(5);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Menu size={24} className="text-slate-900" />
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">
                <PawPrint size={20} className="text-white" />
              </div>
              <span className="text-2xl font-display font-bold text-slate-900 tracking-tight hidden sm:block">Pet Shop</span>
            </Link>
          </div>

          {location.pathname === '/' && (
            <div className="hidden lg:flex items-center gap-1 bg-slate-50/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-100/50">
              {visibleCategories.map(category => (
                <button 
                  key={category}
                  onClick={() => onCategorySelect(category)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeCategory === category ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                >
                  {category}
                </button>
              ))}
              <div className="relative" ref={moreRef}>
                <button 
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1 transition-all ${moreCategories.includes(activeCategory) ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                >
                  More <ChevronDown size={14} className={`transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 grid grid-cols-1 gap-1"
                    >
                      {moreCategories.map(category => (
                        <button 
                          key={category}
                          onClick={() => {
                            onCategorySelect(category);
                            setIsMoreOpen(false);
                          }}
                          className={`px-4 py-2 text-sm font-medium text-left transition-colors ${activeCategory === category ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                          {category}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                <Award size={16} className="text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">{loyaltyPoints} pts</span>
              </div>
            )}
            
            <button className="p-2.5 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
              <Search size={20} className="text-slate-600" />
            </button>
            
            <Link to="/profile" className="p-2.5 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
              <User size={20} className="text-slate-600" />
            </Link>
            
            <button 
              onClick={onOpenWishlist}
              className="p-2.5 hover:bg-slate-100 rounded-full transition-colors relative group"
            >
              <Heart size={20} className="text-slate-600 group-hover:text-rose-500 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={onOpenCart}
              className="p-2.5 hover:bg-slate-100 rounded-full transition-colors relative group"
            >
              <ShoppingBag size={20} className="text-slate-600 group-hover:text-emerald-600 transition-colors" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cartCount}
                  className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
