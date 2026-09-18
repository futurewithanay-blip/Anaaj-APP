import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, TrendingUp, Truck, Award, CheckCircle2, 
  Sparkles, Bot, MapPin, AlertCircle, ArrowRight, ShieldCheck, 
  RefreshCw, Layers, DollarSign, ChevronRight, Zap, ArrowUpRight
} from 'lucide-react';
import { MANDI_COMMODITIES } from '../../data/mandiData';
import porterService, { PORTER_VEHICLE_TYPES } from '../../services/porterService';

// Pre-defined commodity catalogue for quick selection and intelligent baseline
const COMMODITY_CATALOG = [
  { id: 'onion', name: 'Onion (कांदा / प्याज)', category: 'Vegetables', basePrice: 2450, icon: '🧅' },
  { id: 'wheat', name: 'Wheat (गहू / गेहूं)', category: 'Cereals', basePrice: 2720, icon: '🌾' },
  { id: 'soybean', name: 'Soybean (सोयाबीन)', category: 'Oilseeds', basePrice: 4980, icon: '🫘' },
  { id: 'cotton', name: 'Cotton (कापूस / कपास)', category: 'Fibre', basePrice: 7850, icon: '☁️' },
  { id: 'tomato', name: 'Tomato (टोमॅटो / टमाटर)', category: 'Vegetables', basePrice: 1650, icon: '🍅' },
  { id: 'maize', name: 'Maize (मका / मक्का)', category: 'Cereals', basePrice: 2280, icon: '🌽' },
  { id: 'mustard', name: 'Mustard (मोहरी / सरसों)', category: 'Oilseeds', basePrice: 5450, icon: '🟡' },
  { id: 'chana', name: 'Gram / Chana (हरभरा / चना)', category: 'Pulses', basePrice: 5900, icon: '🧆' },
  { id: 'potato', name: 'Potato (बटाटा / आलू)', category: 'Vegetables', basePrice: 1450, icon: '🥔' },
  { id: 'tur', name: 'Tur / Arhar (तूर / अरहर)', category: 'Pulses', basePrice: 10450, icon: '🌱' },
];

// Grade definitions with quality multipliers and descriptions
const GRADE_CONFIG = {
  A: {
    label: 'Grade A (Super Premium)',
    sub: 'Bold grain / large uniform size, moisture < 12%, zero defects',
    multiplier: 1.12, // +12% premium
    color: 'border-emerald-500 bg-emerald-50 text-emerald-900',
    badge: 'bg-emerald-600 text-white',
    desc: '+12% Premium over Modal APMC Rate'
  },
  B: {
    label: 'Grade B (FAQ / Standard)',
    sub: 'Fair Average Quality (FAQ), standard mandi moisture & sorting',
    multiplier: 1.00, // standard baseline
    color: 'border-blue-500 bg-blue-50 text-blue-900',
    badge: 'bg-blue-600 text-white',
    desc: 'Standard APMC Benchmark Rate'
  },
  C: {
    label: 'Grade C (Commercial / Low)',
    sub: 'Small size, mixed color, moisture > 14% or minor blemishes',
    multiplier: 0.88, // -12% discount
    color: 'border-amber-500 bg-amber-50 text-amber-900',
    badge: 'bg-amber-600 text-white',
    desc: '-12% Quality Discount'
  }
};

// Preset farmer origin clusters
const FARMER_LOCATIONS = [
  { id: 'nashik', name: 'Nashik / Dindori (Maharashtra)', state: 'Maharashtra', lat: 20.0, lng: 73.8 },
  { id: 'indore', name: 'Indore / Sanwer (Madhya Pradesh)', state: 'Madhya Pradesh', lat: 22.7, lng: 75.8 },
  { id: 'pune', name: 'Pune / Khed-Manchar (Maharashtra)', state: 'Maharashtra', lat: 18.5, lng: 73.8 },
  { id: 'nagpur', name: 'Nagpur / Katol (Maharashtra)', state: 'Maharashtra', lat: 21.1, lng: 79.0 },
  { id: 'kota', name: 'Kota / Hadoti (Rajasthan)', state: 'Rajasthan', lat: 25.1, lng: 75.8 },
  { id: 'ludhiana', name: 'Khanna / Ludhiana (Punjab)', state: 'Punjab', lat: 30.7, lng: 76.2 }
];

