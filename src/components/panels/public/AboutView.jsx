import React from 'react';
import { ShieldCheck, Award, Target, Users, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export default function AboutView({ t }) {
  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-agri-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-800">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-400/30">
              National AgriTech Initiative
            </span>
            <span className="text-xs text-slate-300">Unified Digital Mandi Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight flex items-center">
            About <span className="text-amber-400 font-serif font-black ml-1.5 mr-0.5">अ</span>naaj — THE FARMER'S DIGITAL MARKET
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Smart Market Linkage & Price Discovery Platform empowering Indian agriculture under the Agriculture, FoodTech & Rural Prosperity mission.
          </p>
        </div>
      </div>

      {/* Problem Context & Solution Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <span className="text-xs font-bold uppercase text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            The Problem We Solve
          </span>
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            Distress Selling & Information Asymmetry
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Indian farmers and smallholder FPOs struggle with limited visibility into forward price trends, transport friction, and buyer credibility. Farmers often sell immediately post-harvest due to cash-flow pressures, yielding up to 30% lower returns than potential. Meanwhile, food processors struggle to aggregate consistent volume with verified quality.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-emerald-200 shadow-sm space-y-3 bg-emerald-50/40">
          <span className="text-xs font-bold uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            The अnaaj Solution
          </span>
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            AI Market Intelligence & End-to-End Trade Linkage
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            An integrated market-intelligence and transaction-enablement ecosystem that combines Agmarknet mandi data, AI price trajectories (Prophet/ARIMA), smart net profit calculations, collective FPO lot pooling, verified institutional buyer matching, and pre-authorized escrow payments.
          </p>
        </div>
      </div>

      {/* Tech Stack Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 font-heading">
          Technical Architecture & Stack
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
            <span className="font-bold text-slate-500 uppercase text-[10px]">Frontend UI/UX</span>
            <p className="font-bold text-slate-900 text-sm">React 18 + Tailwind CSS</p>
            <p className="text-slate-500">Meghdoot / Indian Govt design language</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
            <span className="font-bold text-slate-500 uppercase text-[10px]">AI / Time-Series ML</span>
            <p className="font-bold text-slate-900 text-sm">Prophet / ARIMA Models</p>
            <p className="text-slate-500">15-day price trajectory & confidence band</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
            <span className="font-bold text-slate-500 uppercase text-[10px]">Geospatial / GIS</span>
            <p className="font-bold text-slate-900 text-sm">Leaflet / OpenStreetMap</p>
            <p className="text-slate-500">Mandi radius, logistics & cold storages</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
            <span className="font-bold text-slate-500 uppercase text-[10px]">Inclusivity & Offline</span>
            <p className="font-bold text-slate-900 text-sm">SMS / USSD Gateway (56161)</p>
            <p className="text-slate-500">Web Speech API Voice Assistant (HI/MR/EN)</p>
          </div>
        </div>
      </div>

    </div>
  );
}
