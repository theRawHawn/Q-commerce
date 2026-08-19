import React from 'react';
import { 
  Droplet, 
  Zap, 
  Hammer, 
  Anchor, 
  Wrench, 
  TestTube, 
  ShieldCheck, 
  Sparkles, 
  Boxes, 
  Receipt,
  Clock,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';
import { TradeCategory } from '../types';

interface CategoryChipsProps {
  selectedCategory: TradeCategory;
  onSelectCategory: (category: TradeCategory) => void;
  onOpenRestock: () => void;
  onOpenAiScanner: () => void;
  isGstFilterActive?: boolean;
  onToggleGstFilter?: () => void;
}

export interface CategoryItem {
  id: TradeCategory;
  label: string;
  icon: any;
  imgUrl: string;
  bgColor: string;
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'all',
    label: 'All Items',
    icon: Layers,
    imgUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=200&auto=format&fit=crop&q=80',
    bgColor: 'bg-amber-100/70 border-amber-200'
  },
  {
    id: 'plumbing',
    label: 'Plumbing',
    icon: Droplet,
    imgUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=200&auto=format&fit=crop&q=80',
    bgColor: 'bg-blue-50 border-blue-200'
  },
  {
    id: 'electrical',
    label: 'Electrical',
    icon: Zap,
    imgUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&auto=format&fit=crop&q=80',
    bgColor: 'bg-amber-50 border-amber-200'
  },
  {
    id: 'fasteners',
    label: 'Fasteners',
    icon: Anchor,
    imgUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=200&auto=format&fit=crop&q=80',
    bgColor: 'bg-slate-100 border-slate-200'
  },
  {
    id: 'adhesives',
    label: 'Adhesives',
    icon: TestTube,
    imgUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=200&auto=format&fit=crop&q=80',
    bgColor: 'bg-rose-50 border-rose-200'
  },
  {
    id: 'tools',
    label: 'Tools & Bits',
    icon: Wrench,
    imgUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&auto=format&fit=crop&q=80',
    bgColor: 'bg-emerald-50 border-emerald-200'
  },
  {
    id: 'safety',
    label: 'Safety Gear',
    icon: ShieldCheck,
    imgUrl: 'https://images.unsplash.com/photo-1578873375969-d655f6e52292?w=200&auto=format&fit=crop&q=80',
    bgColor: 'bg-teal-50 border-teal-200'
  }
];

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenRestock,
  onOpenAiScanner,
  isGstFilterActive = false,
  onToggleGstFilter,
}) => {
  return (
    <div className="bg-white border-b border-slate-100 py-3 sm:py-4 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        
        {/* Categories Section Header (Reference Image 2 Style) */}
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Categories
          </h2>
          <button
            onClick={onOpenAiScanner}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full transition cursor-pointer border border-emerald-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Photo Match</span>
          </button>
        </div>

        {/* Category Visual Cards Carousel (Reference Image 2 Style) */}
        <div className="flex items-start gap-3 sm:gap-4 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group text-center focus:outline-none"
              >
                {/* Visual Rounded Square Card with Image and Icon overlay */}
                <div 
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1.5 flex items-center justify-center transition duration-200 relative overflow-hidden border ${
                    isSelected
                      ? 'bg-emerald-100 border-emerald-600 ring-2 ring-emerald-600/30 scale-105 shadow-xs'
                      : `${cat.bgColor} hover:scale-102 hover:shadow-2xs`
                  }`}
                >
                  <img 
                    src={cat.imgUrl} 
                    alt={cat.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl opacity-90 group-hover:opacity-100 transition"
                  />
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-2xs">
                    <Icon className="w-2.5 h-2.5 text-slate-800" />
                  </div>
                </div>

                {/* Label */}
                <span className={`text-[11px] sm:text-xs tracking-tight font-extrabold max-w-[72px] truncate ${
                  isSelected ? 'text-emerald-900' : 'text-slate-700'
                }`}>
                  {cat.label}
                </span>
              </button>
            );
          })}

          {/* Quick Van Restock Tile */}
          <button
            onClick={onOpenRestock}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1.5 bg-purple-50 border border-purple-200 flex flex-col items-center justify-center hover:scale-102 transition shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-1">
                <Boxes className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-black text-purple-900 uppercase">Restock</span>
            </div>
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-700">Van Kits</span>
          </button>
        </div>

        {/* Filter Quick Chips Row (GSTIN 18% ITC toggle & 12-min dispatch) */}
        {onToggleGstFilter && (
          <div className="flex items-center gap-2 pt-1 overflow-x-auto scrollbar-none text-xs border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Filters:</span>
            </span>

            {/* GSTIN / 18% ITC Filter Toggle */}
            <button
              onClick={onToggleGstFilter}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border transition cursor-pointer ${
                isGstFilterActive
                  ? 'bg-sky-700 text-white border-sky-800 shadow-2xs'
                  : 'bg-sky-50 hover:bg-sky-100 text-sky-900 border-sky-200'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>🧾 GST Invoice / 18% ITC Sellers Only</span>
              {isGstFilterActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 ml-0.5"></span>
              )}
            </button>

            {/* Express 12-min tag */}
            <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Clock className="w-3 h-3 text-emerald-600" />
              <span>⚡ Local 12-Min Delivery</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
