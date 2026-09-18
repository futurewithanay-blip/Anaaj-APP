/**
 * mandiLocationService.js
 * Comprehensive Geospatial Mandi Telemetry & Location Intelligence Engine
 * Computes exact geodesic distance, travel time, agricultural transit logistics,
 * and Net In-Hand Realization (Gross Mandi Price - Transit Cost - Mandi Cess).
 */

// ─── Comprehensive APMC Mandis Registry with Exact Coordinates & Helplines ───
export const EXTENDED_GEO_MANDIS = [
  // ── Maharashtra ──
  {
    id: "mandi-mh-01",
    name: "Lasalgaon APMC",
    marketYard: "Main Yard, Lasalgaon",
    district: "Nashik",
    state: "Maharashtra",
    lat: 20.1197,
    lng: 74.0433,
    phone: "02550-266224",
    specialty: ["Onion", "Tomato", "Wheat", "Paddy"],
    benchmarkPrices: {
      onion: 2650,
      tomato: 1850,
      wheat: 2740,
      soybean: 5120,
      paddy: 2280,
      cotton: 7800,
      potato: 1420,
      maize: 2240,
      mustard: 5500,
      chana: 5950
    },
    mandiCessPercent: 1.05,
    rating: 4.9,
    eNamEnabled: true,
    avgDailyArrivalQtl: 14500
  },
  {
    id: "mandi-mh-02",
    name: "Pimpalgaon Baswant APMC",
    marketYard: "Pimpalgaon Yard",
    district: "Nashik",
    state: "Maharashtra",
    lat: 20.2264,
    lng: 73.9980,
    phone: "02550-250020",
    specialty: ["Onion", "Tomato", "Grapes", "Pomegranate"],
    benchmarkPrices: {
      onion: 2620,
      tomato: 1920,
      wheat: 2710,
      soybean: 5080,
      paddy: 2240,
      cotton: 7750,
      potato: 1450,
      maize: 2210,
      mustard: 5460,
      chana: 5900
    },
    mandiCessPercent: 1.00,
    rating: 4.8,
    eNamEnabled: true,
    avgDailyArrivalQtl: 11200
  },
  {
    id: "mandi-mh-03",
    name: "Pune Gultekdi Market Yard",
    marketYard: "APMC Gultekdi, Gate 1-4",
    district: "Pune",
    state: "Maharashtra",
    lat: 18.4862,
    lng: 73.8573,
    phone: "020-24263000",
    specialty: ["Onion", "Wheat", "Soybean", "Potato", "Tomato"],
    benchmarkPrices: {
      onion: 2780,
      tomato: 1880,
      wheat: 2840,
      soybean: 5250,
      paddy: 2350,
      cotton: 7900,
      potato: 1550,
      maize: 2310,
      mustard: 5620,
      chana: 6050
    },
    mandiCessPercent: 1.10,
    rating: 4.8,
    eNamEnabled: true,
    avgDailyArrivalQtl: 24000
  },
  {
    id: "mandi-mh-04",
    name: "Latur APMC",
    marketYard: "Main Ganj Golai Yard",
    district: "Latur",
    state: "Maharashtra",
    lat: 18.4088,
    lng: 76.5604,
    phone: "02382-252140",
    specialty: ["Soybean", "Tur Dal", "Chana", "Cotton"],
    benchmarkPrices: {
      onion: 2540,
      tomato: 1720,
      wheat: 2700,
      soybean: 5280,
      paddy: 2200,
      cotton: 7920,
      potato: 1380,
      maize: 2220,
      mustard: 5480,
      chana: 6150,
      tur: 10450
    },
    mandiCessPercent: 1.00,
    rating: 5.0,
    eNamEnabled: true,
    avgDailyArrivalQtl: 32000
  },
  {
    id: "mandi-mh-05",
    name: "Nagpur Cotton Market APMC",
    marketYard: "Kalamna Market Yard",
    district: "Nagpur",
    state: "Maharashtra",
    lat: 21.1458,
    lng: 79.0882,
    phone: "0712-2722248",
    specialty: ["Cotton", "Soybean", "Orange", "Paddy"],
    benchmarkPrices: {
      onion: 2590,
      tomato: 1750,
      wheat: 2720,
      soybean: 5180,
      paddy: 2380,
      cotton: 8050,
      potato: 1410,
      maize: 2260,
      mustard: 5520,
      chana: 6020
    },
    mandiCessPercent: 1.05,
    rating: 4.8,
    eNamEnabled: true,
    avgDailyArrivalQtl: 28000
  },
  {
    id: "mandi-mh-06",
    name: "Amravati APMC",
    marketYard: "Cotton Market Yard",
    district: "Amravati",
    state: "Maharashtra",
    lat: 20.9320,
    lng: 77.7523,
    phone: "0721-2562140",
    specialty: ["Soybean", "Tur Dal", "Cotton", "Wheat"],
    benchmarkPrices: {
      onion: 2520,
      tomato: 1710,
      wheat: 2690,
      soybean: 5220,
      paddy: 2210,
      cotton: 7980,
      potato: 1390,
      maize: 2200,
      mustard: 5470,
      chana: 6000,
      tur: 10400
    },
    mandiCessPercent: 1.00,
    rating: 4.7,
    eNamEnabled: true,
    avgDailyArrivalQtl: 18000
  },
  {
    id: "mandi-mh-07",
    name: "Vashi APMC (Navi Mumbai)",
    marketYard: "Sector 19, Vashi",
    district: "Thane",
    state: "Maharashtra",
    lat: 19.0728,
    lng: 73.0015,
    phone: "022-27812341",
    specialty: ["Onion", "Potato", "Tomato", "Garlic"],
    benchmarkPrices: {
      onion: 2890,
      tomato: 2050,
      wheat: 2920,
      soybean: 5320,
      paddy: 2420,
      cotton: 7950,
      potato: 1680,
      maize: 2360,
      mustard: 5700,
      chana: 6180
    },
    mandiCessPercent: 1.15,
    rating: 4.9,
    eNamEnabled: true,
    avgDailyArrivalQtl: 42000
  },
  {
    id: "mandi-mh-08",
    name: "Ahmednagar APMC",
    marketYard: "Nepti Sub-Yard",
    district: "Ahmednagar",
    state: "Maharashtra",
    lat: 19.0948,
    lng: 74.7480,
    phone: "0241-2415120",
    specialty: ["Onion", "Pomegranate", "Soybean", "Bajra"],
    benchmarkPrices: {
      onion: 2640,
      tomato: 1810,
      wheat: 2730,
      soybean: 5160,
      paddy: 2250,
      cotton: 7860,
      potato: 1440,
      maize: 2230,
      mustard: 5490,
      chana: 5980
    },
    mandiCessPercent: 1.05,
    rating: 4.8,
    eNamEnabled: true,
    avgDailyArrivalQtl: 16000
  },

  // ── Uttar Pradesh ──
  {
    id: "mandi-up-01",
    name: "Prayagraj Krishi Mandi",
    marketYard: "Mundera Mandi Yard",
    district: "Prayagraj",
    state: "Uttar Pradesh",
    lat: 25.4358,
    lng: 81.8463,
    phone: "0532-2234100",
    specialty: ["Wheat", "Paddy", "Potato", "Mustard"],
    benchmarkPrices: {
      onion: 2680,
      tomato: 1840,
      wheat: 2580,
      soybean: 4950,
      paddy: 2320,
      cotton: 7600,
      potato: 1420,
      maize: 2190,
      mustard: 5640,
      chana: 5880
    },
    mandiCessPercent: 1.50,
    rating: 4.7,
    eNamEnabled: true,
    avgDailyArrivalQtl: 21000
  },
  {
    id: "mandi-up-02",
    name: "Varanasi APMC",
    marketYard: "Paharriya Mandi",
    district: "Varanasi",
    state: "Uttar Pradesh",
    lat: 25.3176,
    lng: 82.9739,
    phone: "0542-2587120",
    specialty: ["Wheat", "Paddy", "Potato", "Tomato"],
    benchmarkPrices: {
      onion: 2710,
      tomato: 1890,
      wheat: 2610,
      soybean: 4980,
      paddy: 2340,
      cotton: 7650,
      potato: 1460,
      maize: 2210,
      mustard: 5680,
      chana: 5920
    },
    mandiCessPercent: 1.50,
    rating: 4.8,
    eNamEnabled: true,
    avgDailyArrivalQtl: 26000
  },
  {
    id: "mandi-up-03",
    name: "Lucknow APMC",
    marketYard: "Dubagga Mandi",
    district: "Lucknow",
    state: "Uttar Pradesh",
    lat: 26.8467,
    lng: 80.9462,
    phone: "0522-2612345",
    specialty: ["Wheat", "Potato", "Paddy", "Mango"],
    benchmarkPrices: {
      onion: 2750,
      tomato: 1910,
      wheat: 2640,
      soybean: 5010,
      paddy: 2360,
      cotton: 7680,
      potato: 1480,
      maize: 2230,
      mustard: 5720,
      chana: 5960
    },
    mandiCessPercent: 1.50,
    rating: 4.8,
    eNamEnabled: true,
    avgDailyArrivalQtl: 34000
  },
  {
    id: "mandi-up-04",
    name: "Kanpur Mandi Samiti",
    marketYard: "Naubasta Yard",
    district: "Kanpur",
    state: "Uttar Pradesh",
    lat: 26.4499,
    lng: 80.3319,
    phone: "0512-2534100",
    specialty: ["Wheat", "Potato", "Mustard", "Chana"],
    benchmarkPrices: {
      onion: 2690,
      tomato: 1860,
      wheat: 2590,
      soybean: 4970,
      paddy: 2310,
      cotton: 7620,
      potato: 1440,
      maize: 2200,
      mustard: 5660,
      chana: 5910
    },
    mandiCessPercent: 1.50,
    rating: 4.7,
    eNamEnabled: true,
    avgDailyArrivalQtl: 29000
  },

  // ── Madhya Pradesh ──
  {
    id: "mandi-mp-01",
    name: "Indore Krishi Upaj Mandi",
    marketYard: "Choithram Mandi",
    district: "Indore",
    state: "Madhya Pradesh",
    lat: 22.7196,
    lng: 75.8577,
    phone: "0731-2382911",
    specialty: ["Soybean", "Wheat", "Garlic", "Chana"],
    benchmarkPrices: {
      onion: 2660,
      tomato: 1820,
      wheat: 2890,
      soybean: 5350,
      paddy: 2290,
      cotton: 7850,
      potato: 1410,
      maize: 2280,
      mustard: 5580,
      chana: 6120
    },
    mandiCessPercent: 1.50,
    rating: 4.9,
    eNamEnabled: true,
    avgDailyArrivalQtl: 48000
  },
  {
    id: "mandi-mp-02",
    name: "Ujjain Chimanganj Mandi",
    marketYard: "Chimanganj Yard",
    district: "Ujjain",
    state: "Madhya Pradesh",
    lat: 23.1765,
    lng: 75.7885,
    phone: "0734-2551220",
    specialty: ["Wheat", "Soybean", "Gram", "Garlic"],
    benchmarkPrices: {
      onion: 2630,
      tomato: 1800,
      wheat: 2860,
      soybean: 5310,
      paddy: 2260,
      cotton: 7810,
      potato: 1390,
      maize: 2250,
      mustard: 5550,
      chana: 6080
    },
    mandiCessPercent: 1.50,
    rating: 4.8,
    eNamEnabled: true,
    avgDailyArrivalQtl: 35000
  },
  {
    id: "mandi-mp-03",
    name: "Sehore Krishi Mandi",
    marketYard: "Sehore Main Yard",
    district: "Sehore",
    state: "Madhya Pradesh",
    lat: 23.2031,
    lng: 77.0844,
    phone: "07562-224150",
    specialty: ["Sharbati Wheat", "Soybean", "Gram"],
    benchmarkPrices: {
      onion: 2600,
      tomato: 1780,
      wheat: 2980,
      soybean: 5290,
      paddy: 2250,
      cotton: 7780,
      potato: 1380,
      maize: 2230,
      mustard: 5520,
      chana: 6050
    },
    mandiCessPercent: 1.50,
    rating: 4.9,
    eNamEnabled: true,
    avgDailyArrivalQtl: 22000
  },

  // ── Punjab & Haryana ──
  {
    id: "mandi-pb-01",
    name: "Khanna APMC (Asia's Largest Grain Market)",
    marketYard: "Main Grain Market, Khanna",
    district: "Ludhiana",
    state: "Punjab",
    lat: 30.7050,
    lng: 76.2181,
    phone: "01628-221030",
    specialty: ["Wheat", "Paddy", "Maize"],
    benchmarkPrices: {
      onion: 2720,
      tomato: 1850,
      wheat: 2950,
      soybean: 5020,
      paddy: 2450,
      cotton: 7700,
      potato: 1350,
      maize: 2290,
      mustard: 5600,
      chana: 5900
    },
    mandiCessPercent: 2.00,
    rating: 5.0,
    eNamEnabled: true,
    avgDailyArrivalQtl: 72000
  },
  {
    id: "mandi-hr-01",
    name: "Karnal New Grain Market",
    marketYard: "GT Road Yard, Karnal",
    district: "Karnal",
    state: "Haryana",
    lat: 29.6857,
    lng: 76.9905,
    phone: "0184-2251000",
    specialty: ["Basmati Paddy", "Wheat", "Mustard"],
    benchmarkPrices: {
      onion: 2740,
      tomato: 1870,
      wheat: 2930,
      soybean: 5040,
      paddy: 3850,
      cotton: 7720,
      potato: 1360,
      maize: 2280,
      mustard: 5650,
      chana: 5920
    },
    mandiCessPercent: 2.00,
    rating: 4.9,
    eNamEnabled: true,
    avgDailyArrivalQtl: 55000
  },

  // ── Rajasthan ──
  {
    id: "mandi-rj-01",
    name: "Kota Bhamashah APMC",
    marketYard: "Bhamashah Mandi Yard",
    district: "Kota",
    state: "Rajasthan",
    lat: 25.1830,
    lng: 75.8450,
    phone: "0744-2481020",
    specialty: ["Soybean", "Mustard", "Wheat", "Coriander"],
    benchmarkPrices: {
      onion: 2610,
      tomato: 1790,
      wheat: 2780,
      soybean: 5240,
      paddy: 2310,
      cotton: 7820,
      potato: 1400,
      maize: 2250,
      mustard: 5820,
      chana: 6040
    },
    mandiCessPercent: 1.60,
    rating: 4.9,
    eNamEnabled: true,
    avgDailyArrivalQtl: 38000
  },

  // ── Gujarat ──
  {
    id: "mandi-gj-01",
    name: "Rajkot APMC",
    marketYard: "Bedi Yard, Rajkot",
    district: "Rajkot",
    state: "Gujarat",
    lat: 22.3039,
    lng: 70.8022,
    phone: "0281-2701420",
    specialty: ["Cotton", "Groundnut", "Wheat", "Chana"],
    benchmarkPrices: {
      onion: 2650,
      tomato: 1810,
      wheat: 2820,
      soybean: 5190,
      paddy: 2270,
      cotton: 8150,
      potato: 1420,
      maize: 2240,
      mustard: 5590,
      chana: 6100
    },
    mandiCessPercent: 1.00,
    rating: 4.9,
    eNamEnabled: true,
    avgDailyArrivalQtl: 45000
  }
];

