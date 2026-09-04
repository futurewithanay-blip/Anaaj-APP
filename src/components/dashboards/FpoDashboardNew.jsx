import React, { useState } from 'react';
import {
  Users, Layers, ShoppingBag, TrendingUp, DollarSign,
  Truck, Award, AlertTriangle, Plus, ChevronRight,
  Menu, X, LogOut, Bell, Search, Globe,
  LayoutDashboard, PackagePlus, Handshake, Package, CreditCard,
  PieChart, MessageSquare, BookOpen, FileText, HelpCircle,
  ArrowUpRight, ArrowDownRight, ShoppingCart
} from 'lucide-react';
import { translations } from '../../i18n/translations';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// ─── Sample Data ───────────────────────────────────────────────────────────────
const FARMERS = [
  { id: 'F-101', name: 'Ramesh Kumar', location: 'Nashik', crops: 'Onion, Tomato', qty: '150 Q', status: 'Verified' },
  { id: 'F-102', name: 'Suresh Patil', location: 'Yeola', crops: 'Wheat, Soybean', qty: '200 Q', status: 'Verified' },
  { id: 'F-103', name: 'Anil Deshmukh', location: 'Pimpalgaon', crops: 'Onion', qty: '80 Q', status: 'Pending' },
];

const AGGREGATIONS = [
  { crop: 'Onion (Red Nasik)', farmers: 12, qty: '1200 Q', grade: 'A', status: 'Ready for Bulk Lot' },
  { crop: 'Wheat (Sharbati)', farmers: 8, qty: '800 Q', grade: 'B+', status: 'Aggregating' },
  { crop: 'Soybean', farmers: 5, qty: '350 Q', grade: 'A', status: 'Aggregating' },
];

const BULK_LOTS = [
  { id: 'BL-001', crop: 'Onion', qty: '1000 Q', grade: 'A', price: '₹2,500/q', status: 'Published' },
  { id: 'BL-002', crop: 'Wheat', qty: '500 Q', grade: 'B+', price: '₹2,150/q', status: 'Draft' },
];

const ORDERS = [
  { id: 'ORD-901', buyer: 'Reliance Fresh', crop: 'Onion', qty: '500 Q', amount: '₹12,50,000', status: 'In Transit' },
  { id: 'ORD-902', buyer: 'BigBasket', crop: 'Wheat', qty: '200 Q', amount: '₹4,30,000', status: 'Confirmed' },
];

