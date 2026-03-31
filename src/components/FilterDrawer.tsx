import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Star, X, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../data';

export const FilterDrawer = ({ 
  isOpen, 
  onClose, 
  activeCategory, 
  onCategorySelect, 
  minRating, 
  onRatingSelect,
  onClearAll
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  activeCategory: string, 
  onCategorySelect: (category: string) => void, 
  minRating: number, 
  onRatingSelect: (rating: number) => void,
  onClearAll: () => void
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-xs bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Filter size={20} className="text-primary" />
                Filters
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Close filters">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(category => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        activeCategory === category 
                          ? 'bg-primary border-primary' 
                          : 'border-slate-300 group-hover:border-primary/45'
                      }`}>
                        {activeCategory === category && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                      <input 
                        type="radio" 
                        name="category" 
                        value={category} 
                        checked={activeCategory === category}
                        onChange={() => onCategorySelect(category)}
                        className="hidden"
                      />
                      <span className={`text-sm font-medium transition-colors ${
                        activeCategory === category ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'
                      }`}>
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Minimum Rating</h3>
                <div className="space-y-3">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        minRating === rating 
                          ? 'border-primary' 
                          : 'border-slate-300 group-hover:border-primary/45'
                      }`}>
                        {minRating === rating && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <input 
                        type="radio" 
                        name="rating" 
                        value={rating} 
                        checked={minRating === rating}
                        onChange={() => onRatingSelect(rating)}
                        className="hidden"
                      />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={`${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} transition-colors`} 
                          />
                        ))}
                        <span className="text-sm text-slate-500 ml-2">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-4">
              <button 
                onClick={onClearAll}
                className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={onClose}
                className="flex-[2] bg-primary text-white py-3 rounded-xl font-bold shadow-md shadow-secondary/70 hover:bg-primary-dark transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


