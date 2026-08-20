import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix default Leaflet icon paths in bundlers
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// Custom Leaflet HTML DivIcons with professional, creative SVG designs
export const createHubIcon = (storeName: string = 'Local Hardware Store') => {
  return L.divIcon({
    className: 'custom-hub-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <!-- Top Store Pill -->
        <div style="background: #090d16; color: #38bdf8; padding: 2px 7px; border-radius: 9999px; font-size: 9px; font-weight: 900; letter-spacing: 0.03em; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px; margin-bottom: 3px; border: 1.5px solid rgba(56,189,248,0.3);">
          <span style="width: 5px; height: 5px; border-radius: 9999px; background: #38bdf8; box-shadow: 0 0 6px #38bdf8;"></span>
          <span>STORE PARTNER</span>
        </div>

        <!-- Store 3D Box Badge -->
        <div style="width: 38px; height: 38px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 18px rgba(15,23,42,0.45); border: 2.5px solid #ffffff; position: relative;">
          <!-- Shop Building SVG -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <!-- Outer Ping Ring -->
          <div style="position: absolute; inset: -4px; border-radius: 14px; border: 2px solid #38bdf8; animation: pulse-ring 2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite; opacity: 0.6;"></div>
        </div>

        <!-- Contact Ground Shadow -->
        <div style="width: 24px; height: 6px; background: radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 70%); border-radius: 9999px; margin-top: 2px;"></div>
      </div>
    `,
    iconSize: [44, 60],
    iconAnchor: [22, 56],
    popupAnchor: [0, -56],
  });
};

export const createRiderIcon = (speedKmH: number = 28) => {
  return L.divIcon({
    className: 'custom-rider-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate3d(0,0,0);">
        <!-- Live Floating Speed Tag -->
        <div style="background: #0f172a; color: #10b981; padding: 2px 6px; border-radius: 9999px; font-size: 8.5px; font-weight: 900; letter-spacing: 0.02em; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.35); display: flex; align-items: center; gap: 3px; margin-bottom: 2px; border: 1.5px solid rgba(16,185,129,0.4); font-family: ui-monospace, monospace;">
          <span style="width: 4px; height: 4px; border-radius: 9999px; background: #10b981; box-shadow: 0 0 5px #10b981; animation: pulse 1s infinite;"></span>
          <span>${speedKmH} km/h</span>
        </div>

        <!-- Courier Avatar Disc with 3D Border & Glow -->
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #059669 0%, #047857 100%); border-radius: 9999px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 18px rgba(5,150,105,0.5); border: 2.5px solid #ffffff; position: relative;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18.5" cy="17.5" r="3.5"/>
            <circle cx="5.5" cy="17.5" r="3.5"/>
            <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h4"/>
          </svg>
          <!-- Live EV Pulse Icon -->
          <div style="position: absolute; bottom: -2px; right: -2px; width: 14px; height: 14px; background: #f59e0b; border-radius: 9999px; border: 1.5px solid white; display: flex; align-items: center; justify-content: center; font-size: 7.5px; font-weight: 900; color: #78350f;">
            ⚡
          </div>
        </div>

        <!-- Motion Ground Wave -->
        <div style="position: absolute; bottom: -4px; width: 28px; height: 6px; background: radial-gradient(ellipse at center, rgba(5,150,105,0.5) 0%, rgba(5,150,105,0) 75%); border-radius: 9999px;"></div>
      </div>
    `,
    iconSize: [44, 56],
    iconAnchor: [22, 50],
  });
};

