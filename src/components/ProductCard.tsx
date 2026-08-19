import React from 'react';
import { 
  Plus, 
  Minus, 
  Clock, 
  Star, 
  ShieldCheck, 
  Check, 
  Droplet, 
  Zap, 
  Hammer, 
  Anchor, 
  Wrench, 
  TestTube,
  Sparkles,
  Info,
  Receipt
} from 'lucide-react';
import { HardwareProduct } from '../types';

interface ProductCardProps {
  product: HardwareProduct;
  quantityInCart: number;
  onAddToCart: (product: HardwareProduct, qty?: number) => void;
  onUpdateCartQty: (productId: string, delta: number) => void;
  onOpenDetail: (product: HardwareProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateCartQty,
  onOpenDetail,
}) => {
  // Category-specific visual icon & theme
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'plumbing':
        return { icon: Droplet, bg: 'bg-blue-50/70', color: 'text-blue-600', border: 'border-blue-100' };
      case 'electrical':
        return { icon: Zap, bg: 'bg-amber-50/70', color: 'text-amber-600', border: 'border-amber-100' };
      case 'carpentry':
        return { icon: Hammer, bg: 'bg-orange-50/70', color: 'text-orange-600', border: 'border-orange-100' };
      case 'fasteners':
        return { icon: Anchor, bg: 'bg-slate-100/70', color: 'text-slate-700', border: 'border-slate-200' };
      case 'tools':
        return { icon: Wrench, bg: 'bg-emerald-50/70', color: 'text-emerald-700', border: 'border-emerald-100' };
      case 'adhesives':
        return { icon: TestTube, bg: 'bg-rose-50/70', color: 'text-rose-600', border: 'border-rose-100' };
      default:
        return { icon: ShieldCheck, bg: 'bg-teal-50/70', color: 'text-teal-700', border: 'border-teal-100' };
    }
  };

  const theme = getCategoryTheme(product.category);
  const Icon = theme.icon;

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : null;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="bg-white border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between hover:shadow-md transition-all duration-200 group relative"
    >
      
      <div>
        {/* Top Thumbnail Image Area */}
        <div 
          onClick={() => onOpenDetail(product)}
          className={`w-full aspect-[4/3] rounded-xl ${theme.bg} ${theme.border} border flex flex-col items-center justify-center relative cursor-pointer group-hover:scale-[1.02] transition-transform overflow-hidden`}
        >
          {/* ⏱️ Blinkit Delivery Speed Tag */}
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs border border-slate-100">
            <Clock className="w-3 h-3 text-emerald-600" />
            <span>{product.deliveryTimeMins} MINS</span>
          </div>

          {/* Discount Badge */}
          {discountPercent && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
              {discountPercent}% OFF
            </div>
          )}

          {/* Center Graphic / Real Product Photo */}
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback to icon container if image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
                const parent = (e.currentTarget as HTMLElement).parentElement;
                if (parent) {
                  const fallback = parent.querySelector('.fallback-icon');
                  if (fallback) fallback.classList.remove('hidden');
                }
              }}
            />
          ) : null}

          <div className={`fallback-icon ${product.imageUrl ? 'hidden' : ''} w-14 h-14 rounded-2xl bg-white shadow-xs border border-black/5 flex items-center justify-center`}>
            <Icon className={`w-8 h-8 ${theme.color}`} />
          </div>

          {/* Brand watermark badge */}
          <div className="absolute bottom-1.5 right-2 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
            {product.specs.brand}
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-2.5 space-y-1">
          
          {/* Title */}
          <h3 
            onClick={() => onOpenDetail(product)}
            className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2 cursor-pointer hover:text-emerald-700 transition"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Unit / Pack Size */}
          <div className="text-[11px] text-slate-500 font-medium truncate">
            {product.specs.size || product.specs.standard || 'Standard Unit'}
          </div>

          {/* Rating & Local Shop Partner */}
          <div className="flex items-center justify-between gap-1 pt-0.5">
            <span className="inline-flex items-center gap-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0">
              <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
              <span>{product.rating}</span>
            </span>
            <span className="text-[9.5px] text-slate-500 truncate max-w-[115px] font-medium flex items-center gap-0.5" title={product.sellerName}>
              <span>🏪</span>
              <span className="truncate">{product.sellerName || 'Sri Lakshmi Hardware'}</span>
            </span>
          </div>

          {/* GSTIN / ITC Eligibility Badge */}
          <div className="pt-1 flex items-center gap-1.5">
            {product.isGstRegistered !== false ? (
              <span className="inline-flex items-center gap-1 bg-sky-50 border border-sky-200 text-sky-900 text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md">
                <Receipt className="w-2.5 h-2.5 text-sky-700" />
                <span>GST Tax Invoice (18% ITC)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-[9.5px] font-medium px-1.5 py-0.5 rounded-md">
                <span>No GST ITC (Small Trader)</span>
              </span>
            )}
          </div>

        </div>
      </div>

      {/* Price & Blinkit ADD Button Row */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        
        {/* Prices */}
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-black text-slate-900">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-slate-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <div className="text-[9px] text-emerald-700 font-bold">
            {product.stockCount > 0 ? `${product.stockCount} in local store` : 'Out of stock'}
          </div>
        </div>

        {/* Signature Blinkit ADD / Quantity Counter Button */}
        <div>
          {quantityInCart === 0 ? (
            <button
              id={`add-btn-${product.id}`}
              onClick={() => onAddToCart(product, 1)}
              className="bg-white border-2 border-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 text-emerald-700 font-black text-xs uppercase px-4 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              <span>ADD</span>
            </button>
          ) : (
            <div className="bg-emerald-700 text-white rounded-lg px-2 py-1 flex items-center gap-2 shadow-xs font-bold text-xs">
              <button
                onClick={() => onUpdateCartQty(product.id, -1)}
                className="w-4 h-4 flex items-center justify-center hover:bg-emerald-800 rounded transition cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-mono text-xs w-3 text-center">{quantityInCart}</span>
              <button
                onClick={() => onUpdateCartQty(product.id, 1)}
                className="w-4 h-4 flex items-center justify-center hover:bg-emerald-800 rounded transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
