import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
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
  Zap
} from 'lucide-react';
import { MANDI_COMMODITIES } from '../../data/mandiData';

export default function PricePredictionCard({ t }) {
  const [selectedCropId, setSelectedCropId] = useState('onion');
  const crop = MANDI_COMMODITIES.find((c) => c.id === selectedCropId) || MANDI_COMMODITIES[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
      
      {/* Header Banner */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-900 via-agri-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              AI Market Intelligence Engine (Prophet/ARIMA Time-Series)
            </span>
          </div>
          <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <span>{t.aiPricePrediction} & Sell/Hold Advisory</span>
          </h3>
          <p className="text-xs text-emerald-200/80">
            Real-time multi-mandi arrival analytics & price trajectory forecasting
          </p>
        </div>

        {/* Commodity Selector Pills */}
        <div className="flex flex-wrap gap-1.5">
          {MANDI_COMMODITIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCropId(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCropId === c.id
                  ? 'bg-harvest-500 text-slate-950 shadow-sm ring-2 ring-white/50'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {c.name.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Recommendation & Price Metric Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Current Mandi Price & MSP */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Current APMC Average Rate
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-heading">
                ₹{crop.currentAvgPrice.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">/ Quintal</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-md ${
                crop.trendDirection === 'up' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {crop.trendDirection === 'up' ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                {crop.priceTrend} this week
              </span>
              <span className="text-[11px] text-slate-500">
                Govt MSP: <strong>₹{crop.msp.toLocaleString()}</strong>
              </span>
            </div>
          </div>

          {/* AI Selling Recommendation Banner */}
          <div className={`p-4 rounded-2xl border md:col-span-2 flex flex-col justify-between ${
            crop.aiRecommendation === 'SELL_NOW'
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              : crop.aiRecommendation === 'WAIT_HOLD'
              ? 'bg-amber-50/90 border-amber-300 text-amber-950'
              : 'bg-blue-50/90 border-blue-300 text-blue-950'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-700" />
                AI Smart Recommendation
              </span>
              <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs ${
                crop.aiRecommendation === 'SELL_NOW'
                  ? 'bg-emerald-600 text-white'
                  : crop.aiRecommendation === 'WAIT_HOLD'
                  ? 'bg-amber-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}>
                {crop.aiRecommendation === 'SELL_NOW' ? '🟢 ' + t.sellNow : crop.aiRecommendation === 'WAIT_HOLD' ? '🟡 ' + t.waitHold : '🔵 ' + t.sellInMarket}
              </span>
            </div>
            
            <p className="text-xs leading-relaxed font-medium text-slate-700 mt-1">
              {crop.aiReason}
            </p>
          </div>

        </div>

        {/* 15-Day Forward Price Forecast Chart */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                15-Day Forward Price Forecast Curve (₹/Quintal)
              </h4>
              <p className="text-[11px] text-slate-500">
                Projected trajectory with upper & lower confidence boundaries (95% CI)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-3 h-0.5 bg-emerald-600 inline-block"></span> Predicted Price
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-3 h-3 bg-emerald-100 border border-emerald-300 inline-block rounded-xs"></span> Confidence Band
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={crop.forecast} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#86efac" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#86efac" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} domain={['dataMin - 100', 'dataMax + 100']} tickLine={false} />
                <Tooltip
                  formatter={(val, name) => [
                    `₹${val}/Qtl`,
                    name === 'price' ? 'Predicted Price' : name === 'confidenceMax' ? 'Upper Limit' : 'Lower Limit'
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <ReferenceLine y={crop.msp} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: `MSP: ₹${crop.msp}`, fill: '#b45309', fontSize: 11 }} />
                <Area type="monotone" dataKey="confidenceMax" stroke="#86efac" fill="url(#colorBand)" />
                <Area type="monotone" dataKey="confidenceMin" stroke="#86efac" fill="transparent" />
                <Area type="monotone" dataKey="price" stroke="#15803d" strokeWidth={3} fill="url(#colorPrice)" dot={{ r: 4, fill: '#15803d', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Nearby APMC Mandi Rate Comparison */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Live Rates Across Nearby Mandis for {crop.name}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {crop.mandis.map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-agri-400 transition">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800 font-heading">{m.name}</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {m.distanceKm} km
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{m.district}, {m.state}</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-agri-800">₹{m.price}</span>
                  <span className="text-[11px] text-slate-500">Arrivals: {m.arrival}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Transport: ~₹{m.transportPerQtl}/Q</span>
                  <span className="text-emerald-700 font-bold">{m.buyersActive} Active Buyers</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
