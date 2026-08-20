import React from 'react';
import { 
  Droplet, 
  Zap, 
  Anchor, 
  Wrench, 
  TestTube, 
  ShieldCheck, 
  RotateCcw, 
  Layers,
  Sparkles,
  Grid,
  Disc,
  Scissors,
  Hammer
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
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'all',
    label: 'All',
    icon: Grid,
  },
  {
    id: 'plumbing',
    label: 'Plumbing',
    icon: Droplet,
  },
  {
    id: 'electrical',
    label: 'Electrical',
    icon: Zap,
  },
  {
    id: 'screws',
    label: 'Screws & Anchors',
    icon: Hammer,
  },
  {
    id: 'cutters',
    label: 'Tile & Iron Cutters',
    icon: Scissors,
  },
  {
    id: 'cutting_discs',
    label: 'Cutting Discs & Blades',
    icon: Disc,
  },
  {
    id: 'fasteners',
    label: 'Fasteners',
    icon: Anchor,
  },
  {
    id: 'adhesives',
    label: 'Adhesives',
    icon: TestTube,
  },
  {
    id: 'tools',
    label: 'Tools & Bits',
    icon: Wrench,
  },
  {
    id: 'safety',
    label: 'Safety Gear',
    icon: ShieldCheck,
  }
];

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenRestock,
}) => {
  return (
    <div className="bg-white border-b border-slate-200/70 py-3 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Un-congested Horizontal Category Icons Bar */}
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto px-1 py-1 scrollbar-none">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group focus:outline-none transition select-none"
              >
                {/* Category Icon Pill */}
                <div 
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-200 relative ${
                    isSelected
                      ? 'bg-slate-950 text-amber-300 shadow-md scale-105 border border-amber-400/30'
                      : 'bg-slate-100/90 text-slate-800 hover:bg-slate-200/80 border border-slate-200/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isSelected ? 'text-amber-300' : 'text-slate-800'}`} />
                </div>

                {/* Category Label */}
                <span 
                  className={`text-xs font-bold tracking-tight text-center whitespace-nowrap transition ${
                    isSelected ? 'text-slate-950 font-black' : 'text-slate-600 group-hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </span>

                {/* Active Underline Indicator */}
                <div 
                  className={`h-1 rounded-full transition-all duration-200 ${
                    isSelected ? 'w-6 bg-slate-950' : 'w-0 bg-transparent'
                  }`}
                />
              </button>
            );
          })}

          {/* Reorder / History Tab */}
          <button
            onClick={onOpenRestock}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group focus:outline-none transition select-none"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center justify-center hover:bg-emerald-100 transition shadow-2xs">
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-800" />
            </div>
            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 tracking-tight whitespace-nowrap">
              Reorder
            </span>
            <div className="h-1 w-0 bg-transparent rounded-full" />
          </button>

        </div>

      </div>
    </div>
  );
};
