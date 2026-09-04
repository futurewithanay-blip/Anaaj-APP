import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  Plus,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Truck,
  Star,
  Clock,
  ArrowRight,
  Send,
  X
} from 'lucide-react';
import { INITIAL_BUYER_REQUIREMENTS } from '../../../data/sampleLots';
import confetti from 'canvas-confetti';

export default function BuyerDashboard({ farmerLots, t }) {
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'requirements' | 'orders'
  const [requirements, setRequirements] = useState(INITIAL_BUYER_REQUIREMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('all');
  const [showPostReqModal, setShowPostReqModal] = useState(false);

  // New Requirement form state
  const [newReqCrop, setNewReqCrop] = useState('Onion');
  const [newReqQty, setNewReqQty] = useState(300);
  const [newReqPrice, setNewReqPrice] = useState(2650);
  const [newReqLocation, setNewReqLocation] = useState('Nashik Processing Plant');

  // Offer submission modal state
  const [selectedLotForOffer, setSelectedLotForOffer] = useState(null);
  const [offerPrice, setOfferPrice] = useState(2640);
  const [pickupType, setPickupType] = useState('buyer_pickup');

  // Filter farmer lots
  const filteredLots = farmerLots.filter((lot) => {
    const matchesQuery = lot.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.grade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = selectedCropFilter === 'all' || lot.crop.toLowerCase().includes(selectedCropFilter.toLowerCase());
    return matchesQuery && matchesCrop;
  });

  const handleCreateRequirement = (e) => {
    e.preventDefault();
    const newReq = {
      id: `REQ-${Math.floor(7700 + Math.random() * 200)}`,
      buyerName: "ITC Agri Procurement Ltd",
      buyerType: "Flour Miller & Exporter",
      crop: newReqCrop,
      requiredQuantityQtl: Number(newReqQty),
      preferredGrade: "Grade A / Export Quality",
      maxMoisture: "11%",
      maxPriceOffered: Number(newReqPrice),
      deliveryLocation: newReqLocation,
      fulfillmentTimeline: "Within 5 days",
      status: "Open Bidding",
      verifiedScore: 99
    };
    setRequirements([newReq, ...requirements]);
    setShowPostReqModal(false);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    alert("Requirement posted! AI matching engine is notifying 120+ verified farmers in Maharashtra & MP.");
  };

  const handleSubmitOffer = (e) => {
    e.preventDefault();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    alert(`💼 Digital Offer of ₹${offerPrice}/Qtl submitted for Lot ${selectedLotForOffer.id}!\nEscrow funds pre-authorized. Farmer has been notified.`);
    setSelectedLotForOffer(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-blue-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-blue-400/30">
                🏢 Institutional Buyer & Processor Desk
              </span>
              <span className="text-xs text-blue-200">Sahyadri Agro / ITC Ltd • Verified Buyer Badge (99%)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
              Direct Farmer & FPO Procurement Gateway
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Source consistent commercial volumes directly from verified smallholder farmers and FPO aggregation hubs with digital quality assay certificates and escrow settlements.
            </p>
          </div>

          <button
            onClick={() => setShowPostReqModal(true)}
            className="px-5 py-3 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-blue-500/30 transition hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Post Procurement Requirement</span>
          </button>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-blue-900/60">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-blue-200 font-medium">Active Demand Postings</p>
            <p className="text-2xl font-black font-heading mt-1">{requirements.length} Requirements</p>
            <p className="text-[11px] text-blue-300 mt-1">2,500 Quintals Target Volume</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-blue-200 font-medium">Available Farmer Inventory</p>
            <p className="text-2xl font-black font-heading mt-1">{farmerLots.length} Live Lots</p>
            <p className="text-[11px] text-emerald-300 mt-1">AI Verified Assay Grades</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-blue-200 font-medium">Escrow Security Fund</p>
            <p className="text-2xl font-black font-heading mt-1">₹45,00,000</p>
            <p className="text-[11px] text-blue-300 mt-1">Pre-authorized SBI Escrow</p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'marketplace', label: '🌾 Browse Farmer & FPO Lots (' + filteredLots.length + ')' },
          { id: 'requirements', label: '📋 My Sourcing Requirements (' + requirements.length + ')' },
          { id: 'orders', label: '📦 Active Orders & Deliveries (2)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Marketplace Tab */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by crop, location, variety (e.g. Nashik Onion, Latur Soybean)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCropFilter}
                onChange={(e) => setSelectedCropFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50"
              >
                <option value="all">All Crops</option>
                <option value="onion">Onion (कांदा)</option>
                <option value="soybean">Soybean (सोयाबीन)</option>
                <option value="wheat">Wheat (गहू)</option>
              </select>
            </div>
          </div>

          {/* Farmer Lots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredLots.map((lot) => (
              <div key={lot.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="relative">
                    <img src={lot.image} alt={lot.crop} className="w-full h-44 object-cover" />
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>96% AI Match Score</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-400">{lot.id}</span>
                      <span className="text-xs text-slate-500">{lot.distanceFromMandi} from Mandi</span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 font-heading">{lot.crop}</h4>
                    <p className="text-xs text-slate-500">{lot.location}</p>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Available Qty:</span>
                        <strong className="text-slate-900">{lot.quantityQtl} Quintals</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Assay Grade:</span>
                        <span className="font-semibold text-emerald-800">{lot.grade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Moisture:</span>
                        <span className="font-semibold text-slate-800">{lot.moisturePercent}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 pt-1 border-t border-slate-200">
                        <span className="font-bold">Farmer Reserve:</span>
                        <strong className="text-emerald-700 text-sm font-heading">₹{lot.expectedPrice}/Qtl</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      setSelectedLotForOffer(lot);
                      setOfferPrice(lot.expectedPrice);
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Digital Bid / Offer</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* Sourcing Requirements Tab */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-heading">Active Procurement Requisitions</h3>
            <button
              onClick={() => setShowPostReqModal(true)}
              className="px-4 py-2 bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Requisition</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {requirements.map((req) => (
              <div key={req.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400">{req.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {req.status}
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-900 font-heading">{req.crop}</h4>
                <p className="text-xs text-slate-500">Target Volume: <strong>{req.requiredQuantityQtl} Quintals</strong></p>

                <div className="p-3 rounded-2xl bg-slate-50 space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Target Price:</span>
                    <strong className="text-slate-900">₹{req.maxPriceOffered}/Q</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Spec:</span>
                    <span className="text-slate-800">{req.preferredGrade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Location:</span>
                    <span className="text-slate-800 truncate">{req.deliveryLocation}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-emerald-700 font-bold">
                  <span>8 Matched Farmer Lots</span>
                  <span className="text-blue-700 hover:underline cursor-pointer">View Matches &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 font-heading">Confirmed Purchase Contracts</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400">ORD-2026-9912</span>
                <h4 className="font-bold text-sm text-slate-900 mt-0.5">Soybean (140 Quintals) • Dnyaneshwar Patil</h4>
                <p className="text-xs text-slate-500">Agreed Price: ₹5,120/Qtl • Total: ₹7,16,800</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                  🚚 In Transit (Truck MH-15-EG-4412)
                </span>
                <button
                  onClick={() => alert("Release Escrow Payment: ₹7,16,800 transferred to Farmer Bank Account.")}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Approve & Release Escrow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Requirement Modal */}
      {showPostReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-300" />
                <h4 className="font-bold font-heading text-base">Post Procurement Requirement</h4>
              </div>
              <button onClick={() => setShowPostReqModal(false)} className="text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequirement} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Needed</label>
                  <select
                    value={newReqCrop}
                    onChange={(e) => setNewReqCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="Onion">Onion (कांदा)</option>
                    <option value="Soybean">Soybean (सोयाबीन)</option>
                    <option value="Wheat">Wheat (गहू)</option>
                    <option value="Cotton">Cotton (कापूस)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity (Quintals)</label>
                  <input
                    type="number"
                    required
                    value={newReqQty}
                    onChange={(e) => setNewReqQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Price (₹/Qtl)</label>
                  <input
                    type="number"
                    required
                    value={newReqPrice}
                    onChange={(e) => setNewReqPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Destination</label>
                  <input
                    type="text"
                    value={newReqLocation}
                    onChange={(e) => setNewReqLocation(e.target.value)}
                    placeholder="e.g. Nashik Plant"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPostReqModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md"
                >
                  Publish Sourcing Demand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offer Submission Modal */}
      {selectedLotForOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">Send Digital Bid to Farmer</h4>
                <p className="text-[11px] text-slate-400">Lot {selectedLotForOffer.id} ({selectedLotForOffer.crop})</p>
              </div>
              <button onClick={() => setSelectedLotForOffer(null)} className="text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitOffer} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Farmer Expected Price:</span>
                  <strong className="text-slate-800">₹{selectedLotForOffer.expectedPrice}/Qtl</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Available Volume:</span>
                  <span className="font-semibold">{selectedLotForOffer.quantityQtl} Quintals</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Offered Price (₹/Quintal)</label>
                <input
                  type="number"
                  required
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-base font-extrabold text-emerald-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Logistics Arrangement</label>
                <select
                  value={pickupType}
                  onChange={(e) => setPickupType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="buyer_pickup">Buyer Will Arrange Farmgate Pickup</option>
                  <option value="farmer_delivery">Farmer to Deliver at Buyer Plant</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedLotForOffer(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md"
                >
                  Lock Offer & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
