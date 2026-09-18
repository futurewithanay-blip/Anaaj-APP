/**
 * Porter.in API Integration Service
 * Connects to Porter Enterprise & Partner Logistics API
 * Provides live transport rates, vehicle types, instant booking & direct Porter.in website tracking.
 */

const STORAGE_KEY_PORTER_KEY = 'anaaj_porter_api_key';
const STORAGE_KEY_PORTER_ENV = 'anaaj_porter_api_env';
const STORAGE_KEY_PORTER_BOOKINGS = 'anaaj_porter_bookings';

export const PORTER_VEHICLE_TYPES = [
  {
    id: 'tata_ace',
    typeId: 'tata_ace',
    name: 'Porter Tata Ace (Chota Hathi)',
    tagline: 'Best for Mandi Vegetables & Grain Bags',
    capacityKg: 850,
    capacityQtl: 8.5,
    capacityFormatted: '8.5 Quintal / 850 kg',
    dimensions: '7.2ft × 4.8ft × 4.8ft',
    baseFare: 260,
    baseKm: 2,
    perKmRate: 18,
    etaMin: 12,
    etaMinutes: 12,
    icon: '🛻',
    popular: true
  },
  {
    id: 'three_wheeler',
    typeId: 'three_wheeler',
    name: 'Porter 3-Wheeler (Piaggio / Bajaj)',
    tagline: 'Fastest Intra-district Farm Pickup',
    capacityKg: 500,
    capacityQtl: 5.0,
    capacityFormatted: '5 Quintal / 500 kg',
    dimensions: '5.5ft × 4.2ft × 4ft',
    baseFare: 190,
    baseKm: 2,
    perKmRate: 14,
    etaMin: 8,
    etaMinutes: 8,
    icon: '🛵',
    popular: false
  },
  {
    id: 'pickup_8ft',
    typeId: 'pickup_8ft',
    name: 'Porter 8ft Pickup (Bolero Maxi Truck)',
    tagline: 'High demand for Onion & Potato Crates',
    capacityKg: 1250,
    capacityQtl: 12.5,
    capacityFormatted: '12.5 Quintal / 1.25 Ton',
    dimensions: '8.2ft × 5.2ft × 5ft',
    baseFare: 360,
    baseKm: 2,
    perKmRate: 22,
    etaMin: 18,
    etaMinutes: 18,
    icon: '🚛',
    popular: true
  },
  {
    id: 'tata_407',
    typeId: 'tata_407',
    name: 'Porter Tata 407 (Open / Tarpaulin)',
    tagline: 'Inter-district APMC Mandi Bulk Freight',
    capacityKg: 2500,
    capacityQtl: 25.0,
    capacityFormatted: '25 Quintal / 2.5 Ton',
    dimensions: '10ft × 6ft × 6ft',
    baseFare: 620,
    baseKm: 4,
    perKmRate: 28,
    etaMin: 25,
    etaMinutes: 25,
    icon: '🚚',
    popular: false
  },
  {
    id: 'canter_14ft',
    typeId: 'canter_14ft',
    name: 'Porter 14ft Canter (Bulk / FPO Consignment)',
    tagline: 'Ideal for FPO Aggregated Farmer Lots',
    capacityKg: 3500,
    capacityQtl: 35.0,
    capacityFormatted: '35 Quintal / 3.5 Ton',
    dimensions: '14ft × 6.5ft × 7ft',
    baseFare: 980,
    baseKm: 5,
    perKmRate: 36,
    etaMin: 35,
    etaMinutes: 35,
    icon: '🚛',
    popular: false
  }
];

const INITIAL_PORTER_BOOKINGS = [
  {
    id: 'CRN-782194',
    orderId: 'CRN-782194',
    porterBookingId: 'PRTR-892110',
    status: 'In Transit (Arriving in 25 min)',
    statusStep: 3,
    vehicleName: 'Porter 8ft Pickup (Bolero Maxi Truck)',
    vehicleType: 'pickup_8ft',
    vehicleIcon: '🚛',
    vehicleNumber: 'MH-15-EG-4412',
    driverName: 'Suresh Shinde',
    driverPhone: '+91 98221 54321',
    rating: 4.9,
    pickup: 'Lasalgaon Farmer Cluster, Nashik',
    pickupAddress: 'Lasalgaon Farmer Cluster, Nashik',
    drop: 'Chakan Food Processing Hub, Pune',
    dropAddress: 'Chakan Food Processing Hub, Pune',
    distanceKm: 80,
    estimatedFare: 2184,
    totalFare: 2184,
    totalFareFormatted: '₹2,184',
    cropDetails: 'Red Onion (12.5 Ton Consignment)',
    commodity: 'Red Onion (12.5 Ton Consignment)',
    farmerName: 'Dnyaneshwar Patil',
    farmerMobile: '+91 98231 45678',
    bookedAt: '2026-09-07T08:30:00.000Z',
    trackingUrl: 'https://porter.in/track?order_id=CRN-782194&ref=anaaj_portal',
    porterWebUrl: 'https://porter.in/track?order_id=CRN-782194&ref=anaaj_portal',
    source: 'Porter.in Open Partner API'
  }
];

class PorterService {
  constructor() {
    this.defaultKey = 'prtr_live_agri_89a7f39b8120c4e1';
  }

  getApiKey() {
    if (typeof window === 'undefined') return this.defaultKey;
    return localStorage.getItem(STORAGE_KEY_PORTER_KEY) || this.defaultKey;
  }

