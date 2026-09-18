import React, { useState } from 'react';
import {
  Users,
  Layers,
  TrendingUp,
  Package,
  DollarSign,
  Plus,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Percent,
  Download
} from 'lucide-react';
import { INITIAL_FPO_MEMBERS } from '../../../data/sampleLots';
import confetti from 'canvas-confetti';
import PricePredictionCard from '../../common/PricePredictionCard';
import FpoMembershipManager from '../../common/FpoMembershipManager';

export default function FpoDashboard({ t }) {
  const [activeTab, setActiveTab] = useState('aggregation'); // 'aggregation' | 'members' | 'revenue' | 'network'
  const [members, setMembers] = useState(INITIAL_FPO_MEMBERS);
  const [selectedFarmerIds, setSelectedFarmerIds] = useState(['F-101', 'F-102', 'F-103', 'F-104']); // Selected 4 farmers for pooling
  const [bulkLotCreated, setBulkLotCreated] = useState(false);

  // Calculate pooled volume
  const selectedMembers = members.filter((m) => selectedFarmerIds.includes(m.id));
  const pooledQuantityQtl = selectedMembers.reduce((acc, m) => acc + m.lotReadyQtl, 0);
  const bulkPricePerQtl = 2680; // Premium price for 100+ Quintal bulk lot vs individual ₹2,580
  const grossBulkRevenue = pooledQuantityQtl * bulkPricePerQtl;
  const fpoCessPercent = 1.5; // 1.5% FPO management fee
  const fpoCessAmount = Math.round((grossBulkRevenue * fpoCessPercent) / 100);
  const netDistributableRevenue = grossBulkRevenue - fpoCessAmount;

  const toggleFarmerSelection = (id) => {
    if (selectedFarmerIds.includes(id)) {
      setSelectedFarmerIds(selectedFarmerIds.filter((fid) => fid !== id));
    } else {
      setSelectedFarmerIds([...selectedFarmerIds, id]);
    }
  };

  const handleCreateBulkLot = () => {
    setBulkLotCreated(true);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    alert(`🎉 Bulk Commercial Lot of ${pooledQuantityQtl} Quintals Created!\nMatched with Sahyadri Agro Export Division at ₹${bulkPricePerQtl}/Qtl (Premium +₹100/Q over individual rates).\nMember payouts computed automatically.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-harvest-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-amber-800/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-400/30">
                🌾 FPO Aggregator & Collective Selling Engine
              </span>
              <span className="text-xs text-amber-200">Sahyadri Farmers Producer Co. • 500+ Members</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
              Smallholder Lot Pooling & Bulk Selling Engine
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-xl leading-relaxed">
              Combine small 2–5 quintal harvest lots into high-volume commercial consignments to unlock premium institutional buyer contracts and eliminate middleman deductions.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('aggregation')}
            className="px-5 py-3 bg-harvest-500 hover:bg-harvest-400 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-harvest-600/30 transition hover:scale-[1.02]"
          >
            <Layers className="w-4 h-4" />
            <span>Launch Aggregation Engine</span>
          </button>
        </div>

        {/* 4 Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-amber-800/60">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-amber-200 font-medium">Registered Member Farmers</p>
            <p className="text-2xl font-black font-heading mt-1">{members.length * 90} Farmers</p>
            <p className="text-[11px] text-amber-300 mt-1">Across 14 Village Clusters</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-amber-200 font-medium">Ready Harvest Volume</p>
            <p className="text-2xl font-black font-heading mt-1 text-harvest-300">1,850 Quintals</p>
            <p className="text-[11px] text-amber-300 mt-1">Onion & Soybean Lots</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-amber-200 font-medium">Bulk Premium Realization</p>
            <p className="text-2xl font-black font-heading mt-1 text-emerald-400">+₹100 to ₹160/Q</p>
            <p className="text-[11px] text-emerald-300 mt-1">Over Mandi Retail Bids</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-amber-200 font-medium">Total Member Payouts</p>
            <p className="text-2xl font-black font-heading mt-1">₹42.8 Lakhs</p>
            <p className="text-[11px] text-amber-300 mt-1">Direct Bank Transfer (DBT)</p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'aggregation', label: '📦 Collective Selling Engine (Pool Lots)' },
          { id: 'ai-prices', label: '🤖 AI Crop Price Forecast & Selling Advisory' },
          { id: 'membership-requests', label: '👥 Member Join Requests & Roster' },
          { id: 'members', label: '👨🌾 Full Farmer Directory (' + members.length + ')' },
          { id: 'revenue', label: '💰 Member Revenue Distribution Analytics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-amber-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Aggregation Engine Tab */}
      {activeTab === 'aggregation' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Select Individual Farmer Lots to Pool */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-heading">
                    Step 1: Select Smallholder Lots to Aggregate
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tick the farmer lots ready for collective export-grade consignment
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                  {selectedFarmerIds.length} Lots Selected
                </span>
              </div>

              <div className="space-y-2.5">
                {members.map((farmer) => {
                  const isSelected = selectedFarmerIds.includes(farmer.id);
                  return (
                    <div
                      key={farmer.id}
                      onClick={() => toggleFarmerSelection(farmer.id)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 accent-amber-600 rounded"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{farmer.name}</h4>
                          <p className="text-[11px] text-slate-500">{farmer.village} • {farmer.landAcres} Acres land</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-amber-900 font-heading">
                          {farmer.lotReadyQtl} Quintals
                        </span>
                        <span className="block text-[10px] text-slate-400">{farmer.crop} (Grade A)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Bulk Lot Summary & Buyer Contract Match */}
            <div className="bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-3xl p-6 shadow-lg border border-amber-900/50 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-harvest-500/20 text-harvest-300 border border-harvest-400/30">
                  Step 2: AI Bulk Contract Formation
                </span>

                <h3 className="text-xl font-bold font-heading mt-3">
                  Aggregated Bulk Lot Summary
                </h3>
                <p className="text-xs text-amber-200/80 mt-0.5">
                  Pooled from {selectedFarmerIds.length} smallholder farmers
                </p>

                {/* Metrics Breakdown */}
                <div className="mt-5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Combined Volume:</span>
                    <strong className="text-white text-base">{pooledQuantityQtl} Quintals</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Institutional Bulk Rate:</span>
                    <strong className="text-emerald-400 text-base">₹{bulkPricePerQtl}/Qtl</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Individual Retail Price:</span>
                    <span className="line-through text-slate-400">₹2,580/Qtl</span>
                  </div>
                  <div className="flex justify-between text-emerald-300 font-bold pt-1 border-t border-white/10">
                    <span>Total Bulk Value:</span>
                    <span>₹{grossBulkRevenue.toLocaleString()}</span>
                  </div>
                </div>

                {/* AI Buyer Match Alert */}
                <div className="mt-4 p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-200">
                  <Sparkles className="w-5 h-5 text-harvest-400 shrink-0" />
                  <p>
                    Matched with <strong>Sahyadri Agro Processing</strong> (500Q procurement contract) with ₹0 middleman commission!
                  </p>
                </div>
              </div>

              <button
                onClick={handleCreateBulkLot}
                disabled={pooledQuantityQtl === 0}
                className="w-full py-3.5 rounded-2xl bg-harvest-500 hover:bg-harvest-400 text-slate-950 font-black text-xs shadow-lg shadow-harvest-600/30 transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Lock Bulk Sale ({pooledQuantityQtl} Qtl)</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Member Roster Tab */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 font-heading">Registered Member Farmers</h3>
            <button
              onClick={() => alert("Add Member Farmer Form opened")}
              className="px-4 py-2 bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Farmer</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Member ID</th>
                  <th className="py-3 px-4">Farmer Name</th>
                  <th className="py-3 px-4">Village / Block</th>
                  <th className="py-3 px-4">Landholding</th>
                  <th className="py-3 px-4">Crop Ready</th>
                  <th className="py-3 px-4">Available Qtl</th>
                  <th className="py-3 px-4">Bank DBT Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{m.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{m.name}</td>
                    <td className="py-3.5 px-4">{m.village}</td>
                    <td className="py-3.5 px-4">{m.landAcres} Acres</td>
                    <td className="py-3.5 px-4 font-semibold text-amber-800">{m.crop}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{m.lotReadyQtl} Qtl</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Aadhaar Linked
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Revenue Distribution Tab */}
      {activeTab === 'revenue' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-heading">
              Transparent Member Payout Breakdown (Bulk Contract #BC-2026-88)
            </h3>
            <p className="text-xs text-slate-500">
              Automated per-farmer revenue share calculated by volume weightage deducting 1.5% FPO administrative cess.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Gross Contract Value:</span>
              <p className="text-xl font-black text-slate-900 mt-1">₹{grossBulkRevenue.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-xs text-amber-700">FPO Operational Cess (1.5%):</span>
              <p className="text-xl font-black text-amber-900 mt-1">-₹{fpoCessAmount.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs text-emerald-700">Total Transferred via Bank DBT:</span>
              <p className="text-xl font-black text-emerald-900 mt-1">₹{netDistributableRevenue.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Per-Farmer Share Statement:</h4>
            {selectedMembers.map((m) => {
              const farmerGross = m.lotReadyQtl * bulkPricePerQtl;
              const farmerCess = Math.round((farmerGross * fpoCessPercent) / 100);
              const farmerNet = farmerGross - farmerCess;
              return (
                <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{m.name} ({m.village})</h5>
                    <p className="text-[11px] text-slate-500">{m.lotReadyQtl} Quintals @ ₹{bulkPricePerQtl}/Qtl</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-700 font-heading">
                      ₹{farmerNet.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-slate-400">Paid to SBI A/C ending 4412</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Crop Price Forecast & Advisory Tab for FPO */}
      {activeTab === 'ai-prices' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-bold">
              <span className="p-1.5 bg-amber-500 text-slate-950 rounded-lg">🏢 FPO Advisory</span>
              <span>Collective Aggregation Price Intelligence: Evaluate market timing for 500+ Member pooled lots</span>
            </div>
            <span className="text-[11px] text-amber-900 font-semibold bg-white/80 px-2.5 py-1 rounded-md border border-amber-200">
              Optimal liquidation timing minimizes holding depreciation
            </span>
          </div>
          <PricePredictionCard t={t} isFpo={true} />
        </div>
      )}

      {/* Member Join Requests & Roster Management */}
      {activeTab === 'membership-requests' && (
        <FpoMembershipManager currentRole="fpo" />
      )}

    </div>
  );
}
