import React, { useState } from 'react';
import { Boxes, X, Check, Plus, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { HardwareProduct } from '../types';

interface ToolboxRestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: HardwareProduct[];
  onAddMultipleToCart: (items: { product: HardwareProduct; qty: number }[]) => void;
}

export const ToolboxRestockModal: React.FC<ToolboxRestockModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddMultipleToCart,
}) => {
  const restockIds = ['plumb-03', 'fast-01', 'fast-02', 'elec-05', 'adhes-01', 'tool-05', 'safe-02', 'adhes-04'];
  const restockProducts = restockIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is HardwareProduct => Boolean(p));

  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({
    'plumb-03': 2,
    'fast-01': 1,
    'fast-02': 1,
    'elec-05': 1,
    'tool-05': 1,
  });

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setSelectedItems(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = 1;
      }
      return next;
    });
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      toggleItem(id);
    } else {
      setSelectedItems(prev => ({ ...prev, [id]: qty }));
    }
  };

  const totalCost = Object.entries(selectedItems).reduce((sum, [id, qty]) => {
    const p = products.find(prod => prod.id === id);
    const quantity = typeof qty === 'number' ? qty : Number(qty) || 1;
    return sum + (p ? p.price * quantity : 0);
  }, 0);

  const handleDispatch = () => {
    const itemsToAdd = Object.entries(selectedItems)
      .map(([id, qty]) => {
        const prod = products.find(p => p.id === id);
        const quantity = typeof qty === 'number' ? qty : Number(qty) || 1;
        return prod ? { product: prod, qty: quantity } : null;
      })
      .filter((item): item is { product: HardwareProduct; qty: number } => Boolean(item));

    onAddMultipleToCart(itemsToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl text-slate-900 animate-in zoom-in-95 duration-200 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Daily Van & Toolbox Restock
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Replenish consumables in 1 tap before you run out on site
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

        {/* Consumables Checklist */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {restockProducts.map((p) => {
            const isSelected = Boolean(selectedItems[p.id]);
            const qty = selectedItems[p.id] || 1;

            return (
              <div
                key={p.id}
                className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 text-xs ${
                  isSelected
                    ? 'bg-emerald-50/50 border-emerald-500/80 shadow-2xs'
                    : 'bg-slate-50 border-slate-200/80 opacity-60'
                }`}
              >
                <div 
                  onClick={() => toggleItem(p.id)}
                  className="flex items-center gap-3 cursor-pointer flex-1 truncate"
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition shrink-0 ${
                    isSelected ? 'bg-emerald-700 text-white border-emerald-700' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-slate-900 truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-500">{p.specs.brand} • ₹{p.price}/each</div>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex items-center gap-1.5 shrink-0 bg-emerald-700 text-white rounded-lg p-1">
                    <button
                      onClick={() => updateQty(p.id, qty - 1)}
                      className="w-5 h-5 flex items-center justify-center hover:bg-emerald-800 rounded font-bold"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-xs">{qty}</span>
                    <button
                      onClick={() => updateQty(p.id, qty + 1)}
                      className="w-5 h-5 flex items-center justify-center hover:bg-emerald-800 rounded font-bold"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-base font-black text-slate-900">₹{totalCost}</div>
            <div className="text-[10px] text-slate-500">{Object.keys(selectedItems).length} items selected</div>
          </div>

          <button
            id="restock-dispatch-btn"
            onClick={handleDispatch}
            disabled={Object.keys(selectedItems).length === 0}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Zap className="w-4 h-4" />
            <span>Dispatch Restock Pouch (12m)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
