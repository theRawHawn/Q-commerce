import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Check, 
  Building2, 
  User, 
  Phone, 
  KeyRound, 
  LocateFixed,
  Loader2,
  AlertCircle,
  Plus,
  Search,
  Navigation,
  Sparkles,
  Edit2,
  Trash2
} from 'lucide-react';
import { JobSiteLocation } from '../types';
import { OpenStreetMap } from './OpenStreetMap';

export interface SavedAddress {
  id: string;
  tag: 'Job Site' | 'Home' | 'Work' | 'Warehouse' | 'Other';
  address: string;
  floorUnit: string;
  landmark: string;
  siteContactName: string;
  sitePhone: string;
  isDefault: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceSla?: string;
}

const DEFAULT_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr_jobsite',
    tag: 'Job Site',
    address: '14th Main Rd, 4th Block, Koramangala, Bengaluru',
    floorUnit: 'Tower B, 4th Floor, Flat 402',
    landmark: 'Opposite BDA Complex, Gate #2',
    siteContactName: 'Rahul Sharma',
    sitePhone: '+91 98450 12891',
    isDefault: true,
    coordinates: { lat: 12.9352, lng: 77.6245 },
    distanceSla: '1.2 km • Ultra Fast 10-12 Min SLA',
  },
  {
    id: 'addr_warehouse',
    tag: 'Warehouse',
    address: 'Plot #42, Industrial Area, Peenya 1st Stage, Bengaluru',
    floorUnit: 'Shed #3, Ground Floor',
    landmark: 'Near TVS Cross Bus Stop',
    siteContactName: 'Suresh Kumar (Store Manager)',
    sitePhone: '+91 98801 44192',
    isDefault: false,
    coordinates: { lat: 13.0285, lng: 77.5197 },
    distanceSla: '2.8 km • Express 15 Min SLA',
  },
  {
    id: 'addr_work',
    tag: 'Work',
    address: '100ft Road, 12th Main, Indiranagar, Bengaluru',
    floorUnit: 'Suite 201, Landmark Building',
    landmark: 'Above Axis Bank Branch',
    siteContactName: 'Rahul Sharma',
    sitePhone: '+91 98450 12891',
    isDefault: false,
    coordinates: { lat: 12.9716, lng: 77.6412 },
    distanceSla: '3.0 km • 14-16 Mins SLA',
  },
  {
    id: 'addr_home',
    tag: 'Home',
    address: '27th Main Rd, Sector 2, HSR Layout, Bengaluru',
    floorUnit: 'House #142, 2nd Floor',
    landmark: 'Near NIFT Campus & Water Tank',
    siteContactName: 'Rahul Sharma',
    sitePhone: '+91 98450 12891',
    isDefault: false,
    coordinates: { lat: 12.9121, lng: 77.6446 },
    distanceSla: '2.1 km • Express SLA',
  },
];

interface LocationPageProps {
  currentLocation: JobSiteLocation;
  onSaveLocation: (loc: JobSiteLocation) => void;
  onClose: () => void;
}

