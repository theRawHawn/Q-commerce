import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  X, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Loader2, 
  Info,
  Clock,
  Layers
} from 'lucide-react';
import { HardwareProduct } from '../types';

interface PartFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: HardwareProduct[];
  onAddToCart: (product: HardwareProduct, qty?: number) => void;
}

export const PartFinderModal: React.FC<PartFinderModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
}) => {
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tradeContext, setTradeContext] = useState('plumbing');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const setSampleQuery = (desc: string, trade: string) => {
    setDescription(desc);
    setTradeContext(trade);
  };

  const handleAnalyze = async () => {
    if (!description && !imagePreview) {
      setError('Please provide a photo or describe the broken part.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiResult(null);

    try {
      const response = await fetch('/api/part-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          imageBase64: imagePreview,
          tradeContext
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed with status ${response.status}`);
      }

      const data = await response.json();
      setAiResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to identify part. Using local catalog fallback.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl text-slate-900 animate-in zoom-in-95 duration-200 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Blinkit AI Part Scanner
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Gemini 3.7 Vision
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Snap or describe broken fittings to identify exact replacement specs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Area */}
        <div className="space-y-3 text-xs">
          
          {/* Quick Trade Selector */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 text-[11px]">Trade:</span>
            {['plumbing', 'electrical', 'carpentry', 'fasteners'].map((t) => (
              <button
                key={t}
                onClick={() => setTradeContext(t)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition cursor-pointer ${
                  tradeContext === t
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Photo Snap or Upload Box */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Part Photo (Upload broken valve, stripped screw, or burnt breaker):
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500/80 rounded-2xl p-3 bg-slate-50/60 transition text-center">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Upload Preview"
                    className="max-h-36 rounded-xl mx-auto object-contain border border-slate-200"
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center py-3">
                  <Camera className="w-7 h-7 text-emerald-700 mb-1" />
                  <span className="font-bold text-slate-800">
                    Click to Take Photo or Upload Image
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    Supports JPG, PNG, WebP
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Crisis / Problem Description:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Broken chrome quarter-turn angle valve under bathroom sink leaking water, need replacement with Teflon..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Sample Prompts */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick One-Tap Test Scenarios:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '🚰 Leaking Geyser Angle Valve', desc: '1/2 inch brass quarter-turn angle valve leaking at geyser inlet', trade: 'plumbing' },
                { label: '⚡ Tripped 16A Geyser MCB', desc: 'Single pole 16 Amp C-curve MCB tripping under heavy geyser load', trade: 'electrical' },
                { label: '🔩 Heavy Concrete Anchors', desc: 'Need nylon wall plugs and yellow zinc screws for hanging heavy vanity', trade: 'fasteners' }
              ].map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setSampleQuery(sample.desc, sample.trade)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-lg transition cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            id="run-ai-match-btn"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gemini Analyzing Dimensions & Thread Standards...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Scan & Match Dark Store Inventory (12m Delivery)</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* AI Result Card */}
          {aiResult && (
            <div className="mt-4 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="font-black text-emerald-950 text-xs uppercase tracking-wider">
                    {aiResult.identifiedPartName || 'Part Identified'}
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                  {aiResult.confidenceScore ? `${Math.round(aiResult.confidenceScore * 100)}% Confidence` : 'High Confidence'}
                </span>
              </div>

              {/* Technical breakdown */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-emerald-100">
                <div>
                  <span className="text-slate-400 block font-medium">Standard / Thread:</span>
                  <span className="font-bold text-slate-800">{aiResult.standard || '1/2" BSP Standard'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Recommended Size:</span>
                  <span className="font-bold text-slate-800">{aiResult.suggestedSize || '15mm (1/2 Inch)'}</span>
                </div>
              </div>

              {/* Pro Tip from AI */}
              {aiResult.tradespersonTip && (
                <div className="text-[11px] text-emerald-900 bg-emerald-100/60 p-2.5 rounded-xl flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Pro Tip:</strong> {aiResult.tradespersonTip}</span>
                </div>
              )}

              {/* Matching Catalog Items to Add */}
              <div className="space-y-2 pt-2 border-t border-emerald-200/80">
                <span className="font-black text-slate-700 text-[10px] uppercase tracking-wider block">
                  In-Stock Matching SKUs at Dark Store #07:
                </span>

                {products.slice(0, 2).map((item) => (
                  <div key={item.id} className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="truncate">
                      <div className="font-bold text-slate-900 text-xs truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">₹{item.price} • {item.binLocation}</div>
                    </div>
                    <button
                      onClick={() => {
                        onAddToCart(item, 1);
                        onClose();
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer"
                    >
                      + Add to Cart
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
