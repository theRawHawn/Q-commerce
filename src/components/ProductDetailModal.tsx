import React from 'react';
import { 
  X, 
  Check, 
  Zap, 
  MapPin, 
  ShieldCheck, 
  Plus, 
  ArrowRight, 
  FileText,
  Boxes,
  Clock,
  Star,
  Receipt,
  Building2,
  Percent
} from 'lucide-react';
import { HardwareProduct } from '../types';

interface ProductDetailModalProps {
  product: HardwareProduct | null;
  onClose: () => void;
  onAddToCart: (product: HardwareProduct, qty?: number) => void;
  allProducts: HardwareProduct[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  allProducts,
}) => {
  if (!product) return null;

  const companionItems = (product.frequentlyBoughtWith || [])
    .map(id => allProducts.find(p => p.id === id))
    .filter((p): p is HardwareProduct => Boolean(p));

  const isGst = product.isGstRegistered !== false;
  const gstRate = product.gstRatePercent || 18;
  const estimatedTax = Math.round((product.price * gstRate) / (100 + gstRate));
  const basePrice = product.price - estimatedTax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl text-slate-900 animate-in zoom-in-95 duration-200 space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                {product.specs.brand}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 capitalize">{product.category}</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug">
              {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Photo Banner if available */}
        {product.imageUrl && (
          <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-lg">
              SKU: {product.id}
            </div>
          </div>
        )}

        {/* Speed & Storage Info Bar */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Delivery Speed</div>
              <div className="font-black text-emerald-800">{product.deliveryTimeMins} Mins to Drop Location</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-[10px] uppercase font-bold text-slate-400">Local Shop Partner</div>
              <div className="font-bold text-slate-800 truncate">{product.sellerName || 'Sri Lakshmi Hardware'}</div>
            </div>
          </div>
        </div>

        {/* B2B GSTIN & Input Tax Credit (ITC) Details Box */}
        <div className={`p-3.5 rounded-2xl border ${isGst ? 'bg-sky-50/70 border-sky-200' : 'bg-slate-50 border-slate-200'} space-y-2 text-xs`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-black text-slate-900">
              <Receipt className="w-4 h-4 text-sky-700" />
              <span>Seller GSTIN & B2B Tax Credit (ITC)</span>
            </div>
            {isGst ? (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                100% ITC Eligible
              </span>
            ) : (
              <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                No ITC
              </span>
            )}
          </div>

          {isGst ? (
            <div className="space-y-1.5 text-slate-700 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Seller Registered GSTIN:</span>
                <span className="font-mono font-bold text-slate-900">{product.sellerGstin || '29AABCU9603R1ZM'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GST Tax Slab:</span>
                <span className="font-bold text-slate-900">{gstRate}% (CGST {gstRate/2}% + SGST {gstRate/2}%)</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-sky-200/60 font-bold">
                <span className="text-emerald-800">Your ITC Tax Credit Claim:</span>
                <span className="text-emerald-800 font-mono font-black">+₹{estimatedTax} Input Credit</span>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-[11px]">
              This product is sold by a local unregistered or composition vendor. No B2B GST tax credit (ITC) invoice will be generated.
            </p>
          )}
        </div>

        {/* Technical Description */}
        <div className="space-y-1.5 text-xs text-slate-600">
          <span className="font-black text-slate-400 uppercase tracking-wider block text-[10px]">
            Product Overview & Use-Case
          </span>
          <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {product.description}
          </p>
        </div>

        {/* Full Specifications Table */}
        <div className="space-y-1.5">
          <span className="font-black text-slate-400 uppercase tracking-wider block text-[10px]">
            Verified Trade Specifications
          </span>
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-200/60 text-xs">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="flex justify-between px-3.5 py-2">
                <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="font-bold text-slate-900">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Companion Accessories */}
        {companionItems.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="font-black text-slate-400 uppercase tracking-wider block text-[10px]">
              Frequently Ordered Together:
            </span>
            <div className="space-y-1.5">
              {companionItems.map(item => (
                <div key={item.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 flex items-center justify-between gap-3 text-xs">
                  <div className="truncate">
                    <div className="font-bold text-slate-800 truncate">{item.name}</div>
                    <div className="text-[10px] text-emerald-700 font-extrabold">₹{item.price}</div>
                  </div>
                  <button
                    onClick={() => onAddToCart(item, 1)}
                    className="bg-white border border-emerald-600 hover:bg-emerald-50 text-emerald-700 text-xs font-black px-3 py-1 rounded-lg transition cursor-pointer shrink-0"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <div className="text-lg font-black text-slate-900">₹{product.price}</div>
            <div className="text-[10px] text-emerald-700 font-bold">{product.stockCount} available in local store</div>
          </div>
          <button
            onClick={() => {
              onAddToCart(product, 1);
              onClose();
            }}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Dispatch Cart</span>
          </button>
        </div>

      </div>
    </div>
  );
};