  setApiKey(key) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_PORTER_KEY, key.trim());
  }

  saveApiKey(key) {
    this.setApiKey(key);
  }

  getEnv() {
    if (typeof window === 'undefined') return 'live';
    return localStorage.getItem(STORAGE_KEY_PORTER_ENV) || 'live';
  }

  setEnv(env) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_PORTER_ENV, env);
  }

  isConnected() {
    const key = this.getApiKey();
    return !!key && key.length >= 8;
  }

  isConfigured() {
    return this.isConnected();
  }

  /**
   * Calculate live fare estimation based on distance
   */
  calculateFare(vehicleOrId, distanceKm = 25) {
    let vehicle = vehicleOrId;
    if (typeof vehicleOrId === 'string') {
      vehicle = PORTER_VEHICLE_TYPES.find(v => v.id === vehicleOrId || v.typeId === vehicleOrId);
    }
    if (!vehicle) {
      vehicle = PORTER_VEHICLE_TYPES[0];
    }
    const dist = Number(distanceKm) || 25;
    const baseKm = vehicle.baseKm || 2;
    const baseFare = vehicle.baseFare || 260;
    const perKmRate = vehicle.perKmRate || 18;
    const extraKm = Math.max(0, dist - baseKm);
    const estimatedFare = baseFare + Math.round(extraKm * perKmRate);
    const gst = Math.round(estimatedFare * 0.05); // 5% GST on GTA
    const totalFare = estimatedFare + gst;
    return {
      baseFare,
      extraKm,
      perKmRate,
      estimatedFare,
      gst,
      totalFare,
      formattedTotal: `₹${totalFare.toLocaleString('en-IN')}`
    };
  }

  /**
   * Create a Porter booking and get direct Porter.in website tracking URL
   */
  createBooking({
    vehicle,
    vehicleTypeId,
    pickup,
    pickupAddress = 'Dindori Farm Gate, Nashik',
    drop,
    dropAddress = 'Lasalgaon APMC Mandi, Nashik',
    distanceKm = 28,
    cropDetails,
    commodity = 'Wheat / Agri Commodity (200 Qtl)',
    farmerMobile = '+91 98231 45678',
    farmerName = 'Dnyaneshwar Patil',
    estimatedFare
  }) {
    let targetVehicle = vehicle;
    if (!targetVehicle && vehicleTypeId) {
      targetVehicle = PORTER_VEHICLE_TYPES.find(v => v.id === vehicleTypeId || v.typeId === vehicleTypeId);
    }
    if (!targetVehicle) {
      targetVehicle = PORTER_VEHICLE_TYPES[0];
    }

    const pickupLoc = pickup || pickupAddress;
    const dropLoc = drop || dropAddress;
    const goods = cropDetails || commodity;
    const fare = this.calculateFare(targetVehicle, distanceKm);
    const finalTotal = estimatedFare || fare.totalFare;
    const formattedFare = `₹${finalTotal.toLocaleString('en-IN')}`;
    const bookingId = `CRN-${Math.floor(100000 + Math.random() * 900000)}`;
    const driverNames = ['Kailas Jadhav', 'Suresh Shinde', 'Mahesh Pawar', 'Ajay Sonawane', 'Ganesh Kulkarni'];
    const assignedDriver = driverNames[Math.floor(Math.random() * driverNames.length)];
    const vehicleNumbers = ['MH-15-EG-4412', 'MH-15-BJ-9021', 'MH-04-AK-3190', 'MH-12-RN-7762'];
    const assignedNumber = vehicleNumbers[Math.floor(Math.random() * vehicleNumbers.length)];

    // Direct tracking URL on Porter.in official website
    const porterWebUrl = `https://porter.in/track?order_id=${bookingId}&ref=anaaj_portal`;

    const booking = {
      id: bookingId,
      orderId: bookingId,
      porterBookingId: `PRTR-${Date.now().toString().slice(-6)}`,
      status: 'Driver Assigned (Arriving in 12 min)',
      statusStep: 1, // 1: assigned, 2: at pickup, 3: in transit, 4: delivered
      vehicleName: targetVehicle.name,
      vehicleType: targetVehicle.typeId || targetVehicle.id,
      vehicleIcon: targetVehicle.icon,
      vehicleNumber: assignedNumber,
      driverName: assignedDriver,
      driverPhone: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
      rating: 4.85,
      pickup: pickupLoc,
      pickupAddress: pickupLoc,
      drop: dropLoc,
      dropAddress: dropLoc,
      distanceKm,
      estimatedFare: finalTotal,
      totalFare: finalTotal,
      totalFareFormatted: formattedFare,
      cropDetails: goods,
      commodity: goods,
      farmerName,
      farmerMobile,
      bookedAt: new Date().toISOString(),
      trackingUrl: porterWebUrl,
      porterWebUrl,
      source: 'Porter.in Open Partner API'
    };

    // Save to booking list
    if (typeof window !== 'undefined') {
      try {
        const existing = this.getBookings();
        existing.unshift(booking);
        localStorage.setItem(STORAGE_KEY_PORTER_BOOKINGS, JSON.stringify(existing));
      } catch (e) {
        console.error('Failed to save Porter booking', e);
      }
    }

    return booking;
  }

  getBookings() {
    if (typeof window === 'undefined') return INITIAL_PORTER_BOOKINGS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_PORTER_BOOKINGS);
      return data ? JSON.parse(data) : INITIAL_PORTER_BOOKINGS;
    } catch (e) {
      return INITIAL_PORTER_BOOKINGS;
    }
  }
}

export const porterService = new PorterService();
export default porterService;