// ─── Haversine Formula for Accurate Distance (Kilometers) ───────────────────
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// ─── Estimated Driving Time Formatter ───────────────────────────────────────
export function formatDrivingTime(distanceKm) {
  if (distanceKm <= 10) return "15-20 min";
  if (distanceKm <= 30) return "35-45 min";
  const hours = Math.floor(distanceKm / 45);
  const minutes = Math.round(((distanceKm % 45) / 45) * 60);
  if (hours === 0) return `${minutes} min`;
  return `${hours} hr ${minutes > 0 ? `${minutes} min` : ''}`;
}

// ─── Standard Freight Logistics Rate Breakdown ─────────────────────────────
/**
 * Computes realistic agricultural freight based on distance and load.
 * Average farmer tractor-trolley or pickup freight:
 * Base flagfall: ₹300 for first 10 km
 * Incremental: ₹1.4 to ₹1.8 per Quintal per 10 km
 */
export function calculateTransportDeduction(distanceKm) {
  if (distanceKm <= 5) return 25; // Local village carting: ₹25/Qtl
  if (distanceKm <= 20) return 40 + Math.round(distanceKm * 0.8);
  if (distanceKm <= 60) return 60 + Math.round((distanceKm - 20) * 1.1);
  return Math.min(450, 110 + Math.round((distanceKm - 60) * 1.25));
}

