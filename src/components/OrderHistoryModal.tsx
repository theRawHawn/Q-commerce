import React, { useState } from 'react';
import { 
  RotateCcw, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  X, 
  Search, 
  Receipt, 
  MapPin, 
  Plus, 
  ShoppingBag, 
  ChevronRight,
  Sparkles,
  ExternalLink,
  Check
} from 'lucide-react';
import { Order, HardwareProduct } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onAddToCart: (product: HardwareProduct, qty?: number) => void;
  onAddMultipleToCart: (items: { product: HardwareProduct; qty: number }[]) => void;
  onOpenOrderTracking?: (orderId: string) => void;
  onOpenCart: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onAddToCart,
  onAddMultipleToCart,
  onOpenOrderTracking,
  onOpenCart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'delivered' | 'active'>('all');
  const [reorderedOrderId, setReorderedOrderId] = useState<string | null>(null);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesTab = 
      filterTab === 'all' ? true :
      filterTab === 'delivered' ? order.status === 'delivered' :
      order.status !== 'delivered';

    if (!matchesTab) return false;

    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const matchesId = order.id.toLowerCase().includes(query);
    const matchesItem = order.items.some(item => 
      item.product.name.toLowerCase().includes(query) ||
      item.product.specs.brand.toLowerCase().includes(query) ||
      item.product.category.toLowerCase().includes(query)
    );
    const matchesAddress = order.jobSite.address.toLowerCase().includes(query) ||
      (order.jobSite.landmark && order.jobSite.landmark.toLowerCase().includes(query));

    return matchesId || matchesItem || matchesAddress;
  });

  const handleReorderWholeOrder = (order: Order) => {
    const itemsToAdd = order.items.map(item => ({
      product: item.product,
      qty: item.quantity
    }));
    onAddMultipleToCart(itemsToAdd);

    setReorderedOrderId(order.id);
    setTimeout(() => {
      setReorderedOrderId(null);
    }, 2000);
  };

  const handleReorderSingleItem = (product: HardwareProduct, qty: number) => {
    onAddToCart(product, qty);
    setAddedItemIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Recently';
    
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl text-slate-900 animate-in zoom-in-95 duration-200 space-y-4 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Order History & Reorder
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                View previous items, order details and reorder in 1 click
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="space-y-2.5 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, brand or order ID..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 shrink-0">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterTab === 'all' 
                    ? 'bg-white text-slate-900 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All ({orders.length})
              </button>
              <button
                onClick={() => setFilterTab('delivered')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterTab === 'delivered' 
                    ? 'bg-white text-emerald-800 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Delivered
              </button>
              <button
                onClick={() => setFilterTab('active')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterTab === 'active' 
                    ? 'bg-white text-blue-800 shadow-2xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Active
              </button>
            </div>
          </div>
        </div>

        {/* Orders List Content */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">No matching orders found</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  {searchQuery 
                    ? `No orders matching "${searchQuery}"`
                    : 'Your past hardware order details and items will appear here after placing an order.'}
                </p>
              </div>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isDelivered = order.status === 'delivered';
              const isJustReordered = reorderedOrderId === order.id;

              return (
                <div 
                  key={order.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:border-slate-300 transition space-y-3"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        #{order.id}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {formatDate(order.placedAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isDelivered ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Delivered</span>
                        </span>
                      ) : (
                        <span className="bg-sky-100 text-sky-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          <Truck className="w-3.5 h-3.5" />
                          <span className="capitalize">{order.status.replace(/_/g, ' ')}</span>
                        </span>
                      )}

                      {!isDelivered && onOpenOrderTracking && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenOrderTracking(order.id);
                          }}
                          className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 transition cursor-pointer"
                        >
                          <span>Track Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items List in this Order */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                    </div>

                    <div className="divide-y divide-slate-100 rounded-xl bg-slate-50/70 p-2.5 border border-slate-100 space-y-2">
                      {order.items.map((item, idx) => {
                        const isItemAdded = addedItemIds[item.product.id];

                        return (
                          <div 
                            key={`${order.id}-${item.product.id}-${idx}`}
                            className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 object-cover rounded-lg border border-slate-200 bg-white shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate">
                                  {item.product.name}
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium">
                                  {item.product.specs.brand} • {item.quantity} x ₹{item.product.price}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleReorderSingleItem(item.product, item.quantity)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 shrink-0 transition cursor-pointer ${
                                isItemAdded
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-white hover:bg-slate-100 text-emerald-800 border border-slate-200 shadow-2xs'
                              }`}
                              title="Reorder this item"
                            >
                              {isItemAdded ? (
                                <>
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>Reorder Item</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Footer & Reorder Action */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px] sm:max-w-[260px]">
                          {order.jobSite.address}
                        </span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="font-black text-slate-900">
                        Total: ₹{order.total}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleReorderWholeOrder(order)}
                        className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${
                          isJustReordered
                            ? 'bg-emerald-800 text-white'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        }`}
                      >
                        {isJustReordered ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Items Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reorder Entire Order</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer / View Cart Shortcut */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Need items delivered right away?
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenCart();
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>View Current Cart</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