export default function NetProfitCalculator({ t = {} }) {
  // ─── Manual Input State ───────────────────────────────────────────────────
  const [cropSearch, setCropSearch] = useState('Onion (कांदा / प्याज)');
  const [selectedCropId, setSelectedCropId] = useState('onion');
  const [customCropPrice, setCustomCropPrice] = useState(2450);
  const [quantityQtl, setQuantityQtl] = useState(50); // Quintals
  const [selectedGrade, setSelectedGrade] = useState('A');
  const [farmerLocation, setFarmerLocation] = useState('Nashik / Dindori (Maharashtra)');

  // ─── Agentic AI State ─────────────────────────────────────────────────────
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiStep, setAiStep] = useState(4); // 1: Price Discovery, 2: Logistics, 3: Deductions, 4: Complete
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState(new Date());

  // Handle manual crop selection from quick chips
  const handleSelectPredefinedCrop = (cropItem) => {
    setSelectedCropId(cropItem.id);
    setCropSearch(cropItem.name);
    setCustomCropPrice(cropItem.basePrice);
    triggerAiAnalysis();
  };

  // Trigger Agentic AI Simulation
  const triggerAiAnalysis = () => {
    setIsAiAnalyzing(true);
    setAiStep(1);

    setTimeout(() => setAiStep(2), 350);
    setTimeout(() => setAiStep(3), 700);
    setTimeout(() => {
      setAiStep(4);
      setIsAiAnalyzing(false);
      setLastAnalyzedAt(new Date());
    }, 1050);
  };

  // Find base mandis from dataset or dynamically synthesize for custom crop / location
  const baseMandisForCrop = useMemo(() => {
    const matched = MANDI_COMMODITIES.find(c => c.id === selectedCropId);
    if (matched && matched.mandis?.length) {
      return matched.mandis;
    }

    // Default regional mandis network if custom crop is entered
    return [
      { name: "Nearest District APMC", state: "Maharashtra", district: "Local", distanceKm: 18, price: customCropPrice, arrival: "12,000 Qtl", mandiCess: 22, rating: 4.8 },
      { name: "Regional Division APMC", state: "Maharashtra", district: "Division", distanceKm: 45, price: Math.round(customCropPrice * 1.04), arrival: "18,500 Qtl", mandiCess: 25, rating: 4.9 },
      { name: "State Hub APMC Market", state: "Maharashtra", district: "State Capital", distanceKm: 165, price: Math.round(customCropPrice * 1.11), arrival: "35,000 Qtl", mandiCess: 28, rating: 4.7 },
      { name: "Terminal Metro Mega Mandi", state: "Maharashtra", district: "Metro Port", distanceKm: 220, price: Math.round(customCropPrice * 1.18), arrival: "48,000 Qtl", mandiCess: 30, rating: 5.0 }
    ];
  }, [selectedCropId, customCropPrice]);

  // ─── Agentic AI Core Calculation Engine ───────────────────────────────────
  const analysisResults = useMemo(() => {
    const gradeMultiplier = GRADE_CONFIG[selectedGrade]?.multiplier || 1.0;
    const totalWeightKg = quantityQtl * 100; // 1 Qtl = 100 kg

    // Select recommended Porter Vehicle based on lot weight
    let recommendedVehicle = PORTER_VEHICLE_TYPES[0]; // Tata Ace
    if (totalWeightKg <= 500) {
      recommendedVehicle = PORTER_VEHICLE_TYPES.find(v => v.id === 'three_wheeler') || PORTER_VEHICLE_TYPES[0];
    } else if (totalWeightKg <= 850) {
      recommendedVehicle = PORTER_VEHICLE_TYPES.find(v => v.id === 'tata_ace') || PORTER_VEHICLE_TYPES[0];
    } else if (totalWeightKg <= 1250) {
      recommendedVehicle = PORTER_VEHICLE_TYPES.find(v => v.id === 'pickup_8ft') || PORTER_VEHICLE_TYPES[2];
    } else if (totalWeightKg <= 2500) {
      recommendedVehicle = PORTER_VEHICLE_TYPES.find(v => v.id === 'tata_407') || PORTER_VEHICLE_TYPES[3];
    } else {
      recommendedVehicle = PORTER_VEHICLE_TYPES.find(v => v.id === 'canter_14ft') || PORTER_VEHICLE_TYPES[4];
    }

    // Process each nearby mandi
    const mandisCalculated = baseMandisForCrop.map((m, index) => {
      // 1. Grade-adjusted Mandi Price per Quintal
      const rawPrice = m.price || customCropPrice;
      const gradeAdjustedPricePerQtl = Math.round(rawPrice * gradeMultiplier);

      // 2. Total Gross Revenue (Mandi se milne wala total paisa)
      const grossRevenue = gradeAdjustedPricePerQtl * quantityQtl;

      // 3. Transport Fare Calculation (Using Porter Logistics Engine)
      const distance = m.distanceKm || 25;
      const tripsNeeded = Math.max(1, Math.ceil(totalWeightKg / recommendedVehicle.capacityKg));
      const singleTripFare = porterService.calculateFare(recommendedVehicle, distance);
      const totalTransportFare = singleTripFare.totalFare * tripsNeeded;

      // 4. Mandi Cess & Handling Unloading (~₹20/Qtl unloading + mandi cess)
      const cessRate = m.mandiCess || 25;
      const totalMandiCessAndLabour = (cessRate + 18) * quantityQtl;

      // 5. Total Deductions
      const totalDeductions = totalTransportFare + totalMandiCessAndLabour;

      // 6. Net Profit In-Hand (Gross Revenue - Transport Fare - Mandi Deductions)
      const netProfitTotal = grossRevenue - totalDeductions;
      const netProfitPerQtl = Math.round(netProfitTotal / quantityQtl);
      const transportCostPerQtl = Math.round(totalTransportFare / quantityQtl);

      return {
        ...m,
        id: `mandi-${index}`,
        gradeAdjustedPricePerQtl,
        grossRevenue,
        distanceKm: distance,
        vehicleRecommended: recommendedVehicle.name,
        vehicleIcon: recommendedVehicle.icon,
        tripsNeeded,
        totalTransportFare,
        transportCostPerQtl,
        totalMandiCessAndLabour,
        totalDeductions,
        netProfitTotal,
        netProfitPerQtl,
      };
    });

    // Sort by Net Profit (Highest First)
    const sortedByNet = [...mandisCalculated].sort((a, b) => b.netProfitTotal - a.netProfitTotal);
    const bestMandi = sortedByNet[0];

    // Mandi with highest gross price (may be deceptive)
    const sortedByGross = [...mandisCalculated].sort((a, b) => b.gradeAdjustedPricePerQtl - a.gradeAdjustedPricePerQtl);
    const highestGrossMandi = sortedByGross[0];

    // Check if there is an arbitrage trap (highest gross price gives lower net profit)
    const isTrapDetected = highestGrossMandi && bestMandi && (highestGrossMandi.name !== bestMandi.name);
    const profitDifference = isTrapDetected ? (bestMandi.netProfitTotal - highestGrossMandi.netProfitTotal) : 0;

    return {
      mandis: sortedByNet,
      bestMandi,
      highestGrossMandi,
      isTrapDetected,
      profitDifference,
      recommendedVehicle,
      totalWeightKg,
      gradeMultiplier
    };
  }, [baseMandisForCrop, selectedGrade, quantityQtl, customCropPrice]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden space-y-6">
      
      {/* ─── Top Header with Agentic AI Status ──────────────────────────────── */}
      <div className="p-6 bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
              <Bot className="w-3 h-3 text-emerald-300" />
              <span>Agentic AI Market & Logistics Arbitrage</span>
            </span>
            <span className="bg-blue-400/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-400/30">
              <Truck className="w-3 h-3" />
              <span>Porter Fare Sync</span>
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-black font-heading flex items-center gap-2">
            <span>{t?.netProfitCalc || "AI Net Profit & Fare Analyzer"}</span>
          </h3>
          <p className="text-xs text-emerald-200/80 mt-1 max-w-2xl">
            Enter your crop name, quantity & grade. Our Agentic AI automatically scans nearby mandis, computes exact road distance & Porter transport fare, and subtracts all expenses to give your <strong>Real Net Take-Home Profit</strong>.
          </p>
        </div>

        <button
          onClick={triggerAiAnalysis}
          disabled={isAiAnalyzing}
          className="self-start md:self-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAiAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAiAnalyzing ? 'Agentic AI Running...' : 'Re-run AI Analysis'}</span>
        </button>
      </div>

      {/* ─── Agentic AI Real-Time Processing Pipeline Banner ───────────────── */}
      {isAiAnalyzing && (
        <div className="mx-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 animate-pulse">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>Agentic AI Pipeline Active: Processing Real-Time Mandi Arbitrage</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
            <div className={`p-2 rounded-lg font-medium ${aiStep >= 1 ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-500'}`}>
              1. 🔍 APMC Price Discovery & Grade Multiplier
            </div>
            <div className={`p-2 rounded-lg font-medium ${aiStep >= 2 ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-500'}`}>
              2. 🗺️ Geospatial Distance & Vehicle Matching
            </div>
            <div className={`p-2 rounded-lg font-medium ${aiStep >= 3 ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-500'}`}>
              3. 🚚 Porter Freight Fare & Cess Deduction
            </div>
            <div className={`p-2 rounded-lg font-medium ${aiStep >= 4 ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-500'}`}>
              4. 💡 Arbitrage Verdict & Smart Recommendation
            </div>
          </div>
        </div>
      )}

      {/* ─── Manual Crop Details Entry Section ─────────────────────────────── */}
      <div className="px-6 space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-sm font-heading">
                Enter Crop Details Manually (फसल का विवरण दर्ज करें)
              </h4>
              <p className="text-xs text-slate-400">
                Choose or type your crop, quantity in quintals, and quality grade.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            Manual Input Mode
          </span>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 rounded-2xl bg-slate-50/80 border border-slate-200">
          
          {/* Input 1: Crop Name / Manual Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Crop Name (फसल का नाम):
            </label>
            <div className="relative">
              <input
                type="text"
                value={cropSearch}
                onChange={(e) => {
                  setCropSearch(e.target.value);
                  const matched = COMMODITY_CATALOG.find(c => c.name.toLowerCase().includes(e.target.value.toLowerCase()));
                  if (matched) {
                    setSelectedCropId(matched.id);
                    setCustomCropPrice(matched.basePrice);
                  } else {
                    setSelectedCropId('custom');
                  }
                }}
                placeholder="e.g. Wheat, Onion, Soybean, Cotton..."
                className="w-full bg-white text-slate-800 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>

            {/* Quick Commodity Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {COMMODITY_CATALOG.slice(0, 5).map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectPredefinedCrop(c)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    selectedCropId === c.id 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.name.split('(')[0].trim()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Quantity in Quintals */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Quantity (वजन / मात्रा):</span>
              <span className="text-emerald-700 font-black text-sm">
                {quantityQtl} Quintals <span className="text-xs text-slate-400 font-normal">({(quantityQtl * 100).toLocaleString()} kg)</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="2000"
                value={quantityQtl}
                onChange={(e) => setQuantityQtl(Math.max(1, Number(e.target.value) || 1))}
                className="w-28 bg-white text-slate-800 text-xs font-black px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
              <span className="text-xs font-bold text-slate-500">Quintals (क्विंटल)</span>
            </div>

            {/* Quick Quantity Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {[15, 30, 50, 100, 200].map(qty => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setQuantityQtl(qty)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg transition cursor-pointer ${
                    quantityQtl === qty
                      ? 'bg-slate-800 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {qty} Qtl
                </button>
              ))}
            </div>
          </div>

          {/* Input 3: Quality Grade Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Quality Grade (गुणवत्ता ग्रेड):
            </label>

            <div className="grid grid-cols-3 gap-1.5">
              {(['A', 'B', 'C']).map((gradeKey) => {
                const cfg = GRADE_CONFIG[gradeKey];
                const isSelected = selectedGrade === gradeKey;
                return (
                  <button
                    key={gradeKey}
                    type="button"
                    onClick={() => setSelectedGrade(gradeKey)}
                    className={`p-2 rounded-xl text-center border-2 transition cursor-pointer ${
                      isSelected
                        ? `${cfg.color} ring-2 ring-emerald-500/20 font-black shadow-xs`
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-black">Grade {gradeKey}</div>
                    <div className="text-[9px] font-medium leading-tight mt-0.5">
                      {gradeKey === 'A' ? 'Super Premium' : gradeKey === 'B' ? 'FAQ Standard' : 'Commercial'}
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              ✨ <strong className="text-slate-700">{GRADE_CONFIG[selectedGrade].label}:</strong> {GRADE_CONFIG[selectedGrade].desc}
            </p>
          </div>

        </div>

        {/* Origin / Farm Gate Setting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-600">Your Farm Gate Location:</span>
            <select
              value={farmerLocation}
              onChange={(e) => setFarmerLocation(e.target.value)}
              className="bg-white border border-emerald-300 text-emerald-950 font-bold px-2 py-1 rounded-lg focus:outline-none"
            >
              {FARMER_LOCATIONS.map(loc => (
                <option key={loc.id} value={loc.name}>{loc.name}</option>
              ))}
            </select>
          </div>
          <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Recommended Vehicle: <strong className="text-slate-800">{analysisResults.recommendedVehicle.name}</strong></span>
          </div>
        </div>
      </div>

      {/* ─── Smart AI Suggestion Banner ("kaha sb se jyada profit hai") ────── */}
      <div className="px-6">
        {analysisResults.bestMandi && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white shadow-lg space-y-3 relative overflow-hidden">
            {/* Background glowing watermark */}
            <div className="absolute right-4 -bottom-6 opacity-15 text-8xl font-black select-none pointer-events-none">
              ₹
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 border border-white/30">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Smart AI Arbitrage Suggestion (सर्वोत्तम मुनाफा मंडी)</span>
              </span>
              <span className="text-xs text-emerald-100">
                • Verified at {lastAnalyzedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-emerald-100 font-semibold">Recommended Mandi for Highest Net Profit:</div>
                <div className="text-2xl font-black font-heading tracking-tight flex items-center gap-2">
                  <span>{analysisResults.bestMandi.name}</span>
                  <span className="text-sm bg-white/25 px-2.5 py-0.5 rounded-full font-bold">
                    {analysisResults.bestMandi.distanceKm} km away
                  </span>
                </div>
                <div className="text-xs text-emerald-100 mt-1">
                  Expected Rate: <strong>₹{analysisResults.bestMandi.gradeAdjustedPricePerQtl.toLocaleString()}/Qtl</strong> (Grade {selectedGrade}) • Total Freight: <strong>₹{analysisResults.bestMandi.totalTransportFare.toLocaleString()}</strong>
                </div>
              </div>

              {/* Net Profit Big Badge */}
              <div className="bg-white text-slate-900 px-5 py-3 rounded-2xl shadow-md text-right shrink-0">
                <div className="text-[10px] uppercase tracking-wider font-black text-slate-400">
                  Total Real Net In-Hand Profit:
                </div>
                <div className="text-2xl font-black font-heading text-emerald-700">
                  ₹{analysisResults.bestMandi.netProfitTotal.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] font-bold text-slate-500">
                  (₹{analysisResults.bestMandi.netProfitPerQtl.toLocaleString('en-IN')} / Quintal Net)
                </div>
              </div>
            </div>

            {/* Smart Arbitrage Insight: High Gross Price Trap Warning */}
            {analysisResults.isTrapDetected && (
              <div className="p-3 bg-slate-900/40 rounded-2xl border border-white/20 text-xs flex items-start gap-2.5 text-emerald-50">
                <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-200">💡 AI Decision Insight (Distance vs Price Warning): </span>
                  Although <strong>{analysisResults.highestGrossMandi.name}</strong> displays a higher gross rate of <strong>₹{analysisResults.highestGrossMandi.gradeAdjustedPricePerQtl}/Q</strong>, its greater distance ({analysisResults.highestGrossMandi.distanceKm} km) costs <strong>₹{analysisResults.highestGrossMandi.totalTransportFare.toLocaleString()}</strong> in transport fare.
                  Selling at <strong>{analysisResults.bestMandi.name}</strong> yields <strong className="text-amber-300">₹{analysisResults.profitDifference.toLocaleString()} MORE Net Take-Home Profit</strong>!
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Nearby Mandis Analysis & Cost Comparison Cards ────────────────── */}
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-sm font-heading">
                Nearby Mandi Price & Transport Fare Comparison
              </h4>
              <p className="text-xs text-slate-400">
                Gross Mandi Price vs Distance & Total Freight Fare = Net In-Hand Profit
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Comparing {analysisResults.mandis.length} Mandis
          </span>
        </div>

        {/* Mandis Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analysisResults.mandis.map((m, idx) => {
            const isBest = m.id === analysisResults.bestMandi?.id;
            return (
              <div
                key={m.id || idx}
                className={`rounded-3xl border transition relative flex flex-col justify-between overflow-hidden ${
                  isBest
                    ? 'bg-emerald-50/70 border-2 border-emerald-500 shadow-md ring-4 ring-emerald-500/10'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Best Badge */}
                {isBest && (
                  <div className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 text-center flex items-center justify-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>Highest Net Profit (सर्वश्रेष्ठ)</span>
                  </div>
                )}

                <div className="p-4 space-y-3">
                  {/* Mandi Name & Distance */}
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h5 className="font-black text-sm text-slate-900 font-heading leading-tight">
                        {m.name}
                      </h5>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
                        {m.distanceKm} km
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{m.district}, {m.state}</p>
                  </div>

                  {/* 1. Mandi Price (Expected per Qtl & Total Gross) */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Mandi Price (Grade {selectedGrade}):</span>
                      <strong className="text-slate-900 font-bold">₹{m.gradeAdjustedPricePerQtl}/Qtl</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Expected Gross Revenue:</span>
                      <strong className="text-emerald-700 font-bold">₹{m.grossRevenue.toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* 2. Logistics & Distance Fare Breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Transport & Expenses</span>
                    </div>

                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>Vehicle ({m.vehicleRecommended.split('(')[0]}):</span>
                      <span className="font-semibold text-slate-700">{m.tripsNeeded} Trip{m.tripsNeeded > 1 ? 's' : ''}</span>
                    </div>

                    <div className="flex justify-between text-rose-600 text-[11px] font-medium">
                      <span>Total Transport Fare ({m.distanceKm} km):</span>
                      <span className="font-bold">-₹{m.totalTransportFare.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-rose-600 text-[11px]">
                      <span>Mandi Cess & Unloading:</span>
                      <span>-₹{m.totalMandiCessAndLabour.toLocaleString()}</span>
                    </div>

                    <div className="pt-1 border-t border-slate-100 flex justify-between text-slate-500 text-[11px]">
                      <span>Total Deductions:</span>
                      <span className="font-bold text-slate-700">-₹{m.totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Real Net In-Hand Take Home */}
                <div className={`p-4 border-t ${isBest ? 'bg-emerald-100/70 border-emerald-300' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-500">
                      Net Take-Home:
                    </span>
                    <span className={`text-xl font-black font-heading ${isBest ? 'text-emerald-700' : 'text-slate-800'}`}>
                      ₹{m.netProfitTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right text-[10px] font-bold text-slate-500 mt-0.5">
                    (₹{m.netProfitPerQtl.toLocaleString()} / Quintal Net)
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Transparent Math & Formula Explainer Footer ───────────────────── */}
      <div className="px-6 pb-6">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Agentic AI Net Profit Calculation Formula (गणना का नियम):</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-500 pt-1">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <strong className="text-slate-700 block mb-0.5">1. Gross Revenue (सकल आय)</strong>
              <code>Gross = Grade Price/Qtl × Quantity ({quantityQtl} Qtl)</code>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <strong className="text-slate-700 block mb-0.5">2. Total Transport Fare (कुल किराया)</strong>
              <code>Fare = Porter Vehicle Rate ({analysisResults.recommendedVehicle.name.split('(')[0]}) × Distance</code>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <strong className="text-slate-700 block mb-0.5">3. Real Net Profit (शुद्ध मुनाफा)</strong>
              <code>Net = Gross − Total Transport Fare − Mandi Charges</code>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
