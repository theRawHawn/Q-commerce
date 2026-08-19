import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Zap, 
  Navigation, 
  PackageCheck, 
  UserCheck, 
  Building, 
  FileText,
  Play,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  BatteryCharging,
  Gauge
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { OpenStreetMap } from './OpenStreetMap';

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
  const [etaSeconds, setEtaSeconds] = useState(720); // 12 mins
  const [simSpeed, setSimSpeed] = useState(1);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (!isOpen || !order || order.status === 'delivered') return;

    const interval = setInterval(() => {
      setEtaSeconds((prev) => {
        const next = Math.max(0, prev - (1 * simSpeed));
        
        // Auto progress states based on remaining time
        if (next < 600 && next >= 480 && order.status === 'placed') {
          onUpdateOrderStatus('picking');
        } else if (next < 480 && next >= 360 && order.status === 'picking') {
          onUpdateOrderStatus('packed');
        } else if (next < 360 && next >= 90 && order.status === 'packed') {
          onUpdateOrderStatus('out_for_delivery');
        } else if (next < 90 && next > 0 && order.status === 'out_for_delivery') {
          onUpdateOrderStatus('arriving');
        } else if (next === 0 && order.status !== 'delivered') {
          onUpdateOrderStatus('delivered');
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, order, simSpeed]);

  if (!isOpen || !order) return null;

  const formatMins = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const fastForward = () => {
    setEtaSeconds(prev => Math.max(0, prev - 180)); // skip 3 mins
  };

  const STEPS: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
    { status: 'placed', label: 'Order Received by Local Store', desc: `${order.sellerPartner?.name || 'Local Verified Hardware Store'} confirmed`, icon: Clock },
    { status: 'picking', label: 'Store Packing Items', desc: `Packed fresh from local hardware store shelves`, icon: PackageCheck },
    { status: 'packed', label: 'Sealed & Quality Checked', desc: 'Packed in secure trade pouch', icon: ShieldCheck },
    { status: 'out_for_delivery', label: 'Rider on Route (EV Courier)', desc: `${order.rider.name} on Bajaj Chetak EV`, icon: Navigation },
    { status: 'arriving', label: 'Arrived at Drop Location', desc: `Reaching ${order.jobSite.floorUnit || order.jobSite.address}`, icon: Building },
    { status: 'delivered', label: 'Delivered to Drop Location', desc: `Handed over to ${order.jobSite.siteContactName} with OTP verification`, icon: CheckCircle2 }
  ];

  const getStepIndex = (st: OrderStatus) => STEPS.findIndex(s => s.status === st);
  const currentStepIdx = getStepIndex(order.status);

  // Live Radar calculation
  const distancePct = Math.min(100, Math.max(0, 100 - (etaSeconds / 720) * 100));

  // Dark store coordinates
  const hubCoords: [number, number] = [12.9352, 77.6245];
  // Destination coordinates
  const destCoords: [number, number] = [
    order.jobSite.coordinates?.lat || 12.9352 + 0.008, 
    order.jobSite.coordinates?.lng || 77.6245 + 0.006
  ];

  // Dynamic rider position on OpenStreetMap
  const progressRatio = distancePct / 100;
  const riderLat = hubCoords[0] + (destCoords[0] - hubCoords[0]) * progressRatio;
  const riderLng = hubCoords[1] + (destCoords[1] - hubCoords[1]) * progressRatio;
  const riderCoords: [number, number] = [riderLat, riderLng];

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto text-slate-900 animate-in zoom-in-95 duration-200"
      >
        
        {/* Modal Header */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">Blinkit Live Order Tracking</h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  12-Min Fleet
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Order #{order.id} • {order.jobSite.jobTag}
              </p>
            </div>
          </div>
          <button
            id="close-tracking-modal"
            type="button"
            aria-label="Close tracking modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs bg-slate-50">
          
          {/* Real-Time Countdown Hero Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-black text-emerald-700 tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Estimated Arrival Time
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

              {/* Delivery OTP Badge */}
              <div className="bg-amber-50 border-2 border-dashed border-amber-300 p-3 rounded-2xl text-center shrink-0">
                <span className="text-[10px] uppercase font-black text-amber-900 block">Jobsite Delivery OTP</span>
                <div className="text-2xl font-black text-amber-600 font-mono tracking-widest mt-0.5">
                  {order.deliveryOtp}
                </div>
                <span className="text-[9px] text-amber-800 font-medium block mt-0.5">Share with rider</span>
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
                  {order.status === 'delivered' ? '0m (Arrived)' : `${(1.2 * (1 - distancePct / 100)).toFixed(2)} km away`}
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
                  className="h-full w-full"
                />
              </div>

              {/* Live Telemetry & Speed Indicator */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-[11px] text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Courier Speed: <strong>26 km/h</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                  <span>EV Battery: <strong>88% (Chetak EV)</strong></span>
                </div>
                <div className="text-emerald-700 font-bold">
                  <span>SLA: 12-Min Promise</span>
                </div>
              </div>

              {/* Interactive Simulation Speed Controls */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <div className="flex items-center gap-1">
                  <span>Simulation Speed:</span>
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
                  <span>Fast Forward 3 Mins</span>
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
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isCurrent
                          ? 'bg-emerald-700 text-white'
                          : isPassed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className={`font-bold ${isCurrent ? 'text-emerald-900' : isPassed ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.label}
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal">{step.desc}</div>
                      </div>
                    </div>

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
                );
              })}
            </div>
          </div>

          {/* Local Hardware Store Partner Card (Swiggy / Zomato Marketplace style) */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{order.sellerPartner?.name || 'Sri Lakshmi Hardware & Electricals'}</span>
                  <span className="text-[10px] bg-sky-50 text-sky-800 font-bold px-1.5 py-0.2 rounded border border-sky-200">
                    ★ {order.sellerPartner?.rating || 4.9} Local Seller
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {order.sellerPartner?.address || '5th Block, Koramangala (1.2 km away)'} • Verified Local Hardware Partner
                </div>
              </div>
            </div>

            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-black px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
              Verified Shop
            </span>
          </div>

          {/* Courier Profile */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold">
                <Navigation className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{order.rider.name}</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    ★ {order.rider.rating}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {order.rider.vehicle} • 12-min emergency response unit
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Calling courier rider ${order.rider.name} at ${order.rider.phone}`)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Rider</span>
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
                    <td className="py-1 font-medium text-slate-500" colSpan={3}>12-Min Dedicated Courier</td>
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

        </div>

      </div>
    </div>
  );
};
