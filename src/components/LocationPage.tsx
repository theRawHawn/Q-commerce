import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Check, 
  Building2, 
  Home,
  Briefcase,
  User, 
  Phone, 
  KeyRound, 
  LocateFixed,
  AlertCircle,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { JobSiteLocation } from '../types';
import { OpenStreetMap } from './OpenStreetMap';
import { reverseGeocodeCoordinates } from '../utils/geolocation';

export interface SavedAddress {
  id: string;
  tag: 'Job Site' | 'Home' | 'Work' | 'Warehouse' | 'Other' | 'Current Location';
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
    distanceSla: '1.2 km • 10-12 Min SLA',
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
    distanceSla: '2.8 km • 15 Min SLA',
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
  
  // Modals / Drawers for Add & Edit
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Address Form State (for both Add and Edit)
  const [formTag, setFormTag] = useState<'Job Site' | 'Home' | 'Work' | 'Warehouse' | 'Other'>('Home');
  const [formAddress, setFormAddress] = useState('');
  const [formFloorUnit, setFormFloorUnit] = useState('');
  const [formLandmark, setFormLandmark] = useState('');
  const [formContactName, setFormContactName] = useState('Rahul Sharma');
  const [formContactPhone, setFormContactPhone] = useState('+91 98450 12891');

  // Toggle doorstep edit accordion on main view
  const [isEditingSelectedDetails, setIsEditingSelectedDetails] = useState(false);

