import React, { useState } from 'react';
import {
  LayoutDashboard, Sprout, PlusCircle, TrendingUp, BarChart3, MapPin,
  ShoppingBag, Package, CreditCard, Truck, Warehouse, BookOpen,
  CloudSun, MessageCircle, HelpCircle, LogOut, Bell, Search,
  Globe, ChevronRight, CheckCircle2, XCircle, AlertTriangle,
  Wheat, Leaf, ArrowUpRight, ArrowDownRight, Eye, Phone, Star,
  Calendar, Upload, Filter, RefreshCw, Menu, X
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { translations } from '../../i18n/translations';
import FarmerGrievance from '../panels/FarmerPanel/FarmerGrievance';
import LogisticsStorage from '../panels/FarmerPanel/LogisticsStorage';
import PricePredictionCard from '../common/PricePredictionCard';
import NetProfitCalculator from '../common/NetProfitCalculator';
import WeatherWidget from '../common/WeatherWidget';

// ─── Sample Data ───────────────────────────────────────────────────────────────
const CROPS = [
  { id: 1, name: 'Onion', variety: 'Red Nasik', qty: '120 Quintal', price: '₹2,400/q', harvest: '15 Aug 2026', status: 'Active', grade: 'A', location: 'Yeola, Nashik' },
  { id: 2, name: 'Wheat', variety: 'Sharbati', qty: '80 Quintal', price: '₹2,150/q', harvest: '20 Aug 2026', status: 'Sold', grade: 'B+', location: 'Yeola, Nashik' },
  { id: 3, name: 'Soybean', variety: 'JS-335', qty: '60 Quintal', price: '₹4,600/q', harvest: '10 Sep 2026', status: 'Pending', grade: 'A+', location: 'Yeola, Nashik' },
  { id: 4, name: 'Tomato', variety: 'Desi Red', qty: '40 Quintal', price: '₹1,800/q', harvest: '5 Sep 2026', status: 'Active', grade: 'A', location: 'Pimpalgaon, Nashik' },
];

const OFFERS = [
  { id: 1, buyer: 'Reliance Fresh', company: 'RIL Agri', crop: 'Onion', qty: '50 Q', offered: '₹2,650/q', total: '₹1,32,500', status: 'New' },
  { id: 2, buyer: 'BigBasket Direct', company: 'Supermart', crop: 'Wheat', qty: '80 Q', offered: '₹2,300/q', total: '₹1,84,000', status: 'New' },
  { id: 3, buyer: 'Godrej Agrovet', company: 'Godrej', crop: 'Soybean', qty: '30 Q', offered: '₹4,800/q', total: '₹1,44,000', status: 'Negotiating' },
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

const ORDERS = [
  { id: 'ORD-001', crop: 'Onion', qty: '50 Q', buyer: 'Reliance Fresh', amount: '₹1,32,500', status: 'In Transit', date: '28 Aug 2026' },
  { id: 'ORD-002', crop: 'Wheat', qty: '80 Q', buyer: 'BigBasket', amount: '₹1,84,000', status: 'Delivered', date: '22 Aug 2026' },
  { id: 'ORD-003', crop: 'Soybean', qty: '25 Q', buyer: 'Godrej Agrovet', amount: '₹1,20,000', status: 'Pending', date: '2 Sep 2026' },
];

const SCHEMES = [
  { name: 'PM-KISAN', benefit: '₹6,000/year direct income support', eligible: true, deadline: 'Open' },
  { name: 'PMFBY', benefit: 'Crop insurance at 2% premium', eligible: true, deadline: 'Oct 2026' },
  { name: 'eNAM', benefit: 'Online mandi trading platform', eligible: true, deadline: 'Open' },
  { name: 'KCC', benefit: 'Kisan Credit Card up to ₹3 Lakh', eligible: false, deadline: 'Open' },
];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'crops', label: 'My Crops', icon: Leaf },
  { id: 'create-lot', label: 'Create Crop Lot', icon: PlusCircle },
  { id: 'market', label: 'Market Prices', icon: TrendingUp },
  { id: 'ai-price', label: 'AI Price Prediction', icon: BarChart3 },
  { id: 'best-market', label: 'Best Market', icon: MapPin },
  { id: 'offers', label: 'Buyer Offers', icon: ShoppingBag },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'logistics', label: 'Logistics', icon: Truck },
  { id: 'storage', label: 'Storage', icon: Warehouse },
  { id: 'schemes', label: 'Govt Schemes', icon: BookOpen },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

