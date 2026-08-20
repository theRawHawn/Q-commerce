import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  HelpCircle, 
  Sun, 
  Moon, 
  EyeOff, 
  BookOpen, 
  Bookmark, 
  Heart, 
  FileText, 
  Gift, 
  FileCheck, 
  Award, 
  Share2, 
  Info, 
  ShieldCheck, 
  Bell, 
  LogOut, 
  ChevronRight, 
  Check, 
  Building2, 
  MapPin, 
  Phone, 
  Calendar, 
  Receipt,
  Sparkles,
  CreditCard,
  Download,
  ExternalLink,
  Edit2,
  Trash2,
  Plus,
  Send,
  MessageSquare,
  CheckCircle2,
  Lock,
  Copy,
  Tag
} from 'lucide-react';
import { CustomerProfile, CustomerGstProfile, Order, JobSiteLocation } from '../types';

interface ProfilePageProps {
  profile: CustomerProfile;
  onSaveProfile: (profile: CustomerProfile) => void;
  orders: Order[];
  onClose: () => void;
  onOpenOrderTracking: (orderId: string) => void;
  onOpenRestock: () => void;
  onUpdateJobSite?: (jobSite: JobSiteLocation) => void;
  onOpenLocationModal?: () => void;
}

type SubView = 
  | 'main' 
  | 'gst_details' 
  | 'address_book' 
  | 'edit_profile' 
  | 'orders' 
  | 'bookmarks' 
  | 'wishlist' 
  | 'gift_cards' 
  | 'compliance' 
  | 'payment_settings' 
  | 'claim_gift' 
  | 'rewards' 
  | 'impact' 
  | 'about' 
  | 'privacy' 
  | 'notifications';

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onSaveProfile,
  orders,
  onClose,
  onOpenOrderTracking,
  onOpenRestock,
  onUpdateJobSite,
  onOpenLocationModal
}) => {
  // Sub-view navigation state
  const [activeSubView, setActiveSubView] = useState<SubView>('main');

  // User Profile State
  const [name, setName] = useState(profile.name || 'Rohan K');
  const [phone, setPhone] = useState(profile.phone || '+91 96111 93492');
  const [email, setEmail] = useState(profile.email || 'rohan.kulkarni@gmail.com');
  const [dob, setDob] = useState('25 Nov 1997');
  
  // Toggles & Preferences State
  const [appearance, setAppearance] = useState<'LIGHT' | 'DARK'>('LIGHT');
  const [hideSensitive, setHideSensitive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // GST State
  const [gstin, setGstin] = useState(profile.gstProfile?.gstin || '29AABCP1429B1Z8');
  const [legalName, setLegalName] = useState(profile.gstProfile?.legalBusinessName || 'Kulkarni Infra & Electricals LLP');
  const [tradeName, setTradeName] = useState(profile.gstProfile?.tradeName || 'Kulkarni MEP Works');
  const [gstError, setGstError] = useState<string | null>(null);
  const [gstSaved, setGstSaved] = useState(false);

  // Address State
  const [address, setAddress] = useState(profile.defaultAddress || '14th Main Rd, 4th Block, Koramangala, Bengaluru');
  const [floorUnit, setFloorUnit] = useState(profile.floorUnit || 'Tower B, 4th Floor, Flat 402');
  const [landmark, setLandmark] = useState(profile.landmark || 'Opposite BDA Complex, Gate #2');
  const [addressSaved, setAddressSaved] = useState(false);

  // Interactive Lists State
  const [bookmarks, setBookmarks] = useState([
    { id: 'b1', title: '2BHK Apartment Electrical BOM', itemsCount: 18, totalEst: '₹14,250', date: '12 Aug 2026' },
    { id: 'b2', title: 'Site Phase-1 CPVC Plumbing Fittings', itemsCount: 32, totalEst: '₹28,900', date: '04 Aug 2026' },
    { id: 'b3', title: 'Office False Ceiling LED Grid Lights', itemsCount: 12, totalEst: '₹9,600', date: '28 Jul 2026' }
  ]);
  const [newBookmarkTitle, setNewBookmarkTitle] = useState('');

  const [wishlist, setWishlist] = useState([
    { id: 'w1', name: 'Havells 1.5 sq mm FR PVC Insulated Wire (90m)', category: 'Electrical', price: 1480, inStock: true },
    { id: 'w2', name: 'Bosch GSB 500W Professional Impact Drill Set', category: 'Power Tools', price: 2890, inStock: true },
    { id: 'w3', name: 'Finolex 4 inch SWR PVC Agriculture Pipe 10ft', category: 'Plumbing', price: 620, inStock: true }
  ]);

  // Payment Methods State
  const [upiId, setUpiId] = useState('rohan.kulkarni@okaxis');
  const [savedCard, setSavedCard] = useState('HDFC Bank Corporate Visa •••• 4092');
  const [defaultPayment, setDefaultPayment] = useState<'UPI' | 'CARD' | 'COD'>('UPI');

  // Claim Gift Card State
  const [giftCode, setGiftCode] = useState('');
  const [claimedBalance, setClaimedBalance] = useState(0);

  // Notification Preferences State
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifySms, setNotifySms] = useState(true);
  const [notifyDeals, setNotifyDeals] = useState(false);
  const [notifyTracking, setNotifyTracking] = useState(true);

  // Privacy Settings State
  const [dataSharing, setDataSharing] = useState(false);
  const [personalizedOffers, setPersonalizedOffers] = useState(true);

  // Sync state if profile prop updates
  useEffect(() => {
    if (profile.name) setName(profile.name);
    if (profile.phone) setPhone(profile.phone);
    if (profile.email) setEmail(profile.email);
    if (profile.defaultAddress) setAddress(profile.defaultAddress);
    if (profile.floorUnit) setFloorUnit(profile.floorUnit);
    if (profile.landmark) setLandmark(profile.landmark);
    if (profile.gstProfile?.gstin) setGstin(profile.gstProfile.gstin);
    if (profile.gstProfile?.legalBusinessName) setLegalName(profile.gstProfile.legalBusinessName);
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveGst = () => {
    const clean = gstin.trim().toUpperCase();
    if (clean.length > 0 && clean.length !== 15) {
      setGstError('GSTIN must be 15 alphanumeric characters (e.g. 29AABCP1429B1Z8).');
      return;
    }
    setGstError(null);

    const updatedProfile: CustomerProfile = {
      ...profile,
      name,
      phone,
      email,
      gstProfile: {
        isB2BEnabled: true,
        gstin: clean,
        legalBusinessName: legalName,
        tradeName: tradeName,
        billingAddress: address,
        state: 'Karnataka',
        stateCode: '29',
        contactPerson: name,
        contactEmail: email
      }
    };
    onSaveProfile(updatedProfile);
    setGstSaved(true);
    showToast('GSTIN details updated successfully!');
    setTimeout(() => {
      setGstSaved(false);
      setActiveSubView('main');
    }, 1000);
  };

  const handleSaveAddress = () => {
    const updatedProfile: CustomerProfile = {
      ...profile,
      defaultAddress: address,
      floorUnit: floorUnit,
      landmark: landmark
    };
    onSaveProfile(updatedProfile);
    if (onUpdateJobSite) {
      onUpdateJobSite({
        address,
        floorUnit,
        landmark,
        siteContactName: name,
        sitePhone: phone,
        jobTag: "Default Jobsite",
        coordinates: { lat: 12.9352, lng: 77.6245 }
      });
    }
    setAddressSaved(true);
    showToast('Address book updated!');
    setTimeout(() => {
      setAddressSaved(false);
      setActiveSubView('main');
    }, 1000);
  };

  const handleSavePersonal = () => {
    onSaveProfile({
      ...profile,
      name,
      phone,
      email
    });
    showToast('Profile details updated!');
    setActiveSubView('main');
  };

  const handleAddBookmark = () => {
    if (!newBookmarkTitle.trim()) return;
    setBookmarks([
      {
        id: 'b_' + Date.now(),
        title: newBookmarkTitle.trim(),
        itemsCount: 0,
        totalEst: '₹0',
        date: 'Today'
      },
      ...bookmarks
    ]);
    setNewBookmarkTitle('');
    showToast('New hardware list created!');
  };

  const handleClaimGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCode.trim()) return;
    if (giftCode.trim().toUpperCase() === 'BLINK2026' || giftCode.trim().length >= 6) {
      setClaimedBalance((prev) => prev + 500);
      showToast('🎉 ₹500 Gift Voucher Claimed Successfully!');
      setGiftCode('');
    } else {
      showToast('Invalid voucher code. Try BLINK2026');
    }
  };

  return (
    <div className={`min-h-screen ${appearance === 'DARK' ? 'bg-slate-950 text-slate-100' : 'bg-[#F4F6F8] text-slate-900'} flex flex-col font-sans pb-24 animate-in fade-in duration-200`}>
      
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-amber-300 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xl border border-amber-400/30 flex items-center gap-2 animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================== */}
      {/* TOP HEADER: Sleek, Dark Slate & Amber      */}
      {/* ========================================== */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-4 pb-8 px-4 sm:px-6 shadow-md relative overflow-hidden">
        {/* Background Decorative Warm Accent Rings */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-32 h-32 rounded-full bg-yellow-500/10 blur-xl pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10 space-y-5">
          
          {/* Top Bar with Back Arrow & Title */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (activeSubView !== 'main') {
                  setActiveSubView('main');
                } else {
                  onClose();
                }
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition cursor-pointer active:scale-95"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>{activeSubView === 'main' ? 'Profile' : 'Account Details'}</span>
            </h1>

            <div className="w-10" /> {/* Spacer for symmetry */}
          </div>

          {/* Centered User Avatar & Details (NO DP "+" upload button as requested) */}
          <div className="flex flex-col items-center text-center space-y-2 pt-1">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-white text-slate-950 font-black text-3xl sm:text-4xl flex items-center justify-center shadow-xl border-2 border-amber-400">
              {name ? name.charAt(0).toUpperCase() : 'R'}
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {name}
                </h2>
                <button
                  onClick={() => setActiveSubView('edit_profile')}
                  className="p-1 rounded-md text-amber-400 hover:text-amber-300 transition cursor-pointer"
                  title="Edit Profile Info"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 text-xs text-amber-200/90 font-medium mt-1 flex-wrap">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  {phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {dob}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* MAIN BODY CONTENT AREA                     */}
      {/* ========================================== */}
      <div className="max-w-2xl w-full mx-auto px-3 sm:px-4 -mt-4 relative z-20 space-y-3.5">

        {/* ------------------------------------------ */}
        {/* SUBVIEW: ORDERS HISTORY                    */}
        {/* ------------------------------------------ */}
        {activeSubView === 'orders' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">Your Order History</h3>
              </div>
              <button
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Back
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No active orders yet.</p>
                <button
                  onClick={onOpenRestock}
                  className="bg-slate-950 text-white font-black text-xs px-4 py-2.5 rounded-xl hover:bg-slate-800 transition"
                >
                  Quick Restock / Buy Hardware
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="font-mono text-slate-900">Order #{ord.id.slice(-6)}</span>
                      <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      {ord.items.length} items • ₹{ord.totalAmount}
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          onOpenOrderTracking(ord.id);
                        }}
                        className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black py-2 rounded-lg transition"
                      >
                        Track Delivery
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* SUBVIEW: GST DETAILS MANAGER               */}
        {/* ------------------------------------------ */}
        {activeSubView === 'gst_details' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">B2B GSTIN & Tax Details</h3>
              </div>
              <button
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Back
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Add your business GSTIN to get 18% Input Tax Credit (ITC) invoices automatically on all orders.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  GSTIN Number (15 Characters)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="29AABCP1429B1Z8"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-xs font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {gstError && (
                  <p className="text-red-600 text-[11px] font-bold mt-1">{gstError}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Legal Registered Business Name
                </label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="Kulkarni Infra & Electricals LLP"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Trade Name / Branch
                </label>
                <input
                  type="text"
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  placeholder="Kulkarni MEP Works"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveGst}
              className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black text-sm py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {gstSaved ? (
                <>
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>GSTIN Details Saved!</span>
                </>
              ) : (
                <span>Save GSTIN Info</span>
              )}
            </button>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* SUBVIEW: ADDRESS BOOK                      */}
        {/* ------------------------------------------ */}
        {activeSubView === 'address_book' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">Saved Drop Locations</h3>
              </div>
              <button
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Back
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Street / Area Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="14th Main Rd, 4th Block, Koramangala, Bengaluru"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Tower / Floor / Flat #
                  </label>
                  <input
                    type="text"
                    value={floorUnit}
                    onChange={(e) => setFloorUnit(e.target.value)}
                    placeholder="Tower B, 4th Floor, Flat 402"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Landmark / Gate Instructions
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Opposite BDA Complex, Gate #2"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {onOpenLocationModal && (
                <button
                  type="button"
                  onClick={onOpenLocationModal}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
                >
                  Select on Map
                </button>
              )}

              <button
                type="button"
                onClick={handleSaveAddress}
                className="flex-1 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                {addressSaved ? <Check className="w-4 h-4 text-amber-400" /> : null}
                <span>{addressSaved ? 'Saved!' : 'Save Address'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* SUBVIEW: BOOKMARKED HARDWARE LISTS         */}
        {/* ------------------------------------------ */}
        {activeSubView === 'bookmarks' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">Bookmarked Hardware BOMs</h3>
              </div>
              <button
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Back
              </button>
            </div>

            {/* Create New Bookmark Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New BOM List Name (e.g. 3BHK Wiring BOM)..."
                value={newBookmarkTitle}
                onChange={(e) => setNewBookmarkTitle(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleAddBookmark}
                className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {bookmarks.map((bm) => (
                <div key={bm.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{bm.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {bm.itemsCount} Items • Est: <span className="font-mono text-slate-800 font-bold">{bm.totalEst}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setBookmarks(bookmarks.filter(b => b.id !== bm.id));
                      showToast('List removed');
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* SUBVIEW: WISHLIST                          */}
        {/* ------------------------------------------ */}
        {activeSubView === 'wishlist' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <h3 className="font-black text-slate-900 text-base">Your Wishlist ({wishlist.length})</h3>
              </div>
              <button
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Back
              </button>
            </div>

            <div className="space-y-3">
              {wishlist.map((item) => (
                <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded uppercase">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900">{item.name}</h4>
                    <p className="text-xs font-mono font-black text-slate-900">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => {
                      setWishlist(wishlist.filter(w => w.id !== item.id));
                      showToast('Added item to active cart!');
                    }}
                    className="bg-slate-950 hover:bg-slate-800 text-amber-300 font-bold text-xs px-3 py-2 rounded-lg"
                  >
                    Move to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* SUBVIEW: E-GIFT CARDS & VOUCHERS          */}
        {/* ------------------------------------------ */}
        {activeSubView === 'gift_cards' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">E-Gift Cards & Corporate Vouchers</h3>
              </div>
              <button
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Back
              </button>
            </div>

            <div className="p-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 rounded-xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2 py-0.5 rounded">
                Active Balance
              </span>
              <p className="text-2xl font-black font-mono">₹{claimedBalance}</p>
              <p className="text-xs font-bold">Usable automatically at checkout for hardware orders.</p>
            </div>

            <form onSubmit={handleClaimGiftCard} className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">Enter Gift Card / Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. BLINK2026"
                  value={giftCode}
                  onChange={(e) => setGiftCode(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-mono text-xs font-bold uppercase text-slate-900 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Redeem
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* SUBVIEW: SITE SAFETY & COMPLIANCE         */}
        {/* ------------------------------------------ */}
        {activeSubView === 'compliance' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">Safety & Quality Certificates</h3>
              </div>
              <button
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Back
              </button>
            </div>

            <div className="space-y-3">
              {[
                { title: 'BIS Grade-A Electrical Wire Conformance Certificate', certNo: 'BIS-IND-94821', status: 'VERIFIED' },
                { title: 'ISO 9001:2015 CPVC Plumbing Pressure Rating Standard', certNo: 'ISO-PLM-3092', status: 'VERIFIED' },
                { title: 'Fire Retardant FR-LSH Switchgear Conformance Cert', certNo: 'FR-ELEC-8812', status: 'VERIFIED' }
              ].map((cert, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {cert.status}
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900 mt-1">{cert.title}</h4>
                    <p className="text-[11px] font-mono text-slate-500">{cert.certNo}</p>
                  </div>
                  <button
                    onClick={() => showToast('Downloading PDF Compliance Record...')}
                    className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* SUBVIEW: PAYMENT SETTINGS                 */}
        {/* ------------------------------------------ */}
        {activeSubView === 'payment_settings' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">Saved Payment Settings</h3>
              </div>
              <button
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Back
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Primary VPA / UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Saved Corporate Card</label>
                <input
                  type="text"
                  value={savedCard}
                  onChange={(e) => setSavedCard(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Default Checkout Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'CARD', 'COD'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDefaultPayment(m)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        defaultPayment === m
                          ? 'bg-slate-950 text-amber-300 border-slate-950'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  showToast('Payment settings updated!');
                  setActiveSubView('main');
                }}
                className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black text-xs py-3 rounded-xl transition cursor-pointer"
              >
                Save Payment Methods
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* SUBVIEW: REWARDS & CASHBACK               */}
        {/* ------------------------------------------ */}
        {activeSubView === 'rewards' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">Contractor Rewards & Coins</h3>
              </div>
              <button
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Back
              </button>
            </div>

            <div className="p-4 bg-gradient-to-br from-slate-950 to-slate-900 text-white rounded-xl shadow-xs flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Blinkit Trade Points
                </span>
                <p className="text-3xl font-black text-amber-300 font-mono">420 Coins</p>
                <p className="text-xs text-slate-300 font-medium mt-0.5">₹1 Coin = ₹1 Discount on Next Order</p>
              </div>
              <Sparkles className="w-10 h-10 text-amber-400" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-900">Active Coupons</h4>
              {[
                { code: 'BULKBMS10', desc: '10% OFF on Orders above ₹10,000' },
                { code: 'FREESHIP50', desc: 'Zero Express Site Delivery Fee' }
              ].map((c, i) => (
                <div key={i} className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="font-mono font-black text-xs text-amber-900">{c.code}</span>
                    <p className="text-[11px] text-amber-800 font-medium">{c.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(c.code);
                      showToast(`Copied ${c.code}!`);
                    }}
                    className="p-1.5 text-amber-900 hover:text-amber-950 font-bold text-xs"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* SUBVIEW: FEEDING INDIA & IMPACT            */}
        {/* ------------------------------------------ */}
        {activeSubView === 'impact' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">Feeding India CSR Impact</h3>
              </div>
              <button
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Back
              </button>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
              <p className="text-3xl font-black text-emerald-900 font-mono">142 Meals</p>
              <p className="text-xs font-bold text-emerald-800">
                Donated through your Hardware Order contributions.
              </p>
            </div>

            <button
              onClick={() => showToast('Generating 80G Tax Exemption Certificate...')}
              className="w-full bg-slate-950 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Download 80G Tax Exemption Receipt</span>
            </button>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* SUBVIEW: ABOUT US                          */}
        {/* ------------------------------------------ */}
        {activeSubView === 'about' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">About Blinkit Hardware</h3>
              </div>
              <button
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Back
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-medium">
              <p>
                Blinkit Hardware Edition delivers electrical, plumbing, power tools, safety equipment, and building materials directly to contractor jobsites in under 10–15 minutes.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">App Version: 17.73.1 • Hardware Build</p>
                <p className="text-[11px] text-slate-500">Dark Store Operating Radius: Koramangala & Indiranagar Hubs</p>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* SUBVIEW: PRIVACY & DATA SETTINGS           */}
        {/* ------------------------------------------ */}
        {activeSubView === 'privacy' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">Account Privacy & Security</h3>
              </div>
              <button
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Back
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Personalized Recommendations</span>
                <button
                  type="button"
                  onClick={() => setPersonalizedOffers(!personalizedOffers)}
                  className={`w-10 h-5 rounded-full transition-colors p-0.5 ${personalizedOffers ? 'bg-slate-950' : 'bg-slate-200'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${personalizedOffers ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Share Anonymous Usage Analytics</span>
                <button
                  type="button"
                  onClick={() => setDataSharing(!dataSharing)}
                  className={`w-10 h-5 rounded-full transition-colors p-0.5 ${dataSharing ? 'bg-slate-950' : 'bg-slate-200'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${dataSharing ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <button
                onClick={() => showToast('Exporting account data to your email...')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition"
              >
                Request Full Data Export
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* SUBVIEW: NOTIFICATION PREFERENCES          */}
        {/* ------------------------------------------ */}
        {activeSubView === 'notifications' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">Notification Preferences</h3>
              </div>
              <button
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Back
              </button>
            </div>

            <div className="space-y-3">
              {[
                { title: 'WhatsApp Live Delivery Updates', desc: 'Driver GPS link and dispatch ETA', state: notifyWhatsapp, set: setNotifyWhatsapp },
                { title: 'SMS Invoices & Receipts', desc: 'Automatic 18% ITC GST invoices', state: notifySms, set: setNotifySms },
                { title: 'Live Order Tracking Push Notifications', desc: 'Realtime order status alerts', state: notifyTracking, set: setNotifyTracking },
                { title: 'Daily Deal & Restock Alerts', desc: 'Promotions on wire, PVC & tools', state: notifyDeals, set: setNotifyDeals }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100">
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => item.set(!item.state)}
                    className={`w-10 h-5 rounded-full transition-colors p-0.5 shrink-0 ${item.state ? 'bg-slate-950' : 'bg-slate-200'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.state ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* SUBVIEW: EDIT PERSONAL PROFILE             */}
        {/* ------------------------------------------ */}
        {activeSubView === 'edit_profile' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Edit Personal Details</h3>
              <button
                onClick={() => setActiveSubView('main')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
              >
                Back
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Date of Birth</label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSavePersonal}
              className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black text-sm py-3 rounded-xl transition cursor-pointer"
            >
              Update Profile
            </button>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* MAIN PROFILE PAGE VIEW                     */}
        {/* ------------------------------------------ */}
        {activeSubView === 'main' && (
          <>
            {/* 1. TOP 3-GRID QUICK ACTIONS */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              
              {/* Card 1: Your orders */}
              <button
                onClick={() => setActiveSubView('orders')}
                className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-xs transition hover:shadow-md cursor-pointer active:scale-98"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center mb-2">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                  Your orders
                </span>
              </button>

              {/* Card 2: GST Details */}
              <button
                onClick={() => setActiveSubView('gst_details')}
                className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-xs transition hover:shadow-md cursor-pointer active:scale-98"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center mb-2 border border-amber-200/60">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8] text-amber-700" />
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                  GST Details
                </span>
                <span className="text-[10px] font-mono text-amber-700 font-bold mt-0.5">18% ITC</span>
              </button>

              {/* Card 3: Need help? */}
              <a
                href="https://wa.me/919845012891?text=Hi%20Blinkit%20Support%2C%20I%20need%20help%20with%20my%20order"
                target="_blank"
                rel="noreferrer"
                className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-xs transition hover:shadow-md cursor-pointer active:scale-98"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center mb-2">
                  <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                  Need help?
                </span>
              </a>

            </div>

            {/* 2. APPEARANCE & SENSITIVE ITEMS TOGGLES */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs space-y-3">
              
              {/* Appearance Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sun className="w-4 h-4 text-slate-700" />
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                    Appearance
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={appearance}
                    onChange={(e) => {
                      const val = e.target.value as 'LIGHT' | 'DARK';
                      setAppearance(val);
                      showToast(`Switched to ${val} Mode`);
                    }}
                    className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-extrabold text-slate-800 uppercase focus:outline-none cursor-pointer"
                  >
                    <option value="LIGHT">LIGHT</option>
                    <option value="DARK">DARK</option>
                  </select>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Hide Sensitive Items Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2.5 pr-2">
                  <EyeOff className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800 block leading-snug">
                      Hide sensitive items
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block">
                      Chemicals, high-voltage equipment and restricted items will be hidden.{' '}
                      <button 
                        type="button" 
                        onClick={() => alert("Restricted safety chemicals and high-voltage equipment require special contractor verification.")}
                        className="underline text-slate-600 hover:text-slate-900 font-medium"
                      >
                        Know more
                      </button>
                    </span>
                  </div>
                </div>

                {/* Custom Toggle Switch */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !hideSensitive;
                    setHideSensitive(next);
                    showToast(next ? 'Sensitive items hidden' : 'Showing all items');
                  }}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 cursor-pointer ${
                    hideSensitive ? 'bg-slate-950' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      hideSensitive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>

            {/* 3. SECTION CARD: YOUR INFORMATION */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-4 pt-3.5 pb-1">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  Your information
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Address book */}
                <button
                  onClick={() => setActiveSubView('address_book')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-slate-700" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Address book</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Bookmarked recipes / lists */}
                <button
                  onClick={() => setActiveSubView('bookmarks')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Bookmark className="w-4 h-4 text-slate-700" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Bookmarked hardware lists</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Your wishlist */}
                <button
                  onClick={() => setActiveSubView('wishlist')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-slate-700" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Your wishlist</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* GST details */}
                <button
                  onClick={() => setActiveSubView('gst_details')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-700" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-800">GST details</span>
                      {gstin && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-mono font-bold px-1.5 py-0.5 rounded">
                          {gstin.slice(0, 4)}...
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* E-gift cards */}
                <button
                  onClick={() => setActiveSubView('gift_cards')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Gift className="w-4 h-4 text-slate-700" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">E-gift cards</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Your prescriptions / Safety Compliance */}
                <button
                  onClick={() => setActiveSubView('compliance')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-4 h-4 text-slate-700" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Site Safety & Compliance certificates</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* 4. SECTION CARD: PAYMENT AND COUPONS */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-4 pt-3.5 pb-1">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  Payment and coupons
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Payment settings */}
                <button
                  onClick={() => setActiveSubView('payment_settings')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Receipt className="w-4 h-4 text-slate-700" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Payment settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Claim Gift card */}
                <button
                  onClick={() => setActiveSubView('gift_cards')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Gift className="w-4 h-4 text-slate-700" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Claim Gift card</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Your collected rewards */}
                <button
                  onClick={() => setActiveSubView('rewards')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-slate-700" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Your collected rewards</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* 5. SECTION CARD: FEEDING INDIA / CSR */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-4 pt-3.5 pb-1">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  Feeding India & Sustainability
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                <button
                  onClick={() => setActiveSubView('impact')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Your impact</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveSubView('impact')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Receipt className="w-4 h-4 text-slate-700" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Get Feeding India receipt</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* 6. SECTION CARD: OTHER INFORMATION */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-4 pt-3.5 pb-1">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  Other Information
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Share the app */}
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: 'Blinkit Hardware', url: window.location.href });
                    } else {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast('App share link copied to clipboard!');
                    }
                  }}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Share2 className="w-4 h-4 text-slate-700" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Share the app</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* About us */}
                <button
                  onClick={() => setActiveSubView('about')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Info className="w-4 h-4 text-slate-700" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">About us</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Account privacy */}
                <button
                  onClick={() => setActiveSubView('privacy')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-slate-700" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Account privacy</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Notification preferences */}
                <button
                  onClick={() => setActiveSubView('notifications')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-slate-700" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Notification preferences</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Log out */}
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to log out of your profile?')) {
                      showToast('Logged out successfully');
                      setTimeout(onClose, 500);
                    }
                  }}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-red-50 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 text-red-600">
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs sm:text-sm font-bold">Log out</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-300" />
                </button>
              </div>
            </div>

            {/* 7. BOTTOM BRANDING FOOTER */}
            <div className="text-center py-6 space-y-1 select-none">
              <div className="flex items-center justify-center gap-1 font-black text-2xl text-slate-300 tracking-tight">
                <span>blink</span>
                <span className="text-slate-900 font-black">it</span>
              </div>
              <p className="text-[11px] font-mono font-medium text-slate-400">
                v17.73.1 • Hardware Edition
              </p>
            </div>

          </>
        )}

      </div>

    </div>
  );
};
