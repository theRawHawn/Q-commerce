import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  Building2, 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Receipt, 
  ShoppingBag, 
  Check, 
  Tag, 
  Truck, 
  Sparkles,
  Store,
  Navigation,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CartItem, JobSiteLocation, HardwareProduct, CustomerProfile } from '../types';
import { calculateCartDispatchSummary } from '../utils/deliveryEta';

interface CartPageProps {
  items: CartItem[];
  allProducts: HardwareProduct[];
  jobSite: JobSiteLocation;
  customerProfile: CustomerProfile;
  onClose: () => void;
  onAddToCart: (product: HardwareProduct, qty?: number) => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: (config: {
    paymentMethod: 'Instant UPI' | 'Corporate Card' | 'Pay on Jobsite' | 'Trade Credit (Net 30)';
    clientInvoiceNeeded: boolean;
    clientName?: string;
    isGstEnabled?: boolean;
    gstin?: string;
    businessName?: string;
  }) => void;
  onOpenLocationModal: () => void;
  onOpenProfileModal: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  allProducts,
  jobSite,
  customerProfile,
  onClose,
  onAddToCart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onOpenLocationModal,
  onOpenProfileModal,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'Instant UPI' | 'Corporate Card' | 'Pay on Jobsite' | 'Trade Credit (Net 30)'>('Instant UPI');
  const [clientInvoiceNeeded, setClientInvoiceNeeded] = useState(true);
  const [clientName, setClientName] = useState(jobSite.jobTag || 'Flat 402 Renovation');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // GSTIN tick box state
  const savedGstin = customerProfile?.gstProfile?.gstin || '';
  const savedBusinessName = customerProfile?.gstProfile?.legalBusinessName || '';
  const [isGstEnabled, setIsGstEnabled] = useState<boolean>(() => {
    return Boolean(customerProfile?.gstProfile?.isB2BEnabled && savedGstin);
  });
  const [gstinInput, setGstinInput] = useState<string>(savedGstin || '');
  const [businessNameInput, setBusinessNameInput] = useState<string>(savedBusinessName || '');
  const [isEditingGstin, setIsEditingGstin] = useState<boolean>(!savedGstin);
  const [gstError, setGstError] = useState<string | null>(null);

  const [riderTip, setRiderTip] = useState<number>(0);

  // Dynamic dispatch calculation across all sellers in the cart based on distance to jobsite
  const dispatchSummary = calculateCartDispatchSummary(items, jobSite.coordinates);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const mrpTotal = items.reduce((sum, item) => sum + (item.product.originalPrice || item.product.price) * item.quantity, 0);
  const isFreeDelivery = subtotal >= 199;
  const deliveryFee = subtotal === 0 ? 0 : (isFreeDelivery ? 0 : 25);
  const deliverySavings = isFreeDelivery ? 25 : 0;
  const handlingCharge = subtotal > 0 ? 5 : 0;
  const discount = appliedPromo ? Math.round(subtotal * 0.1) : 0;
  const totalSavings = Math.max(0, (mrpTotal - subtotal) + discount + deliverySavings);
  const tax = Math.round(((subtotal - discount) * 18) / 118);
  const total = Math.max(0, subtotal - discount + deliveryFee + handlingCharge + riderTip);

  // Input Tax Credit (ITC) calculation
  const itcClaimable = items.reduce((acc, item) => {
    if (item.product.isGstRegistered !== false) {
      const rate = item.product.gstRatePercent || 18;
      const itemTax = Math.round((item.product.price * item.quantity * rate) / (100 + rate));
      return acc + itemTax;
    }
    return acc;
  }, 0);