// ─── Sub-section Components ────────────────────────────────────────────────────

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
    Active: 'bg-emerald-100 text-emerald-700',
    Sold: 'bg-blue-100 text-blue-700',
    Pending: 'bg-amber-100 text-amber-700',
    New: 'bg-green-100 text-green-700',
    Negotiating: 'bg-purple-100 text-purple-700',
    'In Transit': 'bg-blue-100 text-blue-700',
    Delivered: 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

// Dashboard Overview
function DashboardOverview({ user }) {
  const [activeCrop, setActiveCrop] = useState('onion');
  const [offerStates, setOfferStates] = useState({});
  const toggleOffer = (id, action) => setOfferStates(p => ({ ...p, [id]: action }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard icon={Leaf} label="Total Crops" value="4" sub="Varieties listed" color="bg-emerald-500" trend={12} />
        <SummaryCard icon={Package} label="Active Lots" value="2" sub="Live on platform" color="bg-blue-500" trend={5} />
        <SummaryCard icon={ShoppingBag} label="Buyer Offers" value="9" sub="3 require action" color="bg-amber-500" trend={22} />
        <SummaryCard icon={RefreshCw} label="Pending Orders" value="1" sub="Awaiting dispatch" color="bg-purple-500" />
        <SummaryCard icon={CreditCard} label="Total Earnings" value="₹4.36L" sub="This season" color="bg-rose-500" trend={18} />
      </div>

      {/* My Crops */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-black text-slate-800">🌾 My Crops</h3>
          <button className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1">View All <ChevronRight className="w-3 h-3" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 text-xs text-slate-500 font-bold">
              <th className="text-left px-5 py-3">Crop</th>
              <th className="text-left px-4 py-3">Quantity</th>
              <th className="text-left px-4 py-3">Expected Price</th>
              <th className="text-left px-4 py-3">Harvest Date</th>
              <th className="text-left px-4 py-3">Grade</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr></thead>
            <tbody>{CROPS.map((c, i) => (
              <tr key={c.id} className={`border-t border-slate-50 hover:bg-emerald-50/30 transition ${i % 2 === 0 ? '' : 'bg-slate-50/40'}`}>
                <td className="px-5 py-3 font-bold text-slate-800">{c.name} <span className="text-xs font-normal text-slate-400">({c.variety})</span></td>
                <td className="px-4 py-3 text-slate-600">{c.qty}</td>
                <td className="px-4 py-3 font-bold text-emerald-700">{c.price}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{c.harvest}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">{c.grade}</span></td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      {/* Buyer Offers + Market Prices side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Buyer Offers */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800">🤝 Recent Buyer Offers</h3>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{OFFERS.length} New</span>
          </div>
          <div className="divide-y divide-slate-50">
            {OFFERS.map(o => (
              <div key={o.id} className="p-4 hover:bg-slate-50/60 transition">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm text-slate-800">{o.buyer}</p>
                    <p className="text-xs text-slate-400">{o.company} • {o.crop} • {o.qty}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-emerald-700">{o.offered}</p>
                    <p className="text-xs text-slate-400">Total: {o.total}</p>
                  </div>
                  {!offerStates[o.id] ? (
                    <div className="flex gap-2">
                      <button onClick={() => toggleOffer(o.id, 'accepted')} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Accept
                      </button>
                      <button onClick={() => toggleOffer(o.id, 'rejected')} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-red-50 hover:text-red-600 transition flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${offerStates[o.id] === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                      {offerStates[o.id] === 'accepted' ? '✅ Accepted' : '❌ Rejected'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Prices Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800">📊 Market Prices (₹/Quintal)</h3>
          </div>
          <div className="p-4">
            <div className="flex gap-2 mb-4 flex-wrap">
              {['onion','wheat','soybean','tomato'].map(c => (
                <button key={c} onClick={() => setActiveCrop(c)}
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition ${activeCrop === c ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'}`}>
                  {c}
                </button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={PRICE_DATA}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey={activeCrop} stroke="#059669" strokeWidth={2} fill="url(#priceGrad)" dot={{ fill: '#059669', strokeWidth: 2, r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weather + AI Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather */}
        <div className="bg-gradient-to-br from-blue-600 to-sky-500 rounded-2xl p-5 text-white">
          <h3 className="font-black mb-4 flex items-center gap-2"><CloudSun className="w-5 h-5" /> Weather — Nashik</h3>
          <div className="flex items-center gap-6 mb-4">
            <div className="text-5xl">🌤️</div>
            <div>
              <div className="text-4xl font-black">31°C</div>
              <div className="text-blue-200 text-sm">Partly Cloudy</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm font-bold">Humidity: 68%</div>
              <div className="text-sm font-bold">Wind: 12 km/h</div>
              <div className="text-sm font-bold">Rain: 60% chance</div>
            </div>
          </div>
          <div className="bg-blue-700/40 rounded-xl p-3 text-sm">
            <p className="font-bold flex items-center gap-2">⚠️ Agromet Advisory</p>
            <p className="text-blue-200 text-xs mt-1">Moderate rainfall expected Thu-Fri. Delay onion harvesting by 2 days. Apply fungicide on soybean crop immediately.</p>
          </div>
        </div>

        {/* AI Market Insight */}
        <div className="bg-gradient-to-br from-emerald-700 to-green-600 rounded-2xl p-5 text-white">
          <h3 className="font-black mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5" /> AI Market Insight</h3>
          <div className="space-y-3">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs text-emerald-200 font-semibold mb-1">🎯 Suggested Selling Price</div>
              <div className="text-xl font-black">₹2,600–₹2,750 / Quintal</div>
              <div className="text-xs text-emerald-200 mt-0.5">For Onion (Red Nasik) in next 7 days</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs text-emerald-200 font-semibold mb-1">🏆 Best Market to Sell</div>
              <div className="font-black">Lasalgaon APMC, Nashik</div>
              <div className="text-xs text-emerald-200 mt-0.5">Modal price ₹2,580/q • 48 km away</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs text-emerald-200 font-semibold mb-1">⏰ Best Time to Sell</div>
              <div className="font-black">4–10 September 2026</div>
              <div className="text-xs text-emerald-200 mt-0.5">Price expected to peak after rain clearance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// My Crops full page
function MyCrops() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800">🌾 My Crops</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition flex items-center gap-2"><PlusCircle className="w-4 h-4" />Add Crop</button>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition flex items-center gap-2"><Filter className="w-4 h-4" />Filter</button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {CROPS.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-black text-slate-800 text-lg">{c.name}</h3>
                <p className="text-xs text-slate-400">{c.variety} • {c.location}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 rounded-xl p-3"><div className="text-xs text-slate-400 mb-1">Quantity</div><div className="font-black text-sm text-slate-800">{c.qty}</div></div>
              <div className="bg-emerald-50 rounded-xl p-3"><div className="text-xs text-slate-400 mb-1">Price</div><div className="font-black text-sm text-emerald-700">{c.price}</div></div>
              <div className="bg-blue-50 rounded-xl p-3"><div className="text-xs text-slate-400 mb-1">Grade</div><div className="font-black text-sm text-blue-700">{c.grade}</div></div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">Harvest: {c.harvest}</span>
              <button className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1">View Details <ChevronRight className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Create Crop Lot
function CreateCropLot() {
  const [form, setForm] = useState({ crop: '', qty: '', grade: 'A', price: '', harvest: '', location: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-black text-slate-800 mb-5">➕ Create Crop Lot</h2>
      {submitted && (
        <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <div><p className="font-bold text-emerald-800">Lot Created Successfully!</p><p className="text-xs text-emerald-600">Your crop lot is now live on the <strong>अnaaj</strong> marketplace.</p></div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Crop Name *</label>
            <select value={form.crop} onChange={set('crop')} required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white">
              <option value="">Select Crop</option>
              {['Onion','Wheat','Rice','Soybean','Cotton','Tomato','Potato','Maize','Sugarcane','Grapes'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Quality / Grade *</label>
            <select value={form.grade} onChange={set('grade')} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white">
              {['A+','A','B+','B','C'].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Quantity (Quintals) *</label>
            <input type="number" value={form.qty} onChange={set('qty')} placeholder="e.g. 100" required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Expected Price (₹/Quintal) *</label>
            <input type="number" value={form.price} onChange={set('price')} placeholder="e.g. 2500" required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Harvest Date *</label>
            <input type="date" value={form.harvest} onChange={set('harvest')} required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Location (Village, District) *</label>
            <input value={form.location} onChange={set('location')} placeholder="e.g. Yeola, Nashik" required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">Additional Notes</label>
          <textarea value={form.notes} onChange={set('notes')} placeholder="Describe crop quality, storage condition, packaging…" rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
        </div>
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-400 transition cursor-pointer">
          <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-500">Upload Crop Photos</p>
          <p className="text-xs text-slate-400">PNG, JPG up to 10MB • Max 5 photos</p>
        </div>
        <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Create Crop Lot & Publish
        </button>
      </form>
    </div>
  );
}

// Market Prices
function MarketPrices() {
  const [activeCrop, setActiveCrop] = useState('onion');
  const mandis = [
    { name: 'Lasalgaon APMC', price: '₹2,580', min: '₹2,200', max: '₹2,900', arrivals: '12,400 Q' },
    { name: 'Pimpalgaon APMC', price: '₹2,520', min: '₹2,100', max: '₹2,800', arrivals: '8,200 Q' },
    { name: 'Navi Mumbai APMC', price: '₹2,650', min: '₹2,300', max: '₹3,100', arrivals: '5,600 Q' },
    { name: 'Pune APMC', price: '₹2,600', min: '₹2,250', max: '₹3,000', arrivals: '4,100 Q' },
  ];
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-slate-800">📊 Live Market Prices</h2>
      <div className="flex gap-2 flex-wrap">
        {['onion','wheat','soybean','tomato'].map(c => (
          <button key={c} onClick={() => setActiveCrop(c)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition ${activeCrop === c ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={PRICE_DATA}>
            <defs>
              <linearGradient id="mktGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => `₹${v.toLocaleString()}/q`} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey={activeCrop} stroke="#059669" strokeWidth={2.5} fill="url(#mktGrad)" dot={{ fill: '#059669', r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mandis.map(m => (
          <div key={m.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <p className="font-black text-slate-800 mb-2">{m.name}</p>
            <div className="flex items-center justify-between text-sm">
              <div><span className="text-slate-400 text-xs">Modal</span><div className="font-black text-emerald-700 text-lg">{m.price}</div></div>
              <div className="text-right"><span className="text-slate-400 text-xs">Range</span><div className="text-xs text-slate-600">{m.min} – {m.max}</div></div>
              <div className="text-right"><span className="text-slate-400 text-xs">Arrivals</span><div className="font-bold text-slate-700">{m.arrivals}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Buyer Offers Full
function BuyerOffersFull() {
  const [states, setStates] = useState({});
  const toggle = (id, a) => setStates(p => ({ ...p, [id]: a }));
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-slate-800">🤝 Buyer Offers ({OFFERS.length})</h2>
      <div className="space-y-4">
        {OFFERS.map(o => (
          <div key={o.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-black text-slate-800">{o.buyer}</h3>
                <p className="text-sm text-slate-400">{o.company} • {o.crop} • {o.qty}</p>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div className="bg-emerald-50 rounded-xl p-3"><div className="text-xs text-slate-400">Offered Price</div><div className="font-black text-emerald-700">{o.offered}</div></div>
              <div className="bg-slate-50 rounded-xl p-3"><div className="text-xs text-slate-400">Quantity</div><div className="font-black text-slate-700">{o.qty}</div></div>
              <div className="bg-blue-50 rounded-xl p-3"><div className="text-xs text-slate-400">Total Value</div><div className="font-black text-blue-700">{o.total}</div></div>
            </div>
            {!states[o.id] ? (
              <div className="flex gap-3">
                <button onClick={() => toggle(o.id, 'accepted')} className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition">✅ Accept Offer</button>
                <button onClick={() => toggle(o.id, 'negotiating')} className="flex-1 py-2.5 bg-amber-100 text-amber-700 font-bold text-sm rounded-xl hover:bg-amber-200 transition">💬 Negotiate</button>
                <button onClick={() => toggle(o.id, 'rejected')} className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-red-50 hover:text-red-600 transition">❌ Reject</button>
              </div>
            ) : (
              <div className={`p-3 rounded-xl text-center font-bold ${states[o.id] === 'accepted' ? 'bg-emerald-100 text-emerald-700' : states[o.id] === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                {states[o.id] === 'accepted' ? '✅ Offer Accepted' : states[o.id] === 'rejected' ? '❌ Offer Rejected' : '💬 Negotiation Initiated'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// My Orders
function MyOrders() {
  const steps = ['Order Placed', 'Confirmed', 'Packed', 'In Transit', 'Delivered'];
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-slate-800">📦 My Orders</h2>
      <div className="space-y-4">
        {ORDERS.map(o => {
          const step = o.status === 'Delivered' ? 4 : o.status === 'In Transit' ? 3 : o.status === 'Pending' ? 1 : 2;
          return (
            <div key={o.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div><h3 className="font-black text-slate-800">{o.id}</h3><p className="text-sm text-slate-400">{o.crop} • {o.qty} • {o.buyer}</p></div>
                <div className="text-right"><div className="font-black text-emerald-700">{o.amount}</div><div className="text-xs text-slate-400">{o.date}</div></div>
              </div>
              <div className="flex items-center gap-1 mb-3 overflow-x-auto">
                {steps.map((s, i) => (
                  <React.Fragment key={s}>
                    <div className={`flex flex-col items-center min-w-0 flex-shrink-0`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= step ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{i <= step ? '✓' : i + 1}</div>
                      <span className="text-[9px] text-slate-400 mt-1 text-center leading-tight">{s}</span>
                    </div>
                    {i < steps.length - 1 && <div className={`h-0.5 flex-1 mx-1 ${i < step ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
                  </React.Fragment>
                ))}
              </div>
              <StatusBadge status={o.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Govt Schemes
function GovtSchemes() {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-slate-800">🏛️ Government Schemes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SCHEMES.map(s => (
          <div key={s.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-black text-slate-800">{s.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${s.eligible ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{s.eligible ? '✅ Eligible' : '❌ Not Eligible'}</span>
            </div>
            <p className="text-sm text-slate-600 mb-3">{s.benefit}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Deadline: {s.deadline}</span>
              {s.eligible && <button className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition">Apply Now</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Payments
function Payments() {
  const payments = [
    { id: 'PAY-001', from: 'Reliance Fresh', crop: 'Wheat', amount: '₹1,84,000', date: '22 Aug 2026', method: 'NEFT', status: 'Received' },
    { id: 'PAY-002', from: 'BigBasket', crop: 'Onion', amount: '₹96,000', date: '15 Aug 2026', method: 'UPI', status: 'Received' },
    { id: 'PAY-003', from: 'Godrej Agrovet', crop: 'Soybean', amount: '₹1,20,000', date: '—', method: '—', status: 'Pending' },
  ];
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-slate-800">💳 Payments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-emerald-600 rounded-2xl p-5 text-white"><div className="text-xs text-emerald-200 mb-1">Total Received</div><div className="text-2xl font-black">₹4,36,000</div></div>
        <div className="bg-amber-500 rounded-2xl p-5 text-white"><div className="text-xs text-amber-100 mb-1">Pending</div><div className="text-2xl font-black">₹1,20,000</div></div>
        <div className="bg-slate-700 rounded-2xl p-5 text-white"><div className="text-xs text-slate-300 mb-1">Total Sales</div><div className="text-2xl font-black">₹5,56,000</div></div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-slate-50 text-xs text-slate-500 font-bold">
            <th className="text-left px-5 py-3">Payment ID</th>
            <th className="text-left px-4 py-3">Buyer</th>
            <th className="text-left px-4 py-3">Crop</th>
            <th className="text-left px-4 py-3">Amount</th>
            <th className="text-left px-4 py-3">Date</th>
            <th className="text-left px-4 py-3">Method</th>
            <th className="text-left px-4 py-3">Status</th>
          </tr></thead>
          <tbody>{payments.map(p => (
            <tr key={p.id} className="border-t border-slate-50 hover:bg-slate-50 transition">
              <td className="px-5 py-3 font-mono text-xs text-slate-600">{p.id}</td>
              <td className="px-4 py-3 font-bold text-slate-800">{p.from}</td>
              <td className="px-4 py-3 text-slate-600">{p.crop}</td>
              <td className="px-4 py-3 font-black text-emerald-700">{p.amount}</td>
              <td className="px-4 py-3 text-slate-500 text-xs">{p.date}</td>
              <td className="px-4 py-3 text-slate-500 text-xs">{p.method}</td>
              <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// Simple placeholder for remaining sections
function SimplePlaceholder({ title, icon, description }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-800">{icon} {title}</h2>
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <p className="text-slate-500 font-semibold">{description}</p>
        <p className="text-xs text-slate-400 mt-2">Full integration with live data available in production</p>
      </div>
    </div>
  );
}

function FarmerBuyerChat({ t, user }) {
  const [activeContact, setActiveContact] = useState(0);
  const [messages, setMessages] = useState({
    0: [
      { sender: 'buyer', text: 'Namaste Dnyaneshwar ji! We received your Red Onion Lot listing (120 Quintal, Grade A).', time: '10:30 AM' },
      { sender: 'buyer', text: 'Our current procurement rate is ₹2,650/Qtl with direct farm-gate pickup. Are you interested?', time: '10:31 AM' },
      { sender: 'me', text: 'Namaste. We have Grade A sorted onions. Can you increase the offer to ₹2,700/Qtl for 50 Quintals?', time: '10:35 AM' },
      { sender: 'buyer', text: 'Let me check with our regional procurement manager in Pune. We can likely do ₹2,680/Qtl if moisture is under 11%.', time: '10:40 AM' },
    ],
    1: [
      { sender: 'buyer', text: 'Hello farmer! BigBasket supply team here regarding your Sharbati Wheat lot.', time: 'Yesterday' },
      { sender: 'buyer', text: 'Can you provide the digital assay test report from Lasalgaon mandi lab?', time: 'Yesterday' },
      { sender: 'me', text: 'Yes, assay report uploaded. Moisture is 10.2% and grain purity is 99%.', time: 'Yesterday' },
      { sender: 'buyer', text: 'Excellent. Escrow pre-authorization is ready on the portal for ₹1,84,000.', time: '9:15 AM' },
    ],
    2: [
      { sender: 'buyer', text: 'Greetings! Sahyadri FPO aggregation cluster is pooling 500 Qtl Onion for Dubai export contract.', time: '2 days ago' },
      { sender: 'buyer', text: 'If you join the bulk pool, member payout is ₹2,780/Qtl with zero transportation charge.', time: '2 days ago' },
    ],
    3: [
      { sender: 'ai', text: '🙏 Namaste! Main Kisan Saathi AI hoon. Aap apni fasal, mandi bhav, ya weather ke baare me koi bhi sawal pooch sakte hain.', time: 'Just now' },
      { sender: 'ai', text: 'Tip: Aaj Lasalgaon mandi me pyaz ka bhav ₹2,580/Q hai. Hold recommendation valid for next 5 days.', time: 'Just now' },
    ]
  });
  const [inputText, setInputText] = useState('');

  const contacts = [
    { name: 'Reliance Fresh Procurement', role: 'Institutional Buyer • Pune Hub', avatar: '🏢', verified: true, active: true },
    { name: 'BigBasket Direct Supply', role: 'Supermarket Chain • Mumbai', avatar: '🛒', verified: true, active: false },
    { name: 'Sahyadri FPO Cluster Desk', role: 'FPO Aggregator • Nashik', avatar: '🌾', verified: true, active: false },
    { name: 'Kisan Saathi AI Assistant', role: 'AI Agri & Mandi Advisor • 24x7', avatar: '🤖', verified: true, active: true },
  ];

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    const newMsg = { sender: 'me', text, time: 'Just now' };
    setMessages(prev => ({
      ...prev,
      [activeContact]: [...(prev[activeContact] || []), newMsg]
    }));
    setInputText('');

    setTimeout(() => {
      let replyText = "Thank you! Our procurement desk has noted your message. We will update the contract offer in the portal.";
      if (activeContact === 3) {
        replyText = "🌾 Kisan Saathi AI: Aapka sandesh prapt hua! Humari mandi analytics ke mutabik aapko behtar munafa milne ki sambhavna hai.";
      } else if (text.toLowerCase().includes('price') || text.toLowerCase().includes('rate')) {
        replyText = "We can confirm our best counter-offer is ₹2,685/Qtl with instant digital escrow guarantee upon loading.";
      }
      setMessages(prev => ({
        ...prev,
        [activeContact]: [...(prev[activeContact] || []), { sender: activeContact === 3 ? 'ai' : 'buyer', text: replyText, time: 'Just now' }]
      }));
    }, 900);
  };

  const quickChips = [
    "What is your best price per Quintal?",
    "Ready for farm-gate pickup tomorrow morning",
    "Digital quality assay (Grade A) is verified",
    "Please send payment escrow confirmation",
  ];

  const currentChat = messages[activeContact] || [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[620px]">
      {/* Contact List */}
      <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-100 bg-white">
          <h3 className="font-black text-slate-800 text-base">💬 {t?.dashChat || 'Farmer & Buyer Chat'}</h3>
          <p className="text-xs text-slate-400">Direct negotiations with verified institutional buyers</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {contacts.map((c, idx) => (
            <div
              key={idx}
              onClick={() => setActiveContact(idx)}
              className={`p-4 flex items-start gap-3 cursor-pointer transition ${activeContact === idx ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : 'hover:bg-slate-100/60'}`}
            >
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xl flex-shrink-0 shadow-xs">
                {c.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-slate-800 truncate">{c.name}</p>
                  {c.active && <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{c.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 flex items-center justify-center text-xl">
              {contacts[activeContact].avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-black text-slate-800 text-sm">{contacts[activeContact].name}</h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded-md">✓ Verified</span>
              </div>
              <p className="text-xs text-slate-400">{contacts[activeContact].role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              🔒 Escrow Protected Deal
            </span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
          {currentChat.map((m, idx) => {
            const isMe = m.sender === 'me';
            return (
              <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                  isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none'
                }`}>
                  <p className="leading-relaxed">{m.text}</p>
                  <span className={`text-[10px] mt-1 block text-right font-medium ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 pt-2 pb-1 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto bg-slate-50/60 no-scrollbar">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-[11px] font-semibold text-slate-600 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-full px-3 py-1 whitespace-nowrap transition cursor-pointer flex-shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Type your reply, propose price, or ask delivery terms..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Send</span>
            <span>➤</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function FarmerDashboardNew({ user, onLogout, lang: appLang = 'en', setLang: appSetLang, t: propT }) {
  const lang = appLang || 'en';
  const setLang = appSetLang || (() => {});
  const t = propT || translations[lang] || translations.en;
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'dashboard', label: t?.dashOverview || 'Dashboard', icon: LayoutDashboard },
    { id: 'crops', label: t?.myCrops || 'My Crops', icon: Leaf },
    { id: 'create-lot', label: t?.lotCreation || 'Create Crop Lot', icon: PlusCircle },
    { id: 'market', label: t?.liveMandiPrices || 'Market Prices', icon: TrendingUp },
    { id: 'ai-price', label: t?.aiPricePrediction || 'AI Price Prediction', icon: BarChart3 },
    { id: 'best-market', label: t?.dashProfitCalc || 'Best Market', icon: MapPin },
    { id: 'offers', label: t?.buyerOffers || 'Buyer Offers', icon: ShoppingBag },
    { id: 'orders', label: t?.trackOrders || 'My Orders', icon: Package },
    { id: 'payments', label: t?.dashPayments || 'Payments', icon: CreditCard },
    { id: 'logistics', label: t?.dashLogistics || t?.logisticsStorage || 'Logistics', icon: Truck },
    { id: 'storage', label: t?.dashStorage || 'Storage', icon: Warehouse },
    { id: 'schemes', label: t?.navSchemes || 'Govt Schemes', icon: BookOpen },
    { id: 'weather', label: t?.dashWeather || t?.weatherAdvisory || 'Weather', icon: CloudSun },
    { id: 'chat', label: t?.dashChat || 'Chat', icon: MessageCircle },
    { id: 'help', label: t?.dashHelp || t?.disputeRedressal || 'Help & Support', icon: HelpCircle },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardOverview user={user} />;
      case 'crops': return <MyCrops />;
      case 'create-lot': return <CreateCropLot />;
      case 'market': return <MarketPrices />;
      case 'offers': return <BuyerOffersFull />;
      case 'orders': return <MyOrders />;
      case 'payments': return <Payments />;
      case 'schemes': return <GovtSchemes />;
      case 'ai-price': return <PricePredictionCard t={t} />;
      case 'best-market': return <NetProfitCalculator t={t} />;
      case 'logistics': return <LogisticsStorage t={t} defaultTab="logistics" />;
      case 'storage': return <LogisticsStorage t={t} defaultTab="storage" />;
      case 'weather': return <WeatherWidget t={t} />;
      case 'chat': return <FarmerBuyerChat t={t} user={user} />;
      case 'help': return <FarmerGrievance t={t} />;
      default: return <DashboardOverview user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* LEFT SIDEBAR */}
      <aside className={`fixed lg:static z-50 inset-y-0 left-0 w-64 bg-gradient-to-b from-emerald-900 to-green-900 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="font-black text-white text-base flex items-center">
                <span className="text-amber-400 font-serif font-black text-lg">अ</span>naaj
              </div>
              <div className="text-emerald-300 text-[10px] font-bold uppercase tracking-wider">Kisan Desk</div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-emerald-300 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center text-xl">{user?.avatar || '👨‍🌾'}</div>
            <div className="min-w-0">
              <p className="font-bold text-white text-sm truncate">{user?.name || 'Dnyaneshwar Patil'}</p>
              <p className="text-emerald-400 text-xs">{user?.village || 'Yeola'}, {user?.district || 'Nashik'}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-white/15 text-white'
                    : 'text-emerald-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-emerald-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-300 hover:bg-red-900/40 hover:text-red-300 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {t?.dashLogout || 'Logout'}
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center gap-4 px-4 lg:px-6 flex-shrink-0 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-700">
            <Menu className="w-6 h-6" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search crops, markets, buyers…"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
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

            {/* Notifications */}
            <button className="relative w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl cursor-pointer hover:bg-emerald-100 transition">
              <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-sm">{user?.avatar || '👨‍🌾'}</div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none">{(user?.name || 'Dnyaneshwar').split(' ')[0]}</p>
                <p className="text-[10px] text-emerald-600 leading-none mt-0.5">Farmer</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
            <span className="hover:text-emerald-600 cursor-pointer" onClick={() => setActiveSection('dashboard')}>Dashboard</span>
            {activeSection !== 'dashboard' && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-600 font-semibold capitalize">{NAV_ITEMS.find(n => n.id === activeSection)?.label}</span>
              </>
            )}
          </div>

          {/* Section Content */}
          <div className="animate-fade-in">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
