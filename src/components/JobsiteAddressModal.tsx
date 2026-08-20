import React, { useState } from 'react';
import { 
  MapPin, 
  X, 
  Check, 
  Building2, 
  User, 
  Phone, 
  KeyRound, 
  Wrench, 
  Compass, 
  LocateFixed,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { JobSiteLocation } from '../types';
import { OpenStreetMap } from './OpenStreetMap';

interface JobsiteAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: JobSiteLocation;
  onSaveLocation: (loc: JobSiteLocation) => void;
}

const PRESET_LOCALITIES = [
  {
    name: 'Koramangala 4th Block',
    address: '14th Main, 4th Block, Koramangala, Bengaluru',
    landmark: 'Opposite BDA Complex',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    hubDist: '1.2 km • Ultra Fast SLA',
  },
  {
    name: 'HSR Layout Sector 2',
    address: '27th Main Rd, Sector 2, HSR Layout, Bengaluru',
    landmark: 'Near NIFT Campus & Water Tank',
    coordinates: { lat: 12.9121, lng: 77.6446 },
    hubDist: '2.1 km • Express SLA',
  },
  {
    name: 'Indiranagar 100ft Road',
    address: '100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru',
    landmark: 'Near CMH Hospital Metro',
    coordinates: { lat: 12.9716, lng: 77.6412 },
    hubDist: '3.0 km • 14-16 Mins SLA',
  },
  {
    name: 'Bellandur EcoSpace',
    address: 'Outer Ring Rd, Green Glen Layout, Bellandur, Bengaluru',
    landmark: 'Opposite EcoWorld Gate 2',
    coordinates: { lat: 12.9260, lng: 77.6762 },
    hubDist: '3.4 km • 15 Mins SLA',
  },
];

