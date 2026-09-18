import React, { useState } from 'react';
import {
  Sprout,
  ArrowRight,
  Building2,
  Layers
} from 'lucide-react';
import HeroCarousel from '../../common/HeroCarousel';

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


      {/* 🎯 ROLE ENTRY QUICK ACCESS — 3 Portals */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => onEnterPanel && onEnterPanel('farmer')}
          className="cursor-pointer group bg-gradient-to-br from-emerald-800 to-green-900 text-white rounded-3xl p-7 shadow-xl shadow-emerald-900/20 border border-emerald-700/30 hover:scale-[1.02] transition-all relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10 blur-2xl" />
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mb-4 text-2xl">👨‍🌾</div>
          <div className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">Farmer Portal</div>
          <h3 className="text-xl font-black font-heading mb-2">Kisan Dashboard</h3>
          <p className="text-xs text-emerald-100/80 leading-relaxed mb-4">
            List your crops, get AI price advisory, compare mandi profits, and connect with verified institutional buyers.
          </p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 group-hover:text-white transition">
            <Sprout className="w-4 h-4" /> Enter Farmer Panel <ArrowRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition" />
          </div>
        </div>

        <div
          onClick={() => onEnterPanel && onEnterPanel('fpo')}
          className="cursor-pointer group bg-gradient-to-br from-amber-800 to-orange-900 text-white rounded-3xl p-7 shadow-xl shadow-amber-900/20 border border-amber-700/30 hover:scale-[1.02] transition-all relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10 blur-2xl" />
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mb-4 text-2xl">🤝</div>
          <div className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">FPO Portal</div>
          <h3 className="text-xl font-black font-heading mb-2">FPO Aggregator</h3>
          <p className="text-xs text-amber-100/80 leading-relaxed mb-4">
            Pool smallholder lots into bulk consignments, unlock institutional contracts, and distribute transparent payouts to members.
          </p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:text-white transition">
            <Layers className="w-4 h-4" /> Enter FPO Panel <ArrowRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition" />
          </div>
        </div>

        <div
          onClick={() => onEnterPanel && onEnterPanel('buyer')}
          className="cursor-pointer group bg-gradient-to-br from-blue-800 to-indigo-900 text-white rounded-3xl p-7 shadow-xl shadow-blue-900/20 border border-blue-700/30 hover:scale-[1.02] transition-all relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10 blur-2xl" />
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mb-4 text-2xl">🏢</div>
          <div className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">Buyer Portal</div>
          <h3 className="text-xl font-black font-heading mb-2">Buyer Hub</h3>
          <p className="text-xs text-blue-100/80 leading-relaxed mb-4">
            Source verified crop lots directly from farmers, post procurement requirements, and manage escrow-protected bulk deals.
          </p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300 group-hover:text-white transition">
            <Building2 className="w-4 h-4" /> Enter Buyer Panel <ArrowRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition" />
          </div>
        </div>
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
