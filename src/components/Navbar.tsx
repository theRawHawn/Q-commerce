import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Camera, 
  Mic,
  Zap,
  User,
  Sparkles,
  RotateCcw,
  ShoppingBag
} from 'lucide-react';
import { JobSiteLocation, CustomerProfile } from '../types';
import { calculateDynamicDeliveryEta } from '../utils/deliveryEta';

interface NavbarProps {
  jobSite: JobSiteLocation;
  customerProfile: CustomerProfile;
  onOpenLocationModal: () => void;
  onOpenProfileModal: () => void;
  onOpenAiPartFinder: () => void;
  onOpenRoiCalculator?: () => void;
  onOpenToolboxRestock?: () => void;
  onOpenCart?: () => void;
  cartCount?: number;
  cartTotal?: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  jobSite,
  customerProfile,
  onOpenLocationModal,
  onOpenProfileModal,
  onOpenAiPartFinder,
  onOpenToolboxRestock,
  onOpenCart,
  cartCount,
  cartTotal,
  searchQuery,
  onSearchChange,
}) => {
  const placeholders = [
    'Search "1/2 brass angle valve"',
    'Search "Bosch 1250W tile cutter machine"',
    'Search "4 inch diamond cutting disc"',
    'Search "Self-drilling hex head screws"',
    'Search "16A C-Curve MCB breaker"',
    'Search "Dewalt 4 inch angle grinder"',
    'Search "Fischer nylon wall plugs & screws"',
    'Search "Ultra-thin iron cutting wheel disc"',
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  // Real-time dynamic delivery ETA calculation based on current jobsite coordinates
  const liveEta = calculateDynamicDeliveryEta(jobSite.coordinates);
  const userInitial = customerProfile.name ? customerProfile.name.charAt(0).toUpperCase() : 'R';

  return (
    <header 
      className="w-full rounded-none text-slate-950 transition-all relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #F8C336 0%, #FBD050 100%)',
      }}
    >
      {/* Subtle Ambient Bokeh Glow */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 10%, rgba(255, 255, 255, 0.45) 0%, transparent 40%),
            radial-gradient(circle at 90% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 45%),
            radial-gradient(circle at 50% 100%, rgba(255, 255, 255, 0.3) 0%, transparent 40%)
          `
        }}
      />
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-2.5 space-y-2.5 sm:space-y-3">
        
        {/* Top Row: Delivery ETA, Address & Profile */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Left Block: ETA + Location */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            
            {/* Delivery Info Block */}
            <div className="min-w-0 flex-1">
              {/* Big ETA Text with Lightning bolt */}
              <div className="flex items-center gap-1.5">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-slate-950 fill-slate-950 shrink-0" />
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-none shrink-0">
                  {liveEta.etaMins} minutes
                </h1>
              </div>

              {/* Delivery Address Dropdown with reduced size and lower contrast */}
              <button
                onClick={onOpenLocationModal}
                className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-900/90 hover:text-slate-950 transition cursor-pointer max-w-full group"
                title="Change Delivery Jobsite Address"
              >
                <span className="font-extrabold uppercase tracking-tight text-slate-950 underline decoration-slate-950/40 underline-offset-2 shrink-0">
                  {jobSite.jobTag || 'HOME'}
                </span>
                <span className="text-slate-900/80 font-medium truncate max-w-[140px] sm:max-w-[260px] md:max-w-[360px]">
                  - {jobSite.floorUnit ? `${jobSite.floorUnit}, ` : ''}{jobSite.address}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-950 group-hover:translate-y-0.5 transition shrink-0 ml-0.5" />
              </button>
            </div>

          </div>

          {/* Right Block: Cart & Account Profile Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Header Cart Button (Desktop/Tablet Only) */}
            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="hidden md:flex relative items-center justify-center bg-slate-950 text-white hover:bg-slate-900 border border-amber-300/80 p-2 sm:p-2.5 rounded-xl shadow-md transition cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                title="Open Shopping Cart"
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  {cartCount !== undefined && cartCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-emerald-500 text-slate-950 text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-slate-950">
                      {cartCount}
                    </span>
                  )}
                </div>
              </button>
            )}

            {/* Account Profile Button */}
            <button
              onClick={onOpenProfileModal}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950 text-white border border-amber-300 shadow-md flex items-center justify-center font-black text-sm hover:scale-105 active:scale-95 transition cursor-pointer shrink-0"
              title="Account & Trade Profile"
            >
              {userInitial ? (
                <span className="text-sm font-black text-amber-300">{userInitial}</span>
              ) : (
                <User className="w-5 h-5 text-amber-300" />
              )}
            </button>
          </div>

        </div>

        {/* Search Bar Row: Spacious, Clean Floating Card */}
        <div className="relative">
          <div className="flex items-center bg-white border border-slate-200/90 rounded-2xl sm:rounded-full px-3.5 py-2.5 sm:py-3 shadow-md transition-all focus-within:ring-2 focus-within:ring-slate-900 focus-within:shadow-lg">
            
            {/* Search Icon */}
            <Search className="w-5 h-5 text-slate-800 shrink-0 mr-2.5" />

            {/* Input */}
            <input
              id="blinkit-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholders[placeholderIndex]}
              className="w-full bg-transparent text-xs sm:text-sm md:text-base text-slate-900 placeholder-slate-400 focus:outline-none font-semibold min-w-0"
            />

            {/* Right Action Buttons in Search Bar */}
            <div className="flex items-center gap-1.5 shrink-0 ml-1">
              
              {/* Clear button if active query */}
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-1 rounded-lg"
                >
                  Clear
                </button>
              )}

              {/* AI Photo Match / Camera Button */}
              <button
                onClick={onOpenAiPartFinder}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300/80 font-black text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0 transition cursor-pointer shadow-2xs"
                title="Snap or upload hardware part photo for AI match"
              >
                <Camera className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline text-xs">AI Match</span>
              </button>

              {/* Mic Icon (Visual voice search standard) */}
              <button
                onClick={onOpenAiPartFinder}
                className="p-1.5 text-slate-500 hover:text-slate-900 transition cursor-pointer rounded-full hover:bg-slate-100"
                title="Voice / AI Search"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </header>
  );
};