  const isValidGstinFormat = (val: string) => {
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val.trim().toUpperCase());
  };

  // Cross-sell items for carousel
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const cartProductIds = new Set(items.map(i => i.product.id));
  const suggestedCompanions = allProducts.filter(p => !cartProductIds.has(p.id)).slice(0, 10);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = () => {
    if (isGstEnabled) {
      const activeGstin = (gstinInput || savedGstin).trim().toUpperCase();
      if (!activeGstin) {
        setGstError('Please enter a valid 15-digit GSTIN or untick the GSTIN box to order as an individual.');
        return;
      }
      if (!isValidGstinFormat(activeGstin)) {
        setGstError('Invalid GSTIN format (e.g. 29AABCP1429B1Z8). Please correct or untick the GSTIN box.');
        return;
      }
    }
    setGstError(null);
    setIsProcessing(true);
    setTimeout(() => {
      const activeGstin = isGstEnabled ? (gstinInput.trim().toUpperCase() || savedGstin) : undefined;
      const activeBusiness = isGstEnabled ? (businessNameInput.trim() || savedBusinessName || 'Registered Enterprise') : undefined;
      
      onCheckout({
        paymentMethod,
        clientInvoiceNeeded,
        clientName,
        isGstEnabled,
        gstin: activeGstin,
        businessName: activeBusiness
      });
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      
      {/* Top Cart Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1 font-bold text-xs"
              title="Back to Catalog"
            >
              <ArrowLeft className="w-5 h-5 text-slate-800" />
              <span className="hidden sm:inline">Back to Store</span>
            </button>
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Checkout & Review</span>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {items.reduce((s, i) => s + i.quantity, 0)} items
                </span>
              </h1>
            </div>
          </div>

          {/* Plain ETA with distance - no card border */}
          <div className="flex items-center gap-2 text-right">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm sm:text-base font-black text-slate-900">
                ⚡ {dispatchSummary.formattedEta}
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {dispatchSummary.nearestHubDistanceKm.toFixed(1)} km away
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Cart Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-32 sm:pb-24">
        
        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="max-w-md mx-auto my-12 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Your Cart is Empty</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                No hardware items added yet. Browse emergency repair parts, valves, breakers & screws for instant courier dispatch.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-3 rounded-xl transition cursor-pointer shadow-sm"
            >
              Browse Hardware Catalog
            </button>
          </div>
        ) : (
          /* 2-Column Responsive Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            
            {/* Left Column (8 Cols on Desktop) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              
              {/* 1. Jobsite Delivery Address Card */}
              <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm text-slate-900 truncate">
                          {jobSite.jobTag || 'Jobsite Floor Drop'}
                        </span>
                        <span className="text-[10px] text-emerald-800 bg-emerald-100 font-extrabold px-2 py-0.5 rounded-md uppercase">
                          Floor Delivery
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 font-semibold mt-1">
                        {jobSite.floorUnit} • {jobSite.address}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Landmark: {jobSite.landmark} • Gate: {jobSite.gateCode}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Site Contact: <strong>{jobSite.siteContactName}</strong> ({jobSite.sitePhone})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Plain ETA & distance - no card border */}
                    <div className="text-right leading-tight hidden sm:block">
                      <div className="text-sm font-black text-slate-900">
                        ⚡ {dispatchSummary.formattedEta}
                      </div>
                      <div className="text-[11px] font-bold text-slate-500">
                        {dispatchSummary.nearestHubDistanceKm.toFixed(1)} km away
                      </div>
                    </div>

                    <button
                      onClick={onOpenLocationModal}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </section>

              {/* 2. Cart Items List */}
              <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-slate-900">
                      Order Items ({items.length})
                    </h2>
                    <p className="text-[11px] text-slate-400 font-medium">
                      All items in stock for instant courier dispatch
                    </p>
                  </div>
                  <button
                    onClick={onClearCart}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                      
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                              {product.category}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight block">
                            {product.specs?.brand || 'PRO HARDWARE'} • SKU: {product.id}
                          </span>
                          <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate leading-snug">
                            {product.name}
                          </h3>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {product.specs?.size || product.specs?.standard || 'Standard Size'}
                          </div>
                          <div className="text-xs font-black text-slate-900 mt-1">
                            <span>₹{product.price} <span className="text-[10px] font-medium text-slate-400">/ unit</span></span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="bg-emerald-700 text-white rounded-lg px-2 py-1 flex items-center gap-2 shadow-2xs font-extrabold text-xs">
                          <button
                            onClick={() => onUpdateQty(product.id, -1)}
                            className="hover:bg-emerald-800 rounded p-0.5 transition cursor-pointer text-white"
                            title="Decrease quantity"
                          >
                            {quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-200 hover:text-white" /> : <Minus className="w-3.5 h-3.5 stroke-[2.5]" />}
                          </button>
                          <span className="w-4 text-center font-mono text-xs font-black text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(product.id, 1)}
                            className="hover:bg-emerald-800 rounded p-0.5 transition cursor-pointer text-white"
                            title="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900">
                            ₹{product.price * quantity}
                          </span>
                          {product.mrp && product.mrp > product.price && (
                            <div className="text-[10px] text-slate-400 line-through">
                              ₹{product.mrp * quantity}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. Frequently Bought Together Carousel */}
              {suggestedCompanions.length > 0 && (
                <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <h2 className="text-xs sm:text-sm font-black text-slate-900">
                        Frequently Bought Together
                      </h2>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => scrollCarousel('left')}
                        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollCarousel('right')}
                        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div
                    ref={carouselRef}
                    className="flex gap-3 overflow-x-auto pb-2 pt-1 scroll-smooth snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {suggestedCompanions.map((comp) => {
                      const compQty = items.find(i => i.product.id === comp.id)?.quantity || 0;
                      return (
                        <div
                          key={comp.id}
                          className="w-36 sm:w-40 shrink-0 bg-white hover:bg-slate-50/80 border border-slate-200/90 rounded-2xl p-2.5 flex flex-col justify-between snap-start transition shadow-2xs group"
                        >
                          <div>
                            {/* Product Image + Floating ADD / Stepper */}
                            <div className="relative mb-2.5 rounded-xl overflow-hidden bg-slate-50 border border-slate-200/70 aspect-square flex items-center justify-center">
                              <img
                                src={comp.imageUrl}
                                alt={comp.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              
                              {comp.specs?.brand && (
                                <span className="absolute top-1.5 left-1.5 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                                  {comp.specs.brand}
                                </span>
                              )}

                              {/* Floating ADD / Stepper Button */}
                              <div className="absolute bottom-1.5 right-1.5">
                                {compQty === 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => onAddToCart(comp, 1)}
                                    className="bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-600 font-black text-[11px] px-2.5 py-1 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1 uppercase"
                                  >
                                    <span>ADD</span>
                                    <Plus className="w-3 h-3 stroke-[3]" />
                                  </button>
                                ) : (
                                  <div className="bg-emerald-700 text-white font-extrabold text-xs rounded-lg px-2 py-1 shadow-md flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => onUpdateQty(comp.id, -1)}
                                      className="hover:bg-emerald-800 rounded p-0.5 transition cursor-pointer"
                                    >
                                      {compQty === 1 ? <Trash2 className="w-3 h-3 text-rose-200" /> : <Minus className="w-3 h-3 stroke-[3]" />}
                                    </button>
                                    <span className="font-mono text-xs w-3 text-center">{compQty}</span>
                                    <button
                                      type="button"
                                      onClick={() => onUpdateQty(comp.id, 1)}
                                      className="hover:bg-emerald-800 rounded p-0.5 transition cursor-pointer"
                                    >
                                      <Plus className="w-3 h-3 stroke-[3]" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Pack Size / Unit Badge */}
                            <div className="text-[10px] text-slate-500 font-bold bg-slate-100 w-fit px-1.5 py-0.5 rounded mb-1">
                              {comp.specs?.size || comp.specs?.standard || '1 Unit'}
                            </div>

                            {/* Product Title */}
                            <h4 className="text-xs font-extrabold text-slate-900 line-clamp-2 leading-tight mb-1">
                              {comp.name}
                            </h4>
                          </div>

                          {/* Price Row */}
                          <div className="flex items-baseline gap-1.5 mt-2 pt-2 border-t border-slate-100">
                            <span className="text-xs font-black text-slate-900">₹{comp.price}</span>
                            {comp.mrp && comp.mrp > comp.price && (
                              <span className="text-[10px] text-slate-400 line-through">₹{comp.mrp}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 5. B2B GSTIN & Project Tagging */}
              <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
                
                {/* GSTIN Enable/Disable Checkbox Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <label className="flex items-start gap-3 cursor-pointer select-none flex-1">
                    <input
                      type="checkbox"
                      id="checkout-gstin-tickbox"
                      checked={isGstEnabled}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIsGstEnabled(checked);
                        setGstError(null);
                        if (checked && !gstinInput) {
                          setGstinInput(savedGstin || '29AABCP1429B1Z8');
                          setBusinessNameInput(savedBusinessName || 'Apex Infra & Renovations LLP');
                        }
                      }}
                      className="w-5 h-5 mt-0.5 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300 transition cursor-pointer accent-emerald-600 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-black text-slate-900">
                          GST Business Tax Invoice (GSTIN)
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isGstEnabled 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {isGstEnabled ? '✓ GSTIN Enabled' : 'Disabled (Individual)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {isGstEnabled 
                          ? 'GSTIN & business name will be printed on your official tax invoice.' 
                          : 'Tick this box to add your GSTIN and business name to the invoice.'}
                      </p>
                    </div>
                  </label>

                  {isGstEnabled && (
                    <button
                      type="button"
                      onClick={() => setIsEditingGstin(!isEditingGstin)}
                      className="text-xs font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg transition cursor-pointer shrink-0"
                    >
                      {isEditingGstin ? 'Done' : 'Change GSTIN'}
                    </button>
                  )}
                </div>

                {/* Body Content based on Checkbox State */}
                {isGstEnabled ? (
                  <div className="space-y-3">
                    
                    {/* If editing or entering GSTIN */}
                    {isEditingGstin || !gstinInput ? (
                      <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sky-950 flex items-center gap-1.5">
                            <Receipt className="w-3.5 h-3.5 text-sky-700" />
                            <span>Enter Business GST Details</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setGstinInput('29AABCP1429B1Z8');
                              setBusinessNameInput('Apex Infra & Renovations LLP');
                              setGstError(null);
                            }}
                            className="text-[10px] font-bold text-sky-700 hover:underline bg-white border border-sky-200 px-2 py-0.5 rounded cursor-pointer"
                          >
                            Fill sample GSTIN
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                              GSTIN (15 Digits) *
                            </label>
                            <input
                              type="text"
                              maxLength={15}
                              value={gstinInput}
                              onChange={(e) => {
                                setGstinInput(e.target.value.toUpperCase());
                                setGstError(null);
                              }}
                              placeholder="e.g. 29AABCP1429B1Z8"
                              className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase focus:border-emerald-600 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                              Legal Business / Firm Name *
                            </label>
                            <input
                              type="text"
                              value={businessNameInput}
                              onChange={(e) => setBusinessNameInput(e.target.value)}
                              placeholder="e.g. Apex Infra & Renovations LLP"
                              className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs font-bold focus:border-emerald-600 focus:outline-none"
                            />
                          </div>
                        </div>

                        {gstError && (
                          <p className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 p-2 rounded-lg">
                            {gstError}
                          </p>
                        )}
                      </div>
                    ) : (
                      /* Display confirmed active GSTIN card */
                      <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-3.5 space-y-2 text-xs text-sky-950">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Billing Entity:</span>
                          <span className="font-bold text-slate-900">{businessNameInput || savedBusinessName || 'Apex Infra & Renovations LLP'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Buyer GSTIN:</span>
                          <span className="font-mono font-bold text-sky-900 bg-sky-100/80 px-2 py-0.5 rounded border border-sky-200">{gstinInput || savedGstin}</span>
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      GSTIN option is disabled. Ordering with individual retail receipt.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsGstEnabled(true);
                        if (!gstinInput) {
                          setGstinInput(savedGstin || '29AABCP1429B1Z8');
                          setBusinessNameInput(savedBusinessName || 'Apex Infra & Renovations LLP');
                        }
                      }}
                      className="text-emerald-700 font-bold hover:underline cursor-pointer shrink-0 ml-2"
                    >
                      Enable GSTIN
                    </button>
                  </div>
                )}

                {/* Job / Client Tag for internal invoicing */}
                <div className="pt-1">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Client / Jobsite Reference Note (Optional):
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Flat 402 Bath Remodel, Client: Rahul Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </section>

            </div>

            {/* Right Column (4-5 Cols on Desktop - Sticky Payment & Bill Summary) */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-20">
              
              {/* Payment Methods */}
              <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>Select Payment Method</span>
                </h2>

                <div className="space-y-2">
                  {[
                    { id: 'Instant UPI', label: 'Instant UPI / QR Code', sub: 'Google Pay, PhonePe, Paytm', icon: '⚡' },
                    { id: 'Corporate Card', label: 'Corporate Card / NetBanking', sub: 'Visa, Master, Rupay Corporate', icon: '💳' },
                    { id: 'Pay on Jobsite', label: 'Pay on Floor Drop (Cash / UPI)', sub: 'Pay rider after inspection', icon: '💵' },
                    { id: 'Trade Credit (Net 30)', label: 'Trade Credit (Net 30)', sub: 'Pre-approved contractor credit line', icon: '📋' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        paymentMethod === method.id
                          ? 'bg-emerald-50/80 border-emerald-500 shadow-2xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id as any)}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>{method.icon}</span>
                          <span>{method.label}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{method.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {/* Green Savings Banner */}
              {totalSavings > 0 && (
                <div className="bg-emerald-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Saved <span className="bg-emerald-800 text-white px-2 py-0.5 rounded-md font-mono font-black">₹{totalSavings}</span> with this order!</span>
                  </div>
                </div>
              )}

              {/* Bill Details */}
              <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  Bill Details
                </h2>

                {/* Promo Code Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter Coupon Code"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs font-bold uppercase focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (promoCode) {
                        setAppliedPromo(promoCode);
                        setPromoCode('');
                      }
                    }}
                    className="bg-slate-900 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {appliedPromo && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Coupon '{appliedPromo}' Applied (-10%)
                    </span>
                    <button
                      onClick={() => setAppliedPromo(null)}
                      className="text-emerald-900 font-black hover:underline cursor-pointer text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span>Item Total</span>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      {mrpTotal > subtotal && (
                        <span className="text-slate-400 line-through text-[11px]">₹{mrpTotal}</span>
                      )}
                      <span>₹{subtotal}</span>
                    </div>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center text-emerald-700 font-bold">
                      <span>Pro Coupon Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <span>Delivery Partner Fee</span>
                      {isFreeDelivery && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.2 rounded uppercase">
                          FREE
                        </span>
                      )}
                    </span>
                    <span className="font-bold text-slate-900">
                      {isFreeDelivery ? (
                        <>
                          <span className="line-through text-slate-400 mr-1 font-normal">₹25</span>
                          <span className="text-emerald-700 font-black">FREE</span>
                        </>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Site Delivery & Gate Handling</span>
                    <span className="font-bold text-slate-900">₹{handlingCharge}</span>
                  </div>

                  {/* Delivery Partner Tip Section */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1">
                        <span>Delivery Partner Tip</span>
                        <span className="text-[10px] text-slate-400 font-normal">(100% to rider)</span>
                      </span>
                      {riderTip > 0 && (
                        <button
                          type="button"
                          onClick={() => setRiderTip(0)}
                          className="text-[10px] text-emerald-700 hover:underline font-bold"
                        >
                          Clear Tip
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { amount: 10, label: '₹10' },
                        { amount: 20, label: '₹20', badge: 'Most tipped' },
                        { amount: 30, label: '₹30' },
                        { amount: 50, label: '₹50' },
                      ].map((tip) => (
                        <button
                          key={tip.amount}
                          type="button"
                          onClick={() => setRiderTip(riderTip === tip.amount ? 0 : tip.amount)}
                          className={`py-1.5 px-1 rounded-xl border text-xs font-black transition cursor-pointer flex flex-col items-center justify-center relative ${
                            riderTip === tip.amount
                              ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                          }`}
                        >
                          <span>{tip.label}</span>
                          {tip.badge && (
                            <span className={`text-[7.5px] font-extrabold tracking-tight ${riderTip === tip.amount ? 'text-emerald-200' : 'text-emerald-700'}`}>
                              {tip.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isGstEnabled && (
                    <div className="flex justify-between items-center text-emerald-700 font-bold pt-1">
                      <span>GST ITC Included in Order</span>
                      <span>₹{itcClaimable || tax}</span>
                    </div>
                  )}

                  {/* To Pay Total */}
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline font-black text-sm sm:text-base text-slate-900">
                    <div>
                      <div>To Pay</div>
                      <div className="text-[10px] text-slate-400 font-medium">Inclusive of all taxes</div>
                    </div>
                    <div className="text-right flex items-baseline gap-1.5">
                      {(discount > 0 || mrpTotal > subtotal) && (
                        <span className="text-xs text-slate-400 line-through font-medium">
                          ₹{mrpTotal + deliveryFee + handlingCharge + riderTip}
                        </span>
                      )}
                      <span className="text-lg font-black text-emerald-900">₹{total}</span>
                    </div>
                  </div>
                </div>

              </section>

              {/* Order Cancellation & Dispatch Disclaimer Card */}
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 text-xs space-y-1">
                <div className="font-black text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>NOTE: Instant Dispatch Policy</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                  Orders are packed and dispatched immediately to meet jobsite deadlines. Orders cannot be cancelled once packed.
                </p>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Universal Sticky Bottom Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 p-3 px-4 sm:px-6 shadow-xl">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-tight">
                Pay via {paymentMethod} • ⚡ {dispatchSummary.formattedEta}
              </div>
              <div className="text-lg font-black text-slate-900">
                ₹{total}
              </div>
            </div>

            <button
              id="confirm-place-order-btn"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-black text-xs sm:text-sm uppercase px-6 sm:px-8 py-3 rounded-xl transition cursor-pointer shadow-md shadow-emerald-900/10 flex items-center gap-1 disabled:opacity-50"
            >
              <span>{isProcessing ? 'Dispatching...' : 'Place Order⚡'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
