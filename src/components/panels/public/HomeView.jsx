import React, { useState } from 'react';
import {
  Sprout,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Users,
  Building2,
  PhoneCall,
  Search,
  CheckCircle2,
  Award,
  Layers,
  Globe,
  MapPin,
  HelpCircle,
  Truck
} from 'lucide-react';
import HeroCarousel from '../../common/HeroCarousel';
import PricePredictionCard from '../../common/PricePredictionCard';
import NetProfitCalculator from '../../common/NetProfitCalculator';
import WeatherWidget from '../../common/WeatherWidget';
import MandiMap from '../../common/MandiMap';
import { MANDI_COMMODITIES } from '../../../data/mandiData';

export default function HomeView({
  setCurrentView,
  setCurrentRole,
  onEnterPanel,
  onOpenAuthModal,
  onOpenVoiceBot,
  onOpenSmsModal,
  t,
  lang
}) {
  const [quickSearch, setQuickSearch] = useState('');

  return (
    <div className="space-y-16 animate-in fade-in duration-200">
      
      {/* 🌟 HERO CAROUSEL SECTION (Movable Aesthetic Banner inspired by Meghdoot / Viksit Bharat) */}
      <HeroCarousel
        onEnterPanel={onEnterPanel}
        onOpenVoiceBot={onOpenVoiceBot}
        onOpenSmsModal={onOpenSmsModal}
        onOpenAuthModal={onOpenAuthModal}
        t={t}
        lang={lang}
      />

      {/* 📊 CORE PILLAR MODULES */}
      
      {/* 1. AI Price Forecasting & Sell/Hold Advisory */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {t?.pillar1Badge || "Pillar 1: Price Intelligence"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {t?.pillar1Title || "AI Price Prediction & Sell/Hold Recommendations"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t?.pillar1Desc || "Tackle distress selling with forward 15-day price trajectories and multi-market arrival trends."}
          </p>
        </div>

        <PricePredictionCard t={t} />
      </section>

      {/* 2. Smart Net Profit Discovery Calculator */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {t?.pillar2Badge || "Pillar 2: Real Take-Home Discovery"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {t?.pillar2Title || "True Net Profit Calculator (Not Just Highest Price)"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t?.pillar2Desc || "Deducts transport freight, loading, mandi cess, and storage days to show the truly profitable market."}
          </p>
        </div>

        <NetProfitCalculator t={t} />
      </section>

      {/* 3. GIS Mandi & Cold Storage Map */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            {t?.pillar3Badge || "Pillar 3: Geospatial Discovery"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {t?.pillar3Title || "Interactive APMC Mandi & Storage Map"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t?.pillar3Desc || "Find nearby markets, active buyers, and WDRA accredited cold storages within your district radius."}
          </p>
        </div>

        <MandiMap t={t} />
      </section>

      {/* 4. Meghdoot Agromet Weather Advisory */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            {t?.pillar4Badge || "Pillar 4: Weather & Advisory"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {t?.pillar4Title || "Meghdoot / IMD Agromet District Bulletin"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t?.pillar4Desc || "Localized sowing, pesticide spray, and harvest advisories synchronized with district weather conditions."}
          </p>
        </div>

        <WeatherWidget t={t} />
      </section>

      {/* 🌟 6 KEY PLATFORM DIFFERENTIATORS (SIH 2026 PITCH HIGHLIGHTS) */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            Innovation Highlights
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading">
            Why <span className="text-amber-400 font-serif">अ</span>naaj ("THE FARMER'S DIGITAL MARKET") Changes Rural Trade
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Addressing Problem Statement 26132 for SIH 2026
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-bold text-base font-heading">Net Profit Calculator</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Solves deceptive "high prices in far away mandis" by subtracting actual transport ₹/km, mandi cess, and storage costs to recommend true maximum take-home profit.
            </p>
          </div>

          <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-bold text-base font-heading">Collective Selling Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Auto-aggregates small 2-5 quintal lots from dozens of smallholders into 100+ quintal export lots that attract premium institutional buyers with zero middleman cuts.
            </p>
          </div>

          <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-bold text-base font-heading">AI Sell/Hold Advisory</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Time-series predictive models (Prophet/ARIMA) analyze arrivals, moisture, and futures to protect farmers from post-harvest distress dumping.
            </p>
          </div>

          <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              4
            </div>
            <h4 className="font-bold text-base font-heading">Offline SMS & USSD Fallback</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ensures total inclusivity for low-connectivity rural zones. Farmers with basic feature phones query mandi prices via SMS to 56161 or dial *99*123#.
            </p>
          </div>

          <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
              5
            </div>
            <h4 className="font-bold text-base font-heading">Escrow Payment Protection</h4>
            <p className="text-xs text-slate-700 text-slate-400 leading-relaxed">
              Pre-authorized buyer funds locked in escrow guarantee payment release within 24 hours of weighment receipt, eliminating chronic default risk.
            </p>
          </div>

          <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-harvest-500/20 text-harvest-400 flex items-center justify-center font-bold">
              6
            </div>
            <h4 className="font-bold text-base font-heading">Govt Schemes & Weather Hub</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Single unified window for PM-Kisan, Namo Shetkari, ₹1 Fasal Bima Yojana, and Meghdoot agromet advisories tailored to the farmer's specific crops.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