export const JobsiteAddressModal: React.FC<JobsiteAddressModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSaveLocation,
}) => {
  const [formData, setFormData] = useState<JobSiteLocation>(currentLocation);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLocation(formData);
    onClose();
  };

  const handleMapLocationSelect = async (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      coordinates: { lat, lng }
    }));

    // Optional reverse geocoding on drag
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`);
      if (res.ok) {
        const data = await res.json();
        const road = data.address?.road || data.address?.suburb || data.address?.neighbourhood || '';
        const city = data.address?.city || data.address?.state_district || data.address?.town || 'Bengaluru';
        const postcode = data.address?.postcode ? ` - ${data.address.postcode}` : '';
        if (road) {
          setFormData(prev => ({
            ...prev,
            address: `${road}, ${city}${postcode}`,
            coordinates: { lat, lng }
          }));
        }
      }
    } catch {
      // Keep existing address if offline
    }
  };

  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setLocationStatus('Acquiring real-time GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setFormData(prev => ({
          ...prev,
          coordinates: { lat, lng }
        }));
        setLocationStatus('GPS locked! Resolving address...');

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`);
          if (res.ok) {
            const data = await res.json();
            const road = data.address?.road || data.address?.suburb || data.address?.neighbourhood || '';
            const city = data.address?.city || data.address?.state_district || data.address?.town || 'Bengaluru';
            const postcode = data.address?.postcode ? ` - ${data.address.postcode}` : '';
            const landmark = data.address?.building || data.address?.commercial || data.address?.amenity || 'Near Current Location';

            const resolvedAddress = road ? `${road}, ${city}${postcode}` : `${data.display_name.split(',').slice(0, 3).join(',')}, ${city}`;

            setFormData(prev => ({
              ...prev,
              address: resolvedAddress,
              landmark: landmark,
              coordinates: { lat, lng }
            }));
            setLocationStatus('Location updated to your real-time GPS position!');
          } else {
            setFormData(prev => ({
              ...prev,
              address: `Current GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
              coordinates: { lat, lng }
            }));
            setLocationStatus('Location coordinates updated!');
          }
        } catch {
          setFormData(prev => ({
            ...prev,
            address: `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            coordinates: { lat, lng }
          }));
          setLocationStatus('GPS coordinates successfully set!');
        } finally {
          setIsLocating(false);
          setTimeout(() => setLocationStatus(null), 4000);
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus(null);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Location permission was denied. Please enable GPS permissions or choose on the map.');
        } else if (err.code === err.TIMEOUT) {
          setLocationError('Location request timed out. Please retry or click on the map.');
        } else {
          setLocationError('Unable to retrieve current location. Please select on the map.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSelectPreset = (preset: typeof PRESET_LOCALITIES[0]) => {
    setFormData(prev => ({
      ...prev,
      address: preset.address,
      landmark: preset.landmark,
      coordinates: preset.coordinates,
    }));
    setLocationError(null);
    setLocationStatus(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl text-slate-900 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 sticky top-0 bg-white z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Drop Location
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Set delivery address and contact details for live estimated delivery
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-3 space-y-4 text-xs">
          
          {/* Real-Time GPS Detection CTA Bar */}
          <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <div className="text-xs font-black text-emerald-950">
                  Real-Time Live Location
                </div>
                <div className="text-[11px] text-emerald-700">
                  Auto-detect GPS coordinates at your current location
                </div>
              </div>
            </div>

            <button
              id="detect-gps-location-btn"
              type="button"
              onClick={handleDetectCurrentLocation}
              disabled={isLocating}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Locating GPS...</span>
                </>
              ) : (
                <>
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>Use Current Location</span>
                </>
              )}
            </button>
          </div>

          {/* Feedback messages */}
          {locationStatus && (
            <div className="bg-emerald-100/80 border border-emerald-300 text-emerald-900 px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{locationStatus}</span>
            </div>
          )}

          {locationError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3 py-2 rounded-xl text-[11px] font-medium flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{locationError}</span>
            </div>
          )}

          {/* Interactive Site Pin Picker */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-700" />
                <span>Interactive Drop Pin:</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                Lat: {formData.coordinates.lat.toFixed(4)}, Lng: {formData.coordinates.lng.toFixed(4)}
              </span>
            </div>

            <div className="h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-slate-200">
              <OpenStreetMap
                center={[formData.coordinates.lat, formData.coordinates.lng]}
                zoom={15}
                interactive={true}
                onLocationSelect={handleMapLocationSelect}
                showHubCoverage={true}
                className="h-full w-full"
              />
            </div>
            <p className="text-[10px] text-slate-500">
              💡 Click or drag the red pin on the map to mark the exact drop point or gate.
            </p>
          </div>

          {/* Quick Locality Presets */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
              Quick Delivery Area Presets:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_LOCALITIES.map((preset) => {
                const isSelected = formData.address.includes(preset.name.split(' ')[0]);
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-[11px]">{preset.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{preset.hubDist}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Details (Name & Phone Number) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                Contact Name:
              </label>
              <input
                type="text"
                required
                value={formData.siteContactName}
                onChange={(e) => setFormData({ ...formData, siteContactName: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                Contact Number:
              </label>
              <input
                type="tel"
                required
                value={formData.sitePhone}
                onChange={(e) => setFormData({ ...formData, sitePhone: e.target.value })}
                placeholder="+91 98450 12891"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium font-mono"
              />
            </div>
          </div>

          {/* Street Address */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              Complete Address (Building, Street, Area):
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. 14th Main, 4th Block, Koramangala, Bengaluru"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Floor & Landmark / Delivery Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Flat / Floor / House No:</label>
              <input
                type="text"
                value={formData.floorUnit || ''}
                onChange={(e) => setFormData({ ...formData, floorUnit: e.target.value })}
                placeholder="e.g. 4th Floor, Flat 402 / Gate Drop"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-emerald-700" />
                Landmark / Gate Instructions:
              </label>
              <input
                type="text"
                value={formData.landmark || ''}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="e.g. Opp BDA Complex / Tell Guard Flat 402"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-6 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Drop Location</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
