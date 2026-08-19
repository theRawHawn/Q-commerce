import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  ShoppingBag, 
  Camera, 
  Sparkles, 
  User, 
  Building2, 
  Receipt,
  Clock
} from 'lucide-react';
import { JobSiteLocation, CustomerProfile } from '../types';

interface NavbarProps {
  jobSite: JobSiteLocation;
  customerProfile: CustomerProfile;
  onOpenLocationModal: () => void;
  onOpenProfileModal: () => void;
  onOpenAiPartFinder: () => void;
  onOpenRoiCalculator: () => void;
  onOpenToolboxRestock: () => void;
  onOpenCart: () => void;
  cartCount: number;
  cartTotal: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  jobSite,
  customerProfile,
  onOpenLocationModal,
  onOpenProfileModal,
  onOpenAiPartFinder,
  onOpenCart,
  cartCount,
  cartTotal,
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

  const isB2B = customerProfile?.gstProfile?.isB2BEnabled && customerProfile?.gstProfile?.gstin;
  const userInitial = customerProfile.name ? customerProfile.name.charAt(0).toUpperCase() : 'R';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
        
        {/* ================= MOBILE HEADER (Ref: Blinkit / Zepto / Swiggy Mobile Screen) ================= */}
        <div className="md:hidden space-y-2">
          
          {/* Row 1: Delivery ETA + Drop Location on Left, Profile + Cart on Right */}
          <div className="flex items-center justify-between gap-2">
            
            {/* Delivery Time & Drop Location Pill */}
            <div 
              onClick={onOpenLocationModal}
              className="cursor-pointer flex items-center gap-2 group flex-1 min-w-0 pr-2"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 leading-none">
                  <span className="text-sm font-black text-slate-950">12 mins</span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">FAST</span>
                </div>
                <div className="flex items-center gap-0.5 text-xs text-slate-600 font-bold truncate mt-0.5 group-hover:text-emerald-700">
                  <span className="truncate">To: {jobSite.floorUnit || jobSite.address}</span>
                  <ChevronDown className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Profile & Cart Controls on Right */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Profile Avatar Button */}
              <button
                onClick={onOpenProfileModal}
                className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black hover:bg-slate-800 transition cursor-pointer shadow-2xs"
                title="Account & Profile"
              >
                {userInitial}
              </button>

              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {cartCount > 0 && <span>{cartCount}</span>}
              </button>

            </div>

          </div>

          {/* Row 2: Full-Width Search Bar with AI Photo Match Scanner */}
          <div className="relative flex items-center bg-slate-100/90 hover:bg-slate-100 border border-slate-200/90 rounded-2xl px-3.5 py-2 transition focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 focus-within:bg-white shadow-2xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholders[placeholderIndex]}
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
            />

            {/* AI Vision Scanner Button */}
            <button
              onClick={onOpenAiPartFinder}
              title="Snap broken hardware part for instant AI match"
              className="ml-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-extrabold text-[11px] px-2 py-1 rounded-xl flex items-center gap-1 shrink-0 transition cursor-pointer shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] font-black">AI Match</span>
            </button>
          </div>

        </div>

        {/* ================= DESKTOP HEADER (MD and Up) ================= */}
        <div className="hidden md:flex items-center justify-between gap-4">
          
          {/* Logo & Drop Location */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 cursor-pointer">
              <div className="flex items-baseline font-black text-2xl tracking-tighter text-slate-900">
                <span>blink</span>
                <span className="text-emerald-600">it</span>
              </div>
              <div className="bg-amber-400 text-zinc-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider shadow-2xs">
                HARDWARE
              </div>
            </div>

            {/* Drop Location */}
            <div 
              onClick={onOpenLocationModal}
              className="cursor-pointer group flex items-start gap-2 pl-4 border-l border-slate-200"
            >
              <div className="pt-0.5">
                <div className="flex items-center gap-1 text-[11px] font-black text-slate-900 leading-none">
                  <span className="text-emerald-700">⚡ 10-12 MINS DELIVERY</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-700 font-bold truncate mt-0.5 group-hover:text-emerald-700 max-w-[200px]">
                  <span className="truncate">{jobSite.floorUnit || jobSite.address}</span>
                  <ChevronDown className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-emerald-700 transition" />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative flex items-center bg-slate-100/90 hover:bg-slate-100 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 transition focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 focus-within:bg-white shadow-2xs">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
              
              <input
                id="blinkit-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholders[placeholderIndex]}
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
              />

              <button
                onClick={onOpenAiPartFinder}
                className="ml-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-extrabold text-xs px-2.5 py-1 rounded-xl flex items-center gap-1.5 shrink-0 transition cursor-pointer shadow-2xs"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Photo Match</span>
              </button>
            </div>
          </div>

          {/* Right Desktop Actions */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* B2B GSTIN Pill */}
            <button
              onClick={onOpenProfileModal}
              className={`font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer border ${
                isB2B
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-700" />
              <div className="text-left leading-tight">
                <div className="font-extrabold text-[11px]">
                  {isB2B ? 'B2B GST: Active' : 'GSTIN & Billing'}
                </div>
                <div className="text-[9px] text-slate-500">
                  {isB2B ? '18% ITC Claimable' : 'Claim Tax Credit'}
                </div>
              </div>
            </button>

            {/* Profile Button */}
            <button
              onClick={onOpenProfileModal}
              className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs p-1.5 sm:px-3 sm:py-2 rounded-xl flex items-center gap-2 transition cursor-pointer border border-slate-200"
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">
                {userInitial}
              </div>
              <div className="text-left leading-none">
                <div className="font-extrabold text-slate-900 text-xs truncate max-w-[100px]">
                  {customerProfile.name ? customerProfile.name.split(' ')[0] : 'Account'}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                  {customerProfile.isPhoneVerified ? 'Verified' : 'Profile'}
                </div>
              </div>
            </button>

            {/* Cart Button */}
            <button
              id="navbar-cart-btn"
              onClick={onOpenCart}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount === 0 ? (
                <span>My Cart</span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span>{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
                  <span className="text-emerald-300">•</span>
                  <span className="font-black">₹{cartTotal.toFixed(0)}</span>
                </div>
              )}
            </button>

          </div>

        </div>

      </div>
    </header>
  );
};
