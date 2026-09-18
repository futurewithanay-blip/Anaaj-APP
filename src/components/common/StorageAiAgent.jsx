import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Warehouse,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  Send,
  Building2,
  Info,
  ArrowRight,
  Check,
  Phone,
  Layers,
  FileText,
  BadgePercent,
  RefreshCw,
  Zap,
  SlidersHorizontal,
  Navigation
} from 'lucide-react';
import storageAiService, { STORAGE_AI_CROPS } from '../../services/storageAiService';
import { getStorageAdvisory } from '../../services/apiClient';
import { saveWarehouseBooking, fetchWarehouseBookings, isSupabaseConfigured } from '../../services/supabaseClient';
import confetti from 'canvas-confetti';
import VoiceInputMic from './VoiceInputMic';


export default function StorageAiAgent({
  currentRole = 'farmer',
  userProfile = {
    id: 'farmer-dnyaneshwar',
    name: 'Dnyaneshwar Patil',
    village: 'Niphad',
    district: 'Nashik',
    state: 'Maharashtra',
    phone: '+91 98231 44521'
  }
}) {
  // Input parameters
  const [selectedCropId, setSelectedCropId] = useState('wheat');
  const [quantityQtl, setQuantityQtl] = useState(100);
  const [selectedState, setSelectedState] = useState(userProfile.state || 'Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState(userProfile.district || 'Nashik');
  const [customDays, setCustomDays] = useState(null);

  // Agent execution states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [agentStep, setAgentStep] = useState(4); // 1: Ingesting, 2: Volatility, 3: Simulation, 4: Complete
  const [analysisResult, setAnalysisResult] = useState(null);

  // Booking Modal State
  const [selectedWarehouseForBooking, setSelectedWarehouseForBooking] = useState(null);
  const [bookingDays, setBookingDays] = useState(60);
  const [wantsPledgeLoan, setWantsPledgeLoan] = useState(true);
  const [activeBookings, setActiveBookings] = useState([]);
  const [bookingConfirmedToast, setBookingConfirmedToast] = useState(null);

  // Initial calculation & load bookings
  const runEvaluation = async (cropId, qty, state, dist, days) => {
    setIsAnalyzing(true);
    setAgentStep(1);

    setTimeout(() => setAgentStep(2), 200);
    setTimeout(() => setAgentStep(3), 400);

    const cId = cropId || selectedCropId;
    const q = qty || quantityQtl;
    const s = state || selectedState;
    const d = dist || selectedDistrict;
    const holdDays = days !== undefined && days !== null ? days : (customDays || 60);

    const localRes = storageAiService.runAdvisoryAgent({
      cropId: cId,
      quantityQtl: q,
      locationState: s,
      locationDistrict: d,
      customHoldingDays: holdDays
    });

    try {
      const liveBackendRes = await getStorageAdvisory({
        crop: cId,
        quantity_qtl: q,
        holding_days: holdDays,
        custom_monthly_storage_rent: localRes?.financials?.monthlyStorageRatePerQtl || 25,
        interest_rate_pct: 7.0
      });

      setAgentStep(4);
      if (liveBackendRes && liveBackendRes.verdict) {
        setAnalysisResult({
          ...localRes,
          backendEngine: liveBackendRes.engine || 'FastAPI Microservice',
          isBackendLive: true,
          financials: {
            ...localRes.financials,
            immediateMandiGross: liveBackendRes.immediate_revenue,
            totalHoldingCosts: liveBackendRes.storage_cost,
            futureProjectedNet: liveBackendRes.future_net_revenue,
            netGainOrLoss: liveBackendRes.net_gain,
            profitIncreasePercent: liveBackendRes.gain_pct,
            pledgeLoanMaxAmount: liveBackendRes.pledge_loan_amount
          },
          rationale: liveBackendRes.rationale
        });
      } else {
        setAnalysisResult(localRes);
      }
    } catch (e) {
      setAgentStep(4);
      setAnalysisResult(localRes);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    runEvaluation(selectedCropId, quantityQtl, selectedState, selectedDistrict, customDays);
    loadBookings();

    const unsub = storageAiService.subscribe(() => {
      loadBookings();
    });
    return () => unsub();
  }, []);

  const loadBookings = async () => {
    try {
      const dbBookings = await fetchWarehouseBookings(userProfile?.phone);
      if (dbBookings && dbBookings.length > 0) {
        const formatted = dbBookings.map(b => ({
          id: b.booking_code || b.id,
          warehouseName: b.warehouse_name,
          cropName: b.crop_name,
          quantityQtl: b.quantity_qtl,
          durationDays: b.holding_days,
          totalCost: b.total_rent,
          pledgeLoanAmount: b.pledge_loan_amount,
          pledgeLoanOpted: b.pledge_loan_opted,
          bookingDate: b.created_at ? new Date(b.created_at).toLocaleDateString() : 'Recent',
          status: b.status || 'CONFIRMED'
        }));
        setActiveBookings(formatted);
      } else {
        setActiveBookings(storageAiService.getBookings());
      }
    } catch (e) {
      setActiveBookings(storageAiService.getBookings());
    }
  };

  const handleCropChange = (newCropId) => {
    setSelectedCropId(newCropId);
    setCustomDays(null);
    runEvaluation(newCropId, quantityQtl, selectedState, selectedDistrict, null);
  };

  const handleQuantityChange = (newQty) => {
    const val = Math.max(5, Number(newQty) || 5);
    setQuantityQtl(val);
    runEvaluation(selectedCropId, val, selectedState, selectedDistrict, customDays);
  };

  const handleConfirmStorageBooking = async (e) => {
    e.preventDefault();
    if (!selectedWarehouseForBooking) return;

    const booking = storageAiService.createBooking({
      warehouseId: selectedWarehouseForBooking.id,
      warehouseName: selectedWarehouseForBooking.name,
      farmerId: userProfile.id,
      farmerName: userProfile.name,
      cropName: analysisResult?.crop?.name || 'Selected Crop',
      quantityQtl: quantityQtl,
      durationDays: bookingDays,
      dailyRate: selectedWarehouseForBooking.ratePerQtlDay,
      location: `${userProfile.village || 'Niphad'}, ${selectedDistrict}`
    });

    const dbRes = await saveWarehouseBooking({
      booking_code: booking.id,
      user_id: userProfile.id,
      user_name: userProfile.name,
      user_phone: userProfile.phone,
      user_district: selectedDistrict,
      user_state: selectedState,
      crop_name: analysisResult?.crop?.name || 'Selected Crop',
      quantity_qtl: quantityQtl,
      warehouse_name: selectedWarehouseForBooking.name,
      warehouse_location: `${userProfile.village || 'Niphad'}, ${selectedDistrict}`,
      holding_days: bookingDays,
      monthly_rent_per_qtl: (selectedWarehouseForBooking.ratePerQtlDay || 1) * 30,
      total_rent: (selectedWarehouseForBooking.ratePerQtlDay || 1) * bookingDays * quantityQtl,
      pledge_loan_opted: wantsPledgeLoan,
      pledge_loan_amount: analysisResult?.financials?.pledgeLoanMaxAmount || 0
    });

    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    const storageNotice = dbRes?.source === 'supabase' ? ' (Saved to Supabase PostgreSQL)' : '';
    setBookingConfirmedToast(
      `🎉 Storage Confirmed: ${booking.id}! e-NWR Receipt ${booking.enwrReceiptNo} generated.${storageNotice}`
    );
    setSelectedWarehouseForBooking(null);
    await loadBookings();
    setTimeout(() => setBookingConfirmedToast(null), 6000);
  };

  if (!analysisResult) return null;

  const { crop, financials, harvestCycle, liveMarketDynamics, nearbyStorages } = analysisResult;
  const isStoreAdvised = analysisResult.verdict === 'STORE_AND_SELL_LATER';

  return (
    <div className="space-y-6">

      {/* ─── AGENTIC HERO HEADER ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-agri-950 to-emerald-950 p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>AGENTIC AI STORAGE ADVISORY • फसल भंडारण एवं बिक्री सलाहकार</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
              Smart Crop Storage & Sell/Hold Advisory AI
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Autonomous reasoning based on <strong>12-month historical harvest price cycles</strong>,
              live APMC spot fluctuations, cold storage rental economics, and instant <strong>70% e-NWR pledge loans</strong>.
            </p>
          </div>

          {/* Live Agent Status Card */}
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 min-w-[240px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-200 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {isSupabaseConfigured()
                  ? 'Supabase PostgreSQL'
                  : analysisResult.isBackendLive
                  ? 'Live FastAPI Backend'
                  : 'Live Agent Engine'}
              </span>
              <span className="text-[10px] font-mono text-emerald-300">
                {isSupabaseConfigured() ? 'Cloud DB Synced' : analysisResult.isBackendLive ? 'WDRA Microservice' : 'v2.4 Autonomous'}
              </span>
            </div>
            <p className="text-xs text-slate-200">
              Analyzing Mandi: <strong className="text-white">{selectedDistrict} APMC</strong>
            </p>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10 text-emerald-100">
              <span>Confidence Score:</span>
              <strong className="text-emerald-300 font-extrabold">{analysisResult.confidenceScore}%</strong>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Booking Toast */}
      {bookingConfirmedToast && (
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-xl flex items-center justify-between animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">❄️</div>
            <div>
              <p className="font-black text-sm">{bookingConfirmedToast}</p>
              <p className="text-xs text-emerald-100">Warehouse manager notified. Token entry slot locked.</p>
            </div>
          </div>
          <button onClick={() => setBookingConfirmedToast(null)} className="text-white hover:text-emerald-200 text-sm font-bold">✕</button>
        </div>
      )}

      {/* ─── STEP 1: INTERACTIVE CROP & LOCATION INPUT FORM ──────────────────── */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-base text-slate-900 font-heading flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>1. Enter Crop Harvest Details & Location</span>
            </h3>
            <p className="text-xs text-slate-500">
              Provide your harvested volume and farm region to initiate autonomous cost-benefit analysis.
            </p>
          </div>
          <button
            onClick={() => runEvaluation(selectedCropId, quantityQtl, selectedState, selectedDistrict, customDays)}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing Cycle...' : 'Re-Run AI Analysis'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          {/* Crop Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Select Crop (फसल चुनें) *
            </label>
            <div className="relative flex items-center">
              <select
                value={selectedCropId}
                onChange={(e) => handleCropChange(e.target.value)}
                className="w-full px-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
              >
                {STORAGE_AI_CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <VoiceInputMic onResult={handleCropChange} type="dropdown" title="बोलकर फसल चुनें (Speak Crop)" />
            </div>
          </div>

          {/* Harvest Quantity */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Harvest Volume (मात्रा - क्विंटल में) *
            </label>
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1 flex items-center">
                <input
                  type="number"
                  min="5"
                  max="10000"
                  value={quantityQtl}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="w-full px-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <VoiceInputMic onResult={handleQuantityChange} type="number" title="बोलकर मात्रा बताएं (Speak Quantity in Qtl)" />
              </div>
              <span className="font-bold text-slate-500 text-xs shrink-0">Quintals</span>
            </div>
            <div className="flex gap-1 mt-1.5">
              {[50, 100, 250, 500].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleQuantityChange(q)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition ${
                    quantityQtl === q
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {q} Qtl
                </button>
              ))}
            </div>
          </div>

          {/* State */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              State (राज्य)
            </label>
            <div className="relative flex items-center">
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  runEvaluation(selectedCropId, quantityQtl, e.target.value, selectedDistrict, customDays);
                }}
                className="w-full px-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
              >
                {['Maharashtra', 'Madhya Pradesh', 'Punjab', 'Gujarat', 'Rajasthan', 'Haryana', 'Uttar Pradesh'].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <VoiceInputMic
                onResult={(val) => {
                  setSelectedState(val);
                  runEvaluation(selectedCropId, quantityQtl, val, selectedDistrict, customDays);
                }}
                type="dropdown"
                title="बोलकर राज्य चुनें (Speak State)"
              />
            </div>
          </div>

          {/* District / Mandi */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              District / Cluster (जिला / मंडी क्षेत्र)
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                }}
                onBlur={() => runEvaluation(selectedCropId, quantityQtl, selectedState, selectedDistrict, customDays)}
                placeholder="e.g. Nashik, Indore, Ludhiana"
                className="w-full px-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <VoiceInputMic
                onResult={(val) => {
                  setSelectedDistrict(val);
                  runEvaluation(selectedCropId, quantityQtl, selectedState, val, customDays);
                }}
                title="बोलकर जिला बताएं (Speak District)"
              />
            </div>
          </div>

        </div>


        {/* Dynamic Simulation Stepper during analysis */}
        {isAnalyzing && (
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Zap className="w-4 h-4 text-emerald-600 animate-bounce" />
              <span>Autonomous AI Reasoning in Progress...</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
              <div className={`p-2 rounded-xl flex items-center gap-2 ${agentStep >= 1 ? 'bg-emerald-100 text-emerald-900 font-bold' : 'bg-white text-slate-400'}`}>
                <span>{agentStep > 1 ? '✓' : '1.'}</span>
                <span>Ingesting 12M Harvest Cycles</span>
              </div>
              <div className={`p-2 rounded-xl flex items-center gap-2 ${agentStep >= 2 ? 'bg-emerald-100 text-emerald-900 font-bold' : 'bg-white text-slate-400'}`}>
                <span>{agentStep > 2 ? '✓' : '2.'}</span>
                <span>Live APMC Volatility Check</span>
              </div>
              <div className={`p-2 rounded-xl flex items-center gap-2 ${agentStep >= 3 ? 'bg-emerald-100 text-emerald-900 font-bold' : 'bg-white text-slate-400'}`}>
                <span>{agentStep > 3 ? '✓' : '3.'}</span>
                <span>Storage Cost & Net ROI Sim</span>
              </div>
              <div className={`p-2 rounded-xl flex items-center gap-2 ${agentStep >= 4 ? 'bg-emerald-100 text-emerald-900 font-bold' : 'bg-white text-slate-400'}`}>
                <span>4.</span>
                <span>Synthesizing Recommendation</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── STEP 2: SMART ADVISORY DECISION HERO ────────────────────────────── */}
      <div className={`p-6 sm:p-7 rounded-3xl border-2 shadow-sm space-y-5 transition ${
        isStoreAdvised
          ? 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/60 border-emerald-500/80 ring-2 ring-emerald-500/10'
          : 'bg-gradient-to-br from-rose-50/90 via-white to-amber-50/60 border-rose-400/80 ring-2 ring-rose-500/10'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs ${
                isStoreAdvised ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {isStoreAdvised ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{analysisResult.badgeText}</span>
              </span>

              <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-700">
                Confidence: <strong className="text-emerald-700">{analysisResult.confidenceScore}%</strong>
              </span>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600">
                Target Window: <strong>{analysisResult.projectedTimeframe}</strong>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
              {isStoreAdvised 
                ? `Hold in Storage: Projected Net Extra Gain of +₹${Math.abs(financials.netProfitDifference).toLocaleString('en-IN')}`
                : `Sell Now: Downward Glut Pressure of -₹${Math.abs(financials.netProfitDifference).toLocaleString('en-IN')} if Stored`
              }
            </h3>

            <p className="text-sm font-semibold text-slate-700 leading-relaxed">
              {analysisResult.aiSummaryHindi}
            </p>
            <p className="text-xs text-slate-500 italic">
              "{analysisResult.aiSummaryEnglish}"
            </p>
          </div>

          {/* Quick Net ROI Badge */}
          <div className={`p-4 rounded-2xl border text-center shrink-0 min-w-[170px] ${
            isStoreAdvised
              ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
              : 'bg-rose-100/70 border-rose-300 text-rose-950'
          }`}>
            <span className="text-[10px] font-black uppercase tracking-wider block text-slate-500">
              Net Financial Impact
            </span>
            <span className={`text-2xl font-black block mt-0.5 ${isStoreAdvised ? 'text-emerald-700' : 'text-rose-700'}`}>
              {financials.netProfitDifference >= 0 ? '+' : ''}₹{financials.netProfitDifference.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold">
              ({financials.netRoiPercent >= 0 ? '+' : ''}{financials.netRoiPercent}% Net ROI)
            </span>
          </div>
        </div>

        {/* Comparative Cards: Option A (Sell Today) vs Option B (Store & Sell at Peak) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Option A: Sell Today */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase">Option A: Sell Immediately Today</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Zero Storage Cost</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Current Mandi Spot Rate:</span>
                <strong className="text-slate-900">₹{financials.currentSpotPrice} / Quintal</strong>
              </div>
              <div className="flex justify-between">
                <span>Quantity Dispatched:</span>
                <strong className="text-slate-900">{quantityQtl} Quintals</strong>
              </div>
              <div className="flex justify-between">
                <span>Storage & Handling Expense:</span>
                <span className="text-slate-400">₹0 (Instant liquidation)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                <span>Immediate Cash Realization:</span>
                <span className="text-slate-900">₹{financials.revenueToday.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Option B: Store in Cold Storage / Silo */}
          <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 shadow-xs ${
            isStoreAdvised
              ? 'bg-emerald-50/80 border-emerald-300'
              : 'bg-slate-50 border-slate-200 opacity-90'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
              <span className="text-xs font-black text-emerald-900 uppercase">
                Option B: Store for {analysisResult.holdingDays} Days (AI Recommended)
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-2xs">
                Peak Price Harvest
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Projected Peak Mandi Rate:</span>
                <strong className="text-emerald-800 font-extrabold">₹{financials.projectedFuturePrice} / Qtl</strong>
              </div>
              <div className="flex justify-between">
                <span>Net Quantity (after {crop.shrinkageRatePercent}% shrinkage):</span>
                <strong className="text-slate-900">{financials.effectiveSoldQtl} Qtl</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Total Storage + Inward/Outward Rent:</span>
                <span className="text-rose-700 font-bold">-₹{financials.totalHoldingExpense.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-emerald-200 text-sm font-black text-emerald-950">
                <span>Net Profit After Storage Costs:</span>
                <span className="text-emerald-800">₹{financials.netFutureRevenue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Instant e-NWR 70% Pledge Loan Banner */}
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-sky-950">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-sky-100 text-sky-700 rounded-xl shrink-0">
              <Building2 className="w-4 h-4" />
            </span>
            <div>
              <span className="font-extrabold block text-sky-900">
                Need Cash While Storing? Instant 70% e-NWR Warehouse Pledge Loan Eligible!
              </span>
              <p className="text-[11px] text-sky-800">
                Deposit in accredited warehouse to unlock <strong className="font-black text-sky-950">₹{financials.eNwrPledgeLoanValue.toLocaleString('en-IN')}</strong> at 7% p.a. interest without distress selling!
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="px-3 py-1 bg-sky-700 text-white font-extrabold rounded-xl shadow-xs text-xs">
              Eligible: ₹{financials.eNwrPledgeLoanValue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

      </div>

      {/* ─── STEP 3: DEEP MARKET DYNAMICS & HISTORICAL CYCLE INSIGHTS ───────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Past Year Harvest Price Cycle */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Calendar className="w-4 h-4 text-amber-600" />
            <h4 className="font-black text-sm text-slate-900 font-heading">
              Past Year Harvest Cycle (गत वर्ष का मूल्य चक्र)
            </h4>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-900 block">Harvest Period & Arrival Glut:</span>
              <p className="font-semibold text-amber-950">{harvestCycle.harvestPeriod}</p>
              <p className="text-[11px] text-amber-900 font-medium">{harvestCycle.glutArrivalPriceDip}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Past Year Harvest Rate:</span>
                <strong className="text-slate-900 text-sm">₹{harvestCycle.pastYearHarvestPrice} / Qtl</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Post-Harvest 60D Rate:</span>
                <strong className="text-emerald-700 text-sm">₹{harvestCycle.pastYearPostHarvest60DPrice} / Qtl</strong>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-700 flex justify-between items-center">
              <span>Historical Post-Harvest Price Jump:</span>
              <strong className="font-black text-emerald-700">{harvestCycle.pastYearGainPercent}</strong>
            </div>
          </div>
        </div>

        {/* Live Fluctuating Mandi Dynamics */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h4 className="font-black text-sm text-slate-900 font-heading">
              Live Mandi Price Fluctuations (ताज़ा मंडी उतार-चढ़ाव)
            </h4>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Daily Arrival Velocity:</span>
              <strong className="text-slate-900">{liveMarketDynamics.dailyArrivalTrend}</strong>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Institutional Buyer Demand:</span>
              <strong className="text-emerald-700">{liveMarketDynamics.buyerDemand}</strong>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">Recent Spot Volatility:</span>
              <strong className="text-slate-900">{liveMarketDynamics.spotVolatility}</strong>
            </div>

            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900">
              <strong>Government MSP Floor:</strong> ₹{crop.msp} / Quintal (Current spot is ₹{financials.currentSpotPrice - crop.msp >= 0 ? `+${financials.currentSpotPrice - crop.msp}` : `${financials.currentSpotPrice - crop.msp}`} vs MSP)
            </div>
          </div>
        </div>

      </div>

      {/* ─── STEP 4: NEARBY COLD STORAGES & DIRECT 1-CLICK BOOKING ───────────── */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-base text-slate-900 font-heading flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-sky-600" />
              <span>Recommended Nearby Storage Facilities ({nearbyStorages.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              WDRA accredited warehouses suitable for {crop.name} with verified space and e-NWR loan facilities.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 self-start sm:self-auto">
            📍 Sorted by closest distance to {selectedDistrict}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyStorages.map((wh) => (
            <div
              key={wh.id}
              className="p-5 rounded-3xl border border-slate-200 hover:border-sky-400 bg-white transition space-y-4 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Distance Header */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl text-xs font-black bg-sky-600 text-white shadow-xs flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{wh.distanceKm} km away</span>
                  </span>
                  <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    ★ {wh.rating}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 font-heading leading-snug">
                    {wh.name}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{wh.village}, {wh.district}</span>
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                    {wh.type}
                  </span>
                </div>

                {/* Storage Rates & Capacity */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Available Space:</span>
                    <strong className="text-emerald-700">{wh.availableCapacityMt} MT</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Rental:</span>
                    <strong className="text-slate-900">₹{wh.ratePerQtlMonth} / Qtl</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Daily Storage Rate:</span>
                    <span className="font-bold text-slate-700">₹{wh.ratePerQtlDay} / Qtl / Day</span>
                  </div>
                  <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500">
                    ✓ {wh.accreditation}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => setSelectedWarehouseForBooking(wh)}
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                >
                  <Warehouse className="w-3.5 h-3.5" />
                  <span>Reserve Space</span>
                </button>
                <a
                  href={`tel:${wh.phone}`}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center"
                  title="Call Warehouse"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── ACTIVE STORAGE BOOKINGS & RECEIPTS ROSTER ───────────────────────── */}
      {activeBookings.length > 0 && (
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>My Active Stored Lots & e-NWR Receipts ({activeBookings.length})</span>
            </h4>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-lg">
              Live WDRA Backed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBookings.map((b) => (
              <div key={b.id} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Receipt: {b.enwrReceiptNo}
                    </span>
                    <h5 className="font-extrabold text-sm text-slate-900 mt-1">{b.warehouseName}</h5>
                    <p className="text-xs text-slate-500">{b.location} • Booked ID: {b.id}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Commodity:</span>
                    <strong className="text-slate-900">{b.cropName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Quantity:</span>
                    <strong className="text-emerald-700">{b.quantityQtl} Quintals</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Valid Till:</span>
                    <strong className="text-slate-900">{b.expiryDate}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">Pledge Loan Liquidity: <strong>₹{b.pledgeLoanEligible?.toLocaleString('en-IN')}</strong></span>
                  <button
                    onClick={() => storageAiService.cancelBooking(b.id)}
                    className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Release / Liquidate Lot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── MODAL: 1-CLICK SPACE RESERVATION ───────────────────────────────── */}
      {selectedWarehouseForBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full uppercase">
                  Storage Space Reservation
                </span>
                <h3 className="font-black text-slate-900 text-base font-heading mt-1">
                  Book Storage at {selectedWarehouseForBooking.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedWarehouseForBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmStorageBooking} className="space-y-4 text-xs">
              
              {/* Facility Summary */}
              <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-1">
                <div className="flex justify-between font-extrabold text-sky-950">
                  <span>{selectedWarehouseForBooking.name}</span>
                  <span>{selectedWarehouseForBooking.distanceKm} km away</span>
                </div>
                <p className="text-[11px] text-sky-800">
                  {selectedWarehouseForBooking.village}, {selectedWarehouseForBooking.district} • Rate: ₹{selectedWarehouseForBooking.ratePerQtlDay}/Qtl/day
                </p>
              </div>

              {/* Crop & Quantity Display */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Crop to Store:</span>
                  <strong className="text-slate-900 text-sm">{crop.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Stored Quantity:</span>
                  <strong className="text-emerald-700 text-sm">{quantityQtl} Quintals</strong>
                </div>
              </div>

              {/* Storage Duration */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Select Storage Duration (भंडारण अवधि) *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 60, 75, 90].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setBookingDays(d)}
                      className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        bookingDays === d
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost & Pledge Loan Summary */}
              <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-1 text-emerald-950">
                <div className="flex justify-between">
                  <span>Estimated Total Rental ({bookingDays} days):</span>
                  <strong>₹{Math.round(quantityQtl * selectedWarehouseForBooking.ratePerQtlDay * bookingDays).toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Inward Quality Assaying & Token:</span>
                  <span className="text-emerald-800">Included (Free)</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-emerald-200 text-sm font-black">
                  <span>Instant e-NWR 70% Loan Eligible:</span>
                  <span className="text-emerald-700">₹{financials.eNwrPledgeLoanValue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Pledge Loan Checkbox */}
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={wantsPledgeLoan}
                  onChange={(e) => setWantsPledgeLoan(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="text-[11px] font-semibold">
                  Generate instant e-NWR Negotiable Warehouse Receipt for bank pledge loan
                </span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedWarehouseForBooking(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Space Booking</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
