import React from 'react';
import { 
  Zap, 
  Droplet, 
  Anchor, 
  ShieldAlert, 
  Clock, 
  Check, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { EMERGENCY_KITS } from '../data/products';
import { HardwareProduct } from '../types';

interface EmergencyKitsSectionProps {
  products: HardwareProduct[];
  onAddKitToCart: (productIds: string[]) => void;
}

export const EmergencyKitsSection: React.FC<EmergencyKitsSectionProps> = ({
  products,
  onAddKitToCart
}) => {
  return (
    <section className="bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 rounded-2xl border border-amber-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-700 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-md">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              1-Click Jobsite Bundles
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1">
            Emergency Jobsite Repair Kits
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Pre-packed packs for urgent plumbing leaks, tripped breakers & heavy wall mounting.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {EMERGENCY_KITS.map((kit) => {
          const kitItems = kit.productIds
            .map(id => products.find(p => p.id === id))
            .filter((p): p is HardwareProduct => Boolean(p));

          return (
            <div
              key={kit.id}
              className="bg-white border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all hover:shadow-md shadow-xs group"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-slate-100 text-slate-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                    {kit.trade}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-800 font-extrabold text-[11px] bg-emerald-100 px-2 py-0.5 rounded-full">
                    <Zap className="w-3 h-3 fill-emerald-700 text-emerald-700" />
                    {kit.deliveryTime}
                  </span>
                </div>

                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition">
                  {kit.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {kit.description}
                </p>

                {/* Items in Pack */}
                <div className="mt-3 space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Includes {kitItems.length} In-Stock Items:
                  </span>
                  {kitItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-1.5 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </div>
                  ))}
                </div>

                {/* Time & Money Savings Ticker */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] bg-amber-50/80 border border-amber-200/60 px-2.5 py-1.5 rounded-lg">
                  <span className="flex items-center gap-1 font-bold text-amber-900">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Saves {kit.savingsMins} min traffic run
                  </span>
                  <span className="text-emerald-700 font-extrabold">
                    +₹{Math.round(kit.savingsMins * 6)} billable
                  </span>
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-slate-900">₹{kit.price}</span>
                    {kit.originalPrice && (
                      <span className="text-[11px] text-slate-400 line-through">₹{kit.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block">Combo Price</span>
                </div>

                <button
                  id={`dispatch-kit-${kit.id}`}
                  onClick={() => onAddKitToCart(kit.productIds)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Dispatch Kit</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};