export const createDestinationIcon = (label: string = 'Jobsite Drop Point', isInteractive: boolean = true) => {
  return L.divIcon({
    className: 'custom-jobsite-pin',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); pointer-events: auto; user-select: none;">
        
        <!-- Animated Floating Label Badge -->
        <div style="background: #0f172a; color: #ffffff; padding: 2px 7px; border-radius: 9999px; font-size: 9px; font-weight: 800; letter-spacing: 0.02em; white-space: nowrap; box-shadow: 0 3px 10px rgba(15,23,42,0.3); display: flex; align-items: center; gap: 4px; margin-bottom: 3px; border: 1px solid rgba(255,255,255,0.2); font-family: ui-sans-serif, system-ui, sans-serif;">
          <span style="width: 5px; height: 5px; border-radius: 9999px; background: #ef4444; box-shadow: 0 0 6px #ef4444; display: inline-block;"></span>
          <span style="color: #f8fafc;">${label}</span>
          ${isInteractive ? '<span style="color: #94a3b8; font-size: 8px; font-weight: 600; padding-left: 2px;">• Drag</span>' : ''}
        </div>

        <!-- 3D Precision Drop Pin Head (50% Compact Size, Red Theme) -->
        <div class="custom-dest-pin-animated" style="position: relative; width: 22px; height: 27px; filter: drop-shadow(0 6px 8px rgba(185,28,28,0.4)); cursor: grab;">
          <svg width="22" height="27" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="redPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ef4444" />
                <stop offset="60%" stop-color="#dc2626" />
                <stop offset="100%" stop-color="#991b1b" />
              </linearGradient>
              <linearGradient id="redPinGloss" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0" />
              </linearGradient>
              <radialGradient id="redCenterBulb" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="85%" stop-color="#fef2f2" />
                <stop offset="100%" stop-color="#fee2e2" />
              </radialGradient>
            </defs>

            <!-- Outer Pin Teardrop Shape -->
            <path d="M22 1C10.9543 1 2 9.9543 2 21C2 34 19.5 50.8 21.05 52.3C21.58 52.8 22.42 52.8 22.95 52.3C24.5 50.8 42 34 42 21C42 9.9543 33.0457 1 22 1Z" 
                  fill="url(#redPinGrad)" 
                  stroke="#ffffff" 
                  stroke-width="2.5" 
                  stroke-linejoin="round"/>

            <!-- Top Gloss Highlight -->
            <path d="M22 2.5C12.3 2.5 4.5 10.3 4.5 20C4.5 24 6 27.5 8.5 30.5C11 20 18 10 28 6.5C26.1 3.9 24.2 2.5 22 2.5Z" fill="url(#redPinGloss)"/>

            <!-- Inner Circle Target Center -->
            <circle cx="22" cy="21" r="12" fill="url(#redCenterBulb)" stroke="#b91c1c" stroke-width="1.5"/>

            <!-- Precision Crosshair / Drop Location Icon -->
            <circle cx="22" cy="21" r="4.5" fill="#dc2626"/>
            <path d="M22 13.5V16.5M22 25.5V28.5M14.5 21H17.5M26.5 21H29.5" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>

        <!-- Ground Radar Pulse & Contact Shadow -->
        <div style="position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%); width: 18px; height: 6px; pointer-events: none;">
          <!-- Elliptical Contact Ground Shadow -->
          <div style="position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(153,27,27,0.5) 0%, rgba(153,27,27,0) 75%); border-radius: 9999px;"></div>
          <!-- Animated Radar Wave Ring -->
          <div class="contact-ripple-wave" style="position: absolute; inset: -3px; border: 2px solid #ef4444; border-radius: 9999px;"></div>
        </div>

      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -36],
  });
};

