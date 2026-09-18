import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Info,
  ShieldCheck,
  Zap,
  MapPin,
  Calendar,
  AlertTriangle,
  Scale,
  DollarSign,
  ArrowRight,
  Warehouse,
  Truck,
  HelpCircle,
  BarChart3,
  Landmark,
  Layers,
  Award,
  Radio,
  CloudRain,
  Droplets,
  Bell,
  X
} from 'lucide-react';
import {
  HISTORICAL_PREDICTIVE_CROPS,
  OFFICIAL_PULSE_PRICE_SERIES,
  MULTI_YEAR_PULSE_CHART_DATA
} from '../../data/cropPricePredictionData';
import VoiceInputMic from './VoiceInputMic';
import { getAiPriceForecast } from '../../services/apiClient';
import { createPriceAlert } from '../../services/supabaseClient';


export default function PricePredictionCard({ t = {}, onNavigateToProfitCalc, isFpo = false }) {
  // Mode toggle: 'forecast' (12-mo past + 3-mo future) vs 'govt_benchmark' (Official 2016-2020 Govt Pulse Data)
  const [activeTab, setActiveTab] = useState('forecast');

  // Select active crop & mandi
  const [selectedCropId, setSelectedCropId] = useState('wheat');

  const crop = useMemo(() => {
    return HISTORICAL_PREDICTIVE_CROPS.find(c => c.id === selectedCropId) || HISTORICAL_PREDICTIVE_CROPS[0];
  }, [selectedCropId]);

  const [selectedMandiName, setSelectedMandiName] = useState(crop.mandis[0]?.name || '');

  // Keep selected mandi aligned when crop changes
  const activeMandi = useMemo(() => {
    const found = crop.mandis.find(m => m.name === selectedMandiName);
    return found || crop.mandis[0];
  }, [crop, selectedMandiName]);

  // Holding & Net Profit quick comparison simulator state (default higher quantity for FPO)
  const [holdingQuantityQtl, setHoldingQuantityQtl] = useState(isFpo ? 250 : 50);
  const [storageMonths, setStorageMonths] = useState(2);
  const [customStorageCost, setCustomStorageCost] = useState(crop.storageCostPerQtlMonth || 22);

  // When crop changes, update storage cost default
  const handleCropSelect = (cropId) => {
    setSelectedCropId(cropId);
    const newCrop = HISTORICAL_PREDICTIVE_CROPS.find(c => c.id === cropId);
    if (newCrop) {
      setSelectedMandiName(newCrop.mandis[0].name);
      setCustomStorageCost(newCrop.storageCostPerQtlMonth);
    }
  };

  // Adjust graph timeline data by selected mandi offset
  const adjustedChartData = useMemo(() => {
    const offset = activeMandi?.baseOffset || 0;
    return crop.timelineData.map(item => {
      const hist = item.historicalPrice !== null ? Math.max(500, item.historicalPrice + offset) : null;
      const pred = item.predictedPrice !== null ? Math.max(500, item.predictedPrice + offset) : null;
      const cMin = item.confidenceMin !== null ? Math.max(500, item.confidenceMin + offset) : null;
      const cMax = item.confidenceMax !== null ? Math.max(500, item.confidenceMax + offset) : null;

      return {
        ...item,
        historicalPrice: hist,
        predictedPrice: pred,
        confidenceMin: cMin,
        confidenceMax: cMax,
        // Composite price for single continuous baseline display if needed
        displayPrice: hist !== null ? hist : pred
      };
    });
  }, [crop, activeMandi]);

  // Current mandi adjusted price & predicted peak price
  const currentMandiPrice = useMemo(() => {
    const todayItem = adjustedChartData.find(d => d.isCurrent);
    return todayItem ? todayItem.historicalPrice : crop.currentAvgPrice + (activeMandi?.baseOffset || 0);
  }, [adjustedChartData, crop, activeMandi]);

  const predictedPeakPrice = useMemo(() => {
    const futureItems = adjustedChartData.filter(d => d.isPrediction);
    if (!futureItems.length) return currentMandiPrice;
    const maxItem = futureItems.reduce((prev, curr) => (curr.predictedPrice > prev.predictedPrice ? curr : prev), futureItems[0]);
    return maxItem.predictedPrice;
  }, [adjustedChartData, currentMandiPrice]);

  const priceDiff = predictedPeakPrice - currentMandiPrice;
  const priceDiffPct = ((priceDiff / currentMandiPrice) * 100).toFixed(1);
  const isGain = priceDiff >= 0;

  // Holding Calculator Math
  const transportPerQtl = activeMandi?.transportPerQtl || 50;
  const sellTodayGross = currentMandiPrice * holdingQuantityQtl;
  const sellTodayTransport = transportPerQtl * holdingQuantityQtl;
  const sellTodayNetProfit = sellTodayGross - sellTodayTransport;

  const totalStorageCost = customStorageCost * storageMonths * holdingQuantityQtl;
  const sellLaterGross = predictedPeakPrice * holdingQuantityQtl;
  const sellLaterTransport = transportPerQtl * holdingQuantityQtl;
  const sellLaterNetProfit = sellLaterGross - sellLaterTransport - totalStorageCost;

  const netAdvantage = sellLaterNetProfit - sellTodayNetProfit;
  const isNetBeneficial = netAdvantage > 0;

  // Live Backend FastAPI Integration
  const [liveBackendData, setLiveBackendData] = useState(null);
  const [backendStatus, setBackendStatus] = useState('connecting'); // 'live' | 'fallback' | 'connecting'

  useEffect(() => {
    let isMounted = true;
    async function loadForecast() {
      try {
        const res = await getAiPriceForecast({
          crop: crop.name,
          state: activeMandi?.state || 'Maharashtra',
          mandi: activeMandi?.name || 'Lasalgaon APMC',
          currentPrice: currentMandiPrice
        });
        if (isMounted && res) {
          setLiveBackendData(res);
          setBackendStatus(res.engine?.includes('FastAPI') ? 'live' : 'fallback');
        }
      } catch (e) {
        if (isMounted) setBackendStatus('fallback');
      }
    }
    loadForecast();
    return () => { isMounted = false; };
  }, [crop.name, activeMandi?.name, currentMandiPrice]);

  // Real-Time Price Alert Modal state (Supabase price_alerts)
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertForm, setAlertForm] = useState({
    targetPrice: '',
    condition: 'ABOVE',
    phone: '+91 98231 44521',
    farmerName: 'Dnyaneshwar Patil'
  });
  const [alertSaved, setAlertSaved] = useState(false);
  const [alertSaving, setAlertSaving] = useState(false);

  const handleSaveAlert = async (e) => {
    e.preventDefault();
    setAlertSaving(true);
    try {
      await createPriceAlert({
        farmer_name: alertForm.farmerName,
        phone: alertForm.phone,
        crop_name: crop.name,
        mandi_name: activeMandi.name,
        target_price: Number(alertForm.targetPrice) || predictedPeakPrice,
        condition: alertForm.condition
      });
      setAlertSaved(true);
    } catch (err) {
      console.warn('Failed to save price alert:', err);
    } finally {
      setAlertSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden animate-in fade-in duration-300">
      
      {/* ─── Header Banner & Selectors ────────────────────────────────────────── */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-950 via-agri-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-400/30">
                <Sparkles className="w-3.5 h-3.5 text-harvest-400 animate-pulse" />
                AI Crop Price Forecast & Selling Window
              </span>
              {backendStatus === 'live' ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/30 text-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-400/50 shadow-sm animate-pulse">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  Live Gov Agmarknet Stream (FastAPI)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-200 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-amber-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Govt Benchmark ML Mode
                </span>
              )}
              <span className="text-xs text-emerald-200/70">
                Past 12 Months Historical + 3 Months Prediction
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight flex items-center gap-2">
              <span>{t.aiPricePrediction || 'AI Price Forecast'} & Sell/Hold Advisory</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
              Plan your harvest disposal with machine learning time-series analytics. Compare spot selling today versus holding in WDRA-certified warehouses.
            </p>
          </div>

          {/* Location & Mandi Dropdown */}
          <div className="flex flex-wrap items-center gap-2.5 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/15">
            <div className="flex items-center gap-1.5 text-xs text-emerald-200 px-2 font-medium">
              <MapPin className="w-3.5 h-3.5 text-harvest-400" />
              <span>Target Mandi:</span>
            </div>
            <div className="relative flex items-center">
              <select
                value={selectedMandiName}
                onChange={(e) => setSelectedMandiName(e.target.value)}
                className="bg-slate-900/90 text-white text-xs font-bold rounded-xl pl-3 pr-8 py-2 border border-emerald-400/30 focus:ring-2 focus:ring-harvest-400 focus:outline-hidden"
              >
                {crop.mandis.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name} ({m.district}, {m.state})
                  </option>
                ))}
              </select>
              <VoiceInputMic onResult={setSelectedMandiName} type="dropdown" title="बोलकर मंडी चुनें (Speak Mandi name)" buttonClassName="text-white hover:text-harvest-400 hover:bg-white/10" />
            </div>
          </div>
        </div>


        {/* View Mode Tabs: AI Forecast vs Official Govt Benchmark */}
        <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-4 border-t border-white/10">
          <button
            onClick={() => setActiveTab('forecast')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'forecast'
                ? 'bg-harvest-500 text-slate-950 font-black shadow-md ring-2 ring-white/60'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>12-Month & 3-Month AI Forecast</span>
          </button>
          <button
            onClick={() => setActiveTab('govt_benchmark')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'govt_benchmark'
                ? 'bg-harvest-500 text-slate-950 font-black shadow-md ring-2 ring-white/60'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>🏛️ Official Multi-Year Benchmark (Govt Data 2016–2020)</span>
            <span className="bg-emerald-500/30 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-400/30">
              Verified Pulses
            </span>
          </button>
        </div>

        {/* Commodity Selector Pills (Shown when in Forecast mode) */}
        {activeTab === 'forecast' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-4 scrollbar-thin">
            {HISTORICAL_PREDICTIVE_CROPS.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCropSelect(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedCropId === c.id
                    ? 'bg-harvest-500 text-slate-950 shadow-md ring-2 ring-white/60 font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                <span>{c.name.split('(')[0].trim()}</span>
                {selectedCropId === c.id && <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── TAB CONTENT ────────────────────────────────────────────────────────── */}
      {activeTab === 'govt_benchmark' ? (
        <div className="p-6 space-y-7 bg-slate-50/50">
          
          {/* Government Source Header Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-harvest-400" />
                <span>Official Ministry of Agriculture & e-NAM Verified Dataset</span>
              </div>
              <h4 className="text-xl font-black font-heading text-white">
                Multi-Year Historical Pulse Price Benchmark (2016 – 2020)
              </h4>
              <p className="text-xs text-emerald-100/80 max-w-2xl">
                Real benchmark prices in ₹/Quintal across major wholesale pulse mandis. All predictive holding algorithms, seasonal recovery indicators, and warehouse holding returns are directly derived from these multi-year cyclical patterns.
              </p>
            </div>
            <div className="shrink-0 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Covered Pulses</span>
              <span className="text-lg font-black text-harvest-400 font-heading">Arhar • Urad • Moong</span>
              <span className="text-[10px] text-emerald-300/80 block mt-0.5">5-Year National Benchmark</span>
            </div>
          </div>

          {/* 3 Metric Cards for Arhar, Urad, Moong */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {OFFICIAL_PULSE_PRICE_SERIES.map((pulse) => (
              <div key={pulse.crop} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-400 transition">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-base font-heading">{pulse.commonName}</h5>
                      <span className="text-[11px] text-slate-400 font-serif italic">{pulse.botanical}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Govt Tracked
                    </span>
                  </div>

                  {/* Spot & Historical Range */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Spot</span>
                      <strong className="text-base font-black text-slate-900 font-heading">₹{pulse.currentSpotPrice.toLocaleString()}</strong>
                      <span className="text-[10px] text-slate-500 block">MSP: ₹{pulse.msp2024_26}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">5-Year Avg (2016-20)</span>
                      <strong className="text-base font-black text-slate-700 font-heading">₹{pulse.metrics.fiveYearAverage.toLocaleString()}</strong>
                      <span className="text-[10px] text-emerald-600 font-bold block">{pulse.metrics.recoveryRate2018To2020}</span>
                    </div>
                  </div>

                  {/* Recommendation Insight */}
                  <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Cyclical Strategy:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-emerald-900/90">
                      {pulse.metrics.holdingRecommendation}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Target Peak</span>
                    <strong className="text-sm font-black text-emerald-700">₹{pulse.metrics.targetPeak.toLocaleString()}/Qtl</strong>
                  </div>
                  <button
                    onClick={() => {
                      handleCropSelect(pulse.crop.toLowerCase());
                      setActiveTab('forecast');
                    }}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition"
                  >
                    <span>Forecast 2026</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recharts Multi-Line Comparison Chart (2016 - 2020) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-black text-slate-900 font-heading flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-700" />
                  <span>5-Year Price Trajectory Comparison (2016 – 2020)</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct official Ministry time-series comparison in ₹/Quintal across Arhar, Urad, and Moong.
                </p>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-4 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-amber-800">
                  <span className="w-3 h-1 bg-amber-600 rounded-full inline-block"></span>
                  <span>Arhar (तुअर)</span>
                </div>
                <div className="flex items-center gap-1.5 text-indigo-800">
                  <span className="w-3 h-1 bg-indigo-600 rounded-full inline-block"></span>
                  <span>Urad (उड़द)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <span className="w-3 h-1 bg-emerald-600 rounded-full inline-block"></span>
                  <span>Moong (मूंग)</span>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={MULTI_YEAR_PULSE_CHART_DATA} margin={{ top: 15, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[3000, 9000]} tickFormatter={(v) => `₹${v}`} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      return (
                        <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs min-w-[200px] space-y-1.5">
                          <span className="font-black text-harvest-400 block border-b border-slate-700 pb-1">
                            Year: {label} (Official Benchmark)
                          </span>
                          <div className="flex justify-between text-amber-300">
                            <span>Arhar:</span>
                            <strong className="font-mono font-bold">₹{payload.find(p => p.dataKey === 'Arhar')?.value?.toLocaleString()}/Qtl</strong>
                          </div>
                          <div className="flex justify-between text-indigo-300">
                            <span>Urad:</span>
                            <strong className="font-mono font-bold">₹{payload.find(p => p.dataKey === 'Urad')?.value?.toLocaleString()}/Qtl</strong>
                          </div>
                          <div className="flex justify-between text-emerald-300">
                            <span>Moong:</span>
                            <strong className="font-mono font-bold">₹{payload.find(p => p.dataKey === 'Moong')?.value?.toLocaleString()}/Qtl</strong>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Line type="monotone" dataKey="Arhar" stroke="#d97706" strokeWidth={3} dot={{ r: 5, fill: '#d97706' }} activeDot={{ r: 7 }} />
                  <Line type="monotone" dataKey="Urad" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} activeDot={{ r: 7 }} />
                  <Line type="monotone" dataKey="Moong" stroke="#059669" strokeWidth={3} dot={{ r: 5, fill: '#059669' }} activeDot={{ r: 7 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Exact Benchmark Table Data */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Official Ministry Benchmark Dataset Table (₹ / Quintal)
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                Source: Govt. of India Agmarknet Pulse Archives
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/75 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Crop (फसल)</th>
                    <th className="py-3 px-4 text-center">2016</th>
                    <th className="py-3 px-4 text-center">2017</th>
                    <th className="py-3 px-4 text-center">2018</th>
                    <th className="py-3 px-4 text-center">2019</th>
                    <th className="py-3 px-4 text-center">2020</th>
                    <th className="py-3 px-4 text-center">5-Yr Avg</th>
                    <th className="py-3 px-4">Market Trend Dynamics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  <tr className="hover:bg-amber-50/50">
                    <td className="py-3 px-4 font-black text-amber-950">Arhar (तुअर / अरहर)</td>
                    <td className="py-3 px-4 text-center font-bold text-amber-900">8,011</td>
                    <td className="py-3 px-4 text-center">4,374</td>
                    <td className="py-3 px-4 text-center text-rose-700 font-semibold">4,001 (Trough)</td>
                    <td className="py-3 px-4 text-center">5,016</td>
                    <td className="py-3 px-4 text-center">4,958</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700">5,272</td>
                    <td className="py-3 px-4 text-slate-600">High elasticity; rapid rebound from post-harvest low; optimal holding return.</td>
                  </tr>
                  <tr className="hover:bg-indigo-50/50">
                    <td className="py-3 px-4 font-black text-indigo-950">Urad (उड़द)</td>
                    <td className="py-3 px-4 text-center font-bold text-indigo-900">7,309</td>
                    <td className="py-3 px-4 text-center">3,825</td>
                    <td className="py-3 px-4 text-center text-rose-700 font-semibold">3,760 (Trough)</td>
                    <td className="py-3 px-4 text-center">4,652</td>
                    <td className="py-3 px-4 text-center font-bold text-indigo-700">5,961 (+28%)</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700">5,101</td>
                    <td className="py-3 px-4 text-slate-600">Fastest 2-year recovery (+58.5% rebound); excellent off-season storage value.</td>
                  </tr>
                  <tr className="hover:bg-emerald-50/50">
                    <td className="py-3 px-4 font-black text-emerald-950">Moong (मूंग)</td>
                    <td className="py-3 px-4 text-center">5,479</td>
                    <td className="py-3 px-4 text-center">4,744</td>
                    <td className="py-3 px-4 text-center">4,823</td>
                    <td className="py-3 px-4 text-center font-bold">5,662</td>
                    <td className="py-3 px-4 text-center font-black text-emerald-700">6,216 (Peak)</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700">5,385</td>
                    <td className="py-3 px-4 text-slate-600">Unbroken 4-year bull cycle; lowest drawdown risk; high storage ROI.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-6 space-y-7">

        
        {/* ─── Key Metrics Summary Row (4 High-Impact Cards) ────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Current Spot Mandi Price */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Current Mandi Price</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">Today</span>
            </span>
            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900 font-heading">
                  ₹{currentMandiPrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-semibold">/ Quintal</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                at <strong>{activeMandi.name.split('(')[0]}</strong>
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Govt MSP: <strong>₹{crop.msp.toLocaleString()}</strong></span>
              <span className="text-emerald-700 font-bold">
                {currentMandiPrice >= crop.msp ? 'Above MSP ✓' : 'Below MSP ⚠️'}
              </span>
            </div>
          </div>

          {/* Card 2: Predicted Future Price */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>AI Predicted Peak Price</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Next 90 Days</span>
            </span>
            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-emerald-700 font-heading">
                  ₹{predictedPeakPrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-semibold">/ Quintal</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Expected in <strong>{crop.holdingAdvisory.peakPeriod.split('(')[0]}</strong>
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Expected Change:</span>
              <span className={`font-black flex items-center gap-0.5 ${isGain ? 'text-emerald-700' : 'text-rose-600'}`}>
                {isGain ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {isGain ? `+₹${priceDiff}` : `-₹${Math.abs(priceDiff)}`} ({isGain ? `+${priceDiffPct}%` : `${priceDiffPct}%`})
              </span>
            </div>
            <button
              onClick={() => {
                setAlertForm(prev => ({ ...prev, targetPrice: predictedPeakPrice }));
                setShowAlertModal(true);
              }}
              className="mt-2.5 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>🔔 Set Mandi Price Alert</span>
            </button>
          </div>

          {/* Card 3: AI Recommendation Badge */}
          <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
            crop.holdingAdvisory.recommendation === 'SELL_NOW'
              ? 'bg-rose-50/80 border-rose-300 text-rose-950'
              : crop.holdingAdvisory.recommendation === 'WAIT_HOLD'
              ? 'bg-amber-50/80 border-amber-300 text-amber-950'
              : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
          }`}>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                AI Selling Recommendation
              </span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                crop.holdingAdvisory.recommendation === 'SELL_NOW'
                  ? 'bg-rose-600 text-white'
                  : crop.holdingAdvisory.recommendation === 'WAIT_HOLD'
                  ? 'bg-amber-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {crop.holdingAdvisory.recommendation === 'SELL_NOW'
                  ? '🔴 Sell Now'
                  : crop.holdingAdvisory.recommendation === 'WAIT_HOLD'
                  ? '🟡 Hold & Wait'
                  : '🟢 Sell Later'}
              </span>
            </div>

            <div className="my-2">
              <p className="font-extrabold text-sm font-heading leading-snug">
                {crop.holdingAdvisory.actionText}
              </p>
              <p className="text-[11px] mt-1 leading-relaxed opacity-90 line-clamp-2">
                {crop.holdingAdvisory.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-black/10 text-[11px] font-semibold flex items-center justify-between">
              <span>Best Selling Period:</span>
              <strong className="underline">{crop.holdingAdvisory.peakPeriod.split('(')[0]}</strong>
            </div>
          </div>

          {/* Card 4: Holding Storage Rate & Logistics */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Mandi Logistics & Storage</span>
              <Warehouse className="w-3.5 h-3.5 text-blue-600" />
            </span>
            <div className="my-2 space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Freight to Mandi:</span>
                <strong className="text-slate-900">₹{transportPerQtl}/Qtl ({activeMandi.distanceKm} km)</strong>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Warehouse Charge:</span>
                <strong className="text-slate-900">₹{customStorageCost}/Qtl/Month</strong>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Cold/Dry Storage:</span>
                <span className="text-emerald-700 font-bold">WDRA Reg. Available</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Est. Holding Cost:</span>
              <strong className="text-slate-700">₹{customStorageCost * 2}/Qtl (2 Mos)</strong>
            </div>
          </div>

        </div>

        {/* ─── Real-World Python ML Forecast Engine Stream (Live Backend Telemetry) ─── */}
        {liveBackendData && liveBackendData.forecast && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white border border-emerald-500/40 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-extrabold text-xs sm:text-sm font-heading text-emerald-300">
                  Live ML Forecast Model • {liveBackendData.engine || 'FastAPI Microservice'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-emerald-200/80">
                  Data Stream: <strong className="text-white">{liveBackendData.mandi_data_source || 'Data.gov.in Agmarknet'}</strong>
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30 text-[11px] font-bold">
                  MSP Floor: ₹{liveBackendData.msp_floor || crop.msp}
                </span>
              </div>
            </div>

            {/* 3 Time Horizon Cards (+7d, +15d, +30d) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-emerald-300 text-xs">
                  <span className="font-bold">+7 Days Horizon</span>
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="my-1.5">
                  <span className="text-xl font-black text-white font-heading">
                    ₹{Math.round(liveBackendData.forecast['+7_days']?.modal || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-200/70 block">
                    Range: ₹{Math.round(liveBackendData.forecast['+7_days']?.lower || 0)} – ₹{Math.round(liveBackendData.forecast['+7_days']?.upper || 0)}
                  </span>
                </div>
                <span className="text-[10px] text-slate-300">Short-term Arrival Pressure</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-amber-300 text-xs">
                  <span className="font-bold">+15 Days Horizon</span>
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div className="my-1.5">
                  <span className="text-xl font-black text-white font-heading">
                    ₹{Math.round(liveBackendData.forecast['+15_days']?.modal || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-amber-200/70 block">
                    Range: ₹{Math.round(liveBackendData.forecast['+15_days']?.lower || 0)} – ₹{Math.round(liveBackendData.forecast['+15_days']?.upper || 0)}
                  </span>
                </div>
                <span className="text-[10px] text-slate-300">Seasonal Absorption Curve</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-harvest-400 text-xs">
                  <span className="font-bold">+30 Days Horizon</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="my-1.5">
                  <span className="text-xl font-black text-white font-heading">
                    ₹{Math.round(liveBackendData.forecast['+30_days']?.modal || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-harvest-200/70 block">
                    Range: ₹{Math.round(liveBackendData.forecast['+30_days']?.lower || 0)} – ₹{Math.round(liveBackendData.forecast['+30_days']?.upper || 0)}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-300 font-semibold">Recommended Window: {liveBackendData.best_selling_window}</span>
              </div>
            </div>

            {/* Live Weather & Agricultural Moisture Risk Telemetry */}
            {liveBackendData.weather_telemetry && (
              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-200">
                  <CloudRain className="w-4 h-4 text-sky-400" />
                  <span>
                    <strong>Live {liveBackendData.weather_telemetry.district} Weather ({liveBackendData.weather_telemetry.source}):</strong>{' '}
                    {liveBackendData.weather_telemetry.temperature_c}°C, {liveBackendData.weather_telemetry.conditions} ({liveBackendData.weather_telemetry.humidity_pct}% RH)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    liveBackendData.weather_telemetry.risk_level === 'HIGH'
                      ? 'bg-rose-500/30 text-rose-300 border border-rose-400/40'
                      : liveBackendData.weather_telemetry.risk_level === 'MODERATE'
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-400/40'
                      : 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40'
                  }`}>
                    Moisture Risk: {liveBackendData.weather_telemetry.risk_level}
                  </span>
                  <span className="text-[11px] text-slate-300 italic">
                    {liveBackendData.weather_telemetry.advisory}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Interactive Past 1 Year + 3 Months Prediction Graph ────────────────── */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading">
                  12-Month Historical Mandi Rate & 3-Month AI Projected Trajectory
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Solid green line denotes verified APMC modal transactions. Dashed glowing line with shaded band indicates AI statistical prediction (±5% confidence).
              </p>
            </div>

            {/* Visual Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200 self-start">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-3 h-1 bg-emerald-600 rounded-full inline-block"></span>
                <span>Past Historical (12 Mo)</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-emerald-500 inline-block"></span>
                <span>AI Predicted (3 Mo)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 bg-emerald-200 border border-emerald-400 rounded-xs inline-block"></span>
                <span>Confidence Band</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                <span className="w-2.5 h-0.5 bg-amber-500 inline-block"></span>
                <span>MSP</span>
              </div>
            </div>
          </div>

          {/* Graph Container */}
          <div className="h-80 sm:h-96 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={adjustedChartData} margin={{ top: 15, right: 25, left: -5, bottom: 5 }}>
                <defs>
                  {/* Historical Area Gradient */}
                  <linearGradient id="historicalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>

                  {/* Prediction Confidence Band Gradient */}
                  <linearGradient id="predictionBandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  tick={{ fill: '#475569' }}
                />
                
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  domain={['dataMin - 150', 'dataMax + 200']} 
                  tickLine={false}
                  tickFormatter={(val) => `₹${val}`}
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    const dataPoint = payload[0]?.payload;
                    if (!dataPoint) return null;

                    const isFuture = dataPoint.isPrediction;
                    const isToday = dataPoint.isCurrent;

                    return (
                      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs min-w-[210px] space-y-1.5">
                        <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                          <span className="font-bold text-emerald-300 font-heading">{label}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                            isToday ? 'bg-harvest-400 text-slate-950' : isFuture ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {isToday ? 'Today (Current)' : isFuture ? 'AI Projected' : 'Actual APMC'}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between pt-0.5">
                          <span className="text-slate-400">Modal Price:</span>
                          <span className="text-base font-extrabold text-white">
                            ₹{(dataPoint.historicalPrice || dataPoint.predictedPrice)?.toLocaleString()}/Qtl
                          </span>
                        </div>

                        {isFuture && dataPoint.confidenceMin && (
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Confidence Band:</span>
                            <span className="text-emerald-300 font-mono">
                              ₹{dataPoint.confidenceMin} – ₹{dataPoint.confidenceMax}
                            </span>
                          </div>
                        )}

                        <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800">
                          {dataPoint.note || 'Regular seasonal market arrivals'}
                        </div>
                      </div>
                    );
                  }}
                />

                {/* Vertical demarcation line for Today / Present Date */}
                <ReferenceLine 
                  x="Sep 2026 (Now)" 
                  stroke="#059669" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{ value: "📍 TODAY", position: "top", fill: "#059669", fontSize: 11, fontWeight: 'bold' }} 
                />

                {/* Horizontal reference for Govt MSP */}
                <ReferenceLine 
                  y={crop.msp} 
                  stroke="#d97706" 
                  strokeDasharray="4 4" 
                  label={{ value: `MSP: ₹${crop.msp}`, position: 'right', fill: '#b45309', fontSize: 11 }} 
                />

                {/* Shaded Area for Prediction Confidence Range */}
                <Area 
                  type="monotone" 
                  dataKey="confidenceMax" 
                  stroke="transparent" 
                  fill="url(#predictionBandGrad)" 
                  connectNulls={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="confidenceMin" 
                  stroke="transparent" 
                  fill="#f8fafc" 
                  connectNulls={false}
                />

                {/* Historical Area & Solid Line */}
                <Area 
                  type="monotone" 
                  dataKey="historicalPrice" 
                  stroke="#059669" 
                  strokeWidth={3} 
                  fill="url(#historicalGrad)" 
                  dot={{ r: 3.5, fill: '#059669', strokeWidth: 1.5, stroke: '#fff' }}
                  connectNulls={false}
                />

                {/* Future Predicted Dashed Accent Line */}
                <Line 
                  type="monotone" 
                  dataKey="predictedPrice" 
                  stroke="#10b981" 
                  strokeWidth={3.5} 
                  strokeDasharray="5 5" 
                  dot={{ r: 4.5, fill: '#10b981', strokeWidth: 2, stroke: '#064e3b' }}
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/80 gap-2">
            <span>Data point interval: Monthly modal rate average. AI forecast based on multi-year seasonal decomposition and arrival volume elasticity.</span>
            <span className="font-semibold text-emerald-800">Target APMC: {activeMandi.name}</span>
          </div>
        </div>

        {/* ─── Integrated Net Profit & Holding Cost Calculator ─────────────────────── */}
        <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50/30 to-slate-50 p-6 shadow-sm space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                <Scale className="w-3.5 h-3.5 text-emerald-700" />
                Strategic Decision Matrix: Sell Today vs. Store & Sell Later
              </span>
              <h4 className="text-lg font-black text-slate-900 font-heading mt-1">
                Net Profit Calculator (Considering Storage & Transportation)
              </h4>
              <p className="text-xs text-slate-500">
                Compare your actual in-hand profit after accounting for storage rental, moisture loss reserve, and mandi freight.
              </p>
            </div>

            {onNavigateToProfitCalc && (
              <button
                onClick={onNavigateToProfitCalc}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <span>Open Full Logistics Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Interactive Sliders / Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            
            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>{isFpo ? 'Consortium Lot Volume (Quantity):' : 'Lot Volume (Quantity):'}</span>
                <strong className="text-emerald-700">{holdingQuantityQtl} Quintals</strong>
              </label>
              <input
                type="range"
                min="10"
                max={isFpo ? 2000 : 500}
                step="5"
                value={holdingQuantityQtl}
                onChange={(e) => setHoldingQuantityQtl(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10 Qtl</span>
                <span>{isFpo ? '1,000 Qtl' : '250 Qtl'}</span>
                <span>{isFpo ? '2,000 Qtl' : '500 Qtl'}</span>
              </div>
            </div>

            {/* Storage Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>Planned Storage Duration:</span>
                <strong className="text-emerald-700">{storageMonths} Months</strong>
              </label>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                value={storageMonths}
                onChange={(e) => setStorageMonths(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 Month</span>
                <span>3 Months</span>
                <span>6 Months</span>
              </div>
            </div>

            {/* Storage Cost / Month */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>Storage Cost per Month:</span>
                <strong className="text-emerald-700">₹{customStorageCost}/Qtl/mo</strong>
              </label>
              <input
                type="range"
                min="10"
                max="60"
                step="2"
                value={customStorageCost}
                onChange={(e) => setCustomStorageCost(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹10 (Dry Govt CWC)</span>
                <span>₹35 (Standard)</span>
                <span>₹60 (Cold Chain)</span>
              </div>
            </div>

          </div>

          {/* Side-by-Side Comparison Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Option A: Sell Today */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Option A: Sell Today (Spot Sale)
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Immediate Cash Flow
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Gross Revenue ({holdingQuantityQtl} Q × ₹{currentMandiPrice}):</span>
                  <strong className="text-slate-900">₹{sellTodayGross.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Transport & Loading (₹{transportPerQtl}/Q):</span>
                  <span>-₹{sellTodayTransport.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Storage & Holding Charges:</span>
                  <span>₹0 (None)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Net Take-Home Today
                  </span>
                  <span className="text-2xl font-black text-slate-900 font-heading">
                    ₹{sellTodayNetProfit.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  ₹{Math.round(sellTodayNetProfit / holdingQuantityQtl).toLocaleString()}/Qtl
                </span>
              </div>
            </div>

            {/* Option B: Store and Sell Later */}
            <div className={`rounded-2xl border p-5 space-y-3 shadow-xs ${
              isNetBeneficial 
                ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/20' 
                : 'bg-amber-50/60 border-amber-300'
            }`}>
              <div className="flex items-center justify-between border-b border-black/5 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                  Option B: Store & Sell at AI Peak
                </span>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                  isNetBeneficial ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {isNetBeneficial ? 'Recommended ✓' : 'Holding Not Recommended'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Gross Revenue ({holdingQuantityQtl} Q × ₹{predictedPeakPrice}):</span>
                  <strong className="text-slate-900">₹{sellLaterGross.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Transport to Mandi:</span>
                  <span>-₹{sellLaterTransport.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Warehouse Rent ({storageMonths} Mo @ ₹{customStorageCost}/Q):</span>
                  <span className="font-semibold">-₹{totalStorageCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-black/10 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">
                    Net Take-Home Later
                  </span>
                  <span className={`text-2xl font-black font-heading ${isNetBeneficial ? 'text-emerald-700' : 'text-slate-900'}`}>
                    ₹{sellLaterNetProfit.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  ₹{Math.round(sellLaterNetProfit / holdingQuantityQtl).toLocaleString()}/Qtl
                </span>
              </div>
            </div>

          </div>

          {/* Strategic Decision Highlight Banner */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isNetBeneficial
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
              : 'bg-amber-500 text-slate-950 border-amber-600'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                {isNetBeneficial ? <Sparkles className="w-5 h-5 text-white" /> : <AlertTriangle className="w-5 h-5 text-slate-950" />}
              </div>
              <div>
                <h5 className="font-black text-sm font-heading">
                  {isNetBeneficial
                    ? `Storing for ${storageMonths} month(s) yields an extra ₹${netAdvantage.toLocaleString()} net profit!`
                    : `Selling today is smarter! Holding results in ₹${Math.abs(netAdvantage).toLocaleString()} lower net returns.`}
                </h5>
                <p className="text-xs opacity-90 mt-0.5">
                  {isNetBeneficial
                    ? `After paying ₹${totalStorageCost.toLocaleString()} storage rent, price gains still generate +₹${Math.round(netAdvantage / holdingQuantityQtl)}/Qtl surplus.`
                    : `Anticipated price change (+₹${priceDiff}/Qtl) is not sufficient to cover warehouse charges and quality risk.`}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider block opacity-90">
                Net Advantage
              </span>
              <span className="text-xl font-black font-heading">
                {isNetBeneficial ? `+₹${netAdvantage.toLocaleString()}` : `-₹${Math.abs(netAdvantage).toLocaleString()}`}
              </span>
            </div>
          </div>

        </div>

        {/* ─── Nearby Mandi Comparison Matrix ──────────────────────────────────────── */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Live APMC Price Discovery across Alternative Mandis for {crop.name.split('(')[0]}</span>
            <span className="text-emerald-700 font-semibold text-[11px]">e-NAM Integrated</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {crop.mandis.map((m) => {
              const adjustedPrice = crop.currentAvgPrice + m.baseOffset;
              const isSelected = m.name === activeMandi.name;

              return (
                <div 
                  key={m.name} 
                  onClick={() => setSelectedMandiName(m.name)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    isSelected 
                      ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 font-heading">{m.name.split('(')[0]}</span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      {m.distanceKm} km
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{m.district}, {m.state}</p>
                  
                  <div className="mt-2.5 flex items-baseline justify-between">
                    <span className="text-xl font-extrabold text-slate-900 font-heading">₹{adjustedPrice.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-500">/ Quintal</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span>Freight: ~₹{m.transportPerQtl}/Q</span>
                    <span className={`font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {isSelected ? 'Selected Mandi ✓' : 'Click to Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Mandatory AI Prediction Disclaimer ──────────────────────────────────── */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h6 className="font-bold text-amber-950">
              Disclaimer & AI Market Advisory Notice (सूचना एवं अस्वीकरण):
            </h6>
            <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
              “AI prediction is an estimate based on available market data. Actual prices may vary due to changing market conditions.”
            </p>
            <p className="text-[10px] text-amber-800/80 leading-relaxed">
              Predictions are statistical estimates using multi-year APMC seasonal arrivals, historical trends, and market patterns. Always cross-verify with local APMC market secretaries before transporting grain.
            </p>
          </div>
        </div>

      </div>
      )}

      {/* ─── Real-Time Supabase Price Alert Modal ─── */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Set Mandi Target Price Alert</h3>
                  <p className="text-[11px] text-emerald-700 font-semibold">⚡ Synced with Supabase PostgreSQL</p>
                </div>
              </div>
              <button
                onClick={() => { setShowAlertModal(false); setAlertSaved(false); }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {alertSaved ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2.5">
                <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
                <p className="font-bold text-emerald-900 text-sm">Price Alert Activated & Stored in Supabase!</p>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  We will monitor APMC price movements for <strong>{crop.name}</strong> at <strong>{activeMandi.name}</strong> and alert <strong>{alertForm.phone}</strong> when price is <strong>{alertForm.condition === 'ABOVE' ? 'above' : 'below'} ₹{Number(alertForm.targetPrice).toLocaleString()}/Qtl</strong>.
                </p>
                <button
                  onClick={() => { setAlertSaved(false); setShowAlertModal(false); }}
                  className="mt-2 px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition cursor-pointer shadow-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveAlert} className="space-y-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl text-xs space-y-1.5 border border-slate-200/80">
                  <div className="flex justify-between text-slate-600">
                    <span>Selected Crop:</span>
                    <strong className="text-slate-900">{crop.name}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Target Mandi:</span>
                    <strong className="text-slate-900">{activeMandi.name}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Current Mandi Price:</span>
                    <strong className="text-slate-900">₹{currentMandiPrice.toLocaleString()}/Qtl</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>AI Predicted Peak:</span>
                    <strong className="text-emerald-700">₹{predictedPeakPrice.toLocaleString()}/Qtl</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Alert Trigger Condition</label>
                  <select
                    value={alertForm.condition}
                    onChange={(e) => setAlertForm(p => ({ ...p, condition: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="ABOVE">When price rises ABOVE target (जब कीमत बढ़े)</option>
                    <option value="BELOW">When price falls BELOW target (जब कीमत गिरे)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Price (₹/Quintal) *</label>
                  <input
                    type="number"
                    value={alertForm.targetPrice}
                    onChange={(e) => setAlertForm(p => ({ ...p, targetPrice: e.target.value }))}
                    required
                    min="100"
                    placeholder={`e.g. ${predictedPeakPrice}`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Alert Mobile Number (SMS/WhatsApp) *</label>
                  <input
                    type="tel"
                    value={alertForm.phone}
                    onChange={(e) => setAlertForm(p => ({ ...p, phone: e.target.value }))}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAlertModal(false)}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={alertSaving}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-md shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {alertSaving ? 'Saving to Supabase...' : 'Save & Activate Alert'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

