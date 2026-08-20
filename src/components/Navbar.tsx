import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Camera, 
  Building2, 
  Clock,
  Zap,
  MapPin
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

  const isB2B = customerProfile?.gstProfile?.isB2BEnabled && customerProfile?.gstProfile?.gstin;
  const userInitial = customerProfile.name ? customerProfile.name.charAt(0).toUpperCase() : 'R';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        
        {/* ================= MOBILE HEADER (<768px) ================= */}
        <div className="md:hidden space-y-2">
          
          {/* Row 1: Logo & Delivery ETA on Left, Profile Avatar on Right */}
          <div className="flex items-center justify-between gap-2">
            
            {/* Logo */}
            <div 
              onClick={() => onSearchChange('')}
              className="flex items-center gap-1 cursor-pointer select-none shrink-0"
            >
              <div className="flex items-baseline font-black text-lg tracking-tighter text-slate-900">
                <span>blink</span>
                <span className="text-emerald-600">it</span>
              </div>
            </div>

            {/* Delivery ETA & Address Pill */}
            <div 
              onClick={onOpenLocationModal}
              className="cursor-pointer group flex items-center gap-2 pl-2.5 border-l border-slate-200 min-w-0 flex-1 transition select-none"
              title="Change Jobsite Delivery Address"
            >
              <div className="min-w-0 flex-1 leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-tight">
                    ⚡ {liveEta.etaMins} MINS
                  </span>
                  <span className="text-[8px] font-extrabold text-emerald-900 bg-emerald-100 px-1.5 py-0.2 rounded-full uppercase tracking-wider shrink-0">
                    {liveEta.badge}
                  </span>
                </div>
                
                {/* Address line */}
                <div className="text-[10.5px] text-slate-700 font-bold truncate mt-0.5 group-hover:text-emerald-700 flex items-center gap-0.5">
                  <span className="truncate">{jobSite.floorUnit || jobSite.address}</span>
                  <ChevronDown className="w-3 h-3 shrink-0 text-slate-400 group-hover:text-emerald-700 transition" />
                </div>
              </div>
            </div>

            {/* Profile Avatar Button */}
            <div className="flex items-center shrink-0 ml-1">
              <button
                onClick={onOpenProfileModal}
                className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-black hover:bg-slate-800 transition cursor-pointer shadow-2xs"
                title="Account & Profile"
              >
                {userInitial}
              </button>
            </div>

          </div>

          {/* Row 2: Full-Width Search Bar */}
          <div className="relative flex items-center bg-slate-100/90 hover:bg-slate-100 border border-slate-200/90 rounded-2xl px-3 py-1.5 sm:py-2 transition focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 focus-within:bg-white shadow-2xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholders[placeholderIndex]}
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium min-w-0"
            />

            <button
              onClick={onOpenAiPartFinder}
              title="Snap broken hardware part for instant AI match"
              className="ml-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-extrabold text-[11px] px-2 py-0.5 rounded-xl flex items-center gap-1 shrink-0 transition cursor-pointer shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] font-black">AI Match</span>
            </button>
          </div>

        </div>

        {/* ================= TABLET / MID-SIZE HEADER (768px - 1023px: md to lg) ================= */}
        <div className="hidden md:block lg:hidden space-y-2.5">
          {/* Row 1: Logo & Location on Left | B2B & Profile on Right */}
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo & Drop Location */}
            <div className="flex items-center gap-4 min-w-0">
              <div 
                onClick={() => onSearchChange('')}
                className="flex items-center gap-1.5 cursor-pointer select-none shrink-0"
              >
                <div className="flex items-baseline font-black text-xl tracking-tighter text-slate-900">
                  <span>blink</span>
                  <span className="text-emerald-600">it</span>
                </div>
                <div className="bg-amber-400 text-zinc-950 text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider shadow-2xs">
                  HARDWARE
                </div>
              </div>

              {/* Delivery ETA Location Block */}
              <div 
                onClick={onOpenLocationModal}
                className="cursor-pointer group flex items-center gap-2.5 pl-3 border-l border-slate-200 min-w-0 transition select-none"
                title="Change Delivery Location"
              >
                <div className="leading-tight min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Delivery in</span>
                    <span className="text-xs font-black text-emerald-700 tracking-tight">
                      {liveEta.etaMins} MINS
                    </span>
                    <span className="text-[8px] font-extrabold text-emerald-900 bg-emerald-100 px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      {liveEta.badge}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[11px] text-slate-700 font-bold truncate mt-0.5 group-hover:text-emerald-700 max-w-[220px]">
                    <span className="truncate">{jobSite.floorUnit || jobSite.address}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-1 rounded text-[9.5px] font-black shrink-0">⚡ {liveEta.etaMins} MINS</span>
                    <ChevronDown className="w-3 h-3 shrink-0 text-slate-400 group-hover:text-emerald-700 transition" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Tablet Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* B2B GSTIN Pill */}
              <button
                onClick={onOpenProfileModal}
                className={`font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer border ${
                  isB2B
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <div className="text-left leading-tight">
                  <div className="font-extrabold text-[10px]">
                    {isB2B ? 'B2B GST: Active' : 'GSTIN & Billing'}
                  </div>
                  <div className="text-[8.5px] text-slate-500">
                    {isB2B ? '18% ITC Claimable' : 'Claim Tax Credit'}
                  </div>
                </div>
              </button>

              {/* Profile Button */}
              <button
                onClick={onOpenProfileModal}
                className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-2 transition cursor-pointer border border-slate-200/90 shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  {userInitial}
                </div>
                <div className="text-left leading-none">
                  <div className="font-extrabold text-slate-900 text-[11px] truncate max-w-[90px]">
                    {customerProfile.name ? customerProfile.name.split(' ')[0] : 'Account'}
                  </div>
                </div>
              </button>
            </div>

          </div>

          {/* Row 2: Full Width Tablet Search Bar */}
          <div className="relative flex items-center bg-slate-100/90 hover:bg-slate-100 border border-slate-200/90 rounded-2xl px-3.5 py-2 transition focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 focus-within:bg-white shadow-2xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholders[placeholderIndex]}
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium min-w-0"
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

        {/* ================= DESKTOP HEADER (1024px+ : lg and up) ================= */}
        <div className="hidden lg:flex items-center justify-between gap-3 xl:gap-4">
          
          {/* Logo & Drop Location */}
          <div className="flex items-center gap-4 xl:gap-6 shrink-0">
            <div 
              onClick={() => onSearchChange('')}
              className="flex items-center gap-1.5 cursor-pointer select-none"
            >
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
              className="cursor-pointer group flex items-center gap-3 pl-4 xl:pl-5 border-l border-slate-200/90 transition select-none"
              title="Change Delivery Location"
            >
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Delivery in</span>
                  <span className="text-base font-black text-emerald-700 tracking-tight">
                    {liveEta.etaMins} MINUTES
                  </span>
                  <span className="text-[9px] font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {liveEta.badge}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold truncate mt-0.5 group-hover:text-emerald-700 max-w-[180px] xl:max-w-[260px]">
                  <span className="truncate">{jobSite.floorUnit || jobSite.address}</span>
                  <span className="text-emerald-700 bg-emerald-50 px-1 rounded text-[10px] font-black shrink-0">⚡ {liveEta.etaMins} MINS</span>
                  <ChevronDown className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-emerald-700 transition" />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-2 xl:mx-4 min-w-[220px]">
            <div className="relative flex items-center bg-slate-100/90 hover:bg-slate-100 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 transition focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 focus-within:bg-white shadow-2xs">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
              
              <input
                id="blinkit-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholders[placeholderIndex]}
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium min-w-0"
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
          <div className="flex items-center gap-2.5 xl:gap-3 shrink-0">
            
            {/* B2B GSTIN Pill */}
            <button
              onClick={onOpenProfileModal}
              className={`font-bold text-xs px-3 xl:px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer border ${
                isB2B
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
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
              className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs px-2.5 xl:px-3 py-2 rounded-xl flex items-center gap-2.5 transition cursor-pointer border border-slate-200/90 shadow-2xs"
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">
                {userInitial}
              </div>
              <div className="text-left leading-none">
                <div className="font-extrabold text-slate-900 text-xs truncate max-w-[100px] xl:max-w-[110px]">
                  {customerProfile.name ? customerProfile.name.split(' ')[0] : 'Account'}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                  {customerProfile.isPhoneVerified ? 'Verified Pro' : 'Trade Profile'}
                </div>
              </div>
            </button>

          </div>

        </div>

      </div>
    </header>
  );
};


