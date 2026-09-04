import React, { useState } from 'react';
import {
  LayoutDashboard, Search, FileText, Users, Handshake, ShoppingCart,
  Package, CreditCard, Truck, History, Star, MessageCircle, Bell,
  HelpCircle, LogOut, Globe, Menu, X, Filter, ChevronRight, MapPin,
  CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, Briefcase
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { translations } from '../../i18n/translations';

// ─── Sample Data ───────────────────────────────────────────────────────────────
const REQUIREMENTS = [
  { id: 'REQ-001', crop: 'Onion (Red Nasik)', qty: '500 Q', maxPrice: '₹2,600/q', date: '10 Sep 2026', location: 'Nashik', status: 'Active', matches: 12 },
  { id: 'REQ-002', crop: 'Wheat (Sharbati)', qty: '1000 Q', maxPrice: '₹2,200/q', date: '15 Sep 2026', location: 'Pune', status: 'Active', matches: 8 },
  { id: 'REQ-003', crop: 'Soybean', qty: '300 Q', maxPrice: '₹4,500/q', date: '05 Sep 2026', location: 'Indore', status: 'Fulfilled', matches: 24 },
];

const OFFERS_SENT = [
  { id: 'OFF-101', farmer: 'Dnyaneshwar Patil', crop: 'Onion', qty: '50 Q', price: '₹2,650/q', status: 'Pending' },
  { id: 'OFF-102', farmer: 'Nashik FPO', crop: 'Wheat', qty: '200 Q', price: '₹2,150/q', status: 'Accepted' },
  { id: 'OFF-103', farmer: 'Ramesh Sharma', crop: 'Tomato', qty: '20 Q', price: '₹1,800/q', status: 'Rejected' },
];

const ACTIVE_ORDERS = [
  { id: 'ORD-501', seller: 'Nashik FPO', crop: 'Wheat', qty: '200 Q', amount: '₹4,30,000', status: 'In Transit', date: '28 Aug 2026' },
  { id: 'ORD-502', seller: 'Dnyaneshwar Patil', crop: 'Onion', qty: '50 Q', amount: '₹1,32,500', status: 'Confirmed', date: '01 Sep 2026' },
];

const PRICE_DATA = [
  { day: 'Mon', onion: 2200, wheat: 2050, soybean: 4400, tomato: 1600 },
  { day: 'Tue', onion: 2350, wheat: 2100, soybean: 4500, tomato: 1750 },
  { day: 'Wed', onion: 2280, wheat: 2130, soybean: 4450, tomato: 1700 },
  { day: 'Thu', onion: 2400, wheat: 2150, soybean: 4600, tomato: 1800 },
  { day: 'Fri', onion: 2500, wheat: 2200, soybean: 4700, tomato: 1850 },
  { day: 'Sat', onion: 2450, wheat: 2180, soybean: 4650, tomato: 1820 },
  { day: 'Sun', onion: 2600, wheat: 2250, soybean: 4800, tomato: 1900 },
];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'find-crops', label: 'Find Crops', icon: Search },
  { id: 'post-req', label: 'Post Requirement', icon: FileText },
  { id: 'ai-matching', label: 'AI Farmer Matching', icon: Users },
  { id: 'my-offers', label: 'My Offers', icon: Handshake },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'logistics', label: 'Logistics', icon: Truck },
  { id: 'history', label: 'Purchase History', icon: History },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

function SummaryCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span className={`text-xs font-bold flex items-center gap-0.5 ${trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-black text-slate-900 mb-0.5">{value}</div>
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Active: 'bg-blue-100 text-blue-700',
    Fulfilled: 'bg-emerald-100 text-emerald-700',
    Pending: 'bg-amber-100 text-amber-700',
    Accepted: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    'In Transit': 'bg-purple-100 text-purple-700',
    Delivered: 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

// Dashboard Overview
function DashboardOverview() {
  const [activeCrop, setActiveCrop] = useState('onion');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard icon={FileText} label="Active Requirements" value="2" sub="Looking for suppliers" color="bg-blue-500" trend={15} />
        <SummaryCard icon={Handshake} label="Offers Sent" value="18" sub="Pending response: 4" color="bg-amber-500" trend={5} />
        <SummaryCard icon={Package} label="Orders Confirmed" value="12" sub="This month" color="bg-emerald-500" trend={20} />
        <SummaryCard icon={CreditCard} label="Pending Payments" value="₹1.5L" sub="Due next 7 days" color="bg-rose-500" />
        <SummaryCard icon={Briefcase} label="Total Spending" value="₹24.5L" sub="This season" color="bg-purple-500" trend={10} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Requirements */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800">📋 Active Requirements</h3>
            <button className="text-xs text-blue-600 font-bold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-50">
            {REQUIREMENTS.slice(0,2).map(r => (
              <div key={r.id} className="p-4 hover:bg-slate-50/60 transition">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm text-slate-800">{r.crop}</p>
                    <p className="text-xs text-slate-400">{r.qty} • Max: {r.maxPrice}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{r.matches} AI Matches</span>
                  <button className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50">Review Matches</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800">📊 Market Price Trends</h3>
          </div>
          <div className="p-4">
            <div className="flex gap-2 mb-4 flex-wrap">
              {['onion','wheat','soybean','tomato'].map(c => (
                <button key={c} onClick={() => setActiveCrop(c)}
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition ${activeCrop === c ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-50'}`}>
                  {c}
                </button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={PRICE_DATA}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey={activeCrop} stroke="#2563eb" strokeWidth={2} fill="url(#priceGrad)" dot={{ fill: '#2563eb', strokeWidth: 2, r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders & Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800">🚚 Active Orders</h3>
            <button className="text-xs text-blue-600 font-bold hover:underline">Track All</button>
          </div>
          <div className="divide-y divide-slate-50">
            {ACTIVE_ORDERS.map(o => (
              <div key={o.id} className="p-4 hover:bg-slate-50/60 transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-mono text-slate-400">{o.id}</span>
                    <p className="font-bold text-sm text-slate-800">{o.crop} ({o.qty})</p>
                    <p className="text-xs text-slate-500">Seller: {o.seller}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-blue-700">{o.amount}</p>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800">🤝 Recent Offers Sent</h3>
            <button className="text-xs text-blue-600 font-bold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-50">
            {OFFERS_SENT.map(o => (
              <div key={o.id} className="p-4 hover:bg-slate-50/60 transition">
                 <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-sm text-slate-800">{o.farmer}</p>
                    <StatusBadge status={o.status} />
                 </div>
                 <div className="flex justify-between text-xs text-slate-500">
                    <p>{o.crop} • {o.qty}</p>
                    <p className="font-bold text-blue-700">{o.price}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Post Requirement
function PostRequirement() {
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-black text-slate-800 mb-5">📋 Post New Requirement</h2>
      {submitted && (
        <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-blue-600" />
          <div><p className="font-bold text-blue-800">Requirement Posted!</p><p className="text-xs text-blue-600">AI is matching you with the best farmers and FPOs.</p></div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Select Crop *</label>
            <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400">
              <option value="">Choose...</option>
              {['Onion','Wheat','Rice','Soybean','Cotton','Tomato'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Required Quantity *</label>
            <input type="text" placeholder="e.g. 500 Quintals" required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Quality / Grade</label>
             <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400">
              {['Any','A+','A','B+','B'].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Maximum Price (₹/Quintal)</label>
            <input type="number" placeholder="e.g. 2600" required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Required Delivery Date *</label>
            <input type="date" required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Delivery Location *</label>
            <input type="text" placeholder="e.g. Pune Warehouse" required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>
        <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition">
          Post Requirement
        </button>
      </form>
    </div>
  )
}

import { INITIAL_FARMER_LOTS } from '../../data/sampleLots';

function FindCropsView({ onSendOffer }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedLotForOffer, setSelectedLotForOffer] = useState(null);
  const [offerPrice, setOfferPrice] = useState(2650);
  const [offerSubmitted, setOfferSubmitted] = useState(false);

  const lots = INITIAL_FARMER_LOTS.filter(l => {
    const matchSearch = l.crop.toLowerCase().includes(searchTerm.toLowerCase()) || l.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCrop = selectedCrop === 'All' || l.crop.toLowerCase().includes(selectedCrop.toLowerCase());
    return matchSearch && matchCrop;
  });

  const handleOfferSubmit = (e) => {
    e.preventDefault();
    setOfferSubmitted(true);
    setTimeout(() => {
      alert(`💼 Digital Offer of ₹${offerPrice}/Qtl submitted for ${selectedLotForOffer.id}!\nEscrow funds pre-authorized. Farmer has been notified via SMS & App.`);
      setSelectedLotForOffer(null);
      setOfferSubmitted(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">🔍 Browse Verified Farmer Lots</h2>
          <p className="text-xs text-slate-500">Direct procurement from verified smallholders & FPOs</p>
        </div>
        <div className="flex items-center gap-2">
          {['All', 'Onion', 'Soybean', 'Wheat'].map(c => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${selectedCrop === c ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by crop, variety, or mandi district..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {lots.map(lot => (
          <div key={lot.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">{lot.id}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">✓ {lot.grade}</span>
              </div>
              <h3 className="font-black text-slate-800 text-base mb-1">{lot.crop}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{lot.location} ({lot.distanceFromMandi})</span>
              </p>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl mb-4 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">Available Qty</div>
                  <div className="text-sm font-black text-slate-800">{lot.quantityQtl} Qtl</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Farmer Asking</div>
                  <div className="text-sm font-black text-emerald-700">₹{lot.expectedPrice}/q</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 space-y-1 mb-4">
                <div>💧 Moisture: <span className="font-semibold text-slate-700">{lot.moisturePercent}</span></div>
                <div>📅 Harvest: <span className="font-semibold text-slate-700">{lot.harvestDate}</span></div>
              </div>
            </div>
            <button
              onClick={() => { setSelectedLotForOffer(lot); setOfferPrice(lot.expectedPrice); }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Handshake className="w-3.5 h-3.5" />
              <span>Make Digital Offer</span>
            </button>
          </div>
        ))}
      </div>

      {/* Offer Modal */}
      {selectedLotForOffer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-800 text-lg">💼 Propose Digital Offer</h3>
              <button onClick={() => setSelectedLotForOffer(null)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Submitting offer for <span className="font-bold text-slate-800">{selectedLotForOffer.crop}</span> ({selectedLotForOffer.quantityQtl} Qtl) in {selectedLotForOffer.location}.
            </p>
            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Your Price per Quintal (₹)</label>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-black text-lg text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="bg-blue-50/70 p-3 rounded-xl text-xs space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Gross Lot Value:</span>
                  <span className="font-bold">₹{(offerPrice * selectedLotForOffer.quantityQtl).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-blue-700">
                  <span>Escrow Pre-authorization:</span>
                  <span className="font-bold">100% Secured</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLotForOffer(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={offerSubmitted}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition"
                >
                  {offerSubmitted ? 'Submitting...' : 'Submit & Lock Escrow'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AiMatchingView() {
  const matches = [
    {
      id: 'MATCH-01',
      crop: 'Onion (Red Nasik)',
      seller: 'Sahyadri Farmers Producer Co.',
      type: 'FPO Bulk Consignment',
      location: 'Niphad Cluster (18 km)',
      available: '1,200 Quintals',
      price: '₹2,640/Q',
      score: 98,
      moisture: '10.8%',
      grade: 'Grade A Export',
      reason: 'Perfect volume match with your 500 Qtl requirement. Distance under 25km saves ₹18/q in freight.'
    },
    {
      id: 'MATCH-02',
      crop: 'Wheat (Sharbati C-306)',
      seller: 'Bhopal Krishi Aggregators',
      type: 'Aggregated Lot',
      location: 'Sehore Hub (MP)',
      available: '800 Quintals',
      price: '₹2,180/Q',
      score: 94,
      moisture: '9.6%',
      grade: 'Grade A+',
      reason: 'Lowest moisture index assayed. Direct rail freight rake loading available.'
    },
    {
      id: 'MATCH-03',
      crop: 'Soybean (Cleaned & Graded)',
      seller: 'Latur Soybean FPO Union',
      type: 'Certified Organic',
      location: 'Latur Processing Area',
      available: '450 Quintals',
      price: '₹4,450/Q',
      score: 91,
      moisture: '10.0%',
      grade: 'Premium Solvent Grade',
      reason: 'Oil content verified at 19.4% via digital spectroscopy assay.'
    }
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-800">🤖 AI Intelligent Farmer & FPO Matching</h2>
        <p className="text-xs text-slate-500">Autonomous recommendation engine optimizing for price, distance, moisture assay & verified seller scores</p>
      </div>

      <div className="space-y-4">
        {matches.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-sm transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-slate-800 text-base">{m.crop}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{m.type}</span>
                </div>
                <p className="text-xs text-slate-500">Seller: <span className="font-semibold text-slate-700">{m.seller}</span> • {m.location}</p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black">
                  <span>🎯 Match Score:</span>
                  <span>{m.score}%</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
              💡 <span className="font-semibold text-slate-700">AI Recommendation Engine:</span> {m.reason}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400">Available Volume</div>
                <div className="text-xs font-black text-slate-800">{m.available}</div>
              </div>
              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400">Price per Qtl</div>
                <div className="text-xs font-black text-emerald-700">{m.price}</div>
              </div>
              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400">Moisture Assay</div>
                <div className="text-xs font-bold text-slate-700">{m.moisture}</div>
              </div>
              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400">Quality Assured</div>
                <div className="text-xs font-bold text-blue-700">{m.grade}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => alert(`Initiating direct procurement deal with ${m.seller} for ${m.crop} at ${m.price}. Escrow authorized.`)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                🤝 Instant Deal & Pre-authorize Escrow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyOffersView() {
  const [offers, setOffers] = useState([
    { id: 'OFF-101', farmer: 'Dnyaneshwar Patil', crop: 'Onion (Red Nasik)', qty: '50 Q', price: '₹2,650/q', total: '₹1,32,500', status: 'Pending Farmer Acceptance', date: '03 Sep 2026' },
    { id: 'OFF-102', farmer: 'Nashik FPO Aggregators', crop: 'Wheat (Sharbati)', qty: '200 Q', price: '₹2,150/q', total: '₹4,30,000', status: 'Accepted • Loading Scheduled', date: '01 Sep 2026' },
    { id: 'OFF-103', farmer: 'Ramesh Sharma', crop: 'Tomato (Desi)', qty: '20 Q', price: '₹1,800/q', total: '₹36,000', status: 'Counter-Offer: ₹1,900/Q', date: '31 Aug 2026' },
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-800">🤝 Active Procurement Offers & Bids</h2>
        <p className="text-xs text-slate-500">Track negotiation status, counter-offers, and legal digital contracts</p>
      </div>

      <div className="space-y-3">
        {offers.map(o => (
          <div key={o.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">{o.id}</span>
                <span className="font-black text-slate-800 text-sm">{o.crop}</span>
              </div>
              <p className="text-xs text-slate-500">Seller: <span className="font-semibold text-slate-700">{o.farmer}</span> • {o.qty} at <span className="font-bold text-emerald-700">{o.price}</span> (Total: {o.total})</p>
              <p className="text-[11px] text-slate-400 mt-1">Submitted on {o.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                o.status.includes('Accepted') ? 'bg-emerald-100 text-emerald-700' :
                o.status.includes('Counter') ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'
              }`}>
                {o.status}
              </span>
              {o.status.includes('Counter') && (
                <button
                  onClick={() => alert(`Counter-offer accepted! Payout adjusted to ₹1,900/Q.`)}
                  className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition"
                >
                  Accept Counter
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersView() {
  const orders = [
    { id: 'ORD-501', seller: 'Nashik FPO Cluster', crop: 'Wheat (Sharbati)', qty: '200 Qtl', amount: '₹4,30,000', status: 'In Transit', vehicle: 'MH-15-EG-4412', driver: 'Sunil Gaikwad (+91 98221 00213)', eta: 'Today 5:30 PM' },
    { id: 'ORD-502', seller: 'Dnyaneshwar Patil', crop: 'Onion (Red Nasik)', qty: '50 Qtl', amount: '₹1,32,500', status: 'Confirmed • Loading', vehicle: 'MH-15-BJ-9021', driver: 'Kailash More (+91 94222 18940)', eta: 'Tomorrow 11:00 AM' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-800">📦 Procurement Orders & Consignments</h2>
        <p className="text-xs text-slate-500">Live order status, e-Way bill compliance, and delivery receipt validation</p>
      </div>

      <div className="space-y-4">
        {orders.map(ord => (
          <div key={ord.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md mr-2">{ord.id}</span>
                <span className="font-black text-slate-800 text-base">{ord.crop}</span>
                <span className="text-xs text-slate-500 ml-2">({ord.qty})</span>
              </div>
              <div className="text-right">
                <span className="font-black text-emerald-700 text-lg mr-3">{ord.amount}</span>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">{ord.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs mb-3">
              <div><span className="text-slate-400">Assigned Transporter:</span> <div className="font-bold text-slate-700">{ord.vehicle}</div></div>
              <div><span className="text-slate-400">Driver Contact:</span> <div className="font-bold text-slate-700">{ord.driver}</div></div>
              <div><span className="text-slate-400">Estimated Delivery:</span> <div className="font-bold text-blue-700">{ord.eta}</div></div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => alert(`GPS Live Tracking initialized for vehicle ${ord.vehicle}. Transit route: Lasalgaon -> Pune Warehouse via NH60.`)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Live GPS Track</span>
              </button>
              <button
                onClick={() => alert(`Confirming receipt of ${ord.id}. Escrow of ${ord.amount} released automatically to farmer account via UPI/NEFT.`)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verify Weighment & Release Escrow</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsView() {
  const transactions = [
    { id: 'TXN-8801', desc: 'Escrow Release: ORD-501 (Wheat 200 Qtl)', amount: '₹4,30,000', date: '28 Aug 2026', type: 'Payout Released', status: 'Success (NEFT)' },
    { id: 'TXN-8802', desc: 'Escrow Deposit: Advance for Onion Procurement', amount: '₹5,00,000', date: '25 Aug 2026', type: 'Wallet Deposit', status: 'Success (HDFC Bank)' },
    { id: 'TXN-8803', desc: 'Quality Assay Testing Fee (Lasalgaon Lab)', amount: '₹1,200', date: '24 Aug 2026', type: 'Lab Assay Fee', status: 'Success' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-800">💳 Buyer Escrow Account & Settlements</h2>
        <p className="text-xs text-slate-500">Zero-risk settlement backed by RBI regulated nodal escrow bank accounts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-600 text-white rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-blue-200 mb-1">Pre-funded Escrow Balance</div>
          <div className="text-2xl font-black">₹25,00,000</div>
          <div className="text-[11px] text-blue-200 mt-1">Ready for 1-click deal locking</div>
        </div>
        <div className="bg-amber-500 text-white rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-amber-100 mb-1">Escrow Funds in Holding</div>
          <div className="text-2xl font-black">₹5,62,500</div>
          <div className="text-[11px] text-amber-100 mt-1">Held until delivery inspection</div>
        </div>
        <div className="bg-slate-800 text-white rounded-2xl p-5 shadow-xs">
          <div className="text-xs text-slate-300 mb-1">Total Procured YTD</div>
          <div className="text-2xl font-black">₹1.48 Crore</div>
          <div className="text-[11px] text-slate-300 mt-1">42 verified farmer contracts</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-black text-slate-800 text-sm">
          Settlement History & Tax Invoices
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {transactions.map(t => (
            <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div>
                <span className="font-mono text-slate-400 mr-2">{t.id}</span>
                <span className="font-bold text-slate-800">{t.desc}</span>
                <div className="text-[11px] text-slate-400 mt-0.5">{t.date} • {t.status}</div>
              </div>
              <div className="text-right">
                <div className="font-black text-slate-800 text-sm">{t.amount}</div>
                <button onClick={() => alert(`Downloading GST Tax Invoice for ${t.id}`)} className="text-[11px] text-blue-600 font-bold hover:underline">Download Tax Invoice</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BuyerLogisticsView() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-800">🚚 Live Logistics & Cold Chain Tracking</h2>
        <p className="text-xs text-slate-500">Fleet telemetry, route temperature monitoring & gate arrival management</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-black text-slate-800 text-base">Shipment MH-15-EG-4412 (Wheat 200 Qtl)</span>
            </div>
            <p className="text-xs text-slate-400">Route: Lasalgaon Cluster Mandi → Chakan Pune Processing Facility</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">On Schedule • 42 km remaining</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-5">
          <div className="bg-slate-50 p-3 rounded-xl"><div className="text-[10px] text-slate-400">Current Speed</div><div className="font-black text-slate-800 text-sm">54 km/h</div></div>
          <div className="bg-slate-50 p-3 rounded-xl"><div className="text-[10px] text-slate-400">Transit Temp</div><div className="font-black text-emerald-700 text-sm">24.2°C (Optimal)</div></div>
          <div className="bg-slate-50 p-3 rounded-xl"><div className="text-[10px] text-slate-400">Driver</div><div className="font-bold text-slate-700 text-sm">Sunil Gaikwad</div></div>
          <div className="bg-slate-50 p-3 rounded-xl"><div className="text-[10px] text-slate-400">ETA Gate</div><div className="font-black text-blue-700 text-sm">5:30 PM Today</div></div>
        </div>

        <div className="bg-slate-100 h-44 rounded-xl flex items-center justify-center relative overflow-hidden border border-slate-200">
          <div className="text-center p-4">
            <div className="text-3xl mb-1">🗺️</div>
            <p className="font-bold text-xs text-slate-700">GPS Telemetry Stream Live</p>
            <p className="text-[11px] text-slate-400">Vehicle is traversing Narayangaon bypass on NH60 without delays</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuyerDashboardNew({ user, onLogout, lang: appLang = 'en', setLang: appSetLang, t: propT }) {
  const lang = appLang || 'en';
  const setLang = appSetLang || (() => {});
  const t = propT || translations[lang] || translations.en;
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t?.dashOverview || 'Dashboard', icon: LayoutDashboard },
    { id: 'find-crops', label: t?.dashFindCrops || 'Find Farmer Lots', icon: Search },
    { id: 'post-req', label: t?.dashPostReq || 'Post Requirement', icon: FileText },
    { id: 'ai-matching', label: t?.dashAiMatching || 'AI Farmer Matching', icon: Users },
    { id: 'my-offers', label: t?.dashMyOffers || 'My Offers', icon: Handshake },
    { id: 'orders', label: t?.dashOrders || 'My Orders', icon: Package },
    { id: 'payments', label: t?.dashPayments || 'Payments & Escrow', icon: CreditCard },
    { id: 'logistics', label: t?.dashLogistics || 'Logistics Tracking', icon: Truck },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardOverview />;
      case 'post-req': return <PostRequirement />;
      case 'find-crops': return <FindCropsView />;
      case 'ai-matching': return <AiMatchingView />;
      case 'my-offers': return <MyOffersView />;
      case 'orders': return <OrdersView />;
      case 'payments': return <PaymentsView />;
      case 'logistics': return <BuyerLogisticsView />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`fixed lg:static z-50 inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-900 to-indigo-900 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <div className="font-black text-white text-base flex items-center">
                <span className="text-amber-300 font-serif font-black text-lg">अ</span>naaj
              </div>
              <div className="text-blue-300 text-[10px] font-bold uppercase tracking-wider">Buyer Desk</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-b border-blue-800">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-xl">🏢</div>
             <div className="min-w-0">
               <p className="font-bold text-white text-sm truncate">{user?.name || 'Agro Processors Ltd'}</p>
               <p className="text-blue-300 text-xs">GST: {user?.gst || '27AAXXX0000X1Z5'}</p>
             </div>
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeSection === item.id ? 'bg-white/15 text-white' : 'text-blue-300 hover:bg-white/10 hover:text-white'
              }`}>
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-3 border-t border-blue-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-300 hover:bg-red-900/40 hover:text-red-300 transition cursor-pointer">
            <LogOut className="w-4 h-4" /> {t?.dashLogout || 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 lg:px-6 shadow-sm justify-between">
           <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500"><Menu className="w-6 h-6" /></button>
              <div className="hidden sm:block relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input placeholder="Search crops, farmers..." className="w-full pl-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400" />
              </div>
           </div>
           <div className="flex items-center gap-3">
             {/* Language Selector */}
             <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200">
               <Globe className="w-3.5 h-3.5 text-blue-600" />
               <select
                 value={lang}
                 onChange={(e) => setLang(e.target.value)}
                 className="bg-transparent font-bold outline-none cursor-pointer"
               >
                 <option value="en">EN</option>
                 <option value="hi">हिंदी</option>
                 <option value="mr">मराठी</option>
                 <option value="gu">ગુજરાતી</option>
                 <option value="pa">ਪੰਜਾਬੀ</option>
               </select>
             </div>
             <button className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center relative cursor-pointer"><Bell className="w-4 h-4 text-slate-600" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button>
             <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                <span className="text-xl">🏢</span>
                <span className="text-sm font-bold text-slate-800 hidden sm:block">Buyer</span>
             </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50">
          <div className="animate-fade-in">
             {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
