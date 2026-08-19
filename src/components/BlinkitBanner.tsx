import React from 'react';
import { 
  Zap, 
  Receipt,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { TradeCategory } from '../types';

interface BlinkitBannerProps {
  onOpenAiScanner: () => void;
  onOpenRoiCalc: () => void;
  onSelectCategory: (cat: TradeCategory) => void;
  onOpenProfileModal?: () => void;
}

export const BlinkitBanner: React.FC<BlinkitBannerProps> = ({
  onOpenAiScanner,
  onOpenRoiCalc,
  onSelectCategory,
  onOpenProfileModal
}) => {
  return (
    <div className="w-full space-y-4">
      
      {/* ================= BENTO 1: MIX, FIX & REPAIR (Direct match to Reference Image 3) ================= */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#e0effe] via-[#eaf4ff] to-[#d6ebff] border border-sky-200 p-3.5 sm:p-5 md:p-6 shadow-xs">
        
        {/* Banner Top Header with floating collage */}
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-0.5 max-w-lg">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-sky-900 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full">
                ⚡ 12-MIN DISPATCH
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-sky-800">
                Local Hardware Store Network
              </span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              MIX, FIX & REPAIR 🛠️
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 font-semibold leading-relaxed">
              Emergency valves, MCBs, solvents & drill bits to your jobsite floor.
            </p>
          </div>

          {/* Decorative Floating Hardware Collage Icon Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-white/80 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl border border-sky-200/80 shadow-2xs shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=100&auto=format&fit=crop&q=80" 
              alt="Valve"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100&auto=format&fit=crop&q=80" 
              alt="MCB"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover"
            />
          </div>
        </div>

        {/* 4 Quadrant Visual Product Tiles (Exact Match to Image 3) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          
          {/* Tile 1: Angle Valves */}
          <div 
            onClick={() => onSelectCategory('plumbing')}
            className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-2xs border border-sky-100 flex flex-col justify-between hover:shadow-md hover:border-sky-300 transition cursor-pointer group"
          >
            <div>
              <div className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight truncate">Fast Angle Valves</div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">Supreme / Jaquar</div>
            </div>
            <div className="my-1.5 sm:my-2 h-16 sm:h-20 w-full rounded-lg sm:rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&auto=format&fit=crop&q=80" 
                alt="Angle Valve"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover group-hover:scale-108 transition duration-300"
              />
            </div>
            <div className="bg-sky-50 text-sky-800 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-center truncate">
              Starts at ₹185
            </div>
          </div>

          {/* Tile 2: MCBs & Wires */}
          <div 
            onClick={() => onSelectCategory('electrical')}
            className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-2xs border border-sky-100 flex flex-col justify-between hover:shadow-md hover:border-sky-300 transition cursor-pointer group"
          >
            <div>
              <div className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight truncate">C-Curve MCBs</div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">Havells / Polycab</div>
            </div>
            <div className="my-1.5 sm:my-2 h-16 sm:h-20 w-full rounded-lg sm:rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80" 
                alt="MCB"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover group-hover:scale-108 transition duration-300"
              />
            </div>
            <div className="bg-amber-50 text-amber-900 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-center truncate">
              Starts at ₹195
            </div>
          </div>

          {/* Tile 3: Fasteners */}
          <div 
            onClick={() => onSelectCategory('fasteners')}
            className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-2xs border border-sky-100 flex flex-col justify-between hover:shadow-md hover:border-sky-300 transition cursor-pointer group"
          >
            <div>
              <div className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight truncate">Wall Plugs & Screws</div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">Fischer / Drywall</div>
            </div>
            <div className="my-1.5 sm:my-2 h-16 sm:h-20 w-full rounded-lg sm:rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=400&auto=format&fit=crop&q=80" 
                alt="Fasteners"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover group-hover:scale-108 transition duration-300"
              />
            </div>
            <div className="bg-emerald-50 text-emerald-800 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-center truncate">
              Up to 35% OFF
            </div>
          </div>

          {/* Tile 4: Solvents & Glue */}
          <div 
            onClick={() => onSelectCategory('adhesives')}
            className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-2xs border border-sky-100 flex flex-col justify-between hover:shadow-md hover:border-sky-300 transition cursor-pointer group"
          >
            <div>
              <div className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight truncate">Solvents & M-Seal</div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">Astral / Pidilite</div>
            </div>
            <div className="my-1.5 sm:my-2 h-16 sm:h-20 w-full rounded-lg sm:rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400&auto=format&fit=crop&q=80" 
                alt="Adhesives"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover group-hover:scale-108 transition duration-300"
              />
            </div>
            <div className="bg-rose-50 text-rose-800 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-center truncate">
              Starts at ₹35
            </div>
          </div>

        </div>

        {/* Footer Link (Image 3) */}
        <div className="mt-3 pt-2 flex items-center justify-between border-t border-sky-200/60 text-xs">
          <button
            onClick={() => onSelectCategory('all')}
            className="font-black text-sky-900 hover:text-sky-950 flex items-center gap-1 cursor-pointer group text-[11px] sm:text-xs"
          >
            <span>See all 500+ rescue parts</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </button>

          <span className="text-[10px] sm:text-[11px] font-bold text-sky-800">
            ⚡ Avg delivery time: 11.4 mins
          </span>
        </div>

      </div>

      {/* ================= BENTO 2: B2B SAVER PASS (Direct match to Image 3 Dark Blue Card) ================= */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0c234a] via-[#103268] to-[#0a1c3d] text-white border border-blue-800/40 p-3.5 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          
          {/* Left Info */}
          <div className="space-y-1 max-w-md w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-blue-400 text-slate-950 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                FREE
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>100% GSTR-3B Input Tax Credit</span>
              </span>
            </div>

            <h3 className="text-base sm:text-lg md:text-xl font-black tracking-tight leading-tight text-white">
              SAVER PASS • 18% ITC TAX SAVINGS
            </h3>

            <p className="text-[11px] sm:text-xs text-blue-200 font-medium leading-relaxed">
              Lock discounted wholesale price & claim 18% GST input credit on every bill.
            </p>

            <div className="pt-1">
              <button
                onClick={onOpenProfileModal}
                className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs px-3.5 py-1.5 sm:py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-98"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Get the pass / Add GSTIN</span>
              </button>
            </div>
          </div>

          {/* Right Product Comparison Box (Exact match to Image 3) */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/15 shrink-0 w-full sm:w-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white/10 shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=200&auto=format&fit=crop&q=80" 
                alt="Product"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="text-[10px] text-blue-200 font-bold">Standard: <span className="line-through text-slate-300">₹450</span></div>
              <div className="text-xs sm:text-sm font-black text-emerald-400">
                Pass Price: ₹369
              </div>
              <div className="text-[9px] text-emerald-200 font-bold bg-emerald-500/25 px-1.5 py-0.5 rounded-md inline-block">
                Saves ₹81 GST Credit
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
