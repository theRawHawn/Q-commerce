export type TradeCategory = 
  | 'all' 
  | 'lighting'
  | 'fans'
  | 'switches'
  | 'bathroom_fittings'
  | 'kitchen_fittings'
  | 'plumbing' 
  | 'electrical' 
  | 'carpentry'
  | 'screws' 
  | 'cutting_discs' 
  | 'cutters' 
  | 'fasteners' 
  | 'tools' 
  | 'adhesives' 
  | 'safety';

export interface CustomerGstProfile {
  isB2BEnabled: boolean;
  gstin: string; // 15 chars e.g. 29AABCS1429B1Z8
  legalBusinessName: string; // e.g. "Apex Infra & Renovations LLP"
  tradeName?: string;
  billingAddress: string;
  state: string;
  stateCode: string; // e.g. "29 - Karnataka"
  contactPerson?: string;
  contactEmail?: string;
}

export interface CustomerProfile {
  id?: string;
  name: string;
  phone: string;
  email: string;
  isPhoneVerified?: boolean;
  accountType?: 'individual' | 'business';
  defaultAddress?: string;
  floorUnit?: string;
  landmark?: string;
  defaultAddressId?: string;
  gstProfile: CustomerGstProfile;
  savedAddresses?: JobSiteLocation[];
  createdAt?: string;
}

export interface SellerPartner {
  id: string;
  name: string;
  locality: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewsCount: number;
  phone: string;
  gstin: string;
  isGstRegistered: boolean;
  specialty: string;
  badge?: string;
  basePrepMins: number;
}

export interface HardwareProduct {
  id: string;
  name: string;
  category: TradeCategory;
  subcategory: string;
  price: number; // in INR ₹
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  specs: {
    size?: string;
    material?: string;
    standard?: string;
    brand: string;
    thread?: string;
    ratingVoltage?: string;
    color?: string;
  };
  description: string;
  stockCount: number;
  binLocation: string; // e.g. "Aisle 3 - Bin 14B"
  sellerId?: string; // Links to SellerPartner
  sellerName?: string; // e.g. "Sri Lakshmi Electricals & Hardware"
  sellerAddress?: string; // e.g. "5th Block, Koramangala"
  sellerLocality?: string; // e.g. "Koramangala"
  sellerCoordinates?: { lat: number; lng: number };
  sellerRating?: number; // e.g. 4.9
  sellerDistanceKm?: number; // Calculated dynamic distance
  sellerGstin?: string; // e.g. "29AABCU9603R1ZM"
  isGstRegistered?: boolean; // true = 100% ITC Eligible Tax Invoice
  gstRatePercent?: number; // e.g. 18 (for 18% GST)
  itcEligible?: boolean; // true = Input Tax Credit claimable
  deliveryTimeMins: number; // Calculated dynamic ETA
  imageUrl?: string;
  badge?: 'High Demand' | 'Jobsite Essential' | 'Pro Choice' | 'Bulk Pack';
  frequentlyBoughtWith?: string[]; // IDs of companion items
  tags: string[];
}

export interface CartItem {
  product: HardwareProduct;
  quantity: number;
}

export interface JobSiteLocation {
  address: string;
  landmark?: string;
  floorUnit?: string;
  gateCode?: string;
  siteContactName: string; // Contact Name (e.g. Rahul Sharma)
  sitePhone: string; // Contact Number (e.g. +91 98450 12891)
  tradeType?: string; // Optional default
  jobTag?: string; // Optional notes
  coordinates: {
    lat: number;
    lng: number;
  };
}

export type OrderStatus = 'placed' | 'picking' | 'packed' | 'out_for_delivery' | 'arriving' | 'delivered';

export interface OrderTimelineStep {
  status: OrderStatus;
  title: string;
  description: string;
  time: string;
  done: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  urgencyFee: number;
  tax: number;
  total: number;
  savingsVsLeavingSite: number; // calculated billable hours saved
  timeSavedMinutes: number;
  status: OrderStatus;
  placedAt: Date;
  estimatedDeliveryAt: Date;
  jobSite: JobSiteLocation;
  customerGstin?: string;
  customerBusinessName?: string;
  itcAmount?: number;
  customerGstProfile?: CustomerGstProfile;
  itcAmountClaimable?: number; // Total GST ITC buyer can claim back in GSTR-3B
  sellerPartner?: {
    name: string;
    shopType: string;
    address: string;
    distanceKm: number;
    rating: number;
    phone?: string;
    gstin?: string;
    isGstRegistered?: boolean;
    itcEligible?: boolean;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  darkStore: {
    name: string;
    code: string;
    distanceKm: number;
    pickerName: string;
  };
  rider: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
    photo: string;
    currentLocation: {
      lat: number;
      lng: number;
      distanceMeters: number;
    };
  };
  deliveryOtp: string;
  paymentMethod: 'Instant UPI' | 'Corporate Card' | 'Pay on Jobsite' | 'Trade Credit (Net 30)';
  clientInvoiceNeeded: boolean;
  clientName?: string;
}

export interface PartAnalysisResult {
  partName: string;
  confidenceScore: number;
  estimatedSize: string;
  material: string;
  threadType: string;
  commonIssues: string;
  matchedProductIds: string[];
  recommendedAccessories: {
    name: string;
    reason: string;
    productId?: string;
  }[];
  expertTip: string;
}

export type AppMode = 'customer' | 'seller';

export type SellerTab = 'orders' | 'inventory' | 'fleet' | 'analytics';

export interface EVRider {
  id: string;
  name: string;
  phone: string;
  vehicle: string; // e.g. "Bajaj Chetak EV #EV-42"
  batteryPercent: number;
  status: 'idle_at_hub' | 'picking_up' | 'in_transit' | 'returning';
  activeOrderId?: string;
  completedToday: number;
  rating: number;
  photo: string;
}

export interface DarkStoreStats {
  todayGmv: number;
  totalOrders: number;
  avgPickSeconds: number;
  avgDeliveryMinutes: number;
  onTimePercent: number;
}

