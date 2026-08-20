import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ArrowLeft,
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Zap, 
  Navigation, 
  PackageCheck, 
  Building, 
  FileText,
  Play,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  BatteryCharging,
  Gauge,
  PhoneCall,
  Share2,
  Check
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { OpenStreetMap } from './OpenStreetMap';
import { calculateDynamicDeliveryEta, DEFAULT_STORE_PARTNER } from '../utils/deliveryEta';

interface OrderTrackingModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onUpdateOrderStatus: (status: OrderStatus) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  order,
  onClose,
  onUpdateOrderStatus,
}) => {
  // Compute initial dynamic ETA in seconds based on distance
  const dynamicEta = useMemo(() => {
    if (!order) return { etaMins: 11, distanceKm: 1.2 };
    return calculateDynamicDeliveryEta(order.jobSite.coordinates);
  }, [order?.jobSite.coordinates]);

  const initialTotalSeconds = dynamicEta.etaMins * 60;
  const [etaSeconds, setEtaSeconds] = useState(initialTotalSeconds);
  const [simSpeed, setSimSpeed] = useState(1);
  const [showInvoice, setShowInvoice] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [courierSpeed, setCourierSpeed] = useState(28);

  // Sync initial seconds when new order opens
  useEffect(() => {
    if (order && order.status === 'placed') {
      setEtaSeconds(initialTotalSeconds);
    }
  }, [order?.id, initialTotalSeconds]);

  // Real-time live countdown
  useEffect(() => {
    if (!isOpen || !order || order.status === 'delivered') return;

    const interval = setInterval(() => {
      setEtaSeconds((prev) => Math.max(0, prev - (1 * simSpeed)));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, order?.status, simSpeed]);

  // Sync order status progression & speed telemetry based on timer progress
  useEffect(() => {
    if (!isOpen || !order || order.status === 'delivered') return;

    const progressRatio = (initialTotalSeconds - etaSeconds) / Math.max(1, initialTotalSeconds);

    let nextStatus: OrderStatus = order.status;
    if (progressRatio < 0.15) {
      nextStatus = 'placed';
    } else if (progressRatio >= 0.15 && progressRatio < 0.35) {
      nextStatus = 'picking';
    } else if (progressRatio >= 0.35 && progressRatio < 0.50) {
      nextStatus = 'packed';
    } else if (progressRatio >= 0.50 && progressRatio < 0.90) {
      nextStatus = 'out_for_delivery';
    } else if (progressRatio >= 0.90 && etaSeconds > 0) {
      nextStatus = 'arriving';
    } else if (etaSeconds === 0) {
      nextStatus = 'delivered';
    }

    if (nextStatus !== order.status) {
      onUpdateOrderStatus(nextStatus);
    }

    // Slight realistic speed fluctuation while on route
    if (order.status === 'out_for_delivery') {
      setCourierSpeed(Math.floor(26 + Math.sin(etaSeconds / 5) * 6));
    } else if (order.status === 'arriving') {
      setCourierSpeed(12);
    } else if (order.status === 'delivered') {
      setCourierSpeed(0);
    }
  }, [isOpen, etaSeconds, initialTotalSeconds, order?.status, onUpdateOrderStatus]);

  if (!isOpen || !order) return null;

  const formatMins = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const fastForward = () => {
    setEtaSeconds(prev => Math.max(0, prev - 120)); // skip 2 mins
  };

  const handleCopyOtp = () => {
    navigator.clipboard?.writeText(order.deliveryOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const orderTime = new Date(order.placedAt || Date.now());
  const formatTimeOffset = (offsetMins: number) => {
    const d = new Date(orderTime.getTime() + offsetMins * 60 * 1000);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const STEPS: { status: OrderStatus; label: string; desc: string; time: string; icon: any }[] = [
    { 
      status: 'placed', 
      label: 'Order Confirmed by Local Store', 
      desc: `${order.sellerPartner?.name || 'Sri Lakshmi Hardware'} acknowledged`, 
      time: formatTimeOffset(0),
      icon: Clock 
    },
    { 
      status: 'picking', 
      label: 'Store Assistant Packing Items', 
      desc: 'Packing from Aisle P1 / Bay 04 with invoice', 
      time: formatTimeOffset(2),
      icon: PackageCheck 
    },
    { 
      status: 'packed', 
      label: 'Quality Checked & Sealed', 
      desc: 'Sealed in tamper-proof trade delivery pouch', 
      time: formatTimeOffset(4),
      icon: ShieldCheck 
    },
    { 
      status: 'out_for_delivery', 
      label: 'Delivery Partner On Route (Live GPS)', 
      desc: `${order.rider.name} assigned & dispatched for live delivery`, 
      time: formatTimeOffset(5),
      icon: Navigation 
    },
    { 
      status: 'arriving', 
      label: 'Arriving at Jobsite Gate', 
      desc: `Reaching ${order.jobSite.floorUnit || order.jobSite.address}`, 
      time: formatTimeOffset(dynamicEta.etaMins - 1),
      icon: Building 
    },
    { 
      status: 'delivered', 
      label: 'Delivered with OTP Verification', 
      desc: `Handed over to ${order.jobSite.siteContactName} with OTP ${order.deliveryOtp}`, 
      time: formatTimeOffset(dynamicEta.etaMins),
      icon: CheckCircle2 
    }
  ];

  const getStepIndex = (st: OrderStatus) => STEPS.findIndex(s => s.status === st);
  const currentStepIdx = getStepIndex(order.status);

  // Live progress percentage calculation
  const progressRatio = Math.min(1, Math.max(0, (initialTotalSeconds - etaSeconds) / initialTotalSeconds));
  const remainingMeters = Math.max(0, Math.round(dynamicEta.distanceKm * 1000 * (1 - progressRatio)));

  // Dark store / seller partner coordinates
  const hubCoords: [number, number] = [
    order.sellerPartner?.coordinates?.lat || DEFAULT_STORE_PARTNER.coordinates.lat,
    order.sellerPartner?.coordinates?.lng || DEFAULT_STORE_PARTNER.coordinates.lng
  ];

  // Destination coordinates
  const destCoords: [number, number] = [
    order.jobSite.coordinates?.lat || hubCoords[0] + 0.008, 
    order.jobSite.coordinates?.lng || hubCoords[1] + 0.006
  ];

  // Dynamic rider position on OpenStreetMap with realistic road curved waypoint interpolation
  const riderLat = hubCoords[0] + (destCoords[0] - hubCoords[0]) * progressRatio;
  const riderLng = hubCoords[1] + (destCoords[1] - hubCoords[1]) * progressRatio;
  const riderCoords: [number, number] = [riderLat, riderLng];

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 min-h-screen flex flex-col w-full h-full overflow-y-auto text-slate-900 animate-in fade-in duration-200">
      
      {/* Full Page Sticky Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 sm:px-6 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <button
            id="close-tracking-modal"
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:scale-95 px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Store</span>
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black shrink-0 shadow-2xs">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-slate-900 truncate">
                  Live Dispatch Tracking
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase shrink-0">
                  {dynamicEta.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                Order #{order.id} • {order.jobSite.jobTag}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowInvoice(!showInvoice)}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showInvoice ? 'Hide Invoice' : 'View Invoice'}</span>
            </button>
            <button
              type="button"
              aria-label="Close tracking"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Page Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-4 text-xs">
          
          {/* Real-Time Countdown Hero Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-black text-emerald-700 tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block mr-0.5" />
                  Live Estimated Arrival
                </span>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono mt-0.5 tracking-tight flex items-baseline gap-2">
                  {order.status === 'delivered' ? (
                    <span className="text-emerald-700 text-2xl sm:text-3xl">Delivered to Floor!</span>
                  ) : (
                    <>
                      <span>{formatMins(etaSeconds)}</span>
                      <span className="text-sm font-semibold text-slate-500 font-sans">mins remaining</span>
                    </>
                  )}
                </div>
                <p className="text-slate-500 text-xs mt-1">
                  Delivering to: <strong className="text-slate-800">{order.jobSite.floorUnit}</strong>, {order.jobSite.address}
                </p>
              </div>

              {/* Delivery OTP Badge with 1-Click Copy */}
              <div 
                onClick={handleCopyOtp}
                className="bg-amber-50 hover:bg-amber-100/70 transition border-2 border-dashed border-amber-300 p-3 rounded-2xl text-center shrink-0 cursor-pointer group"
                title="Click to copy delivery OTP"
              >
                <span className="text-[10px] uppercase font-black text-amber-900 block">Jobsite Delivery OTP</span>
                <div className="text-2xl font-black text-amber-600 font-mono tracking-widest mt-0.5">
                  {order.deliveryOtp}
                </div>
                <div className="text-[9px] text-amber-800 font-medium flex items-center justify-center gap-1 mt-0.5">
                  {copiedOtp ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <span>Tap to copy OTP</span>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive OpenStreetMap Live Route Map */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Live Dispatch Route Track:</span>
                </span>
                <span className="text-emerald-700 font-mono font-bold">
                  {order.status === 'delivered' 
                    ? '0m (Arrived)' 
                    : `${remainingMeters < 1000 ? `${remainingMeters}m away` : `${(remainingMeters / 1000).toFixed(1)} km away`}`}
                </span>
              </div>

              <div className="h-56 sm:h-64 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                <OpenStreetMap
                  center={riderCoords}
                  zoom={15}
                  isRouteMode={true}
                  hubLocation={hubCoords}
                  destinationLocation={destCoords}
                  riderLocation={riderCoords}
                  riderName={order.rider.name}
                  riderSpeed={courierSpeed}
                  className="h-full w-full"
                />
              </div>

              {/* Interactive Simulation Speed Controls */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <div className="flex items-center gap-1">
                  <span>Sim Speed:</span>
                  <button 
                    onClick={() => setSimSpeed(1)} 
                    className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${simSpeed === 1 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}
                  >
                    1x
                  </button>
                  <button 
                    onClick={() => setSimSpeed(5)} 
                    className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${simSpeed === 5 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}
                  >
                    5x
                  </button>
                  <button 
                    onClick={() => setSimSpeed(20)} 
                    className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${simSpeed === 20 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}
                  >
                    20x
                  </button>
                </div>

                <button
                  onClick={fastForward}
                  className="hover:text-emerald-700 flex items-center gap-1 font-bold bg-white border border-slate-200 px-2.5 py-1 rounded-lg transition cursor-pointer shadow-2xs"
                >
                  <Play className="w-3 h-3" />
                  <span>Fast Forward 2 Mins</span>
                </button>
              </div>

            </div>
          </div>

          {/* Stepper Steps */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Order Status Progression
            </span>
            <div className="space-y-1.5">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = currentStepIdx > idx;
                const isCurrent = currentStepIdx === idx;

                return (
                  <div
                    key={step.status}
                    className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-emerald-50 border-emerald-500/80 text-emerald-950 font-bold'
                        : isPassed
                        ? 'bg-slate-50 border-slate-200 text-slate-700'
                        : 'bg-white border-slate-100 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCurrent
                          ? 'bg-emerald-700 text-white'
                          : isPassed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <div className={`font-bold truncate ${isCurrent ? 'text-emerald-900' : isPassed ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.label}
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal truncate">{step.desc}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">
                        {step.time}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-black uppercase bg-emerald-700 text-white px-2 py-0.5 rounded-full animate-pulse">
                          Active
                        </span>
                      )}
                      {isPassed && (
                        <span className="text-[10px] font-bold text-emerald-700">
                          Done
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Local Hardware Store Partner Card (Swiggy / Zomato Marketplace style) */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{order.sellerPartner?.name || 'Sri Lakshmi Hardware & Electricals'}</span>
                  <span className="text-[10px] bg-sky-50 text-sky-800 font-bold px-1.5 py-0.2 rounded border border-sky-200">
                    ★ {order.sellerPartner?.rating || 4.9} Verified
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {order.sellerPartner?.address || '5th Block, Koramangala'} • ({dynamicEta.formattedDist})
                </div>
              </div>
            </div>

            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-black px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
              Verified Shop
            </span>
          </div>

          {/* Delivery Partner Profile */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <Navigation className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Delivery Partner
                </div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{order.rider.name}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    ★ {order.rider.rating} Verified
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Calling delivery partner ${order.rider.name} at ${order.rider.phone}`)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Partner</span>
            </button>
          </div>

          {/* Digital Invoice Toggle */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setShowInvoice(!showInvoice)}
              className="text-emerald-700 hover:underline flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{showInvoice ? 'Hide GST Tax Invoice' : 'View Client GST Tax Invoice / Receipt'}</span>
            </button>

            <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
              Saved ~{order.timeSavedMinutes} mins
            </span>
          </div>

          {/* Digital Invoice Slip */}
          {showInvoice && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-900 font-sans space-y-3 shadow-2xs animate-in fade-in">
              <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                <div>
                  <h4 className="font-black text-sm text-slate-900 uppercase tracking-wider">{order.sellerPartner?.name || 'Local Verified Hardware Store'}</h4>
                  <p className="text-[10px] text-slate-500">Tax Invoice & Material Delivery Slip • Seller GSTIN: <strong className="font-mono text-slate-800">{order.sellerPartner?.gstin || '29AABCS8812K1ZM'}</strong></p>
                </div>
                <div className="text-right text-[10px] text-slate-500">
                  <div>Inv #: <strong>BH-{order.id.slice(-6).toUpperCase()}</strong></div>
                  <div>Date: {new Date().toLocaleDateString('en-IN')}</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-700 grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold block text-slate-900">Drop Location:</span>
                  <div>{order.jobSite.jobTag}</div>
                  <div>{order.jobSite.floorUnit}, {order.jobSite.address}</div>
                  <div className="text-slate-500 mt-0.5">Contact: {order.jobSite.siteContactName} ({order.jobSite.sitePhone})</div>
                </div>
                <div className="text-right">
                  <span className="font-bold block text-slate-900">B2B Customer Profile:</span>
                  <div>{order.customerBusinessName || order.jobSite.siteContactName}</div>
                  {order.customerGstin && (
                    <div className="text-emerald-700 font-mono font-bold">
                      Buyer GSTIN: {order.customerGstin}
                    </div>
                  )}
                  <div>Payment Mode: {order.paymentMethod}</div>
                </div>
              </div>

              <table className="w-full text-[10px] border-t border-b border-slate-100 py-1">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-100">
                    <th className="py-1">Item Description</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Price</th>
                    <th className="py-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(({ product, quantity }) => (
                    <tr key={product.id} className="border-b border-slate-50">
                      <td className="py-1 font-medium">{product.name} ({product.specs.brand})</td>
                      <td className="py-1 text-center">{quantity}</td>
                      <td className="py-1 text-right">₹{product.price}</td>
                      <td className="py-1 text-right font-bold">₹{product.price * quantity}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-1 font-medium text-slate-500" colSpan={3}>Express Delivery Charges</td>
                    <td className="py-1 text-right font-bold">₹{order.deliveryFee}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium text-slate-500" colSpan={3}>GST (18% Input Tax Credit Eligible)</td>
                    <td className="py-1 text-right font-bold">₹{order.tax}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-center text-xs font-black text-slate-900 pt-1">
                <div>
                  <span>Total Amount Paid:</span>
                  {order.itcAmount ? (
                    <div className="text-[10px] text-emerald-700 font-bold">
                      ✓ ₹{order.itcAmount} Input Tax Credit (ITC) claimable in GSTR-3B
                    </div>
                  ) : null}
                </div>
                <span className="text-emerald-700 text-sm font-mono">₹{order.total}</span>
              </div>
            </div>
          )}

      </main>
    </div>
  );
};
