import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wrench, 
  Zap, 
  Search, 
  MapPin, 
  Clock, 
  Sparkles, 
  ShoppingBag, 
  ShieldCheck, 
  Calculator, 
  Boxes, 
  Filter, 
  Camera, 
  TrendingUp, 
  Droplet, 
  Hammer, 
  Anchor, 
  Layers, 
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  TestTube,
  Store,
  Receipt
} from 'lucide-react';

import { HardwareProduct, TradeCategory, CartItem, JobSiteLocation, Order, OrderStatus, CustomerProfile } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { Navbar } from './components/Navbar';
import { CategoryChips } from './components/CategoryChips';
import { BlinkitBanner } from './components/BlinkitBanner';
import { ProductCard } from './components/ProductCard';
import { ProductShelf } from './components/ProductShelf';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PartFinderModal } from './components/PartFinderModal';
import { RoiCalculatorModal } from './components/RoiCalculatorModal';
import { ToolboxRestockModal } from './components/ToolboxRestockModal';
import { JobsiteAddressModal } from './components/JobsiteAddressModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { EmergencyKitsSection } from './components/EmergencyKitsSection';
import { CustomerProfileModal } from './components/CustomerProfileModal';
import { OrderAgainSection } from './components/OrderAgainSection';
import { MobileBottomNav } from './components/MobileBottomNav';

const DEFAULT_JOBSITE: JobSiteLocation = {
  address: '14th Main, 4th Block, Koramangala, Bengaluru',
  landmark: 'Opposite BDA Complex',
  floorUnit: 'Tower B, 4th Floor, Flat 402',
  gateCode: 'Gate #2 (Tell Guard Flat 402)',
  siteContactName: 'Rahul Sharma',
  sitePhone: '+91 98450 12891',
  jobTag: 'Flat 402 Delivery',
  coordinates: {
    lat: 12.9352,
    lng: 77.6245
  }
};

const DEFAULT_CUSTOMER_PROFILE: CustomerProfile = {
  name: 'Rahul Sharma',
  phone: '+91 98450 12891',
  email: 'rahul.sharma@apexmep.in',
  isPhoneVerified: true,
  accountType: 'business',
  defaultAddress: '14th Main, 4th Block, Koramangala, Bengaluru',
  floorUnit: 'Tower B, 4th Floor, Flat 402',
  landmark: 'Opposite BDA Complex, Gate #2',
  gstProfile: {
    isB2BEnabled: true,
    gstin: '29AABCP1429B1Z8',
    legalBusinessName: 'Apex MEP Infrastructure Pvt Ltd',
    tradeName: 'Apex MEP Works',
    billingAddress: '14th Main, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    state: 'Karnataka',
    stateCode: '29',
    contactPerson: 'Rahul Sharma',
    contactEmail: 'rahul.sharma@apexmep.in'
  }
};