export const LocationPage: React.FC<LocationPageProps> = ({
  currentLocation,
  onSaveLocation,
  onClose,
}) => {
  const [formData, setFormData] = useState<JobSiteLocation>(currentLocation);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    try {
      const stored = localStorage.getItem('quickhardware_saved_addresses_list');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_SAVED_ADDRESSES;
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const match = savedAddresses.find(
      (a) => a.address.toLowerCase() === currentLocation.address.toLowerCase()
    );
    return match ? match.id : savedAddresses[0]?.id || 'addr_jobsite';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Address Form State
  const [newTag, setNewTag] = useState<'Job Site' | 'Home' | 'Work' | 'Warehouse' | 'Other'>('Job Site');
  const [newAddress, setNewAddress] = useState('');
  const [newFloorUnit, setNewFloorUnit] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setFormData({
      address: addr.address,
      floorUnit: addr.floorUnit,
      landmark: addr.landmark,
      siteContactName: addr.siteContactName || formData.siteContactName || 'Rahul Sharma',
      sitePhone: addr.sitePhone || formData.sitePhone || '+91 98450 12891',
      jobTag: addr.tag,
      coordinates: addr.coordinates,
    });
    setLocationError(null);
    setLocationStatus(`Selected "${addr.tag}" - ${addr.address.split(',')[0]}`);
    setTimeout(() => setLocationStatus(null), 3000);
  };

  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setLocationStatus('Acquiring real-time GPS position...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          coordinates: { lat, lng },
        }));
        setLocationStatus('GPS locked! Resolving address...');

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
          );
          if (res.ok) {
            const data = await res.json();
            const road =
              data.address?.road ||
              data.address?.suburb ||
              data.address?.neighbourhood ||
              '';
            const city =
              data.address?.city ||
              data.address?.state_district ||
              data.address?.town ||
              'Bengaluru';
            const postcode = data.address?.postcode
              ? ` - ${data.address.postcode}`
              : '';
            const landmark =
              data.address?.building ||
              data.address?.commercial ||
              data.address?.amenity ||
              'Near Current GPS Location';

            const resolvedAddress = road
              ? `${road}, ${city}${postcode}`
              : `${data.display_name.split(',').slice(0, 3).join(',')}, ${city}`;

            setFormData((prev) => ({
              ...prev,
              address: resolvedAddress,
              landmark: landmark,
              coordinates: { lat, lng },
            }));
            setLocationStatus('Location set to your current GPS position!');
          } else {
            setFormData((prev) => ({
              ...prev,
              address: `Current GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
              coordinates: { lat, lng },
            }));
            setLocationStatus('GPS coordinates updated!');
          }
        } catch {
          setFormData((prev) => ({
            ...prev,
            address: `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            coordinates: { lat, lng },
          }));
          setLocationStatus('GPS coordinates set successfully!');
        } finally {
          setIsLocating(false);
          setTimeout(() => setLocationStatus(null), 4000);
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus(null);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError(
            'GPS permission denied. Please enable location permissions in browser settings.'
          );
        } else {
          setLocationError('Unable to detect current GPS location. Please select on map.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleMapLocationSelect = async (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      coordinates: { lat, lng },
    }));

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
      );
      if (res.ok) {
        const data = await res.json();
        const road =
          data.address?.road || data.address?.suburb || data.address?.neighbourhood || '';
        const city =
          data.address?.city || data.address?.state_district || data.address?.town || 'Bengaluru';
        const postcode = data.address?.postcode ? ` - ${data.address.postcode}` : '';
        if (road) {
          setFormData((prev) => ({
            ...prev,
            address: `${road}, ${city}${postcode}`,
            coordinates: { lat, lng },
          }));
        }
      }
    } catch {
      // offline fallback
    }
  };

  const handleAddNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;

    const newSaved: SavedAddress = {
      id: 'addr_' + Date.now(),
      tag: newTag,
      address: newAddress.trim(),
      floorUnit: newFloorUnit.trim(),
      landmark: newLandmark.trim(),
      siteContactName: formData.siteContactName,
      sitePhone: formData.sitePhone,
      isDefault: false,
      coordinates: formData.coordinates,
      distanceSla: '1.5 km • Fast SLA',
    };

    const updated = [newSaved, ...savedAddresses];
    setSavedAddresses(updated);
    try {
      localStorage.setItem('quickhardware_saved_addresses_list', JSON.stringify(updated));
    } catch {
      // ignore
    }

    handleSelectSavedAddress(newSaved);
    setIsAddingNew(false);
    setNewAddress('');
    setNewFloorUnit('');
    setNewLandmark('');
  };

  const handleConfirmLocation = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLocation(formData);
    onClose();
  };

  const filteredSavedAddresses = savedAddresses.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.tag.toLowerCase().includes(q) ||
      a.address.toLowerCase().includes(q) ||
      a.landmark.toLowerCase().includes(q) ||
      a.floorUnit.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-900 flex flex-col font-sans antialiased animate-in fade-in duration-200">
      
      {/* ------------------------------------------------------------- */}
      {/* STICKY TOP HEADER BAR                                         */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-800 transition cursor-pointer flex items-center justify-center"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight flex items-center gap-1.5">
                <span>Select Delivery Location</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider hidden sm:inline-block">
                  Live Dispatch
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[240px] sm:max-w-md">
                Choose from saved addresses or pin exact drop location on map
              </p>
            </div>
          </div>

          <button
            onClick={() => handleDetectCurrentLocation()}
            disabled={isLocating}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer shrink-0"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Use Current Location</span>
            <span className="sm:hidden">GPS</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT BODY                                             */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-6 space-y-5 pb-28">

        {/* Feedback Notifications */}
        {locationStatus && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-2xs animate-in slide-in-from-top-2">
            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{locationStatus}</span>
          </div>
        )}

        {locationError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl text-xs font-medium flex items-center gap-2 shadow-2xs animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* SECTION 1: SEARCH BAR & GPS QUICK DETECT                    */}
        {/* ----------------------------------------------------------- */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for area, street name, building or saved tag..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDetectCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              </div>
              <span>{isLocating ? 'Acquiring GPS coordinates...' : 'Auto-detect my live location'}</span>
            </button>

            <span className="text-[10px] text-slate-400 font-medium">
              GPS Precision Enabled
            </span>
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* SECTION 2: SMOOTH LIGHT / WHITE MAP VIEW (SWIGGY/BLINKIT)  */}
        {/* ----------------------------------------------------------- */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>Interactive Drop Pin (Light Map View)</span>
            </label>
            <span className="text-[10px] text-slate-500 font-mono">
              Lat: {formData.coordinates.lat.toFixed(4)}, Lng: {formData.coordinates.lng.toFixed(4)}
            </span>
          </div>

          {/* Clean White CartoDB Positron Map Canvas */}
          <div className="h-56 sm:h-72 w-full rounded-xl overflow-hidden border border-slate-200 relative shadow-inner">
            <OpenStreetMap
              center={[formData.coordinates.lat, formData.coordinates.lng]}
              zoom={15}
              interactive={true}
              onLocationSelect={handleMapLocationSelect}
              showHubCoverage={true}
              className="h-full w-full"
            />

            {/* Floating Hint Overlay on Map */}
            <div className="absolute top-3 left-3 z-20 bg-slate-950/90 text-white backdrop-blur-xs text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Drag map or tap to fine-tune doorstep location</span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* SECTION 3: SAVED ADDRESSES (REPLACED STATIC PRESETS)       */}
        {/* ----------------------------------------------------------- */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Your Saved Delivery Locations ({filteredSavedAddresses.length})</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Tap any saved address to select it for instant dispatch
              </p>
            </div>

            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New</span>
            </button>
          </div>

          {/* Add New Address Form Inline Toggle */}
          {isAddingNew && (
            <form onSubmit={handleAddNewAddressSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-black uppercase text-slate-800">New Address Details</span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tag / Label</label>
                <div className="flex gap-2 flex-wrap">
                  {(['Job Site', 'Home', 'Work', 'Warehouse', 'Other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewTag(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        newTag === t
                          ? 'bg-slate-950 text-amber-300'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="e.g. 14th Main Rd, 4th Block, Koramangala, Bengaluru"
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Floor / Unit / Flat #</label>
                  <input
                    type="text"
                    value={newFloorUnit}
                    onChange={(e) => setNewFloorUnit(e.target.value)}
                    placeholder="e.g. Tower B, 4th Floor"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Landmark</label>
                  <input
                    type="text"
                    value={newLandmark}
                    onChange={(e) => setNewLandmark(e.target.value)}
                    placeholder="e.g. Near BDA Complex"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs py-2.5 rounded-xl transition cursor-pointer"
              >
                Save &amp; Select New Location
              </button>
            </form>
          )}

          {/* List of Selectable Saved Address Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {filteredSavedAddresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => handleSelectSavedAddress(addr)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                          {addr.tag}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                      {addr.address}
                    </h3>

                    <p className="text-[11px] text-slate-600 font-medium">
                      {addr.floorUnit}{addr.landmark ? ` • ${addr.landmark}` : ''}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-800 font-bold">
                      {addr.distanceSla || 'Fast Dispatch Zone'}
                    </span>
                    <span className="text-slate-500 font-medium">
                      Contact: {addr.siteContactName ? addr.siteContactName.split(' ')[0] : 'Site'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* SECTION 4: COMPLETE CONTACT & DELIVERY INSTRUCTIONS FORM    */}
        {/* ----------------------------------------------------------- */}
        <form onSubmit={handleConfirmLocation} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Delivery Contact &amp; Doorstep Instructions</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>Contact Person Name:</span>
              </label>
              <input
                type="text"
                required
                value={formData.siteContactName}
                onChange={(e) => setFormData({ ...formData, siteContactName: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Contact Phone Number:</span>
              </label>
              <input
                type="tel"
                required
                value={formData.sitePhone}
                onChange={(e) => setFormData({ ...formData, sitePhone: e.target.value })}
                placeholder="+91 98450 12891"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Street Address / Area / Locality:</span>
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. 14th Main Rd, 4th Block, Koramangala, Bengaluru"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Flat / Floor / Unit Number:</label>
              <input
                type="text"
                value={formData.floorUnit || ''}
                onChange={(e) => setFormData({ ...formData, floorUnit: e.target.value })}
                placeholder="e.g. Tower B, 4th Floor, Flat 402"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                <span>Landmark / Security Gate Note:</span>
              </label>
              <input
                type="text"
                value={formData.landmark || ''}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="e.g. Opp BDA Complex / Gate #2"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <button type="submit" id="submit-confirm-location-form-btn" className="hidden">
            Submit
          </button>
        </form>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* STICKY BOTTOM CONFIRMATION ACTION BAR                         */}
      {/* ------------------------------------------------------------- */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3.5 sm:px-6 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          <div className="hidden sm:block">
            <div className="text-xs font-black text-slate-900 truncate max-w-sm">
              Deliver to: {formData.jobTag ? `${formData.jobTag} - ` : ''}{formData.address.split(',')[0]}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold">
              10-12 Mins Express SLA Zone
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer shrink-0"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={(e) => handleConfirmLocation(e)}
              className="flex-1 sm:flex-initial bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Save &amp; Confirm Delivery Location</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
