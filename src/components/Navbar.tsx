import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Camera, 
  Mic,
  Zap,
  User,
  Sparkles
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
  searchQuery,
  onSearchChange,
}) => {
  const placeholders = [
    'Search "1/2 brass angle valve"',
    'Search "16A C-Curve MCB"',
    'Search "Teflon PTFE tape"',
    'Search "CPVC solvent cement"',
    'Search "Bosch 6mm SDS drill bit"',
    'Search "Fischer nylon wall plugs"',
    'Search "M-Seal & Araldite epoxy"',
    'Search "Supreme & Astral fittings"',
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
    <header className="sticky top-0 z-40 bg-gradient-to-b from-[#FFE600] via-[#FFEB3B] to-[#FFF275] border-b border-amber-300/80 shadow-xs text-slate-900 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-3 sm:pb-3.5 space-y-2.5 sm:space-y-3">
        
        {/* Top Row: Logo, Delivery ETA, Address & Profile */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Left Block: Logo + ETA + Location */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            
            {/* Blinkit Logo */}
            <div 
              onClick={() => onSearchChange('')}
              className="flex items-center gap-1 cursor-pointer select-none shrink-0"
              title="Home / Reset Search"
            >
              <div className="flex items-baseline font-black text-xl sm:text-2xl tracking-tighter text-slate-950">
                <span>blink</span>
                <span className="text-emerald-700">it</span>
              </div>
              <span className="bg-slate-950 text-amber-300 text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm tracking-wider shadow-2xs ml-0.5 hidden min-[380px]:inline-block">
                HARDWARE
              </span>
            </div>

            {/* Separator Line */}
            <div className="h-8 w-px bg-slate-900/15 shrink-0 hidden min-[480px]:block" />

            {/* Delivery Info Block */}
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-xs font-black text-slate-800 tracking-tight flex items-center gap-1 leading-none">
                <span>Blinkit in</span>
              </div>

              {/* Big ETA Text with Lightning bolt */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-slate-950 fill-slate-950 shrink-0" />
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-none shrink-0">
                  {liveEta.etaMins} minutes
                </h1>
              </div>

              {/* Delivery Address Dropdown with reduced size and lower contrast */}
              <button
                onClick={onOpenLocationModal}
                className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-700 hover:text-slate-950 transition cursor-pointer max-w-full group"
                title="Change Delivery Jobsite Address"
              >
                <span className="font-extrabold uppercase tracking-tight text-slate-800 underline decoration-slate-800/30 underline-offset-2 shrink-0">
                  {jobSite.jobTag || 'HOME'}
                </span>
                <span className="text-slate-600 font-medium truncate max-w-[140px] sm:max-w-[260px] md:max-w-[360px]">
                  - {jobSite.floorUnit ? `${jobSite.floorUnit}, ` : ''}{jobSite.address}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-600 group-hover:translate-y-0.5 transition shrink-0 ml-0.5" />
              </button>
            </div>

          </div>

          {/* Right Block: Account Profile Button (No Wallet as requested) */}
          <div className="flex items-center shrink-0">
            <button
              onClick={onOpenProfileModal}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-slate-950 border border-amber-300 shadow-sm flex items-center justify-center font-black text-sm hover:scale-105 active:scale-95 transition cursor-pointer"
              title="Account & Trade Profile"
            >
              {userInitial ? (
                <span className="text-sm font-black">{userInitial}</span>
              ) : (
                <User className="w-5 h-5 text-slate-800" />
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