export default function App() {
  // Dynamic Catalog State
  const [products, setProducts] = useState<HardwareProduct[]>(() => {
    try {
      const saved = localStorage.getItem('blinkit_hardware_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Store Orders for Live Tracking
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('blinkit_hardware_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<TradeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [isGstFilterActive, setIsGstFilterActive] = useState(false);
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('quickhardware_cart');
      return saved ? JSON.parse(saved) : [
        { product: INITIAL_PRODUCTS[0], quantity: 1 },
        { product: INITIAL_PRODUCTS[1], quantity: 2 }
      ];
    } catch {
      return [];
    }
  });

  // Jobsite location state
  const [jobSite, setJobSite] = useState<JobSiteLocation>(() => {
    try {
      const saved = localStorage.getItem('quickhardware_jobsite');
      return saved ? JSON.parse(saved) : DEFAULT_JOBSITE;
    } catch {
      return DEFAULT_JOBSITE;
    }
  });

  // Customer Profile & B2B GSTIN state
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(() => {
    try {
      const saved = localStorage.getItem('quickhardware_customer_profile');
      return saved ? JSON.parse(saved) : DEFAULT_CUSTOMER_PROFILE;
    } catch {
      return DEFAULT_CUSTOMER_PROFILE;
    }
  });

  // Active Order state for customer tracking
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    return orders[0]?.id || null;
  });

  const activeOrder = useMemo(() => {
    return orders.find(o => o.id === activeOrderId) || null;
  }, [orders, activeOrderId]);

  // Modal visibility states
  const [isPartFinderOpen, setIsPartFinderOpen] = useState(false);
  const [isRoiCalcOpen, setIsRoiCalcOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isJobsiteModalOpen, setIsJobsiteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<HardwareProduct | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('quickhardware_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('quickhardware_jobsite', JSON.stringify(jobSite));
  }, [jobSite]);

  useEffect(() => {
    localStorage.setItem('quickhardware_customer_profile', JSON.stringify(customerProfile));
  }, [customerProfile]);

  useEffect(() => {
    localStorage.setItem('blinkit_hardware_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('blinkit_hardware_products', JSON.stringify(products));
  }, [products]);

  // Cart operations
  const handleAddToCart = (product: HardwareProduct, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => Boolean(item));
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleAddMultipleToCart = (itemsToAdd: { product: HardwareProduct; qty: number }[]) => {
    itemsToAdd.forEach(({ product, qty }) => {
      handleAddToCart(product, qty);
    });
    setIsCartOpen(true);
  };

  const handleAddKitToCart = (productIds: string[]) => {
    productIds.forEach(id => {
      const prod = products.find(p => p.id === id);
      if (prod) handleAddToCart(prod, 1);
    });
    setIsCartOpen(true);
  };

  // Checkout and place order (Shared with Seller)
  const handleCheckout = (config: {
    paymentMethod: 'Instant UPI' | 'Corporate Card' | 'Pay on Jobsite' | 'Trade Credit (Net 30)';
    clientInvoiceNeeded: boolean;
    clientName?: string;
  }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const isFree = subtotal >= 199;
    const deliveryFee = isFree ? 0 : 25;
    const handlingCharge = 5;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + deliveryFee + handlingCharge + tax;
    
    const timeSavedMinutes = 45;
    const savingsVsLeavingSite = 350;

    // Calculate Input Tax Credit
    const itcAmount = cart.reduce((acc, item) => {
      if (item.product.isGstRegistered !== false) {
        const rate = item.product.gstRatePercent || 18;
        return acc + Math.round((item.product.price * item.quantity * rate) / (100 + rate));
      }
      return acc;
    }, 0);

    const isB2B = customerProfile.gstProfile?.isB2BEnabled && customerProfile.gstProfile?.gstin;

    const newOrder: Order = {
      id: `BH-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      subtotal,
      deliveryFee,
      urgencyFee: handlingCharge,
      tax,
      total,
      savingsVsLeavingSite,
      timeSavedMinutes,
      status: 'placed',
      placedAt: new Date(),
      estimatedDeliveryAt: new Date(Date.now() + 12 * 60 * 1000),
      jobSite: { ...jobSite },
      customerGstin: isB2B ? customerProfile.gstProfile?.gstin : undefined,
      customerBusinessName: isB2B ? customerProfile.gstProfile?.legalBusinessName : undefined,
      itcAmount: isB2B ? itcAmount : undefined,
      sellerPartner: {
        name: 'Sri Lakshmi Hardware & Electricals',
        shopType: 'Verified Local Hardware Seller',
        address: '5th Block, Koramangala (1.2 km away)',
        distanceKm: 1.2,
        rating: 4.9,
        phone: '+91 80 2553 4912',
        gstin: '29AABCS8812K1ZM'
      },
      darkStore: {
        name: 'Sri Lakshmi Hardware & Electricals (Local Seller)',
        code: 'SHOP-BLR-07',
        distanceKm: 1.2,
        pickerName: 'Store Partner Fulfillment'
      },
      rider: {
        name: 'Vikas Kumar',
        phone: '+91 98860 41239',
        vehicle: 'Bajaj Chetak EV (KA-01-EQ-9812)',
        rating: 4.9,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        currentLocation: {
          lat: 12.9352,
          lng: 77.6245,
          distanceMeters: 1200
        }
      },
      deliveryOtp: `${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod: config.paymentMethod,
      clientInvoiceNeeded: config.clientInvoiceNeeded,
      clientName: config.clientName
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    
    // Decrement stock for purchased items
    setProducts(prevProds => {
      return prevProds.map(p => {
        const orderedItem = cart.find(ci => ci.product.id === p.id);
        if (orderedItem) {
          return { ...p, stockCount: Math.max(0, p.stockCount - orderedItem.quantity) };
        }
        return p;
      });
    });

    setCart([]);
    setIsCartOpen(false);
    setIsTrackingOpen(true);
  };

  // Synchronized Status Updates for Live Tracking Modal
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => {
      return prev.map(order => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
    });
  };

  // Filter products by category, search, size, and GSTIN
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        p.name.toLowerCase().includes(query) ||
        p.specs.brand.toLowerCase().includes(query) ||
        p.subcategory.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query));

      const matchSize = sizeFilter === 'all' || 
        (p.specs.size && p.specs.size.toLowerCase().includes(sizeFilter.toLowerCase()));

      const matchGst = !isGstFilterActive || p.isGstRegistered !== false;

      return matchCat && matchSearch && matchSize && matchGst;
    });
  }, [products, selectedCategory, searchQuery, sizeFilter, isGstFilterActive]);

  // Shelf group products
  const emergencyRescueProducts = useMemo(() => {
    return products.filter(p => p.badge === 'High Demand' || p.id === 'plumb-01' || p.id === 'plumb-03' || p.id === 'elec-01' || p.id === 'adhes-04' || p.id === 'fast-01');
  }, [products]);

  const plumbingProducts = useMemo(() => {
    return products.filter(p => p.category === 'plumbing');
  }, [products]);

  const electricalProducts = useMemo(() => {
    return products.filter(p => p.category === 'electrical');
  }, [products]);

  const fastenerProducts = useMemo(() => {
    return products.filter(p => p.category === 'fasteners');
  }, [products]);

  const adhesiveProducts = useMemo(() => {
    return products.filter(p => p.category === 'adhesives');
  }, [products]);

  const toolProducts = useMemo(() => {
    return products.filter(p => p.category === 'tools' || p.category === 'safety' || p.category === 'carpentry');
  }, [products]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-600 selection:text-white">
      
      {/* Signature Blinkit Topbar */}
      <Navbar
        jobSite={jobSite}
        customerProfile={customerProfile}
        onOpenLocationModal={() => setIsJobsiteModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAiPartFinder={() => setIsPartFinderOpen(true)}
        onOpenRoiCalculator={() => setIsRoiCalcOpen(true)}
        onOpenToolboxRestock={() => setIsRestockOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        cartTotal={cartTotal}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Blinkit Category Chips Carousel */}
      <CategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
        onOpenRestock={() => setIsRestockOpen(true)}
        onOpenAiScanner={() => setIsPartFinderOpen(true)}
        isGstFilterActive={isGstFilterActive}
        onToggleGstFilter={() => setIsGstFilterActive(!isGstFilterActive)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 space-y-5 pb-24">
        
        {/* Active Order Dispatch Banner (if order in flight) */}
        {activeOrder && activeOrder.status !== 'delivered' && (
          <div 
            onClick={() => setIsTrackingOpen(true)}
            className="bg-white border-2 border-emerald-500 rounded-2xl p-3.5 sm:p-4 shadow-sm cursor-pointer hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black animate-pulse">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-slate-900">
                    Order #{activeOrder.id} • Status: {activeOrder.status.toUpperCase()}
                  </span>
                  <span className="bg-amber-100 text-amber-900 font-mono font-extrabold px-2 py-0.5 rounded text-[11px]">
                    OTP: {activeOrder.deliveryOtp}
                  </span>
                </div>
                <div className="text-slate-500 text-xs mt-0.5">
                  Courier: <strong className="text-slate-800">{activeOrder.rider.name}</strong> • Delivering to {activeOrder.jobSite.floorUnit}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs font-black text-emerald-700 uppercase">
                Track Live Map
              </span>
              <ChevronRight className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
        )}

        {/* Blinkit Hero Promo Carousel Banner (only on 'all' and no active search) */}
        {selectedCategory === 'all' && !searchQuery && (
          <BlinkitBanner
            onOpenAiScanner={() => setIsPartFinderOpen(true)}
            onOpenRoiCalc={() => setIsRoiCalcOpen(true)}
            onSelectCategory={setSelectedCategory}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {/* Dynamic 'Order Again' Visual Grid Section (like Blinkit / Swiggy Reference) */}
        {selectedCategory === 'all' && !searchQuery && (
          <OrderAgainSection
            customerProfile={customerProfile}
            products={products}
            onSelectCategory={setSelectedCategory}
            onOpenRestock={() => setIsRestockOpen(true)}
            onOpenDetail={setSelectedProductDetail}
          />
        )}

        {/* 1-Click Emergency Crisis Kits */}
        {selectedCategory === 'all' && !searchQuery && (
          <EmergencyKitsSection
            products={products}
            onAddKitToCart={handleAddKitToCart}
          />
        )}

        {/* Shelf Layout or Filtered Search Layout */}
        {searchQuery || selectedCategory !== 'all' || isGstFilterActive ? (
          /* Filtered View */
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>
                    {selectedCategory !== 'all' ? `${selectedCategory.toUpperCase()} ESSENTIALS` : (isGstFilterActive ? 'GST VERIFIED SELLERS (18% ITC ELIGIBLE)' : 'Search Results')}
                  </span>
                  <span className="text-xs font-medium text-slate-400 font-mono">
                    ({filteredProducts.length} items available)
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  All items stocked in local verified hardware partner stores ready for 12-min courier dispatch
                </p>
              </div>

              {/* Sizing Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-400 font-bold text-[11px] mr-1 hidden sm:inline">Size:</span>
                {[
                  { id: 'all', label: 'All' },
                  { id: '1/2', label: '1/2" (15mm)' },
                  { id: '3/4', label: '3/4" (20mm)' },
                  { id: '6mm', label: '6mm' },
                  { id: '8mm', label: '8mm' },
                  { id: '16A', label: '16A' }
                ].map(sz => (
                  <button
                    key={sz.id}
                    onClick={() => setSizeFilter(sz.id)}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      sizeFilter === sz.id
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">No matching hardware item found</h3>
                <p className="text-xs text-slate-400">Try searching for "valve", "MCB", "tape", "screw", or "pliers".</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSizeFilter('all');
                    setIsGstFilterActive(false);
                  }}
                  className="bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl mt-2 cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {filteredProducts.map((product) => {
                  const inCart = cart.find(i => i.product.id === product.id)?.quantity || 0;
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantityInCart={inCart}
                      onAddToCart={handleAddToCart}
                      onUpdateCartQty={handleUpdateCartQty}
                      onOpenDetail={setSelectedProductDetail}
                    />
                  );
                })}
              </div>
            )}

          </div>
        ) : (
          /* Blinkit Standard Shelves Grid */
          <div className="space-y-6">
            
            {/* Shelf 1: 10-Min Rescues */}
            <ProductShelf
              title="⚡ 10-Minute Jobsite Rescues"
              subtitle="Most ordered items when work gets halted unexpectedly"
              badge="Fast Dispatch"
              products={emergencyRescueProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
            />

            {/* Shelf 2: Plumbing & Bath */}
            <ProductShelf
              title="🚰 Plumbing & Sanitary Essentials"
              subtitle="Quarter-turn angle valves, Teflon tape, CPVC brass FTAs & SS braided pipes"
              category="plumbing"
              products={plumbingProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              onSeeAll={setSelectedCategory}
            />

            {/* Shelf 3: Electrical */}
            <ProductShelf
              title="⚡ Electrical & Power Protection"
              subtitle="Havells C-Curve MCBs, Wago lever clamps, insulation tape & copper wires"
              category="electrical"
              products={electricalProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              onSeeAll={setSelectedCategory}
            />

            {/* Shelf 4: Fasteners */}
            <ProductShelf
              title="🔩 Screws, Anchors & Rawl Plugs"
              subtitle="Fischer nylon wall plugs, countersunk yellow zinc screws & concrete wedge bolts"
              category="fasteners"
              products={fastenerProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              onSeeAll={setSelectedCategory}
            />

            {/* Shelf 5: Adhesives & Putty */}
            <ProductShelf
              title="🧪 Adhesives, M-Seal & WD-40"
              subtitle="CPVC solvent cement, Araldite steel epoxy, silicone caulk & rust sprays"
              category="adhesives"
              products={adhesiveProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              onSeeAll={setSelectedCategory}
            />

            {/* Shelf 6: Tools & Safety */}
            <ProductShelf
              title="🧰 Tools, SDS Drill Bits & Safety Gear"
              subtitle="Bosch SDS-Plus 4-cutters, pipe pliers, Olfa blades & 3M safety goggles"
              category="tools"
              products={toolProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              onSeeAll={setSelectedCategory}
            />

          </div>
        )}

        {/* Free Delivery Promo Bar (matching reference screenshots) */}
        <div className="w-full my-4">
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl py-3 px-4 text-center flex items-center justify-center gap-2 text-emerald-950 font-black text-xs shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>⚡ FREE 12-MIN DELIVERY ON ALL ORDERS ABOVE ₹199</span>
            <span className="text-emerald-700/60 hidden sm:inline">•</span>
            <span className="text-emerald-800 text-[11px] font-semibold hidden sm:inline">Dispatched from your nearest verified local hardware seller</span>
          </div>
        </div>

      </main>

      {/* Signature Sticky Floating Bottom Cart Bar (like Blinkit / Instamart mobile & desktop) */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 inset-x-0 z-40 max-w-lg mx-auto px-4 animate-in slide-in-from-bottom-3">
          <div 
            id="floating-blinkit-cart-bar"
            onClick={() => setIsCartOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl p-3.5 px-5 shadow-xl shadow-emerald-900/30 flex items-center justify-between cursor-pointer transition-transform active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <div className="font-black text-sm leading-none">
                  {totalCartCount} {totalCartCount === 1 ? 'ITEM' : 'ITEMS'} • ₹{cartTotal.toFixed(0)}
                </div>
                <div className="text-[10px] text-emerald-200 font-bold mt-0.5 flex items-center gap-1">
                  <span>⚡ 12-Min Delivery to {jobSite.floorUnit}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 font-black text-xs uppercase bg-white text-emerald-800 px-3.5 py-2 rounded-xl shadow-xs">
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-baseline font-black text-base tracking-tight text-slate-900">
              <span>blink</span>
              <span className="text-emerald-600">it</span>
            </div>
            <span className="bg-amber-400 text-zinc-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
              HARDWARE
            </span>
            <span className="text-slate-300">•</span>
            <span>Hyper-local 12-Minute Hardware Delivery for Tradespeople & Businesses</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="text-emerald-700 font-bold">Local Hardware Store Marketplace</span>
            <span>•</span>
            <span>100% Genuine Fittings</span>
            <span>•</span>
            <span>GSTR-3B Input Tax Credit (ITC)</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Tab Navigation (matching Reference Screenshots) */}
      <MobileBottomNav
        currentCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenRestock={() => setIsRestockOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />

      {/* Modals & Slide-over Drawers */}
      <PartFinderModal
        isOpen={isPartFinderOpen}
        onClose={() => setIsPartFinderOpen(false)}
        products={products}
        onAddToCart={handleAddToCart}
      />

      <RoiCalculatorModal
        isOpen={isRoiCalcOpen}
        onClose={() => setIsRoiCalcOpen(false)}
      />

      <ToolboxRestockModal
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        products={products}
        onAddMultipleToCart={handleAddMultipleToCart}
      />

      <JobsiteAddressModal
        isOpen={isJobsiteModalOpen}
        onClose={() => setIsJobsiteModalOpen(false)}
        currentLocation={jobSite}
        onSaveLocation={setJobSite}
      />

      <CustomerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={customerProfile}
        onSaveProfile={setCustomerProfile}
        orders={orders}
        onOpenOrderTracking={(orderId) => {
          setActiveOrderId(orderId);
          setIsTrackingOpen(true);
        }}
        onUpdateJobSite={setJobSite}
      />

      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
        allProducts={products}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        jobSite={jobSite}
        customerProfile={customerProfile}
        onOpenProfile={() => {
          setIsCartOpen(false);
          setIsProfileModalOpen(true);
        }}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
        allProducts={products}
        onAddToCart={handleAddToCart}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        order={activeOrder}
        onClose={() => setIsTrackingOpen(false)}
        onUpdateOrderStatus={(newStatus) => {
          if (activeOrder) {
            handleUpdateOrderStatus(activeOrder.id, newStatus);
          }
        }}
      />

    </div>
  );
}