interface OpenStreetMapProps {
  center: [number, number]; // [lat, lng]
  zoom?: number;
  interactive?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  // Route visualization mode
  isRouteMode?: boolean;
  hubLocation?: [number, number];
  destinationLocation?: [number, number];
  riderLocation?: [number, number];
  riderName?: string;
  riderSpeed?: number;
  className?: string;
  showHubCoverage?: boolean;
}

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  center,
  zoom = 15,
  interactive = true,
  onLocationSelect,
  isRouteMode = false,
  hubLocation,
  destinationLocation,
  riderLocation,
  riderName = 'EV Courier',
  riderSpeed = 28,
  className = 'h-64 w-full rounded-2xl overflow-hidden',
  showHubCoverage = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const riderMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Positron Smooth White Map Tile Layer (Swiggy / Zomato / Blinkit style)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        subdomains: 'abcd',
        attribution: '',
      }).addTo(map);

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Mode 1: Single Pin Picker
    if (!isRouteMode) {
      if (markerRef.current) {
        markerRef.current.setLatLng(center);
      } else {
        const marker = L.marker(center, {
          draggable: interactive && Boolean(onLocationSelect),
          icon: createDestinationIcon('Drop Location', interactive && Boolean(onLocationSelect)),
        }).addTo(map);

        if (interactive && onLocationSelect) {
          marker.on('dragend', () => {
            const pos = marker.getLatLng();
            onLocationSelect(pos.lat, pos.lng);
          });
        }
        markerRef.current = marker;
      }

      // Coverage radius circle around Hub (e.g. 2.5km 12-min SLA zone)
      if (showHubCoverage) {
        L.circle(center, {
          color: '#059669',
          fillColor: '#10b981',
          fillOpacity: 0.12,
          radius: 2200,
          weight: 2,
          dashArray: '4, 8',
        }).addTo(map);
      }

      if (interactive && onLocationSelect) {
        map.off('click');
        map.on('click', (e: L.LeafletMouseEvent) => {
          markerRef.current?.setLatLng(e.latlng);
          onLocationSelect(e.latlng.lat, e.latlng.lng);
        });
      }

      map.setView(center, zoom);
    }

    // Cleanup on unmount
    return () => {
      // Keep map instance alive or handle clean recreation
    };
  }, []);

  // Update center when props change (in pinpicker mode)
  useEffect(() => {
    if (!isRouteMode && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(center, zoom, { duration: 0.8 });
      markerRef.current?.setLatLng(center);
    }
  }, [center, zoom, isRouteMode]);

  // Route & Live Courier Animation Mode
  useEffect(() => {
    if (!isRouteMode || !mapInstanceRef.current || !hubLocation || !destinationLocation) return;

    const map = mapInstanceRef.current;

    // Clear previous layers
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
    }

    // Construct realistic street delivery path with intermediate turning waypoints
    const start = hubLocation;
    const end = destinationLocation;
    
    // Generate curved/road-like polyline coordinates
    const mid1: [number, number] = [start[0] + (end[0] - start[0]) * 0.35 + 0.0012, start[1] + (end[1] - start[1]) * 0.25 - 0.0008];
    const mid2: [number, number] = [start[0] + (end[0] - start[0]) * 0.70 - 0.0006, start[1] + (end[1] - start[1]) * 0.65 + 0.0010];
    const pathCoordinates: [number, number][] = [start, mid1, mid2, end];

    // Background road glow
    L.polyline(pathCoordinates, {
      color: '#10b981',
      weight: 8,
      opacity: 0.3,
      lineCap: 'round',
    }).addTo(map);

    // Primary route polyline
    routePolylineRef.current = L.polyline(pathCoordinates, {
      color: '#047857',
      weight: 4,
      opacity: 0.9,
      dashArray: '6, 8',
      lineCap: 'round',
    }).addTo(map);

    // Local Hardware Store Partner Marker
    L.marker(hubLocation, { icon: createHubIcon() })
      .bindPopup('<strong style="font-size:12px;">Sri Lakshmi Hardware & Electricals</strong><br><span style="font-size:10px;color:#666;">Verified Local Store Partner (Koramangala)</span>')
      .addTo(map);

    // Destination Marker
    L.marker(destinationLocation, { icon: createDestinationIcon('Drop Location', false) })
      .bindPopup('<strong style="font-size:12px;">Customer Drop Location</strong><br><span style="font-size:10px;color:#666;">Doorstep / Gate Delivery Point</span>')
      .addTo(map);

    // Live Rider Marker
    const currentRiderPos = riderLocation || mid1;
    if (riderMarkerRef.current) {
      riderMarkerRef.current.setLatLng(currentRiderPos);
      riderMarkerRef.current.setIcon(createRiderIcon(riderSpeed));
    } else {
      riderMarkerRef.current = L.marker(currentRiderPos, { icon: createRiderIcon(riderSpeed) })
        .bindTooltip(`<strong>${riderName}</strong><br>⚡ Live Delivery Partner`, {
          permanent: true,
          direction: 'top',
          offset: [0, -22],
          className: 'bg-slate-900 text-white text-[11px] rounded-lg px-2 py-1 shadow-lg border-0',
        })
        .addTo(map);
    }

    // Auto-fit bounds with padding
    const bounds = L.latLngBounds([hubLocation, destinationLocation, currentRiderPos]);
    map.fitBounds(bounds, { padding: [40, 40] });

  }, [isRouteMode, hubLocation, destinationLocation, riderLocation, riderName, riderSpeed]);

  return (
    <div className={`relative ${className} border border-slate-200 shadow-inner bg-slate-100`}>
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      
      {/* Map Live GPS Status Badge */}
      <div className="absolute top-2.5 right-2.5 z-20 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 border border-slate-200/90 shadow-2xs flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Live Dispatch GPS</span>
      </div>
    </div>
  );
};
