import React from 'react';
import { Home, Grid, RotateCcw, Building2, ShoppingBag } from 'lucide-react';
import { TradeCategory } from '../types';

interface MobileBottomNavProps {
  currentCategory: TradeCategory;
  onSelectCategory: (cat: TradeCategory) => void;
  onOpenRestock: () => void;
  onOpenProfile: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenRestock,
  onOpenProfile,
  onOpenCart,
  cartCount
}) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 text-center cursor-pointer transition ${
            currentCategory === 'all' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        {/* Categories */}
        <button
          onClick={() => onSelectCategory('plumbing')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 text-center cursor-pointer transition ${
            currentCategory !== 'all' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-bold">Categories</span>
        </button>

        {/* Reorder / Fast Restock */}
        <button
          onClick={onOpenRestock}
          className="flex flex-col items-center gap-0.5 px-2 py-1 text-center text-slate-500 hover:text-slate-900 cursor-pointer transition"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-[10px] font-bold">Reorder</span>
        </button>

        {/* B2B GST Profile */}
        <button
          onClick={onOpenProfile}
          className="flex flex-col items-center gap-0.5 px-2 py-1 text-center text-slate-500 hover:text-slate-900 cursor-pointer transition"
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px] font-bold">B2B GST</span>
        </button>

        {/* Cart */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center gap-0.5 px-2 py-1 text-center text-emerald-700 hover:text-emerald-800 cursor-pointer transition"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-700 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black">Cart</span>
        </button>

      </div>
    </div>
  );
};