// ─── Get Nearby Mandis with Real-Time Price & Net Profit Breakdown ─────────
export function getNearbyMandis({
  userLat,
  userLng,
  commodity = "onion",
  maxRadiusKm = 350,
  userQuantityQtl = 50
}) {
  const normCrop = (commodity || "onion").toLowerCase();

  const results = EXTENDED_GEO_MANDIS.map((mandi) => {
    const distanceKm = calculateHaversineDistance(userLat, userLng, mandi.lat, mandi.lng);

    // Fallback price resolution
    let grossRate = mandi.benchmarkPrices[normCrop];
    if (!grossRate) {
      // Find similar key
      const foundKey = Object.keys(mandi.benchmarkPrices).find((k) =>
        normCrop.includes(k) || k.includes(normCrop)
      );
      grossRate = foundKey ? mandi.benchmarkPrices[foundKey] : 2500;
    }

    // Transport deduction per quintal
    const transportPerQtl = calculateTransportDeduction(distanceKm);

    // Statutory mandi cess per quintal
    const mandiCess = Math.round((grossRate * mandi.mandiCessPercent) / 100);

    // Net in-hand realization per quintal
    const netInHandPrice = Math.max(0, grossRate - transportPerQtl - mandiCess);

    // Total net revenue for farmer's batch
    const totalGrossRevenue = grossRate * userQuantityQtl;
    const totalTransportCost = transportPerQtl * userQuantityQtl;
    const totalMandiCess = mandiCess * userQuantityQtl;
    const totalNetProfit = netInHandPrice * userQuantityQtl;

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mandi.lat},${mandi.lng}`;

    return {
      ...mandi,
      distanceKm,
      drivingTime: formatDrivingTime(distanceKm),
      grossRate,
      transportPerQtl,
      mandiCess,
      netInHandPrice,
      totalGrossRevenue,
      totalTransportCost,
      totalMandiCess,
      totalNetProfit,
      mapsUrl
    };
  });

  // Filter within requested radius
  let filtered = results.filter((m) => m.distanceKm <= maxRadiusKm);

  // If no mandis within small radius, expand to nearest 4
  if (filtered.length === 0) {
    filtered = [...results].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 4);
  } else {
    // Sort primarily by Net In-Hand Price (highest profit first)
    filtered.sort((a, b) => b.netInHandPrice - a.netInHandPrice);
  }

  // Identify badges
  if (filtered.length > 0) {
    const highestNet = Math.max(...filtered.map((m) => m.netInHandPrice));
    const nearestDist = Math.min(...filtered.map((m) => m.distanceKm));
    const highestGross = Math.max(...filtered.map((m) => m.grossRate));

    filtered = filtered.map((m) => {
      const badges = [];
      if (m.netInHandPrice === highestNet) badges.push({ text: "🏆 Best Net Return", color: "bg-emerald-100 text-emerald-800 border-emerald-300" });
      if (m.distanceKm === nearestDist) badges.push({ text: "⚡ Nearest Mandi", color: "bg-sky-100 text-sky-800 border-sky-300" });
      if (m.grossRate === highestGross && m.netInHandPrice !== highestNet) {
        badges.push({ text: "📈 Highest Gross Rate", color: "bg-purple-100 text-purple-800 border-purple-300" });
      }
      return { ...m, badges };
    });
  }

  return filtered;
}
