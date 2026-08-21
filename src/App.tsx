import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { SubCategoryBar } from './components/SubCategoryBar';
import { getMainCategoryConfig } from './data/categories';
import { BlinkitBanner } from './components/BlinkitBanner';
import { ProductCard } from './components/ProductCard';
import { ProductShelf } from './components/ProductShelf';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PartFinderModal } from './components/PartFinderModal';
import { RoiCalculatorModal } from './components/RoiCalculatorModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { JobsiteAddressModal } from './components/JobsiteAddressModal';
import { LocationPage } from './components/LocationPage';
import { DEFAULT_INITIAL_ORDERS } from './data/sampleOrders';
import { CartPage } from './components/CartPage';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CustomerProfileModal } from './components/CustomerProfileModal';
import { ProfilePage } from './components/ProfilePage';
import { OrderAgainSection } from './components/OrderAgainSection';
import { MobileBottomNav } from './components/MobileBottomNav';
import { calculateDynamicDeliveryEta, calculateCartDispatchSummary } from './utils/deliveryEta';

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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const existingIds = new Set(parsed.map((p: HardwareProduct) => p.id));
          const missing = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id));
          return missing.length > 0 ? [...parsed, ...missing] : parsed;
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Store Orders for Live Tracking
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('blinkit_hardware_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return DEFAULT_INITIAL_ORDERS;
    } catch {
      return DEFAULT_INITIAL_ORDERS;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<TradeCategory>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [isGstFilterActive, setIsGstFilterActive] = useState(false);

  // Hierarchical category selection handler
  const handleSelectCategory = (cat: TradeCategory, subCat: string = 'all') => {
    if (['lighting', 'fans', 'switches', 'electrical'].includes(cat)) {
      setSelectedCategory('electrical');
      setSelectedSubCategory(cat === 'electrical' ? subCat : cat);
    } else if (['bathroom_fittings', 'plumbing'].includes(cat)) {
      setSelectedCategory('plumbing');
      setSelectedSubCategory(cat === 'plumbing' ? subCat : cat);
    } else if (cat === 'kitchen_fittings') {
      setSelectedCategory('kitchen_fittings');
      setSelectedSubCategory(subCat);
    } else if (['screws', 'fasteners'].includes(cat)) {
      setSelectedCategory('screws');
      setSelectedSubCategory(subCat !== 'all' ? subCat : (cat === 'fasteners' ? 'fasteners' : 'all'));
    } else if (['tools', 'cutting_discs', 'cutters'].includes(cat)) {
      setSelectedCategory('tools');
      setSelectedSubCategory(subCat !== 'all' ? subCat : (cat !== 'tools' ? cat : 'all'));
    } else {
      setSelectedCategory(cat);
      setSelectedSubCategory(subCat);
    }
    setSearchQuery('');
  };
  
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

  // Real-time location-aware dynamic delivery calculation
  const liveEta = useMemo(() => {
    return calculateDynamicDeliveryEta(jobSite.coordinates);
  }, [jobSite.coordinates]);

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
    isGstEnabled?: boolean;
    gstin?: string;
    businessName?: string;
  }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const isFree = subtotal >= 499;
    const deliveryFee = isFree ? 0 : 25;
    const handlingCharge = 5;
    const isB2B = config.isGstEnabled !== undefined 
      ? config.isGstEnabled 
      : Boolean(customerProfile.gstProfile?.isB2BEnabled && customerProfile.gstProfile?.gstin);

    const tax = Math.round((subtotal * 18) / 118);
    const total = subtotal + deliveryFee + handlingCharge;
    
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

    const finalGstin = isB2B ? (config.gstin || customerProfile.gstProfile?.gstin) : undefined;
    const finalBusinessName = isB2B ? (config.businessName || customerProfile.gstProfile?.legalBusinessName) : undefined;

    // Sync profile if updated during checkout
    if (config.isGstEnabled !== undefined) {
      setCustomerProfile(prev => ({
        ...prev,
        accountType: config.isGstEnabled ? 'business' : 'individual',
        gstProfile: {
          ...prev.gstProfile,
          isB2BEnabled: config.isGstEnabled,
          gstin: finalGstin || prev.gstProfile?.gstin || '',
          legalBusinessName: finalBusinessName || prev.gstProfile?.legalBusinessName || ''
        }
      }));
    }

    const dispatchSummary = calculateCartDispatchSummary(cart, jobSite.coordinates);
    const primaryHub = dispatchSummary.hubs[0];

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
      estimatedDeliveryAt: new Date(Date.now() + dispatchSummary.maxEtaMins * 60 * 1000),
      jobSite: { ...jobSite, jobTag: config.clientName || jobSite.jobTag },
      customerGstin: finalGstin,
      customerBusinessName: finalBusinessName,
      itcAmount: isB2B ? itcAmount : undefined,
      sellerPartner: primaryHub ? {
        name: primaryHub.seller.name,
        shopType: primaryHub.seller.specialty,
        address: `${primaryHub.seller.address} (${primaryHub.formattedDist})`,
        distanceKm: primaryHub.distanceKm,
        rating: primaryHub.seller.rating,
        phone: primaryHub.seller.phone,
        gstin: primaryHub.seller.gstin,
        coordinates: primaryHub.seller.coordinates
      } : {
        name: 'Sri Lakshmi Hardware & Electricals',
        shopType: 'Verified Local Hardware Seller',
        address: `5th Block, Koramangala (${liveEta.formattedDist})`,
        distanceKm: liveEta.distanceKm,
        rating: 4.9,
        phone: '+91 80 2553 4912',
        gstin: '29AABCS8812K1ZM'
      },
      darkStore: {
        name: primaryHub ? primaryHub.seller.name : 'Sri Lakshmi Hardware & Electricals (Local Seller)',
        code: primaryHub ? `SELLER-${primaryHub.seller.id.toUpperCase()}` : 'SHOP-BLR-07',
        distanceKm: primaryHub ? primaryHub.distanceKm : liveEta.distanceKm,
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
          distanceMeters: Math.round((primaryHub?.distanceKm || liveEta.distanceKm) * 1000)
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
  const handleUpdateOrderStatus = React.useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => {
      const current = prev.find(o => o.id === orderId);
      if (current && current.status === newStatus) return prev;
      return prev.map(order => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
    });
  }, []);

  // Filter products by category, subcategory, search, size, and GSTIN
  const filteredProducts = useMemo(() => {
    const mainConfig = getMainCategoryConfig(selectedCategory);

    return products.filter(p => {
      // Main category and Subcategory matching
      let matchCat = selectedCategory === 'all';
      if (!matchCat) {
        if (selectedSubCategory !== 'all') {
          const subItem = mainConfig.subcategories.find(s => s.id === selectedSubCategory);
          if (subItem && subItem.filterFn) {
            matchCat = subItem.filterFn(p);
          } else {
            matchCat = p.category === selectedSubCategory || mainConfig.productCategories.includes(p.category);
          }
        } else {
          matchCat = mainConfig.productCategories.includes(p.category);
        }
      }

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
  }, [products, selectedCategory, selectedSubCategory, searchQuery, sizeFilter, isGstFilterActive]);

  // Shelf group products
  const emergencyRescueProducts = useMemo(() => {
    return products.filter(p => p.badge === 'High Demand' || p.id === 'plumb-01' || p.id === 'plumb-03' || p.id === 'elec-01' || p.id === 'adhes-04' || p.id === 'fast-01');
  }, [products]);

  const lightingProducts = useMemo(() => {
    return products.filter(p => p.category === 'lighting');
  }, [products]);

  const fanProducts = useMemo(() => {
    return products.filter(p => p.category === 'fans');
  }, [products]);

  const switchProducts = useMemo(() => {
    return products.filter(p => p.category === 'switches');
  }, [products]);

  const bathroomProducts = useMemo(() => {
    return products.filter(p => p.category === 'bathroom_fittings');
  }, [products]);

  const kitchenProducts = useMemo(() => {
    return products.filter(p => p.category === 'kitchen_fittings');
  }, [products]);

  const plumbingProducts = useMemo(() => {
    return products.filter(p => p.category === 'plumbing');
  }, [products]);

  const electricalProducts = useMemo(() => {
    return products.filter(p => p.category === 'electrical');
  }, [products]);

  const fastenerProducts = useMemo(() => {
    return products.filter(p => p.category === 'fasteners' || p.category === 'screws');
  }, [products]);

  const adhesiveProducts = useMemo(() => {
    return products.filter(p => p.category === 'adhesives');
  }, [products]);

  const toolProducts = useMemo(() => {
    return products.filter(p => p.category === 'tools' || p.category === 'safety' || p.category === 'carpentry' || p.category === 'cutting_discs' || p.category === 'cutters');
  }, [products]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Dedicated Full-Page Delivery Location View
  if (isJobsiteModalOpen) {
    return (
      <LocationPage
        currentLocation={jobSite}
        onSaveLocation={(newLoc) => {
          setJobSite(newLoc);
          setIsJobsiteModalOpen(false);
        }}
        onClose={() => setIsJobsiteModalOpen(false)}
      />
    );
  }

  // Dedicated Full-Page Profile View
  if (isProfileModalOpen) {
    return (
      <ProfilePage
        profile={customerProfile}
        onSaveProfile={setCustomerProfile}
        orders={orders}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenOrderTracking={(orderId) => {
          setIsProfileModalOpen(false);
          setActiveOrderId(orderId);
          setIsTrackingOpen(true);
        }}
        onOpenRestock={() => {
          setIsProfileModalOpen(false);
          setIsRestockOpen(true);
        }}
        onUpdateJobSite={setJobSite}
        onOpenLocationModal={() => {
          setIsProfileModalOpen(false);
          setIsJobsiteModalOpen(true);
        }}
      />
    );
  }

  // Dedicated Full-Page Cart & Checkout View
  if (isCartOpen) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-600 selection:text-white">
        <CartPage
          items={cart}
          allProducts={products}
          jobSite={jobSite}
          customerProfile={customerProfile}
          onClose={() => setIsCartOpen(false)}
          onAddToCart={handleAddToCart}
          onUpdateQty={handleUpdateCartQty}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
          onOpenLocationModal={() => setIsJobsiteModalOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
        />

        <JobsiteAddressModal
          isOpen={isJobsiteModalOpen}
          onClose={() => setIsJobsiteModalOpen(false)}
          currentLocation={jobSite}
          onSaveLocation={setJobSite}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-600 selection:text-white rounded-none">
      
      {/* Signature Blinkit Sticky Topbar & Category Menu with Bokeh Background */}
      <div className="sticky top-0 z-40 w-full shadow-xs">
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
          onSelectCategory={handleSelectCategory}
          onOpenRestock={() => setIsRestockOpen(true)}
          onOpenAiScanner={() => setIsPartFinderOpen(true)}
          isGstFilterActive={isGstFilterActive}
          onToggleGstFilter={() => setIsGstFilterActive(!isGstFilterActive)}
        />
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-5 space-y-4 sm:space-y-6 pb-32 sm:pb-28 md:pb-20">
        
        {/* Active Order Dispatch Banner (if order in flight) */}
        {activeOrder && activeOrder.status !== 'delivered' && (
          <div 
            onClick={() => setIsTrackingOpen(true)}
            className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white border border-emerald-500/80 rounded-2xl p-3.5 sm:p-4 shadow-lg cursor-pointer hover:shadow-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-emerald-950 flex items-center justify-center font-black animate-pulse shrink-0 shadow-md">
                <Zap className="w-5 h-5 fill-emerald-950" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-sm text-white">
                    Order #{activeOrder.id}
                  </span>
                  <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    ⚡ {activeOrder.status === 'out_for_delivery' ? 'Partner On Route' : activeOrder.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="bg-amber-400 text-amber-950 font-mono font-black px-2 py-0.5 rounded text-[11px]">
                    OTP: {activeOrder.deliveryOtp}
                  </span>
                </div>
                <div className="text-emerald-100/90 text-xs mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>Delivery Partner: <strong>{activeOrder.rider.name}</strong></span>
                  <span>•</span>
                  <span>Delivering to <strong>{activeOrder.jobSite.floorUnit}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl border border-white/20 transition">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Track Live Map
              </span>
              <ChevronRight className="w-4 h-4 text-emerald-300" />
            </div>
          </div>
        )}

        {/* Blinkit Hero Promo Carousel Banner (only on 'all' and no active search) */}
        {selectedCategory === 'all' && !searchQuery && (
          <BlinkitBanner
            onOpenAiScanner={() => setIsPartFinderOpen(true)}
            onOpenRoiCalc={() => setIsRoiCalcOpen(true)}
            onSelectCategory={handleSelectCategory}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            deliveryEtaMins={liveEta.etaMins}
          />
        )}

        {/* Dynamic 'Order Again' Visual Grid Section (like Blinkit / Swiggy Reference) */}
        {selectedCategory === 'all' && !searchQuery && (
          <OrderAgainSection
            customerProfile={customerProfile}
            products={products}
            onSelectCategory={handleSelectCategory}
            onOpenRestock={() => setIsRestockOpen(true)}
            onOpenDetail={setSelectedProductDetail}
          />
        )}

        {/* Shelf Layout or Filtered Search Layout */}
        {searchQuery || selectedCategory !== 'all' || isGstFilterActive ? (
          /* Filtered View */
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
            
            <div className="space-y-3 pb-3 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>
                      {selectedCategory !== 'all' 
                        ? `${getMainCategoryConfig(selectedCategory).label.toUpperCase()} ESSENTIALS` 
                        : (isGstFilterActive ? 'GST VERIFIED SELLERS (18% ITC ELIGIBLE)' : 'Search Results')}
                    </span>
                    <span className="text-xs font-medium text-slate-400 font-mono">
                      ({filteredProducts.length} items available)
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedCategory !== 'all'
                      ? getMainCategoryConfig(selectedCategory).description
                      : 'All items stocked in local verified hardware partner stores ready for swift courier dispatch'}
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

              {/* Sub-categories Selector Bar directly above category results */}
              {selectedCategory !== 'all' && (
                <div className="pt-2.5 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Sub-Categories in {getMainCategoryConfig(selectedCategory).label}:
                    </span>
                  </div>
                  <SubCategoryBar
                    selectedCategory={selectedCategory}
                    selectedSubCategory={selectedSubCategory}
                    onSelectSubCategory={setSelectedSubCategory}
                    products={products}
                  />
                </div>
              )}
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
                      destinationCoords={jobSite.coordinates}
                    />
                  );
                })}
              </div>
            )}

          </div>
        ) : (
          /* Blinkit Standard Shelves Grid */
          <div className="space-y-6">
            
            {/* Shelf 1: Rescues */}
            <ProductShelf
              title={`⚡ ${liveEta.etaMins}-Minute Jobsite Rescues`}
              subtitle="Most ordered items when work gets halted unexpectedly"
              badge="Fast Dispatch"
              products={emergencyRescueProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              deliveryEtaMins={liveEta.etaMins}
              destinationCoords={jobSite.coordinates}
            />

            {/* Shelf 2: Lighting & Bulbs */}
            <ProductShelf
              title="💡 LED Tubelights, Bulbs & Panel Lights"
              subtitle="Philips 20W battens, Wipro 9W B22 bulbs, Havells ceiling panels & T-bulbs"
              category="lighting"
              products={lightingProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              onSeeAll={handleSelectCategory}
              deliveryEtaMins={liveEta.etaMins}
              destinationCoords={jobSite.coordinates}
            />

            {/* Shelf 3: Ceiling & Exhaust Fans */}
            <ProductShelf
              title="🌀 Ceiling Fans, Regulators & Exhausts"
              subtitle="Atomberg BLDC energy saver fans, Crompton 380 RPM, Havells exhausts & Roma regulators"
              category="fans"
              products={fanProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              onSeeAll={handleSelectCategory}
              deliveryEtaMins={liveEta.etaMins}
              destinationCoords={jobSite.coordinates}
            />

            {/* Shelf 4: Switches, Buttons & Sockets */}
            <ProductShelf
              title="🔘 Modular Switches, Buttons & 16A Sockets"
              subtitle="Anchor Roma switch buttons, 16A heavy power sockets, bell pushes & 32A DP isolators"
              category="switches"
              products={switchProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              onSeeAll={handleSelectCategory}
              deliveryEtaMins={liveEta.etaMins}
              destinationCoords={jobSite.coordinates}
            />

            {/* Shelf 5: Bathroom Fittings */}
            <ProductShelf
              title="🚿 Bathroom Fittings & Jet Sprays"
              subtitle="Brass health faucets, Hindware overhead rain showers, 2-in-1 dual valves & towel rods"
              category="bathroom_fittings"
              products={bathroomProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              onSeeAll={handleSelectCategory}
              deliveryEtaMins={liveEta.etaMins}
              destinationCoords={jobSite.coordinates}
            />

            {/* Shelf 6: Kitchen Fittings */}
            <ProductShelf
              title="🚰 Kitchen Fittings, Taps & Couplings"
              subtitle="360° flexible swivel sink taps, SS 304 waste couplings, expandable drain pipes & RO valves"
              category="kitchen_fittings"
              products={kitchenProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              onSeeAll={handleSelectCategory}
              deliveryEtaMins={liveEta.etaMins}
              destinationCoords={jobSite.coordinates}
            />

            {/* Shelf 7: Plumbing */}
            <ProductShelf
              title="🚰 Plumbing & Sanitary Essentials"
              subtitle="Quarter-turn angle valves, Teflon tape, CPVC brass FTAs & SS braided pipes"
              category="plumbing"
              products={plumbingProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              onSeeAll={handleSelectCategory}
              deliveryEtaMins={liveEta.etaMins}
              destinationCoords={jobSite.coordinates}
            />

            {/* Shelf 8: Electrical */}
            <ProductShelf
              title="⚡ Electrical & Power Protection"
              subtitle="Havells C-Curve MCBs, Wago lever clamps, insulation tape & copper wires"
              category="electrical"
              products={electricalProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              onSeeAll={handleSelectCategory}
              deliveryEtaMins={liveEta.etaMins}
              destinationCoords={jobSite.coordinates}
            />

            {/* Shelf 9: Fasteners */}
            <ProductShelf
              title="🔩 Screws, Anchors & Rawl Plugs"
              subtitle="Fischer nylon wall plugs, countersunk yellow zinc screws & concrete wedge bolts"
              category="fasteners"
              products={fastenerProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              onSeeAll={handleSelectCategory}
              deliveryEtaMins={liveEta.etaMins}
              destinationCoords={jobSite.coordinates}
            />

            {/* Shelf 10: Adhesives & Putty */}
            <ProductShelf
              title="🧪 Adhesives, M-Seal & WD-40"
              subtitle="CPVC solvent cement, Araldite steel epoxy, silicone caulk & rust sprays"
              category="adhesives"
              products={adhesiveProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              onSeeAll={handleSelectCategory}
              deliveryEtaMins={liveEta.etaMins}
              destinationCoords={jobSite.coordinates}
            />

            {/* Shelf 11: Tools & Safety */}
            <ProductShelf
              title="🧰 Tools, SDS Drill Bits & Safety Gear"
              subtitle="Bosch SDS-Plus 4-cutters, pipe pliers, Olfa blades & 3M safety goggles"
              category="tools"
              products={toolProducts}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onOpenDetail={setSelectedProductDetail}
              onSeeAll={handleSelectCategory}
              deliveryEtaMins={liveEta.etaMins}
              destinationCoords={jobSite.coordinates}
            />

          </div>
        )}

        {/* Blinkit & Instamart Signature End-of-Feed Watermark Footer */}
        <div id="footer-watermark" className="pt-12 pb-20 sm:pt-16 sm:pb-24 w-full flex flex-col items-center justify-center text-center select-none space-y-2 px-4 mx-auto">
          {/* Subtle Pulse Lightning Bolt Icon above text */}
          <span className="text-amber-500 inline-block text-3xl sm:text-5xl md:text-6xl leading-none animate-pulse">⚡</span>

          {/* Subtle Watermark Headline (Hardware in Minutes) */}
          <h2 className="text-2xl min-[380px]:text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-300/80 leading-normal sm:leading-none inline-flex items-center justify-center text-center select-none">
            <span>Hardware in Minutes.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
            Crafted with <span className="text-blue-500 font-bold">💙</span> in Bengaluru, India
          </p>
        </div>

      </main>

      {/* Signature Sticky Floating Bottom Cart Bar (like Blinkit / Instamart mobile & desktop) */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-[68px] md:bottom-6 inset-x-0 z-40 max-w-lg mx-auto px-3 sm:px-4 animate-in slide-in-from-bottom-3">
          <div 
            id="floating-blinkit-cart-bar"
            onClick={() => setIsCartOpen(true)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl p-3 sm:p-3.5 px-4 sm:px-5 shadow-xl shadow-emerald-950/20 flex items-center justify-between cursor-pointer transition-transform active:scale-[0.99] border border-emerald-700/50"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-black text-xs sm:text-sm leading-none truncate">
                  {totalCartCount} {totalCartCount === 1 ? 'ITEM' : 'ITEMS'}
                </div>
                <div className="text-[10px] text-emerald-200 font-bold mt-0.5 flex items-center gap-1 truncate">
                  <span>⚡ {liveEta.formattedEta} Express Delivery</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 font-black text-[11px] sm:text-xs uppercase bg-white text-emerald-900 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shadow-xs shrink-0 ml-2">
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

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

      <OrderHistoryModal
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        orders={orders}
        onAddToCart={handleAddToCart}
        onAddMultipleToCart={handleAddMultipleToCart}
        onOpenOrderTracking={(orderId) => {
          setActiveOrderId(orderId);
          setIsTrackingOpen(true);
        }}
        onOpenCart={() => setIsCartOpen(true)}
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
        destinationCoords={jobSite.coordinates}
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