  const saveAddressesToStorage = (list: SavedAddress[]) => {
    setSavedAddresses(list);
    try {
      localStorage.setItem('quickhardware_saved_addresses_list', JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setFormData({
      address: addr.address,
      floorUnit: addr.floorUnit,
      landmark: addr.landmark,
      siteContactName: addr.siteContactName || 'Rahul Sharma',
      sitePhone: addr.sitePhone || '+91 98450 12891',
      jobTag: addr.tag,
      coordinates: addr.coordinates,
    });
    setLocationError(null);
    setLocationStatus(`Selected: ${addr.tag} (${addr.address.split(',')[0]})`);
    setTimeout(() => setLocationStatus(null), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setFormTag('Home');
    setFormAddress(formData.address || '');
    setFormFloorUnit('');
    setFormLandmark('');
    setFormContactName(formData.siteContactName || 'Rahul Sharma');
    setFormContactPhone(formData.sitePhone || '+91 98450 12891');
    setIsAddressModalOpen(true);
  };

  const handleOpenEditModal = (addr: SavedAddress, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddress(addr);
    setFormTag(addr.tag);
    setFormAddress(addr.address);
    setFormFloorUnit(addr.floorUnit || '');
    setFormLandmark(addr.landmark || '');
    setFormContactName(addr.siteContactName || 'Rahul Sharma');
    setFormContactPhone(addr.sitePhone || '+91 98450 12891');
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedAddresses.filter((a) => a.id !== id);
    saveAddressesToStorage(updated);
    
    if (selectedAddressId === id && updated.length > 0) {
      handleSelectSavedAddress(updated[0]);
    }
    setDeletingId(null);
    setLocationStatus('Address deleted.');
    setTimeout(() => setLocationStatus(null), 3000);
  };

  const handleSaveAddressForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAddress.trim()) return;

    if (editingAddress) {
      // Edit existing
      const updated = savedAddresses.map((a) => {
        if (a.id === editingAddress.id) {
          return {
            ...a,
            tag: formTag,
            address: formAddress.trim(),
            floorUnit: formFloorUnit.trim(),
            landmark: formLandmark.trim(),
            siteContactName: formContactName.trim(),
            sitePhone: formContactPhone.trim(),
          };
        }
        return a;
      });
      saveAddressesToStorage(updated);
      const edited = updated.find((a) => a.id === editingAddress.id);
      if (edited && selectedAddressId === edited.id) {
        handleSelectSavedAddress(edited);
      }
      setLocationStatus('Address updated successfully!');
    } else {
      // Add new
      const newAddr: SavedAddress = {
        id: 'addr_' + Date.now(),
        tag: formTag,
        address: formAddress.trim(),
        floorUnit: formFloorUnit.trim(),
        landmark: formLandmark.trim(),
        siteContactName: formContactName.trim(),
        sitePhone: formContactPhone.trim(),
        isDefault: false,
        coordinates: formData.coordinates,
        distanceSla: '1.5 km • Express SLA',
      };
      const updated = [newAddr, ...savedAddresses];
      saveAddressesToStorage(updated);
      handleSelectSavedAddress(newAddr);
      setLocationStatus('New address added & selected!');
    }

    setIsAddressModalOpen(false);
    setTimeout(() => setLocationStatus(null), 3000);
  };

  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setLocationStatus('Acquiring real-time GPS position from device...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          // Robust multi-tier reverse geocoding
          const geoResult = await reverseGeocodeCoordinates(lat, lng);
          
          const updatedLocation: JobSiteLocation = {
            address: geoResult.formattedAddress,
            landmark: geoResult.landmark || 'Near GPS Pin',
            floorUnit: formData.floorUnit || 'Doorstep Delivery',
            siteContactName: formData.siteContactName || 'Rahul Sharma',
            sitePhone: formData.sitePhone || '+91 98450 12891',
            jobTag: 'Current Location',
            coordinates: { lat, lng },
          };

          // 1. Update form data
          setFormData(updatedLocation);

          // 2. Create / update SavedAddress for Current GPS Location
          const currentGpsAddr: SavedAddress = {
            id: 'addr_current_gps',
            tag: 'Current Location',
            address: geoResult.formattedAddress,
            floorUnit: updatedLocation.floorUnit || 'Doorstep Delivery',
            landmark: geoResult.landmark,
            siteContactName: updatedLocation.siteContactName,
            sitePhone: updatedLocation.sitePhone,
            isDefault: true,
            coordinates: { lat, lng },
            distanceSla: 'Hyperlocal • 10-12 Min SLA',
          };

          // Remove any previous current GPS address and prepend fresh one
          const updatedAddressesList = [
            currentGpsAddr,
            ...savedAddresses.filter((a) => a.id !== 'addr_current_gps').map((a) => ({ ...a, isDefault: false })),
          ];

          saveAddressesToStorage(updatedAddressesList);
          setSelectedAddressId('addr_current_gps');

          // 3. Immediately persist & apply location to app state
          onSaveLocation(updatedLocation);
          try {
            localStorage.setItem('quickhardware_jobsite', JSON.stringify(updatedLocation));
          } catch {
            // ignore
          }

          setLocationStatus(`✓ Actual GPS Location Saved: ${geoResult.formattedAddress.split(',')[0]} (${geoResult.city})`);
        } catch (err) {
          console.error('Error resolving GPS location:', err);
          const fallbackLoc: JobSiteLocation = {
            ...formData,
            address: `GPS Pin Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            coordinates: { lat, lng },
            jobTag: 'Current Location',
          };
          setFormData(fallbackLoc);
          onSaveLocation(fallbackLoc);
          setLocationStatus('GPS position updated & saved.');
        } finally {
          setIsLocating(false);
          setTimeout(() => setLocationStatus(null), 4500);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        setLocationError(
          err.code === 1
            ? 'Location permission denied. Please allow location access in your browser or pick a location on the map.'
            : 'Unable to acquire accurate GPS position. Please select a pin on the map.'
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const handleMapLocationSelect = async (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, coordinates: { lat, lng } }));

    try {
      const geoResult = await reverseGeocodeCoordinates(lat, lng);
      setFormData((prev) => ({
        ...prev,
        address: geoResult.formattedAddress,
        landmark: geoResult.landmark,
        coordinates: { lat, lng },
      }));
    } catch {
      // ignore
    }
  };

  const handleConfirmLocation = () => {
    onSaveLocation(formData);
    onClose();
  };

  const filteredSavedAddresses = savedAddresses.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.tag.toLowerCase().includes(q) ||
      a.address.toLowerCase().includes(q) ||
      a.floorUnit.toLowerCase().includes(q) ||
      a.landmark.toLowerCase().includes(q)
    );
  });

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case 'Current Location':
        return <LocateFixed className="w-4 h-4 text-emerald-600 animate-pulse" />;
      case 'Home':
        return <Home className="w-4 h-4 text-emerald-600" />;
      case 'Work':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'Warehouse':
        return <Building2 className="w-4 h-4 text-amber-600" />;
      case 'Job Site':
        return <MapPin className="w-4 h-4 text-rose-600" />;
      default:
        return <MapPin className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER                                                 */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 py-3 sm:px-6 shadow-2xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-700 transition cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Select Delivery Address
              </h1>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[220px] sm:max-w-md">
                Select saved location or pick exact doorstep pin
              </p>
            </div>
          </div>

          <button
            onClick={handleDetectCurrentLocation}
            disabled={isLocating}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <LocateFixed className={`w-3.5 h-3.5 text-emerald-700 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Use Live GPS</span>
            <span className="sm:hidden">GPS</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTAINER                                                */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-5 pb-28">

        {/* Notifications */}
        {locationStatus && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{locationStatus}</span>
          </div>
        )}

        {locationError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 shadow-2xs animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* 2. SEARCH & GPS QUICK LINK                                  */}
        {/* ----------------------------------------------------------- */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved addresses (e.g. Home, Koramangala)..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 font-medium shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          {/* Quick 1-Tap 'Use Current Location' Card */}
          <button
            onClick={handleDetectCurrentLocation}
            disabled={isLocating}
            className="w-full bg-white hover:bg-emerald-50/60 border border-emerald-300/80 hover:border-emerald-500 p-3.5 rounded-2xl flex items-center justify-between text-left transition shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition ${isLocating ? 'animate-spin' : ''}`}>
                <LocateFixed className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span>Use Current Location</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    GPS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {isLocating ? 'Acquiring GPS position & resolving address...' : 'Detect & save actual device location for fast delivery'}
                </p>
              </div>
            </div>

            <div className="text-emerald-700 text-xs font-bold shrink-0 flex items-center gap-1 pr-1">
              {isLocating ? (
                <span className="text-[11px] text-emerald-600 animate-pulse">Detecting...</span>
              ) : (
                <span className="text-xs group-hover:translate-x-0.5 transition">Auto Detect →</span>
              )}
            </div>
          </button>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* 3. CLEAN & COMPACT MAP PIN VIEW                            */}
        {/* ----------------------------------------------------------- */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
            <span className="flex items-center gap-1.5 text-slate-900 font-extrabold uppercase tracking-wider text-[11px]">
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>Doorstep Pin Location</span>
            </span>
            <span className="text-[11px] text-slate-500 font-normal truncate max-w-[200px]">
              {formData.address}
            </span>
          </div>

          <div className="h-44 sm:h-52 w-full rounded-xl overflow-hidden border border-slate-200 relative shadow-inner">
            <OpenStreetMap
              center={[formData.coordinates.lat, formData.coordinates.lng]}
              zoom={15}
              interactive={true}
              onLocationSelect={handleMapLocationSelect}
              showHubCoverage={false}
              className="h-full w-full"
            />
            <div className="absolute top-2 left-2 z-20 bg-slate-900/80 text-white backdrop-blur-xs text-[10px] font-medium px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Tap or drag map to adjust exact pin</span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* 4. SAVED ADDRESSES (WITH EDIT & DELETE OPTIONS)              */}
        {/* ----------------------------------------------------------- */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Saved Addresses</span>
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {filteredSavedAddresses.length}
                </span>
              </h2>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Saved Address Cards List */}
          <div className="space-y-3">
            {filteredSavedAddresses.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No matching saved addresses found.
              </div>
            ) : (
              filteredSavedAddresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectSavedAddress(addr)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500/20'
                        : 'border-slate-200/90 bg-white hover:bg-slate-50/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      
                      {/* Left side: Tag icon & details */}
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {getTagIcon(addr.tag)}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-slate-900">
                              {addr.tag}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                DEFAULT
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500 font-medium">
                              {addr.distanceSla || 'Fast SLA'}
                            </span>
                          </div>

                          <p className="text-xs font-medium text-slate-800 leading-snug">
                            {addr.address}
                          </p>

                          {(addr.floorUnit || addr.landmark) && (
                            <p className="text-[11px] text-slate-500">
                              {addr.floorUnit}{addr.landmark ? ` • Near ${addr.landmark}` : ''}
                            </p>
                          )}

                          <p className="text-[11px] text-slate-500 font-medium pt-0.5">
                            Contact: <span className="text-slate-800 font-semibold">{addr.siteContactName}</span> ({addr.sitePhone})
                          </p>
                        </div>
                      </div>

                      {/* Right side: Select status + Action Buttons (Edit & Delete) */}
                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Edit Button */}
                        <button
                          onClick={(e) => handleOpenEditModal(addr, e)}
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                          title="Edit address"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => handleDeleteAddress(addr.id, e)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Selection Radio / Checkmark */}
                        <div
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`w-5 h-5 rounded-full flex items-center justify-center cursor-pointer ml-1 transition ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'border-2 border-slate-300 text-transparent hover:border-slate-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* 5. DOORSTEP & CONTACT DETAILS ACCORDION                     */}
        {/* ----------------------------------------------------------- */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Selected Doorstep &amp; Receiver Details</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {formData.siteContactName} • {formData.sitePhone} {formData.floorUnit ? `• ${formData.floorUnit}` : ''}
              </p>
            </div>

            <button
              onClick={() => setIsEditingSelectedDetails(!isEditingSelectedDetails)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
            >
              {isEditingSelectedDetails ? 'Close Form' : 'Edit Receiver'}
            </button>
          </div>

          {isEditingSelectedDetails && (
            <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Receiver Name</label>
                  <input
                    type="text"
                    value={formData.siteContactName}
                    onChange={(e) => setFormData({ ...formData, siteContactName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={formData.sitePhone}
                    onChange={(e) => setFormData({ ...formData, sitePhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Flat / Floor / House #</label>
                  <input
                    type="text"
                    value={formData.floorUnit || ''}
                    onChange={(e) => setFormData({ ...formData, floorUnit: e.target.value })}
                    placeholder="e.g. Flat 402, 4th Floor"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Landmark Note</label>
                  <input
                    type="text"
                    value={formData.landmark || ''}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder="e.g. Near BDA Gate 2"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* STICKY BOTTOM ACTION BAR                                      */}
      {/* ------------------------------------------------------------- */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 p-3.5 sm:px-6 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          
          <div className="hidden sm:block">
            <div className="text-xs font-black text-slate-900 truncate max-w-xs">
              Deliver to: {formData.jobTag ? `${formData.jobTag} - ` : ''}{formData.address.split(',')[0]}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold">
              10-12 Mins Guaranteed SLA Zone
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmLocation}
              className="flex-1 sm:flex-initial bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Confirm &amp; Deliver Here</span>
            </button>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT ADDRESS DIALOG                              */}
      {/* ------------------------------------------------------------- */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 relative border border-slate-100">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                {editingAddress ? <Pencil className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4 text-emerald-600" />}
                <span>{editingAddress ? 'Edit Saved Address' : 'Add New Address'}</span>
              </h3>

              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddressForm} className="space-y-3.5">
              
              {/* Tag Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Address Label / Tag</label>
                <div className="flex gap-2 flex-wrap">
                  {(['Home', 'Work', 'Job Site', 'Warehouse', 'Other'] as const).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setFormTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        formTag === tag
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / Locality *</label>
                <input
                  type="text"
                  required
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="e.g. 14th Main Rd, 4th Block, Koramangala, Bengaluru"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Floor/Unit & Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">House / Floor / Unit #</label>
                  <input
                    type="text"
                    value={formFloorUnit}
                    onChange={(e) => setFormFloorUnit(e.target.value)}
                    placeholder="e.g. Flat 402, Tower B"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nearby Landmark</label>
                  <input
                    type="text"
                    value={formLandmark}
                    onChange={(e) => setFormLandmark(e.target.value)}
                    placeholder="e.g. Opp BDA Complex"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Contact Person & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Receiver Name</label>
                  <input
                    type="text"
                    required
                    value={formContactName}
                    onChange={(e) => setFormContactName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={formContactPhone}
                    onChange={(e) => setFormContactPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Save Address
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
