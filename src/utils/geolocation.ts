/**
 * Hyperlocal Reverse Geocoding & Geolocation Helper
 * Resolves high-precision GPS coordinates into clean, realistic doorstep addresses.
 */

export interface GeocodedAddress {
  formattedAddress: string;
  road: string;
  suburb: string;
  city: string;
  state: string;
  postcode: string;
  landmark: string;
  lat: number;
  lng: number;
}

export async function reverseGeocodeCoordinates(lat: number, lng: number): Promise<GeocodedAddress> {
  // Tier 1: OpenStreetMap Nominatim API with detailed address breakdown
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=en`;
    const response = await fetch(nominatimUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};

      const houseNumber = addr.house_number || addr.building || '';
      const road = addr.road || addr.street || addr.neighbourhood || addr.suburb || '';
      const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.district || '';
      const city = addr.city || addr.town || addr.village || addr.state_district || addr.county || 'Local Area';
      const state = addr.state || '';
      const postcode = addr.postcode || '';
      const landmark = addr.amenity || addr.building || addr.shop || addr.leisure || 'Near GPS Pin';

      const parts: string[] = [];
      if (houseNumber && road) parts.push(`${houseNumber}, ${road}`);
      else if (road) parts.push(road);
      else if (suburb) parts.push(suburb);

      if (suburb && !parts.includes(suburb)) parts.push(suburb);
      if (city) parts.push(city);
      if (postcode) parts.push(postcode);

      const formattedAddress = parts.length > 0
        ? parts.join(', ')
        : data.display_name?.split(',').slice(0, 3).join(', ') || `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

      return {
        formattedAddress,
        road: road || suburb || 'Local Road',
        suburb: suburb || city,
        city: city || 'Bengaluru',
        state: state || 'Karnataka',
        postcode: postcode || '',
        landmark: landmark || 'Near GPS Pin',
        lat,
        lng,
      };
    }
  } catch (err) {
    console.warn('Nominatim reverse geocode attempt failed, trying fallback...', err);
  }

  // Tier 2: BigDataCloud Reverse Geocoding API (Fast, CORS friendly, free tier)
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const response = await fetch(bdcUrl);
    if (response.ok) {
      const data = await response.json();
      const locality = data.locality || data.localityInfo?.administrative?.[3]?.name || '';
      const city = data.city || data.principalSubdivision || 'Local Area';
      const postcode = data.postcode || '';
      const state = data.principalSubdivision || '';

      const parts: string[] = [];
      if (locality) parts.push(locality);
      if (city && city !== locality) parts.push(city);
      if (postcode) parts.push(postcode);

      const formattedAddress = parts.length > 0
        ? parts.join(', ')
        : `Doorstep Pin, ${city} ${postcode}`.trim();

      return {
        formattedAddress,
        road: locality || 'Main Road',
        suburb: locality || city,
        city: city || 'Bengaluru',
        state: state || '',
        postcode: postcode || '',
        landmark: 'Near GPS Location',
        lat,
        lng,
      };
    }
  } catch (err) {
    console.warn('BigDataCloud reverse geocode failed, using coordinate fallback', err);
  }

  // Tier 3: Coordinate Fallback
  return {
    formattedAddress: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    road: 'Doorstep Location',
    suburb: 'Local Area',
    city: 'Local Area',
    state: '',
    postcode: '',
    landmark: 'GPS Pin Point',
    lat,
    lng,
  };
}