const REVENUE_DATA = [
  { month: 'Jan', revenue: 15, orders: 4, sales: 12 },
  { month: 'Feb', revenue: 20, orders: 6, sales: 18 },
  { month: 'Mar', revenue: 18, orders: 5, sales: 15 },
  { month: 'Apr', revenue: 25, orders: 8, sales: 22 },
  { month: 'May', revenue: 22, orders: 7, sales: 20 },
  { month: 'Jun', revenue: 30, orders: 10, sales: 28 },
];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'farmers', label: 'Manage Farmers', icon: Users },
  { id: 'aggregation', label: 'Crop Aggregation', icon: Layers },
  { id: 'create-lot', label: 'Create Bulk Lot', icon: PackagePlus },
  { id: 'selling', label: 'Bulk Selling', icon: Handshake },
  { id: 'matching', label: 'Buyer Matching', icon: Search },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'revenue', label: 'Revenue', icon: PieChart },
  { id: 'logistics', label: 'Logistics', icon: Truck },
  { id: 'chat', label: 'FPO-to-FPO Chat', icon: MessageSquare },
  { id: 'schemes', label: 'Govt Schemes', icon: BookOpen },
  { id: 'docs', label: 'Documents', icon: FileText },
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
    Verified: 'bg-emerald-100 text-emerald-700',
    Pending: 'bg-amber-100 text-amber-700',
    'Ready for Bulk Lot': 'bg-emerald-100 text-emerald-700',
    Aggregating: 'bg-blue-100 text-blue-700',
    Published: 'bg-purple-100 text-purple-700',
    Draft: 'bg-slate-100 text-slate-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    'In Transit': 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard icon={Users} label="Total Farmers" value="287" sub="Active members" color="bg-amber-500" trend={5} />
        <SummaryCard icon={Layers} label="Total Crop Qty" value="3.5k Q" sub="Currently aggregated" color="bg-emerald-500" trend={12} />
        <SummaryCard icon={Package} label="Active Bulk Lots" value="2" sub="Ready for sale" color="bg-blue-500" />
        <SummaryCard icon={ShoppingCart} label="Active Orders" value="4" sub="In processing" color="bg-purple-500" trend={8} />
        <SummaryCard icon={PieChart} label="Total Revenue" value="₹1.2Cr" sub="YTD Sales" color="bg-rose-500" trend={15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farmer List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800">👥 Recent Farmers Added</h3>
            <button className="text-xs text-amber-600 font-bold hover:underline">Manage All</button>
          </div>
          <div className="divide-y divide-slate-50">
            {FARMERS.map(f => (
              <div key={f.id} className="p-4 hover:bg-slate-50/60 transition flex justify-between items-center">
                 <div>
                   <p className="font-bold text-sm text-slate-800">{f.name}</p>
                   <p className="text-xs text-slate-500">{f.location} • {f.crops} ({f.qty})</p>
                 </div>
                 <StatusBadge status={f.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Aggregation */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800">📊 Crop Aggregation</h3>
            <button className="text-xs text-amber-600 font-bold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-50">
             {AGGREGATIONS.map((a,i) => (
                <div key={i} className="p-4 hover:bg-slate-50/60 transition flex justify-between items-center">
                   <div>
                     <p className="font-bold text-sm text-slate-800">{a.crop}</p>
                     <p className="text-xs text-slate-500">{a.farmers} Farmers • {a.qty} • Grade {a.grade}</p>
                   </div>
                   <StatusBadge status={a.status} />
                </div>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Revenue Analytics */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-5 border-b border-slate-100">
             <h3 className="font-black text-slate-800">📈 Revenue Analytics (Lakhs ₹)</h3>
           </div>
           <div className="p-4">
             <ResponsiveContainer width="100%" height={200}>
               <BarChart data={REVENUE_DATA}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                 <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                 <Tooltip formatter={(v) => `₹${v} Lakh`} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} cursor={{fill: 'rgba(245,158,11,0.05)'}} />
                 <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800">📦 Active Orders</h3>
            <button className="text-xs text-amber-600 font-bold hover:underline">Track All</button>
          </div>
          <div className="divide-y divide-slate-50">
             {ORDERS.map(o => (
               <div key={o.id} className="p-4 hover:bg-slate-50/60 transition flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-slate-800">{o.id} - {o.buyer}</p>
                    <p className="text-xs text-slate-500">{o.crop} ({o.qty})</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-amber-700">{o.amount}</p>
                    <StatusBadge status={o.status} />
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SimplePlaceholder({ title, icon, description }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-800">{icon} {title}</h2>
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <p className="text-slate-500 font-semibold">{description}</p>
        <p className="text-xs text-slate-400 mt-2">Module coming soon in production</p>
      </div>
    </div>
  );
}

import { INITIAL_FPO_MEMBERS } from '../../data/sampleLots';
import confetti from 'canvas-confetti';

function ManageFarmersView() {
  const [farmers, setFarmers] = useState(INITIAL_FPO_MEMBERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newVillage, setNewVillage] = useState('');
  const [newCrop, setNewCrop] = useState('Onion');
  const [newQty, setNewQty] = useState('');
  const [newAcres, setNewAcres] = useState('');

  const handleAddFarmer = (e) => {
    e.preventDefault();
    const newFarmer = {
      id: `F-${100 + farmers.length + 1}`,
      name: newName,
      village: newVillage || 'Yeola, Nashik',
      landAcres: Number(newAcres) || 3.0,
      crop: newCrop,
      lotReadyQtl: Number(newQty) || 25,
      contact: '+91 98XXX XXXXX',
      status: 'Verified'
    };
    setFarmers([newFarmer, ...farmers]);
    setShowAddModal(false);
    setNewName('');
    setNewQty('');
    setNewAcres('');
    alert(`Farmer ${newName} added to FPO registry with ${newQty} Qtl lot!`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">👥 Member Farmer Registry</h2>
          <p className="text-xs text-slate-500">Manage registered member farmers and track their ready harvest contributions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Farmer</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-amber-50/50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Farmer Name</th>
                <th className="text-left px-4 py-3">Village / Cluster</th>
                <th className="text-left px-4 py-3">Land Holding</th>
                <th className="text-left px-4 py-3">Primary Crop</th>
                <th className="text-left px-4 py-3">Harvest Ready</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {farmers.map(f => (
                <tr key={f.id} className="hover:bg-amber-50/20 transition">
                  <td className="px-4 py-3 font-mono font-bold text-amber-800">{f.id}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{f.name}</td>
                  <td className="px-4 py-3 text-slate-500">{f.village}</td>
                  <td className="px-4 py-3 text-slate-600">{f.landAcres} Acres</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{f.crop}</td>
                  <td className="px-4 py-3 font-black text-emerald-700">{f.lotReadyQtl} Qtl</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      ✓ Verified Member
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-800 text-lg">➕ Register Member Farmer</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddFarmer} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Farmer Full Name *</label>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Vitthalrao Patil"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Village & Taluka</label>
                <input
                  value={newVillage}
                  onChange={(e) => setNewVillage(e.target.value)}
                  placeholder="e.g. Lasalgaon, Niphad"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Crop</label>
                  <select
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-400"
                  >
                    {['Onion', 'Wheat', 'Soybean', 'Tomato', 'Grapes'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Ready Qty (Qtl)</label>
                  <input
                    required
                    type="number"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    placeholder="e.g. 40"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Land Size (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newAcres}
                  onChange={(e) => setNewAcres(e.target.value)}
                  placeholder="e.g. 4.5"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CropAggregationView() {
  const [members, setMembers] = useState(INITIAL_FPO_MEMBERS);
  const [selectedIds, setSelectedIds] = useState(['F-101', 'F-102', 'F-103', 'F-104']);
  const [bulkLotCreated, setBulkLotCreated] = useState(false);

  const selectedMembers = members.filter(m => selectedIds.includes(m.id));
  const pooledQty = selectedMembers.reduce((acc, m) => acc + m.lotReadyQtl, 0);
  const bulkPricePerQtl = 2680;
  const grossRevenue = pooledQty * bulkPricePerQtl;
  const fpoCess = Math.round((grossRevenue * 1.5) / 100);
  const netDistributable = grossRevenue - fpoCess;

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(x => x !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleCreatePool = () => {
    setBulkLotCreated(true);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    alert(`🎉 Bulk Commercial Consignment of ${pooledQty} Quintals created successfully!\nInstitutional Buyer matched at ₹${bulkPricePerQtl}/Qtl (Premium +₹100/Q over individual rates).`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-amber-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/30 text-amber-200 px-3 py-1 rounded-full border border-amber-400/30">
              🌾 Smallholder Harvest Aggregation Engine
            </span>
            <h2 className="text-2xl font-black font-heading mt-2">Pool Lots & Unlock Institutional Contracts</h2>
            <p className="text-xs text-amber-100/80 mt-1 max-w-xl">
              Combine small 20–40 quintal farm-gate lots into standardized 100+ quintal export grade bulk lots to secure premium buyer contracts.
            </p>
          </div>
          <button
            onClick={handleCreatePool}
            disabled={selectedIds.length === 0}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-xl transition hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            🚀 Publish Bulk Lot ({pooledQty} Qtl)
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-amber-800/60 text-center">
          <div className="bg-white/10 p-3 rounded-2xl">
            <div className="text-[11px] text-amber-200">Pooled Farmers</div>
            <div className="text-xl font-black mt-0.5">{selectedIds.length} Farmers</div>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl">
            <div className="text-[11px] text-amber-200">Aggregated Volume</div>
            <div className="text-xl font-black mt-0.5 text-amber-300">{pooledQty} Quintals</div>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl">
            <div className="text-[11px] text-amber-200">Negotiated Rate</div>
            <div className="text-xl font-black mt-0.5 text-emerald-400">₹{bulkPricePerQtl}/Qtl</div>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl">
            <div className="text-[11px] text-amber-200">Gross Pool Value</div>
            <div className="text-xl font-black mt-0.5">₹{grossRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <h3 className="font-black text-slate-800 text-sm mb-3">Select Member Lots to Include in Current Pool</h3>
        <div className="space-y-2">
          {members.map(m => {
            const isSelected = selectedIds.includes(m.id);
            return (
              <div
                key={m.id}
                onClick={() => toggleSelect(m.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  isSelected ? 'bg-amber-50/60 border-amber-300' : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-800 text-xs">{m.name}</span>
                    <span className="text-[11px] text-slate-400 ml-2">({m.village})</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-slate-600">{m.crop}</span>
                  <span className="text-xs font-black text-emerald-700">{m.lotReadyQtl} Quintals</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BulkSellingView() {
  const lots = [
    { id: 'BL-001', crop: 'Red Onion (Export Quality 55mm+)', qty: '1,000 Quintals', price: '₹2,680/q', status: 'Active Bidding', bids: 4, topBidder: 'Sahyadri Agro Export' },
    { id: 'BL-002', crop: 'Sharbati Wheat (Grain Purity 99%)', qty: '600 Quintals', price: '₹2,200/q', status: 'Deal Locked in Escrow', bids: 2, topBidder: 'ITC Ltd Procurement' },
    { id: 'BL-003', crop: 'Soybean (Cleaned & Graded)', qty: '400 Quintals', price: '₹4,650/q', status: 'Negotiating', bids: 3, topBidder: 'Adani Wilmar Solvents' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-800">🤝 Institutional Bulk Selling & Contracts</h2>
        <p className="text-xs text-slate-500">Live listings posted to nationwide institutional food processors, mills, and exporters</p>
      </div>

      <div className="space-y-4">
        {lots.map(l => (
          <div key={l.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">{l.id}</span>
                <span className="font-black text-slate-800 text-sm">{l.crop}</span>
              </div>
              <p className="text-xs text-slate-500">Volume: <span className="font-bold text-slate-800">{l.qty}</span> • Base Asking: <span className="font-bold text-emerald-700">{l.price}</span></p>
              <p className="text-[11px] text-slate-400 mt-1">Leading Bidder: <span className="font-semibold text-slate-700">{l.topBidder}</span> ({l.bids} institutional bids)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${l.status.includes('Locked') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                {l.status}
              </span>
              <button
                onClick={() => alert(`Reviewing bids for ${l.id}. High bid from ${l.topBidder} accepted with escrow guarantee.`)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition"
              >
                Review Bids
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FpoOrdersView() {
  const orders = [
    { id: 'FPO-ORD-901', buyer: 'Reliance Retail Fresh Ltd', crop: 'Red Onion', qty: '500 Qtl', amount: '₹13,40,000', status: 'In Transit', carrier: 'MahaFreight Fleet', eta: 'Tonight 9 PM' },
    { id: 'FPO-ORD-902', buyer: 'BigBasket Direct Sourcing', crop: 'Sharbati Wheat', qty: '300 Qtl', amount: '₹6,60,000', status: 'Confirmed • Loading', carrier: 'Godavari Transports', eta: 'Tomorrow' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-800">📦 Institutional Bulk Consignment Orders</h2>
        <p className="text-xs text-slate-500">Dispatch monitoring, weighment certificates, and escrow release tracking</p>
      </div>

      <div className="space-y-3">
        {orders.map(o => (
          <div key={o.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md mr-2">{o.id}</span>
                <span className="font-black text-slate-800 text-sm">{o.buyer}</span>
                <span className="text-xs text-slate-500 ml-2">({o.crop} • {o.qty})</span>
              </div>
              <div className="text-right">
                <span className="font-black text-emerald-700 text-base mr-3">{o.amount}</span>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">{o.status}</span>
              </div>
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>Carrier: <span className="font-semibold text-slate-700">{o.carrier}</span></span>
              <span>Delivery ETA: <span className="font-semibold text-blue-700">{o.eta}</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemberPaymentsView() {
  const payouts = [
    { farmer: 'Dnyaneshwar Patil', crop: 'Onion', qty: '28 Qtl', rate: '₹2,680/Q', gross: '₹75,040', cess: '₹1,125', netPayout: '₹73,915', status: 'Credited (UPI)' },
    { farmer: 'Sanjay Shinde', crop: 'Onion', qty: '35 Qtl', rate: '₹2,680/Q', gross: '₹93,800', cess: '₹1,407', netPayout: '₹92,393', status: 'Credited (NEFT)' },
    { farmer: 'Rameshwar Jadhav', crop: 'Onion', qty: '42 Qtl', rate: '₹2,680/Q', gross: '₹1,12,560', cess: '₹1,688', netPayout: '₹1,10,872', status: 'In Processing' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-800">💳 Member Farmer Settlement & Payout Engine</h2>
        <p className="text-xs text-slate-500">Automated transparent distribution: Gross Buyer Escrow − 1.5% FPO Cess = Direct Farmer Account Credit</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-amber-50/50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3">Member Farmer</th>
                <th className="text-left px-4 py-3">Pooled Qty</th>
                <th className="text-left px-4 py-3">Bulk Rate</th>
                <th className="text-left px-4 py-3">Gross Realization</th>
                <th className="text-left px-4 py-3">FPO Mgmt Fee (1.5%)</th>
                <th className="text-left px-4 py-3">Net Farmer Payout</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payouts.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-bold text-slate-800">{p.farmer}</td>
                  <td className="px-4 py-3 font-semibold text-slate-600">{p.qty}</td>
                  <td className="px-4 py-3 text-slate-600">{p.rate}</td>
                  <td className="px-4 py-3 font-bold text-slate-700">{p.gross}</td>
                  <td className="px-4 py-3 text-red-500 font-medium">−{p.cess}</td>
                  <td className="px-4 py-3 font-black text-emerald-700">{p.netPayout}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function FpoDashboardNew({ user, onLogout, lang: appLang = 'en', setLang: appSetLang, t: propT }) {
  const lang = appLang || 'en';
  const setLang = appSetLang || (() => {});
  const t = propT || translations[lang] || translations.en;
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t?.dashOverview || 'Dashboard', icon: LayoutDashboard },
    { id: 'farmers', label: t?.dashManageFarmers || 'Manage Farmers', icon: Users },
    { id: 'aggregation', label: t?.dashCropAggregation || 'Crop Aggregation', icon: Layers },
    { id: 'selling', label: t?.dashBulkSelling || 'Bulk Selling', icon: Handshake },
    { id: 'orders', label: t?.dashOrders || 'Consignment Orders', icon: Package },
    { id: 'payments', label: t?.dashPayments || 'Member Payouts', icon: CreditCard },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardOverview />;
      case 'farmers': return <ManageFarmersView />;
      case 'aggregation': return <CropAggregationView />;
      case 'selling': return <BulkSellingView />;
      case 'orders': return <FpoOrdersView />;
      case 'payments': return <MemberPaymentsView />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`fixed lg:static z-50 inset-y-0 left-0 w-64 bg-gradient-to-b from-amber-900 to-orange-900 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-amber-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="font-black text-white text-base flex items-center">
                <span className="text-amber-300 font-serif font-black text-lg">अ</span>naaj
              </div>
              <div className="text-amber-300 text-[10px] font-bold uppercase tracking-wider">FPO Portal</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-b border-amber-800">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center text-xl">🤝</div>
             <div className="min-w-0">
               <p className="font-bold text-white text-sm truncate">{user?.name || 'Nashik FPO Sangh'}</p>
               <p className="text-amber-300 text-xs">{user?.regNo || 'MH-FPO-2024'}</p>
             </div>
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeSection === item.id ? 'bg-white/15 text-white' : 'text-amber-300 hover:bg-white/10 hover:text-white'
              }`}>
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-3 border-t border-amber-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-300 hover:bg-red-900/40 hover:text-red-300 transition cursor-pointer">
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
                <input placeholder="Search farmers, lots..." className="w-full pl-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400" />
              </div>
           </div>
           <div className="flex items-center gap-3">
             {/* Language Selector */}
             <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200">
               <Globe className="w-3.5 h-3.5 text-amber-600" />
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
             <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                <span className="text-xl">🤝</span>
                <span className="text-sm font-bold text-slate-800 hidden sm:block">FPO Admin</span>
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
