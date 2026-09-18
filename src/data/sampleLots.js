export const INITIAL_FARMER_LOTS = [
  {
    id: "LOT-2026-081",
    crop: "Onion (लाल कांदा / Red Onion)",
    variety: "Gavran / Nashik Red",
    quantityQtl: 85,
    grade: "Grade A (Export Quality 55mm+)",
    moisturePercent: "11.5%",
    harvestDate: "2026-08-28",
    location: "Dindori, Nashik, Maharashtra",
    distanceFromMandi: "14 km",
    distanceKm: 14,
    expectedPrice: 2650,
    status: "Active Offers (3)",
    offersCount: 3,
    topOfferPrice: 2620,
    topBuyerName: "Sahyadri Agro Processing Ltd",
    farmerName: "Dnyaneshwar Patil",
    farmerType: "Individual Farmer",
    farmerRating: 4.7,
    reviewCount: 23,
    verified: true,
    wishlist: false,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "LOT-2026-094",
    crop: "Soybean (सोयाबीन)",
    variety: "JS-335",
    quantityQtl: 140,
    grade: "Grade A (Cleaned & Graded)",
    moisturePercent: "10.2%",
    harvestDate: "2026-08-25",
    location: "Latur, Maharashtra",
    distanceFromMandi: "22 km",
    distanceKm: 22,
    expectedPrice: 5200,
    status: "Negotiation in Progress",
    offersCount: 2,
    topOfferPrice: 5120,
    topBuyerName: "Adani Wilmar Solvents",
    farmerName: "Latur Soybean FPO Union",
    farmerType: "FPO",
    farmerRating: 4.9,
    reviewCount: 58,
    verified: true,
    wishlist: false,
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "LOT-2026-102",
    crop: "Wheat (गहू - Sharbati)",
    variety: "C-306 MP Sharbati",
    quantityQtl: 210,
    grade: "Premium Golden Grain",
    moisturePercent: "9.8%",
    harvestDate: "2026-08-20",
    location: "Sehore, Madhya Pradesh",
    distanceFromMandi: "18 km",
    distanceKm: 18,
    expectedPrice: 2900,
    status: "Order Confirmed",
    offersCount: 4,
    topOfferPrice: 2880,
    topBuyerName: "ITC Choupal Sagar",
    farmerName: "Bhopal Krishi Aggregators",
    farmerType: "Aggregator",
    farmerRating: 4.5,
    reviewCount: 34,
    verified: true,
    wishlist: false,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=60"
  }
];

export const INITIAL_FPO_MEMBERS = [
  { id: "F-101", name: "Dnyaneshwar Patil", village: "Niphad, Nashik", landAcres: 3.5, crop: "Onion", lotReadyQtl: 28, contact: "+91 98231 XXXXX" },
  { id: "F-102", name: "Sanjay Shinde", village: "Pimpalgaon, Nashik", landAcres: 4.2, crop: "Onion", lotReadyQtl: 35, contact: "+91 97654 XXXXX" },
  { id: "F-103", name: "Rameshwar Jadhav", village: "Chandwad, Nashik", landAcres: 5.0, crop: "Onion", lotReadyQtl: 42, contact: "+91 94222 XXXXX" },
  { id: "F-104", name: "Balu Gaikwad", village: "Sinnar, Nashik", landAcres: 2.8, crop: "Onion", lotReadyQtl: 20, contact: "+91 99211 XXXXX" },
  { id: "F-105", name: "Kishor Deshmukh", village: "Yeola, Nashik", landAcres: 6.0, crop: "Soybean", lotReadyQtl: 60, contact: "+91 98810 XXXXX" },
];

export const INITIAL_BUYER_REQUIREMENTS = [
  {
    id: "REQ-7701",
    buyerName: "Sahyadri Farmers Producer Co. Ltd",
    buyerType: "Food Processor & Exporter",
    crop: "Onion",
    requiredQuantityQtl: 500,
    preferredGrade: "Grade A (50mm-65mm export size, dry outer skin)",
    maxMoisture: "12%",
    maxPriceOffered: 2680,
    deliveryLocation: "Mohadi Cold Hub, Dindori (Nashik)",
    fulfillmentTimeline: "Within 4 days",
    status: "Open",
    verifiedScore: 98
  },
  {
    id: "REQ-7704",
    buyerName: "Adani Wilmar Solvent Extraction",
    buyerType: "Edible Oil Refiner",
    crop: "Soybean",
    requiredQuantityQtl: 1200,
    preferredGrade: "Grade A / FAQ (Oil content >18%)",
    maxMoisture: "11%",
    maxPriceOffered: 5250,
    deliveryLocation: "Latur Processing Plant",
    fulfillmentTimeline: "Within 7 days",
    status: "Matched",
    verifiedScore: 99
  },
  {
    id: "REQ-7709",
    buyerName: "ITC Agri Business Division",
    buyerType: "Flour Miller & FMCG",
    crop: "Wheat (Sharbati / Lokwan)",
    requiredQuantityQtl: 800,
    preferredGrade: "Lustrous grain, zero infestation",
    maxMoisture: "10%",
    maxPriceOffered: 2920,
    deliveryLocation: "Indore Logistics Park",
    fulfillmentTimeline: "Immediate Pickup",
    status: "Fulfilled",
    verifiedScore: 97
  }
];

export const ACTIVITY_FEED = [
  { id: 1, type: "offer_accepted", icon: "✅", message: "Dnyaneshwar Patil accepted your offer of ₹2,650/Q for Onion lot LOT-2026-081", time: "2 hours ago", link: "my-offers" },
  { id: 2, type: "new_match", icon: "🤖", message: "AI found 3 new lots matching your Soybean requirement REQ-7704 (94%+ match score)", time: "4 hours ago", link: "ai-matching" },
  { id: 3, type: "payment_due", icon: "⚠️", message: "Payment of ₹4,30,000 for ORD-501 (Wheat) is due in 2 days", time: "6 hours ago", link: "payments" },
  { id: 4, type: "counter_offer", icon: "🔄", message: "Ramesh Sharma counter-offered ₹1,900/Q for Tomato lot (was ₹1,800)", time: "Yesterday", link: "my-offers" },
  { id: 5, type: "delivery", icon: "🚚", message: "ORD-501 shipment MH-15-EG-4412 is 42 km away. ETA: Today 5:30 PM", time: "Yesterday", link: "logistics" },
];

export const TRANSPORTER_LIST = [
  { id: "TR-01", name: "Suresh Logistics", vehicle: "20ft Container Truck", capacity: "200 Qtl", rate: "₹18/km", rating: 4.6, contact: "+91 98001 11222", available: true },
  { id: "TR-02", name: "Maharashtra Transport Co.", vehicle: "Open Truck (Tata 407)", capacity: "80 Qtl", rate: "₹14/km", rating: 4.3, contact: "+91 97221 33441", available: true },
  { id: "TR-03", name: "Patil Cold Chain Pvt Ltd", vehicle: "Reefer Van (Temp Control)", capacity: "60 Qtl", rate: "₹22/km", rating: 4.8, contact: "+91 94001 55667", available: false },
  { id: "TR-04", name: "KisanGaadi Fleet", vehicle: "Mini Truck (Mahindra Bolero)", capacity: "30 Qtl", rate: "₹12/km", rating: 4.4, contact: "+91 99101 77889", available: true },
];
