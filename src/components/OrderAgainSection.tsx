import React from 'react';
import { RotateCcw, ChevronRight, Zap, Droplet, Anchor, ShieldCheck } from 'lucide-react';
import { CustomerProfile, HardwareProduct } from '../types';

interface OrderAgainSectionProps {
  customerProfile: CustomerProfile;
  products: HardwareProduct[];
  onSelectCategory: (category: any) => void;
  onOpenRestock: () => void;
  onOpenDetail: (product: HardwareProduct) => void;
}

export const OrderAgainSection: React.FC<OrderAgainSectionProps> = ({
  customerProfile,
  products,
  onSelectCategory,
  onOpenRestock,
  onOpenDetail
}) => {
  const firstName = customerProfile.name ? customerProfile.name.split(' ')[0] : 'Trade Pro';

  // Group products for the visual 2x2 grid cards (like Swiggy / Blinkit "Order Again" cards)
  const mostOrdered = products.slice(0, 4);
  const plumbingItems = products.filter(p => p.category === 'plumbing').slice(0, 4);
  const electricalItems = products.filter(p => p.category === 'electrical').slice(0, 4);

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
          <span>{firstName}, order again</span>
        </h2>
        <button
          onClick={onOpenRestock}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
        >
          <span>Quick Kits</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Visual Bundle Cards: scrollable on small mobile, grid on sm/md */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        
        {/* Card 1: Most Ordered */}
        <div 
          onClick={onOpenRestock}
          className="bg-sky-50/70 hover:bg-sky-50 border border-sky-200/80 rounded-2xl p-3 sm:p-3.5 transition cursor-pointer flex flex-col justify-between group shadow-2xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-black text-xs text-slate-900">Most Ordered</span>
            <span className="text-[9px] sm:text-[10px] font-bold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-full">
              ⚡ 12-Min
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-1">
            {mostOrdered.map((item, idx) => (
              <div 
                key={item.id}
                className="relative bg-white rounded-xl p-1.5 border border-slate-100 flex flex-col items-center justify-center aspect-square shadow-2xs overflow-hidden"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition duration-300"
                />
                {idx === 3 && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs rounded-xl flex items-center justify-center text-white font-black text-xs">
                    +16
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-2 text-[11px] font-bold text-slate-600 flex items-center justify-between">
            <span>Fasteners & Valves</span>
            <span className="text-sky-700 font-extrabold group-hover:translate-x-0.5 transition">Restock &gt;</span>
          </div>
        </div>

        {/* Card 2: Plumbing & CPVC */}
        <div 
          onClick={() => onSelectCategory('plumbing')}
          className="bg-blue-50/70 hover:bg-blue-50 border border-blue-200/80 rounded-2xl p-3 sm:p-3.5 transition cursor-pointer flex flex-col justify-between group shadow-2xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-black text-xs text-slate-900">Plumbing & CPVC</span>
            <span className="text-[9px] sm:text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
              Leak Rescues
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-1">
            {plumbingItems.map((item, idx) => (
              <div 
                key={item.id}
                className="relative bg-white rounded-xl p-1.5 border border-slate-100 flex flex-col items-center justify-center aspect-square shadow-2xs overflow-hidden"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition duration-300"
                />
                {idx === 3 && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs rounded-xl flex items-center justify-center text-white font-black text-xs">
                    +8
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-2 text-[11px] font-bold text-slate-600 flex items-center justify-between">
            <span>Teflon, Brass & Jaquar</span>
            <span className="text-blue-700 font-extrabold group-hover:translate-x-0.5 transition">Explore &gt;</span>
          </div>
        </div>

        {/* Card 3: Electrical & MCBs */}
        <div 
          onClick={() => onSelectCategory('electrical')}
          className="bg-amber-50/70 hover:bg-amber-50 border border-amber-200/80 rounded-2xl p-3 sm:p-3.5 transition cursor-pointer flex flex-col justify-between group shadow-2xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-black text-xs text-slate-900">Electrical & MCBs</span>
            <span className="text-[9px] sm:text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
              Havells & Wago
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-1">
            {electricalItems.map((item, idx) => (
              <div 
                key={item.id}
                className="relative bg-white rounded-xl p-1.5 border border-slate-100 flex flex-col items-center justify-center aspect-square shadow-2xs overflow-hidden"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition duration-300"
                />
                {idx === 3 && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs rounded-xl flex items-center justify-center text-white font-black text-xs">
                    +12
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-2 text-[11px] font-bold text-slate-600 flex items-center justify-between">
            <span>Breakers, Wires & Tape</span>
            <span className="text-amber-700 font-extrabold group-hover:translate-x-0.5 transition">Explore &gt;</span>
          </div>
        </div>

      </div>
    </div>
  );
};
