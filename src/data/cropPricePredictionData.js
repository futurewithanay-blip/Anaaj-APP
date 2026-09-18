// Historical 12 months + Future 3 months time-series price data and advisory metadata
// Reflects authentic Indian APMC seasonal arrivals, post-harvest dips, off-season lean peaks, and mandi pricing.

export const HISTORICAL_PREDICTIVE_CROPS = [
  {
    id: "wheat",
    name: "Wheat (गहू / गेहूं - Sharbati & Lokwan)",
    category: "Cereals",
    msp: 2425,
    currentAvgPrice: 2720,
    unit: "₹/Quintal",
    defaultMandi: "Khanna APMC",
    storageCostPerQtlMonth: 22,
    holdingAdvisory: {
      recommendation: "WAIT_HOLD", // "SELL_NOW" | "WAIT_HOLD" | "SELL_LATER"
      actionText: "Hold & Sell Later",
      actionColor: "emerald",
      peakPrice: 2980,
      peakPeriod: "Late November (Post-Diwali / Pre-Sowing season)",
      expectedChangePercent: "+9.6%",
      direction: "up",
      summary: "Flour mills are aggressively restocking before winter. Holding for 2 months yields significantly higher returns even after warehouse & interest charges."
    },
    mandis: [
      { name: "Khanna APMC (Asia's Largest)", district: "Ludhiana", state: "Punjab", baseOffset: 230, distanceKm: 850, transportPerQtl: 140 },
      { name: "Indore Krishi Mandi", district: "Indore", state: "Madhya Pradesh", baseOffset: 140, distanceKm: 310, transportPerQtl: 85 },
      { name: "Nashik APMC", district: "Nashik", state: "Maharashtra", baseOffset: 20, distanceKm: 22, transportPerQtl: 40 },
      { name: "Kota Mandi Yard", district: "Kota", state: "Rajasthan", baseOffset: 95, distanceKm: 580, transportPerQtl: 110 }
    ],
    // 12 months past historical + 3 months prediction (15 points total)
    timelineData: [
      { month: "Sep 2025", historicalPrice: 2380, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Off-season inventory" },
      { month: "Oct 2025", historicalPrice: 2420, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Pre-Rabi demand" },
      { month: "Nov 2025", historicalPrice: 2490, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Festival mill buying" },
      { month: "Dec 2025", historicalPrice: 2540, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Peak lean supply" },
      { month: "Jan 2026", historicalPrice: 2580, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Winter demand" },
      { month: "Feb 2026", historicalPrice: 2510, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Pre-harvest liquidation" },
      { month: "Mar 2026", historicalPrice: 2390, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "New crop arrivals start" },
      { month: "Apr 2026", historicalPrice: 2340, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Peak harvest arrivals dip" },
      { month: "May 2026", historicalPrice: 2430, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Govt procurement pace" },
      { month: "Jun 2026", historicalPrice: 2520, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Monsoon onset" },
      { month: "Jul 2026", historicalPrice: 2610, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Storage stock flow" },
      { month: "Aug 2026", historicalPrice: 2680, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Tight spot supplies" },
      { month: "Sep 2026 (Now)", historicalPrice: 2720, predictedPrice: 2720, confidenceMin: 2670, confidenceMax: 2770, isPrediction: false, isCurrent: true, note: "Current spot rate" },
      { month: "Oct 2026", historicalPrice: null, predictedPrice: 2840, confidenceMin: 2760, confidenceMax: 2920, isPrediction: true, note: "Festive milling demand" },
      { month: "Nov 2026", historicalPrice: null, predictedPrice: 2980, confidenceMin: 2880, confidenceMax: 3080, isPrediction: true, note: "Predicted Seasonal Peak 🎯" },
      { month: "Dec 2026", historicalPrice: null, predictedPrice: 2910, confidenceMin: 2790, confidenceMax: 3030, isPrediction: true, note: "Sowing completion" }
    ]
  },
  {
    id: "onion",
    name: "Onion (कांदा / प्याज - Red & Gavran)",
    category: "Vegetables",
    msp: 1800,
    currentAvgPrice: 2450,
    unit: "₹/Quintal",
    defaultMandi: "Lasalgaon APMC",
    storageCostPerQtlMonth: 38, // higher storage/loss risk
    holdingAdvisory: {
      recommendation: "SELL_NOW",
      actionText: "Sell Immediately (Current Window)",
      actionColor: "rose",
      peakPrice: 2540,
      peakPeriod: "Next 7–10 Days (Before fresh Kharif harvest)",
      expectedChangePercent: "-14.2%",
      direction: "down",
      summary: "South Indian & MP Kharif arrivals will flood terminal mandis by early-mid October. Prices will face downward pressure; holding incurs high spoilage and price drop."
    },
    mandis: [
      { name: "Lasalgaon APMC", district: "Nashik", state: "Maharashtra", baseOffset: 130, distanceKm: 18, transportPerQtl: 35 },
      { name: "Pimpalgaon APMC", district: "Nashik", state: "Maharashtra", baseOffset: 170, distanceKm: 32, transportPerQtl: 45 },
      { name: "Pune Gultekdi Market", district: "Pune", state: "Maharashtra", baseOffset: 300, distanceKm: 165, transportPerQtl: 85 },
      { name: "Azadpur Mandi", district: "Delhi", state: "Delhi", baseOffset: 500, distanceKm: 1150, transportPerQtl: 180 }
    ],
    timelineData: [
      { month: "Sep 2025", historicalPrice: 2280, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Buffer stock sales" },
      { month: "Oct 2025", historicalPrice: 2650, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Navratri spike" },
      { month: "Nov 2025", historicalPrice: 2950, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Diwali festival rush" },
      { month: "Dec 2025", historicalPrice: 2150, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Late Kharif influx" },
      { month: "Jan 2026", historicalPrice: 1650, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Heavy red onion arrivals" },
      { month: "Feb 2026", historicalPrice: 1480, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Rabi arrivals start" },
      { month: "Mar 2026", historicalPrice: 1520, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Summer storage stocking" },
      { month: "Apr 2026", historicalPrice: 1780, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Chawl storage begins" },
      { month: "May 2026", historicalPrice: 1950, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Steady export demand" },
      { month: "Jun 2026", historicalPrice: 2120, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Monsoon supply squeeze" },
      { month: "Jul 2026", historicalPrice: 2280, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Stored onion draws" },
      { month: "Aug 2026", historicalPrice: 2390, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Arrivals down 20%" },
      { month: "Sep 2026 (Now)", historicalPrice: 2450, predictedPrice: 2450, confidenceMin: 2380, confidenceMax: 2520, isPrediction: false, isCurrent: true, note: "Current spot rate" },
      { month: "Oct 2026", historicalPrice: null, predictedPrice: 2310, confidenceMin: 2200, confidenceMax: 2420, isPrediction: true, note: "Early Kharif picking begins" },
      { month: "Nov 2026", historicalPrice: null, predictedPrice: 2100, confidenceMin: 1950, confidenceMax: 2250, isPrediction: true, note: "Heavy market arrival supply" },
      { month: "Dec 2026", historicalPrice: null, predictedPrice: 1850, confidenceMin: 1700, confidenceMax: 2020, isPrediction: true, note: "Arrival peak slump" }
    ]
  },
  {
    id: "soybean",
    name: "Soybean (सोयाबीन - Yellow Gold)",
    category: "Oilseeds",
    msp: 4892,
    currentAvgPrice: 4980,
    unit: "₹/Quintal",
    defaultMandi: "Latur APMC",
    storageCostPerQtlMonth: 20,
    holdingAdvisory: {
      recommendation: "WAIT_HOLD",
      actionText: "Hold & Wait (Target ₹5,350+)",
      actionColor: "emerald",
      peakPrice: 5380,
      peakPeriod: "Mid November to Early December",
      expectedChangePercent: "+8.0%",
      direction: "up",
      summary: "Crushing plants running at 40% capacity due to lean arrivals. International edible oil duty adjustments favor domestic soy meal."
    },
    mandis: [
      { name: "Latur APMC", district: "Latur", state: "Maharashtra", baseOffset: 200, distanceKm: 190, transportPerQtl: 70 },
      { name: "Indore Mandi", district: "Indore", state: "Madhya Pradesh", baseOffset: 370, distanceKm: 310, transportPerQtl: 95 },
      { name: "Nagpur APMC", district: "Nagpur", state: "Maharashtra", baseOffset: 40, distanceKm: 45, transportPerQtl: 35 },
      { name: "Akola Krishi Mandi", district: "Akola", state: "Maharashtra", baseOffset: 100, distanceKm: 110, transportPerQtl: 50 }
    ],
    timelineData: [
      { month: "Sep 2025", historicalPrice: 4620, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Old stock clearance" },
      { month: "Oct 2025", historicalPrice: 4450, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "New harvest arrivals" },
      { month: "Nov 2025", historicalPrice: 4720, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Crushing plant demand" },
      { month: "Dec 2025", historicalPrice: 4890, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Soy-meal export tenders" },
      { month: "Jan 2026", historicalPrice: 4950, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Stable trading" },
      { month: "Feb 2026", historicalPrice: 4880, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "South American crop report" },
      { month: "Mar 2026", historicalPrice: 4760, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Financial year closeout" },
      { month: "Apr 2026", historicalPrice: 4820, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Procurement stabilization" },
      { month: "May 2026", historicalPrice: 4890, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Firm domestic oil demand" },
      { month: "Jun 2026", historicalPrice: 4940, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Sowing season seed demand" },
      { month: "Jul 2026", historicalPrice: 4960, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Monsoon progress monitoring" },
      { month: "Aug 2026", historicalPrice: 4970, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Low mandi inventory" },
      { month: "Sep 2026 (Now)", historicalPrice: 4980, predictedPrice: 4980, confidenceMin: 4910, confidenceMax: 5050, isPrediction: false, isCurrent: true, note: "Current spot rate" },
      { month: "Oct 2026", historicalPrice: null, predictedPrice: 5120, confidenceMin: 5010, confidenceMax: 5230, isPrediction: true, note: "Crushers bidding aggressively" },
      { month: "Nov 2026", historicalPrice: null, predictedPrice: 5380, confidenceMin: 5240, confidenceMax: 5520, isPrediction: true, note: "Peak Predicted Target 🎯" },
      { month: "Dec 2026", historicalPrice: null, predictedPrice: 5290, confidenceMin: 5130, confidenceMax: 5450, isPrediction: true, note: "Post-festive plateau" }
    ]
  },
  {
    id: "mustard",
    name: "Mustard / Rapeseed (सरसों / मोहरी)",
    category: "Oilseeds",
    msp: 5650,
    currentAvgPrice: 5480,
    unit: "₹/Quintal",
    defaultMandi: "Kota Mandi Yard",
    storageCostPerQtlMonth: 22,
    holdingAdvisory: {
      recommendation: "WAIT_HOLD",
      actionText: "Wait & Watch (Winter Surge Expected)",
      actionColor: "amber",
      peakPrice: 5890,
      peakPeriod: "December to January (Winter Oil Consumption)",
      expectedChangePercent: "+7.5%",
      direction: "up",
      summary: "North Indian winter consumption spikes kachi-ghani mustard oil demand. Storing for 2–3 months easily surpasses storage charges."
    },
    mandis: [
      { name: "Kota Mandi Yard", district: "Kota", state: "Rajasthan", baseOffset: 120, distanceKm: 280, transportPerQtl: 75 },
      { name: "Mandsaur APMC", district: "Mandsaur", state: "Madhya Pradesh", baseOffset: 90, distanceKm: 220, transportPerQtl: 65 },
      { name: "Jaipur Surajpole APMC", district: "Jaipur", state: "Rajasthan", baseOffset: 180, distanceKm: 420, transportPerQtl: 95 },
      { name: "Indore Krishi Mandi", district: "Indore", state: "Madhya Pradesh", baseOffset: 110, distanceKm: 290, transportPerQtl: 75 }
    ],
    timelineData: [
      { month: "Sep 2025", historicalPrice: 5120, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Seasonal demand" },
      { month: "Oct 2025", historicalPrice: 5280, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Pre-winter stockpiling" },
      { month: "Nov 2025", historicalPrice: 5540, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "High retail pack off-take" },
      { month: "Dec 2025", historicalPrice: 5780, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Peak winter consumption" },
      { month: "Jan 2026", historicalPrice: 5690, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Late winter demand" },
      { month: "Feb 2026", historicalPrice: 5210, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Pre-harvest price drop" },
      { month: "Mar 2026", historicalPrice: 4850, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "New crop arrivals deluge" },
      { month: "Apr 2026", historicalPrice: 4990, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "NAFED MSP buying" },
      { month: "May 2026", historicalPrice: 5180, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Crushing pace accelerates" },
      { month: "Jun 2026", historicalPrice: 5290, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Monsoon supply pipeline" },
      { month: "Jul 2026", historicalPrice: 5380, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Steady physical trade" },
      { month: "Aug 2026", historicalPrice: 5440, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Low terminal arrivals" },
      { month: "Sep 2026 (Now)", historicalPrice: 5480, predictedPrice: 5480, confidenceMin: 5410, confidenceMax: 5550, isPrediction: false, isCurrent: true, note: "Current spot rate" },
      { month: "Oct 2026", historicalPrice: null, predictedPrice: 5630, confidenceMin: 5520, confidenceMax: 5740, isPrediction: true, note: "Pre-Diwali oil packaging" },
      { month: "Nov 2026", historicalPrice: null, predictedPrice: 5790, confidenceMin: 5660, confidenceMax: 5920, isPrediction: true, note: "Winter chill lifting demand" },
      { month: "Dec 2026", historicalPrice: null, predictedPrice: 5890, confidenceMin: 5730, confidenceMax: 6050, isPrediction: true, note: "Peak Season Window 🎯" }
    ]
  },
  {
    id: "cotton",
    name: "Cotton (कापूस / कपास - Medium & Long Staple)",
    category: "Fibre",
    msp: 7521,
    currentAvgPrice: 7850,
    unit: "₹/Quintal",
    defaultMandi: "Yavatmal APMC",
    storageCostPerQtlMonth: 28,
    holdingAdvisory: {
      recommendation: "SELL_NOW",
      actionText: "Sell Now (Avoid Storage Loss)",
      actionColor: "rose",
      peakPrice: 7850,
      peakPeriod: "Current Window (Before Vidarbha Peak Picking)",
      expectedChangePercent: "-4.5%",
      direction: "down",
      summary: "High opening arrivals expected in October-November. Spinning mills have adequate pipeline inventory; cotton storage carries moisture & weight loss penalties."
    },
    mandis: [
      { name: "Yavatmal APMC", district: "Yavatmal", state: "Maharashtra", baseOffset: 0, distanceKm: 25, transportPerQtl: 30 },
      { name: "Rajkot APMC", district: "Rajkot", state: "Gujarat", baseOffset: 300, distanceKm: 420, transportPerQtl: 90 },
      { name: "Jalna APMC", district: "Jalna", state: "Maharashtra", baseOffset: 70, distanceKm: 140, transportPerQtl: 50 },
      { name: "Kurnool APMC", district: "Kurnool", state: "Andhra Pradesh", baseOffset: -200, distanceKm: 520, transportPerQtl: 110 }
    ],
    timelineData: [
      { month: "Sep 2025", historicalPrice: 7720, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Lean month trade" },
      { month: "Oct 2025", historicalPrice: 7590, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "1st picking arrivals" },
      { month: "Nov 2025", historicalPrice: 7420, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Peak ginning arrivals" },
      { month: "Dec 2025", historicalPrice: 7480, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "CCI MSP procurement" },
      { month: "Jan 2026", historicalPrice: 7590, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Ginner demand up" },
      { month: "Feb 2026", historicalPrice: 7680, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Spinning mill buying" },
      { month: "Mar 2026", historicalPrice: 7750, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Arrivals taper down" },
      { month: "Apr 2026", historicalPrice: 7820, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Export yarn demand" },
      { month: "May 2026", historicalPrice: 7890, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Tight physical bales" },
      { month: "Jun 2026", historicalPrice: 7920, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Lean season peak" },
      { month: "Jul 2026", historicalPrice: 7900, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Mills on hand-to-mouth" },
      { month: "Aug 2026", historicalPrice: 7870, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Monsoon crop estimates" },
      { month: "Sep 2026 (Now)", historicalPrice: 7850, predictedPrice: 7850, confidenceMin: 7780, confidenceMax: 7920, isPrediction: false, isCurrent: true, note: "Current spot rate" },
      { month: "Oct 2026", historicalPrice: null, predictedPrice: 7690, confidenceMin: 7550, confidenceMax: 7830, isPrediction: true, note: "New picking starts" },
      { month: "Nov 2026", historicalPrice: null, predictedPrice: 7500, confidenceMin: 7350, confidenceMax: 7650, isPrediction: true, note: "Heavy market pressure" },
      { month: "Dec 2026", historicalPrice: null, predictedPrice: 7550, confidenceMin: 7380, confidenceMax: 7720, isPrediction: true, note: "CCI support floor" }
    ]
  },
  {
    id: "chana",
    name: "Gram / Chana (हरभरा / चना - Desi & Kabuli)",
    category: "Pulses",
    msp: 5440,
    currentAvgPrice: 5920,
    unit: "₹/Quintal",
    defaultMandi: "Indore Krishi Mandi",
    storageCostPerQtlMonth: 22,
    holdingAdvisory: {
      recommendation: "SELL_LATER",
      actionText: "Hold for Festival Peak (Diwali/Chhath)",
      actionColor: "emerald",
      peakPrice: 6350,
      peakPeriod: "Late October to Mid November",
      expectedChangePercent: "+7.3%",
      direction: "up",
      summary: "Besan and sweets manufacturers face acute supply shortage. Stockists and pulse millers are bidding premium rates for dry sound quality."
    },
    mandis: [
      { name: "Indore Krishi Mandi", district: "Indore", state: "Madhya Pradesh", baseOffset: 120, distanceKm: 310, transportPerQtl: 80 },
      { name: "Akola Krishi Mandi", district: "Akola", state: "Maharashtra", baseOffset: 60, distanceKm: 110, transportPerQtl: 45 },
      { name: "Latur APMC", district: "Latur", state: "Maharashtra", baseOffset: 90, distanceKm: 190, transportPerQtl: 65 },
      { name: "Kota Mandi Yard", district: "Kota", state: "Rajasthan", baseOffset: 40, distanceKm: 580, transportPerQtl: 105 }
    ],
    timelineData: [
      { month: "Sep 2025", historicalPrice: 5350, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Off-season base" },
      { month: "Oct 2025", historicalPrice: 5680, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Diwali sweets rush" },
      { month: "Nov 2025", historicalPrice: 5820, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Post-festive firmness" },
      { month: "Dec 2025", historicalPrice: 5740, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Rabi sowing reports" },
      { month: "Jan 2026", historicalPrice: 5610, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Steady physical trade" },
      { month: "Feb 2026", historicalPrice: 5400, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Early harvest buzz" },
      { month: "Mar 2026", historicalPrice: 5120, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Fresh harvest dip" },
      { month: "Apr 2026", historicalPrice: 5310, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "NAFED procurement" },
      { month: "May 2026", historicalPrice: 5540, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Besan miller off-take" },
      { month: "Jun 2026", historicalPrice: 5690, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Steady pipeline trade" },
      { month: "Jul 2026", historicalPrice: 5790, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Stockiest holding tight" },
      { month: "Aug 2026", historicalPrice: 5880, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Low available float" },
      { month: "Sep 2026 (Now)", historicalPrice: 5920, predictedPrice: 5920, confidenceMin: 5850, confidenceMax: 5990, isPrediction: false, isCurrent: true, note: "Current spot rate" },
      { month: "Oct 2026", historicalPrice: null, predictedPrice: 6200, confidenceMin: 6080, confidenceMax: 6320, isPrediction: true, note: "Pre-Diwali besan demand" },
      { month: "Nov 2026", historicalPrice: null, predictedPrice: 6350, confidenceMin: 6200, confidenceMax: 6500, isPrediction: true, note: "Peak Expected Window 🎯" },
      { month: "Dec 2026", historicalPrice: null, predictedPrice: 6180, confidenceMin: 6000, confidenceMax: 6360, isPrediction: true, note: "Arrival of imported yellow peas" }
    ]
  },
  {
    id: "maize",
    name: "Maize (मका / मक्का - Feed & Starch Grade)",
    category: "Cereals",
    msp: 2090,
    currentAvgPrice: 2280,
    unit: "₹/Quintal",
    defaultMandi: "Chhindwara APMC",
    storageCostPerQtlMonth: 18,
    holdingAdvisory: {
      recommendation: "SELL_NOW",
      actionText: "Sell Now / Near-Term Window",
      actionColor: "rose",
      peakPrice: 2310,
      peakPeriod: "Next 1–2 Weeks",
      expectedChangePercent: "-6.1%",
      direction: "down",
      summary: "Poultry feed demand is currently steady, but huge Kharif crop arrivals from Karnataka and MP in October will cause prices to soften."
    },
    mandis: [
      { name: "Chhindwara APMC", district: "Chhindwara", state: "Madhya Pradesh", baseOffset: 30, distanceKm: 210, transportPerQtl: 50 },
      { name: "Khanna APMC", district: "Ludhiana", state: "Punjab", baseOffset: -90, distanceKm: 850, transportPerQtl: 130 },
      { name: "Nashik APMC", district: "Nashik", state: "Maharashtra", baseOffset: 40, distanceKm: 25, transportPerQtl: 35 },
      { name: "Gultekdi APMC", district: "Pune", state: "Maharashtra", baseOffset: 70, distanceKm: 165, transportPerQtl: 65 }
    ],
    timelineData: [
      { month: "Sep 2025", historicalPrice: 2150, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Poultry feed demand" },
      { month: "Oct 2025", historicalPrice: 2020, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Kharif peak arrivals" },
      { month: "Nov 2025", historicalPrice: 2080, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Starch factory buying" },
      { month: "Dec 2025", historicalPrice: 2160, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Ethanol distillery demand" },
      { month: "Jan 2026", historicalPrice: 2240, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Winter feed uptake" },
      { month: "Feb 2026", historicalPrice: 2270, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Firm industrial demand" },
      { month: "Mar 2026", historicalPrice: 2210, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Bihar Rabi crop watch" },
      { month: "Apr 2026", historicalPrice: 2180, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Gulab-bagh arrivals" },
      { month: "May 2026", historicalPrice: 2220, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "South feed mill tenders" },
      { month: "Jun 2026", historicalPrice: 2250, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Steady off-take" },
      { month: "Jul 2026", historicalPrice: 2260, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Distillery contracts" },
      { month: "Aug 2026", historicalPrice: 2270, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Tight local stocks" },
      { month: "Sep 2026 (Now)", historicalPrice: 2280, predictedPrice: 2280, confidenceMin: 2230, confidenceMax: 2330, isPrediction: false, isCurrent: true, note: "Current spot rate" },
      { month: "Oct 2026", historicalPrice: null, predictedPrice: 2190, confidenceMin: 2110, confidenceMax: 2270, isPrediction: true, note: "Heavy harvest arrivals" },
      { month: "Nov 2026", historicalPrice: null, predictedPrice: 2140, confidenceMin: 2050, confidenceMax: 2230, isPrediction: true, note: "Peak harvest supply glut" },
      { month: "Dec 2026", historicalPrice: null, predictedPrice: 2210, confidenceMin: 2120, confidenceMax: 2300, isPrediction: true, note: "Distillery procurement rebound" }
    ]
  },
  {
    id: "arhar",
    name: "Arhar / Tur (तुअर / अरहर - Red Gram)",
    category: "Pulses",
    msp: 7550,
    currentAvgPrice: 10450,
    unit: "₹/Quintal",
    defaultMandi: "Latur APMC",
    storageCostPerQtlMonth: 24,
    benchmarkPrices: { 2016: 8011, 2017: 4374, 2018: 4001, 2019: 5016, 2020: 4958 },
    holdingAdvisory: {
      recommendation: "WAIT_HOLD",
      actionText: "Hold in Warehouse (Next 45–60 Days)",
      actionColor: "emerald",
      peakPrice: 11200,
      peakPeriod: "Late October to Mid November (Pre-Diwali Mill Buying)",
      expectedChangePercent: "+7.2%",
      direction: "up",
      summary: "Grounded in government benchmark cycles (2016 peak: ₹8,011, 2018 trough: ₹4,001, recovering to ₹5,016). Millers are facing low domestic carryover; holding for 45-60 days yields higher margins after storage rent."
    },
    mandis: [
      { name: "Latur APMC (Dal Pulse Hub)", district: "Latur", state: "Maharashtra", baseOffset: 120, distanceKm: 190, transportPerQtl: 65 },
      { name: "Kalaburagi / Gulbarga APMC", district: "Kalaburagi", state: "Karnataka", baseOffset: 180, distanceKm: 340, transportPerQtl: 95 },
      { name: "Akola Krishi Mandi", district: "Akola", state: "Maharashtra", baseOffset: 80, distanceKm: 110, transportPerQtl: 45 },
      { name: "Indore Krishi Mandi", district: "Indore", state: "Madhya Pradesh", baseOffset: 140, distanceKm: 310, transportPerQtl: 85 }
    ],
    timelineData: [
      { month: "Sep 2025", historicalPrice: 9400, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Lean supply start" },
      { month: "Oct 2025", historicalPrice: 9850, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Festival dal demand" },
      { month: "Nov 2025", historicalPrice: 10100, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Peak festive processing" },
      { month: "Dec 2025", historicalPrice: 9950, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Early harvest buzz" },
      { month: "Jan 2026", historicalPrice: 9600, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "New crop arrivals start" },
      { month: "Feb 2026", historicalPrice: 9350, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Arrival pressure" },
      { month: "Mar 2026", historicalPrice: 9450, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Procurement support" },
      { month: "Apr 2026", historicalPrice: 9700, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Stockist procurement" },
      { month: "May 2026", historicalPrice: 9920, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Import parity watch" },
      { month: "Jun 2026", historicalPrice: 10150, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Monsoon sowing pace" },
      { month: "Jul 2026", historicalPrice: 10300, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Tight physical stocks" },
      { month: "Aug 2026", historicalPrice: 10400, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Millers hand-to-mouth" },
      { month: "Sep 2026 (Now)", historicalPrice: 10450, predictedPrice: 10450, confidenceMin: 10350, confidenceMax: 10550, isPrediction: false, isCurrent: true, note: "Current spot rate" },
      { month: "Oct 2026", historicalPrice: null, predictedPrice: 10850, confidenceMin: 10650, confidenceMax: 11050, isPrediction: true, note: "Pre-festive pipeline stocking" },
      { month: "Nov 2026", historicalPrice: null, predictedPrice: 11200, confidenceMin: 10950, confidenceMax: 11450, isPrediction: true, note: "Projected Peak Window 🎯" },
      { month: "Dec 2026", historicalPrice: null, predictedPrice: 10700, confidenceMin: 10400, confidenceMax: 11000, isPrediction: true, note: "Fresh Kharif harvest arrivals" }
    ]
  },
  {
    id: "urad",
    name: "Urad / Black Gram (उड़द - Black Matpe)",
    category: "Pulses",
    msp: 7400,
    currentAvgPrice: 8750,
    unit: "₹/Quintal",
    defaultMandi: "Latur APMC",
    storageCostPerQtlMonth: 23,
    benchmarkPrices: { 2016: 7309, 2017: 3825, 2018: 3760, 2019: 4652, 2020: 5961 },
    holdingAdvisory: {
      recommendation: "WAIT_HOLD",
      actionText: "Hold for Festival Mill Squeeze (45–60 Days)",
      actionColor: "emerald",
      peakPrice: 9400,
      peakPeriod: "Late October to November (Diwali Season)",
      expectedChangePercent: "+7.4%",
      direction: "up",
      summary: "Grounded in government time series demonstrating a massive +58.5% cyclical recovery (from ₹3,760 in 2018 to ₹5,961 in 2020). Processing mills in Maharashtra & South India are actively buying clean lots."
    },
    mandis: [
      { name: "Latur APMC", district: "Latur", state: "Maharashtra", baseOffset: 110, distanceKm: 190, transportPerQtl: 65 },
      { name: "Jalgaon APMC", district: "Jalgaon", state: "Maharashtra", baseOffset: 40, distanceKm: 130, transportPerQtl: 50 },
      { name: "Indore Krishi Mandi", district: "Indore", state: "Madhya Pradesh", baseOffset: 90, distanceKm: 310, transportPerQtl: 85 },
      { name: "Kota Mandi Yard", district: "Kota", state: "Rajasthan", baseOffset: -50, distanceKm: 580, transportPerQtl: 110 }
    ],
    timelineData: [
      { month: "Sep 2025", historicalPrice: 7950, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Harvest arrivals" },
      { month: "Oct 2025", historicalPrice: 8200, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Festival mill off-take" },
      { month: "Nov 2025", historicalPrice: 8450, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Diwali demand" },
      { month: "Dec 2025", historicalPrice: 8300, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Rabi sowing focus" },
      { month: "Jan 2026", historicalPrice: 8150, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Physical trade steady" },
      { month: "Feb 2026", historicalPrice: 8250, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Spring crop arrivals" },
      { month: "Mar 2026", historicalPrice: 8350, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Gradual appreciation" },
      { month: "Apr 2026", historicalPrice: 8450, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Domestic demand" },
      { month: "May 2026", historicalPrice: 8550, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Summer stocks low" },
      { month: "Jun 2026", historicalPrice: 8650, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Kharif sowing start" },
      { month: "Jul 2026", historicalPrice: 8700, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Monsoon supply squeeze" },
      { month: "Aug 2026", historicalPrice: 8720, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Firm market" },
      { month: "Sep 2026 (Now)", historicalPrice: 8750, predictedPrice: 8750, confidenceMin: 8650, confidenceMax: 8850, isPrediction: false, isCurrent: true, note: "Current spot rate" },
      { month: "Oct 2026", historicalPrice: null, predictedPrice: 9100, confidenceMin: 8950, confidenceMax: 9250, isPrediction: true, note: "Festive dal off-take" },
      { month: "Nov 2026", historicalPrice: null, predictedPrice: 9400, confidenceMin: 9200, confidenceMax: 9600, isPrediction: true, note: "Target Peak Window 🎯" },
      { month: "Dec 2026", historicalPrice: null, predictedPrice: 9050, confidenceMin: 8850, confidenceMax: 9250, isPrediction: true, note: "Post-festive cooling" }
    ]
  },
  {
    id: "moong",
    name: "Moong / Green Gram (मूंग - Green Beans)",
    category: "Pulses",
    msp: 8682,
    currentAvgPrice: 8850,
    unit: "₹/Quintal",
    defaultMandi: "Nagaur APMC",
    storageCostPerQtlMonth: 22,
    benchmarkPrices: { 2016: 5479, 2017: 4744, 2018: 4823, 2019: 5662, 2020: 6216 },
    holdingAdvisory: {
      recommendation: "WAIT_HOLD",
      actionText: "Hold in Silo / Godown (Lowest Downside Risk)",
      actionColor: "emerald",
      peakPrice: 9650,
      peakPeriod: "November to Early December",
      expectedChangePercent: "+9.0%",
      direction: "up",
      summary: "Grounded in government multi-year benchmarks exhibiting unbroken year-on-year expansion (4,744 -> 4,823 -> 5,662 -> 6,216). Moong exhibits lowest storage downside risk; holding into late autumn brings premium."
    },
    mandis: [
      { name: "Nagaur APMC (Moong Capital)", district: "Nagaur", state: "Rajasthan", baseOffset: 160, distanceKm: 620, transportPerQtl: 115 },
      { name: "Merta City APMC", district: "Nagaur", state: "Rajasthan", baseOffset: 140, distanceKm: 590, transportPerQtl: 110 },
      { name: "Latur APMC", district: "Latur", state: "Maharashtra", baseOffset: 60, distanceKm: 190, transportPerQtl: 65 },
      { name: "Indore Krishi Mandi", district: "Indore", state: "Madhya Pradesh", baseOffset: 90, distanceKm: 310, transportPerQtl: 85 }
    ],
    timelineData: [
      { month: "Sep 2025", historicalPrice: 8200, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Fresh harvest start" },
      { month: "Oct 2025", historicalPrice: 8400, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "NAFED MSP buying" },
      { month: "Nov 2025", historicalPrice: 8600, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Festive sweet & snack off-take" },
      { month: "Dec 2025", historicalPrice: 8550, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Winter demand" },
      { month: "Jan 2026", historicalPrice: 8480, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Steady physical trade" },
      { month: "Feb 2026", historicalPrice: 8520, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Pipeline clearance" },
      { month: "Mar 2026", historicalPrice: 8610, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Firm market" },
      { month: "Apr 2026", historicalPrice: 8680, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Procurement parity" },
      { month: "May 2026", historicalPrice: 8750, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Summer crop watch" },
      { month: "Jun 2026", historicalPrice: 8800, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Lean supplies" },
      { month: "Jul 2026", historicalPrice: 8820, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Tight local availability" },
      { month: "Aug 2026", historicalPrice: 8840, predictedPrice: null, confidenceMin: null, confidenceMax: null, isPrediction: false, note: "Firm spot tones" },
      { month: "Sep 2026 (Now)", historicalPrice: 8850, predictedPrice: 8850, confidenceMin: 8750, confidenceMax: 8950, isPrediction: false, isCurrent: true, note: "Current spot rate" },
      { month: "Oct 2026", historicalPrice: null, predictedPrice: 9250, confidenceMin: 9100, confidenceMax: 9400, isPrediction: true, note: "Diwali pulse demand" },
      { month: "Nov 2026", historicalPrice: null, predictedPrice: 9650, confidenceMin: 9450, confidenceMax: 9850, isPrediction: true, note: "Target Seasonal Peak 🎯" },
      { month: "Dec 2026", historicalPrice: null, predictedPrice: 9300, confidenceMin: 9100, confidenceMax: 9500, isPrediction: true, note: "Post-peak stabilization" }
    ]
  }
];

// Re-export official government benchmark datasets for cross-module consumption
export {
  OFFICIAL_PULSE_PRICE_SERIES,
  MULTI_YEAR_PULSE_CHART_DATA,
  OFFICIAL_ENAM_STATE_DATA,
  ENAM_NATIONAL_SUMMARY
} from './officialGovtBenchmarkData';

