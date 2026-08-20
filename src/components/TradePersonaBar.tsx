import React from 'react';
import { 
  Droplet, 
  Zap, 
  Hammer, 
  Anchor, 
  Wrench, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { TradeCategory } from '../types';

interface TradePersonaBarProps {
  selectedCategory: TradeCategory;
  onSelectCategory: (cat: TradeCategory) => void;
  activeTradeRole: string;
  onSelectTradeRole: (role: string) => void;
}

const TRADES = [
  { id: 'all', label: 'All Catalog', icon: LayoutGrid, category: 'all' as TradeCategory, tag: '500+ SKUs' },
  { id: 'plumbing', label: 'Plumbing', icon: Droplet, category: 'plumbing' as TradeCategory, color: 'text-sky-400', tag: 'Valves, CPVC, Hoses' },
  { id: 'electrical', label: 'Electrical', icon: Zap, category: 'electrical' as TradeCategory, color: 'text-amber-400', tag: 'MCBs, Wires, Sockets' },
  { id: 'fasteners', label: 'Fasteners & Plugs', icon: Anchor, category: 'fasteners' as TradeCategory, color: 'text-emerald-400', tag: 'Rawl Plugs, Screws' },
  { id: 'tools', label: 'Tools & Bits', icon: Wrench, category: 'tools' as TradeCategory, color: 'text-orange-400', tag: 'SDS Bits, Blades, Pliers' },
  { id: 'adhesives', label: 'Adhesives & Sealants', icon: Layers, category: 'adhesives' as TradeCategory, color: 'text-purple-400', tag: 'Solvent, Epoxy, RTV' },
  { id: 'carpentry', label: 'Carpentry', icon: Hammer, category: 'carpentry' as TradeCategory, color: 'text-yellow-400', tag: 'Hinges, Wood Glue' },
  { id: 'safety', label: 'Safety & Gloves', icon: ShieldCheck, category: 'safety' as TradeCategory, color: 'text-teal-400', tag: 'Goggles, Nitrile' }
];

export const TradePersonaBar: React.FC<TradePersonaBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="bg-zinc-900 border-b border-zinc-800/80 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap mr-1 hidden sm:inline">
          Trade Categories:
        </span>
        {TRADES.map((trade) => {
          const Icon = trade.icon;
          const isSelected = selectedCategory === trade.category;
          return (
            <button
              key={trade.id}
              id={`trade-tab-${trade.id}`}
              onClick={() => onSelectCategory(trade.category)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                isSelected
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border-zinc-700/60 hover:text-zinc-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-zinc-950' : trade.color || 'text-zinc-400'}`} />
              <span>{trade.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
