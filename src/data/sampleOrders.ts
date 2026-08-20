import { Order } from '../types';
import { INITIAL_PRODUCTS } from './products';

export const DEFAULT_INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-89421',
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 2 },
      { product: INITIAL_PRODUCTS[1], quantity: 3 }
    ],
    subtotal: 505,
    deliveryFee: 0,
    urgencyFee: 0,
    tax: 91,
    total: 596,
    savingsVsLeavingSite: 1200,
    timeSavedMinutes: 45,
    status: 'delivered',
    placedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2), // 2 days ago
    estimatedDeliveryAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2 + 10 * 60 * 1000),
    jobSite: {
      address: '14th Main, 4th Block, Koramangala, Bengaluru',
      landmark: 'Opposite BDA Complex',
      floorUnit: 'Tower B, 4th Floor, Flat 402',
      gateCode: 'Gate #2',
      siteContactName: 'Rahul Sharma',
      sitePhone: '+91 98450 12891',
      jobTag: 'Flat 402 Delivery',
      coordinates: { lat: 12.9352, lng: 77.6245 }
    },
    paymentMethod: 'Instant UPI',
    clientInvoiceNeeded: true,
    deliveryOtp: '4821',
    customerBusinessName: 'Apex MEP Infrastructure Pvt Ltd',
    itcAmountClaimable: 91,
    darkStore: {
      name: 'Koramangala Dark Hub #4',
      code: 'BLR-KRM-04',
      distanceKm: 1.2,
      pickerName: 'Ramesh K.'
    },
    rider: {
      name: 'Manjunath V.',
      phone: '+91 98765 43210',
      vehicle: 'Ather 450X EV',
      rating: 4.9,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      currentLocation: { lat: 12.9352, lng: 77.6245, distanceMeters: 0 }
    }
  },
  {
    id: 'ORD-87102',
    items: [
      { product: INITIAL_PRODUCTS[2] || INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[3] || INITIAL_PRODUCTS[1], quantity: 2 }
    ],
    subtotal: 380,
    deliveryFee: 29,
    urgencyFee: 0,
    tax: 68,
    total: 477,
    savingsVsLeavingSite: 950,
    timeSavedMinutes: 30,
    status: 'delivered',
    placedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 5), // 5 days ago
    estimatedDeliveryAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 5 + 12 * 60 * 1000),
    jobSite: {
      address: '14th Main, 4th Block, Koramangala, Bengaluru',
      landmark: 'Opposite BDA Complex',
      floorUnit: 'Tower B, 4th Floor, Flat 402',
      gateCode: 'Gate #2',
      siteContactName: 'Rahul Sharma',
      sitePhone: '+91 98450 12891',
      jobTag: 'Flat 402 Delivery',
      coordinates: { lat: 12.9352, lng: 77.6245 }
    },
    paymentMethod: 'Corporate Card',
    clientInvoiceNeeded: false,
    deliveryOtp: '1934',
    darkStore: {
      name: 'HSR Layout Hub #2',
      code: 'BLR-HSR-02',
      distanceKm: 2.1,
      pickerName: 'Suresh M.'
    },
    rider: {
      name: 'Anil Kumar',
      phone: '+91 98123 45678',
      vehicle: 'TVS iQube EV',
      rating: 4.8,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      currentLocation: { lat: 12.9352, lng: 77.6245, distanceMeters: 0 }
    }
  }
];
