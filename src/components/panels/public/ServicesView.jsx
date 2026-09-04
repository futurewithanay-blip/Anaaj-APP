import React from 'react';
import {
  Sprout,
  Users,
  Building2,
  TrendingUp,
  Calculator,
  Truck,
  Warehouse,
  ShieldCheck,
  MessageSquare,
  CloudRain,
  Globe,
  Radio,
  Sparkles,
  Smartphone,
  ArrowRight
} from 'lucide-react';

export default function ServicesView({ setCurrentRole, setCurrentView, t }) {
  const farmerFeatures = [
    { num: 1, title: "Farmer Command Dashboard", desc: "Consolidated overview of active crop lots, incoming bids, payments, and market alerts at a glance." },
    { num: 2, title: "My Crop Registry", desc: "List, categorize, and track all registered crops and harvested lots with quality certificates." },
    { num: 3, title: "Lot Creation Studio", desc: "Digital lot creation with quality grade (Grade A/B/C), moisture %, harvest date, and expected MSP." },
    { num: 4, title: "Live APMC Mandi Rates", desc: "Real-time mandi rates from 500+ APMC yards with price trends, arrivals, and MSP comparisons." },
    { num: 5, title: "AI Price Trajectory Forecast", desc: "Prophet/ARIMA time-series models predict price movements 7-15 days ahead with confidence boundaries." },
    { num: 6, title: "True Best Market Discovery", desc: "Recommends markets based on net profit after deducting transport, loading, cess, and storage." },
    { num: 7, title: "Buyer Offer Bidding & Negotiation", desc: "View, accept, reject, or submit real-time counter-bids with verified institutional buyers." },
    { num: 8, title: "End-to-End Order Tracking", desc: "Track your transaction through lot grading, pickup dispatch, weighment slip, and delivery." },
    { num: 9, title: "Escrow Payment Protection", desc: "Pre-authorized digital escrow releases payment straight to your bank account within 24h." },
    { num: 10, title: "Logistics Booking", desc: "Book verified local mini-trucks and pickup tempos with GPS live tracking." },
    { num: 11, title: "Cold Storage & Warehouse Finder", desc: "Discover nearby WDRA-certified cold storages and silos with instant space reservations." },
    { num: 12, title: "Fast-Track Grievance Redressal", desc: "Raise dispute tickets for payment delays or grading discrepancies with APMC ombudsman." },
    { num: 13, title: "Farmer Community Discussion", desc: "Peer-to-peer farmer forum for local price discussions, pest alerts, and harvest tips." },
    { num: 14, title: "Personalized Govt Schemes", desc: "One-click eligibility checker for PM-Kisan, Namo Shetkari, and ₹1 Crop Insurance." },
    { num: 15, title: "Meghdoot Agromet Advisory", desc: "Localized weather forecasts with crop-specific sowing, irrigation, and harvest advisories." },
    { num: 16, title: "Multilingual Voice & SMS Fallback", desc: "Voice assistant in Hindi/Marathi and offline SMS query gateway for low-connectivity zones." },
  ];

  const buyerFeatures = [
    { title: "Procurement Requisition Desk", desc: "Post custom crop demand with quantity, target price, and required quality grade specifications." },
    { title: "AI Compatibility Matchmaking", desc: "Instantly discover farmer lots and FPO bulk consignments matching your exact moisture and volume needs." },
    { title: "Digital Bidding & Real-time Chat", desc: "Send binding price offers, negotiate terms in a live chat thread, and lock agreements." },
    { title: "Escrow Settlement & Transporter Dispatch", desc: "Secure transaction with SBI pre-authorized escrow and integrated freight dispatch." },
    { title: "Buyer Verification Badge", desc: "Build credibility and unlock priority farmer listings with our 5-star verified buyer ranking." },
  ];

  const fpoFeatures = [
    { title: "Member Farmers Roster", desc: "Manage registered smallholders with individual landholdings and crop readiness tracking." },
    { title: "Collective Selling Engine", desc: "Auto-aggregate 20+ smallholder lots into a single commercial consignment (100+ Quintals)." },
    { title: "Bulk Institutional Contracts", desc: "Sell aggregated volumes directly to large flour mills, exporters, and FMCG brands at premium rates." },
    { title: "Automated Member Payouts", desc: "Transparent breakdown of per-farmer revenue share deducting FPO cess with direct DBT payouts." },
    { title: "FPO-to-FPO Network", desc: "Coordinate bulk seed and fertilizer purchases with neighboring FPO federations." },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-agri-950 via-agri-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-agri-700/50">
        <div className="max-w-3xl space-y-3">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-400/30">
            🌾 Complete Platform Feature Matrix
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Comprehensive Digital Agricultural Services
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Designed to address all 30 panel-wise and cross-cutting specifications for Smart India Hackathon 2026 (Problem Statement ID: 26132).
          </p>
        </div>
      </div>

      {/* 👨🌾 Farmer Features Grid (16 Features) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <span>👨🌾 Farmer Panel (16 Core Capabilities)</span>
            </h2>
            <p className="text-xs text-slate-500">Empowering individual cultivators from harvest to bank credit</p>
          </div>
          <button
            onClick={() => {
              setCurrentRole('farmer');
              setCurrentView('home');
            }}
            className="px-4 py-2 bg-agri-700 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-agri-800 transition"
          >
            Launch Farmer Panel &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {farmerFeatures.map((f) => (
            <div key={f.num} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition space-y-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                {f.num}
              </span>
              <h4 className="font-bold text-xs text-slate-900 font-heading">{f.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🌾 FPO Features Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <span>🌾 FPO Aggregator Panel</span>
            </h2>
            <p className="text-xs text-slate-500">Collective lot pooling, bulk institutional selling & revenue sharing</p>
          </div>
          <button
            onClick={() => {
              setCurrentRole('fpo');
              setCurrentView('home');
            }}
            className="px-4 py-2 bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-amber-800 transition"
          >
            Launch FPO Panel &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fpoFeatures.map((f, idx) => (
            <div key={idx} className="p-5 bg-white rounded-2xl border border-amber-200 shadow-2xs space-y-2">
              <h4 className="font-bold text-xs text-slate-900 font-heading">{f.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🏢 Buyer Features Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <span>🏢 Buyer & Processor Hub</span>
            </h2>
            <p className="text-xs text-slate-500">Direct sourcing, AI quality matchmaking & escrow protected orders</p>
          </div>
          <button
            onClick={() => {
              setCurrentRole('buyer');
              setCurrentView('home');
            }}
            className="px-4 py-2 bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-800 transition"
          >
            Launch Buyer Hub &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {buyerFeatures.map((f, idx) => (
            <div key={idx} className="p-5 bg-white rounded-2xl border border-blue-200 shadow-2xs space-y-2">
              <h4 className="font-bold text-xs text-slate-900 font-heading">{f.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
