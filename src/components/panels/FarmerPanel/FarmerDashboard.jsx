import React, { useState } from 'react';
import {
  Sprout,
  TrendingUp,
  Package,
  DollarSign,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  Warehouse,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  Zap,
  Clock,
  Compass
} from 'lucide-react';
import PricePredictionCard from '../../common/PricePredictionCard';
import StorageAiAgent from '../../common/StorageAiAgent';
import NetProfitCalculator from '../../common/NetProfitCalculator';
import WeatherWidget from '../../common/WeatherWidget';
import MandiMap from '../../common/MandiMap';
import CreateLotModal from './CreateLotModal';
import BuyerOffers from './BuyerOffers';
import LogisticsStorage from './LogisticsStorage';
import FarmerGrievance from './FarmerGrievance';
import FpoMembershipManager from '../../common/FpoMembershipManager';

export default function FarmerDashboard({ farmerLots, setFarmerLots, t, lang, onOpenSmsModal, onOpenVoiceBot }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'my-crops' | 'offers' | 'ai-prices' | 'profit-calc' | 'logistics' | 'grievance'
  const [createLotModalOpen, setCreateLotModalOpen] = useState(false);

  const handleAddLot = (newLot) => {
    setFarmerLots([newLot, ...farmerLots]);
  };

  const totalQuintals = farmerLots.reduce((acc, l) => acc + l.quantityQtl, 0);
  const totalOffers = farmerLots.reduce((acc, l) => acc + l.offersCount, 0);
  const estValuation = farmerLots.reduce((acc, l) => acc + (l.expectedPrice * l.quantityQtl), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Welcome & Fast Action Strip */}
      <div className="bg-gradient-to-r from-agri-900 via-agri-800 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-agri-700/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-400/30">
                👨🌾 Farmer Command Center
              </span>
              <span className="text-xs text-emerald-200">Dnyaneshwar Patil • Nashik District</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
              Smart Market Linkage & Crop Sales
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
              Discover real-time mandi prices, predict market trends with AI, compare net profits across mandis, and sell directly to verified institutional buyers.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenVoiceBot}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-emerald-200 rounded-2xl text-xs font-bold border border-white/20 flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Kisan AI Voice Assistant</span>
            </button>

            <button
              onClick={() => setCreateLotModalOpen(true)}
              className="px-5 py-3 bg-harvest-500 hover:bg-harvest-400 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-harvest-600/30 transition hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>{t.lotCreation}</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-emerald-700/50">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-emerald-200 font-medium">Registered Active Lots</p>
            <p className="text-2xl font-black font-heading mt-1">{farmerLots.length} Lots</p>
            <p className="text-[11px] text-emerald-300 mt-1">Total {totalQuintals} Quintals</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-emerald-200 font-medium">Received Buyer Bids</p>
            <p className="text-2xl font-black font-heading mt-1 text-harvest-300">{totalOffers} Offers</p>
            <p className="text-[11px] text-emerald-300 mt-1">From 4 Verified Buyers</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-emerald-200 font-medium">Est. Inventory Value</p>
            <p className="text-2xl font-black font-heading mt-1">₹{estValuation.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-300 mt-1">At Current Market Rates</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-emerald-200 font-medium">AI Market Trend Gauge</p>
            <p className="text-lg font-black font-heading mt-1 text-emerald-300 flex items-center gap-1">
              <Zap className="w-4 h-4 text-harvest-400" />
              <span>SELL ONION 🟢</span>
            </p>
            <p className="text-[11px] text-emerald-300 mt-1">Hold Soybean (+₹200 expected)</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'overview', label: '📊 ' + t.navHome },
          { id: 'my-crops', label: '🌾 ' + t.myCrops + ` (${farmerLots.length})` },
          { id: 'offers', label: '📩 ' + t.buyerOffers + ` (${totalOffers})` },
          { id: 'ai-storage', label: '✨ ' + (t.aiStorageAdvisory || 'AI Storage & Sell Advisory') },
          { id: 'ai-prices', label: '🤖 ' + t.aiPricePrediction },
          { id: 'profit-calc', label: '💡 ' + t.netProfitCalc },
          { id: 'fpo-membership', label: '🤝 Connect to FPO (एफपीओ से जुड़ें)' },
          { id: 'logistics', label: '🚚 ' + (t.dashLogistics || 'Farm Logistics') },
          { id: 'weather', label: '☁️ ' + t.weatherAdvisory },
          { id: 'grievance', label: '🛡️ ' + t.disputeRedressal },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-agri-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Panes */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* AI Sell Now vs Wait Card & Net Profit Quick Highlight */}
          <PricePredictionCard t={t} onNavigateToProfitCalc={() => setActiveTab('profit-calc')} />

          {/* Net Profit Calculator */}
          <NetProfitCalculator t={t} />

          {/* GIS Mandi Map */}
          <MandiMap t={t} />

          {/* Meghdoot Agromet Weather */}
          <WeatherWidget t={t} />

        </div>
      )}

      {activeTab === 'my-crops' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">My Listed Crops & Lots</h3>
              <p className="text-xs text-slate-500">Manage your active listings, grading certificates, and harvest details</p>
            </div>
            <button
              onClick={() => setCreateLotModalOpen(true)}
              className="px-4 py-2.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Lot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {farmerLots.map((lot) => (
              <div key={lot.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
                <img src={lot.image} alt={lot.crop} className="w-full h-44 object-cover" />
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">{lot.id}</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {lot.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 font-heading">{lot.crop}</h4>
                  <p className="text-xs text-slate-500">{lot.variety} • {lot.grade}</p>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Available Volume:</span>
                      <strong className="text-slate-900">{lot.quantityQtl} Quintals</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Moisture Level:</span>
                      <span className="font-semibold text-slate-800">{lot.moisturePercent}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Expected Price:</span>
                      <strong className="text-emerald-700">₹{lot.expectedPrice}/Qtl</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Offers: <strong>{lot.offersCount} Bids</strong></span>
                    <button
                      onClick={() => setActiveTab('offers')}
                      className="text-agri-700 font-bold hover:underline"
                    >
                      View Bids &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'offers' && (
        <BuyerOffers farmerLots={farmerLots} t={t} />
      )}

      {activeTab === 'ai-storage' && (
        <div className="space-y-5 max-w-7xl mx-auto">
          <StorageAiAgent userProfile={{ id: 'farmer-1', name: 'Dnyaneshwar Patil', village: 'Niphad', district: 'Nashik', state: 'Maharashtra' }} />
        </div>
      )}

      {activeTab === 'ai-prices' && (
        <PricePredictionCard t={t} onNavigateToProfitCalc={() => setActiveTab('profit-calc')} />
      )}

      {activeTab === 'profit-calc' && (
        <NetProfitCalculator t={t} />
      )}

      {activeTab === 'fpo-membership' && (
        <FpoMembershipManager currentRole="farmer" />
      )}

      {activeTab === 'logistics' && (
        <LogisticsStorage t={t} />
      )}

      {activeTab === 'weather' && (
        <WeatherWidget t={t} />
      )}

      {activeTab === 'grievance' && (
        <FarmerGrievance t={t} />
      )}

      {/* Lot Creation Modal */}
      <CreateLotModal
        isOpen={createLotModalOpen}
        onClose={() => setCreateLotModalOpen(false)}
        onAddLot={handleAddLot}
      />

    </div>
  );
}
