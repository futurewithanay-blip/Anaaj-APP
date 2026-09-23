import React, { useState, useEffect } from 'react';
import {
  Users, Layers, ShoppingBag, TrendingUp, DollarSign,
  Truck, Award, AlertTriangle, Plus, ChevronRight,
  Menu, X, LogOut, Bell, Search, Globe,
  LayoutDashboard, PackagePlus, Handshake, Package, CreditCard,
  PieChart, MessageSquare, BookOpen, FileText, HelpCircle,
  ArrowUpRight, ArrowDownRight, ShoppingCart, MapPin,
  CloudSun, Warehouse, MessageCircle, Edit2, Star, Sparkles, Check, XCircle,
  Download, Eye, Upload, ShieldCheck, CheckCircle2, Clock, ExternalLink, Filter
} from 'lucide-react';
import { translations } from '../../i18n/translations';
import UserProfileModal from '../common/UserProfileModal';
import FpoBuyerReviews from '../panels/FpoPanel/FpoBuyerReviews';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import LiveMandiDashboard from '../common/LiveMandiDashboard';
import WeatherWidget from '../common/WeatherWidget';
import NetProfitCalculator from '../common/NetProfitCalculator';
import LogisticsStorage from '../panels/FarmerPanel/LogisticsStorage';
import FarmerGrievance from '../panels/FarmerPanel/FarmerGrievance';
import StorageAiAgent from '../common/StorageAiAgent';
import sharedPaymentDB from '../../services/db';
import confetti from 'canvas-confetti';
import { INITIAL_FPO_MEMBERS } from '../../data/sampleLots';
import { GOVT_SCHEMES } from '../../data/schemesData';
import { fetchCropListings, createCropListing, fetchMarketBids, updateBidStatus, fetchFpoMembers, addFpoMember, isSupabaseConfigured } from '../../services/supabaseClient';

import FpoMembershipManager from '../common/FpoMembershipManager';

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
  { id: 'reviews', label: 'Rate Bulk Buyers', icon: Star },
  { id: 'revenue', label: 'Revenue', icon: PieChart },
  { id: 'logistics', label: 'Logistics', icon: Truck },
  { id: 'docs', label: 'Documents', icon: FileText },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

function SummaryCard({ icon: Icon, label, value, sub, color, trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:border-amber-200' : ''}`}
    >
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
      {onClick && <div className="text-[10px] text-amber-500 font-bold mt-1.5 flex items-center gap-0.5">Tap to view <ChevronRight className="w-2.5 h-2.5" /></div>}
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

function DashboardOverview({ farmers: farmersProp, onNavigate }) {
  const farmers = farmersProp || FARMERS;
  const nav = (s) => onNavigate && onNavigate(s);

  return (
    <div className="space-y-6">
      {/* Summary Cards — all clickable, live data */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard icon={Users} label="Total Farmers" value={farmers.length || 287} sub="Active members" color="bg-amber-500" trend={5} onClick={() => nav('farmers')} />
        <SummaryCard icon={Layers} label="Crop Aggregation" value="3.5k Q" sub="Currently aggregated" color="bg-emerald-500" trend={12} onClick={() => nav('aggregation')} />
        <SummaryCard icon={Package} label="Bulk Lots" value="2" sub="Ready for sale" color="bg-blue-500" onClick={() => nav('selling')} />
        <SummaryCard icon={ShoppingCart} label="Active Orders" value="4" sub="In processing" color="bg-purple-500" trend={8} onClick={() => nav('orders')} />
        <SummaryCard icon={PieChart} label="Total Revenue" value="₹1.2Cr" sub="YTD Sales" color="bg-rose-500" trend={15} onClick={() => nav('payments')} />
      </div>

      {/* Quick Access Icon Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-black text-slate-700 text-sm mb-4">⚡ Quick Access</h3>
        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-3">
          {[
            { icon: Users, label: 'Farmers', section: 'farmers', color: 'bg-amber-100 text-amber-700' },
            { icon: Layers, label: 'Aggregation', section: 'aggregation', color: 'bg-emerald-100 text-emerald-700' },
            { icon: TrendingUp, label: 'Market', section: 'market', color: 'bg-blue-100 text-blue-700' },
            { icon: MapPin, label: 'Best Market', section: 'best-market', color: 'bg-purple-100 text-purple-700' },
            { icon: Handshake, label: 'Bulk Sell', section: 'selling', color: 'bg-orange-100 text-orange-700' },
            { icon: Package, label: 'Orders', section: 'orders', color: 'bg-indigo-100 text-indigo-700' },
            { icon: CreditCard, label: 'Payouts', section: 'payments', color: 'bg-rose-100 text-rose-700' },
            { icon: Star, label: 'Rate Buyers', section: 'reviews', color: 'bg-amber-100 text-amber-800' },
            { icon: Truck, label: 'Logistics', section: 'logistics', color: 'bg-teal-100 text-teal-700' },
            { icon: Warehouse, label: 'Storage', section: 'storage', color: 'bg-cyan-100 text-cyan-700' },
            { icon: CloudSun, label: 'Weather', section: 'weather', color: 'bg-sky-100 text-sky-700' },
            { icon: HelpCircle, label: 'Help', section: 'help', color: 'bg-slate-100 text-slate-700' },
          ].map(({ icon: Ic, label, section, color }) => (
            <button key={section} onClick={() => nav(section)} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl ${color} hover:opacity-80 transition-all hover:scale-105 cursor-pointer`}>
              <Ic className="w-5 h-5" />
              <span className="text-[10px] font-bold text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farmer List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800">👥 Recent Farmers Added</h3>
            <button onClick={() => nav('farmers')} className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1 cursor-pointer">Manage All <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="divide-y divide-slate-50">
            {farmers.slice(0, 4).map(f => (
              <div key={f.id} className="p-4 hover:bg-slate-50/60 transition flex justify-between items-center">
                 <div>
                   <p className="font-bold text-sm text-slate-800">{f.name}</p>
                   <p className="text-xs text-slate-500">{f.location || f.village} • {f.crops || f.crop} ({f.qty || `${f.lotReadyQtl} Qtl`})</p>
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
            <button onClick={() => nav('aggregation')} className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1 cursor-pointer">View All <ChevronRight className="w-3 h-3" /></button>
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
           <div className="p-5 border-b border-slate-100 flex items-center justify-between">
             <h3 className="font-black text-slate-800">📈 Revenue Analytics (Lakhs ₹)</h3>
             <button onClick={() => nav('payments')} className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1 cursor-pointer">View Payouts <ChevronRight className="w-3 h-3" /></button>
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
            <button onClick={() => nav('orders')} className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1 cursor-pointer">Track All <ChevronRight className="w-3 h-3" /></button>
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

      {/* Rate Bulk Buyers Banner Card */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-amber-950 rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base text-white">⭐ Institutional Bulk Buyer Ratings</h3>
              <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                3 Pending Bulk Reviews
              </span>
            </div>
            <p className="text-xs text-amber-200 mt-1">
              Rate corporate buyers (Reliance Wholesale, BigBasket, Adani Wilmar) on <strong>Escrow Release</strong>, <strong>Bulk Contract Terms</strong> & <strong>Fleet Logistics</strong>.
            </p>
          </div>
        </div>
        <button
          onClick={() => nav('reviews')}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition shrink-0 flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <span>Rate Bulk Buyers</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── FPO Government Schemes & Grants View ──────────────────────────────────
const FPO_SCHEMES_LIST = [
  {
    id: 'sfac-equity-grant',
    name: 'SFAC Equity Grant Scheme for FPCs',
    category: 'Direct Grants',
    ministry: 'Small Farmers Agribusiness Consortium (SFAC), Ministry of Agriculture',
    benefit: 'Matching equity grant up to ₹15 Lakh per FPO in 1:1 ratio against farmer members equity contribution.',
    eligibility: 'Registered Farmer Producer Company with min. 300 active shareholder farmers (100 in NE/Hilly regions).',
    targetAudience: 'FPO Federations & Producer Companies',
    keyDocuments: ['MCA Certificate of Incorporation', 'Audited Balance Sheet (last 1-2 yrs)', 'List of Shareholder Farmers with land records', 'Bank Account Verification'],
    applyUrl: 'https://sfacindia.com/Equity-Grant-Scheme.aspx',
    status: 'Open for Application',
    grantAmount: 'Up to ₹15,00,000 Direct Grant',
    tags: ['Matching Grant', 'Equity Support', 'SFAC Govt']
  },
  {
    id: 'nabard-credit-guarantee',
    name: 'NABSanrakshan / NABARD Credit Guarantee Scheme (CGFS)',
    category: 'Credit Guarantees',
    ministry: 'NABARD & Dept of Agriculture & Farmers Welfare',
    benefit: 'Collateral-free credit guarantee cover up to 85% for loans up to ₹1 Cr, and 75% for loans up to ₹2 Cr.',
    eligibility: 'Registered FPOs seeking institutional credit from Commercial Banks, RRBs, or Cooperative Banks for working capital/term loans.',
    targetAudience: 'FPOs expanding Bulk Trade & Aggregation',
    keyDocuments: ['FPO Business Plan & DPR', 'Board Resolution for Borrowing', 'Bank Sanction Letter', 'Farmer Member Base KYC'],
    applyUrl: 'https://www.nabsanrakshan.org/',
    status: 'Active All Year',
    grantAmount: 'Up to ₹2,00,00,000 Guarantee',
    tags: ['Collateral Free', 'Credit Guarantee', 'NABARD']
  },
  {
    id: 'central-10000-fpo',
    name: 'Central Sector Scheme for Formation & Promotion of 10,000 FPOs',
    category: 'Direct Grants',
    ministry: 'Ministry of Agriculture & Farmers Welfare, GoI',
    benefit: 'Financial assistance of ₹18.00 Lakh per FPO for initial 3 years for management costs + designated CBBO mentoring.',
    eligibility: 'FPOs mobilized through designated Cluster-Based Business Organizations (CBBOs) or federated producer groups.',
    targetAudience: 'New & Developing FPOs',
    keyDocuments: ['Registration Document under Companies Act or State Co-op Societies Act', 'CBBO Recommendation Letter', 'Geo-tagged Office Setup'],
    applyUrl: 'https://enam.gov.in/web/fpo',
    status: 'Active',
    grantAmount: '₹18,00,000 over 3 Yrs',
    tags: ['CBBO Support', 'Management Cost', 'Central Scheme']
  },
  {
    id: 'aif-infra',
    name: 'Agriculture Infrastructure Fund (AIF) for FPOs',
    category: 'Infra & Storage',
    ministry: 'Department of Agriculture & Farmers Welfare',
    benefit: '3% Interest Subvention per annum up to loan limit of ₹2 Crore for 7 years for Cold Storages, Warehouses, Sorting & Grading lines.',
    eligibility: 'FPOs, Cooperatives, and Agri-entrepreneurs creating post-harvest management infrastructure.',
    targetAudience: 'FPOs investing in Packhouses & Silos',
    keyDocuments: ['Detailed Project Report (DPR)', 'Land Possession / Lease Document (min 10 yrs)', 'Statutory Approvals & Layout Plan'],
    applyUrl: 'https://agriinfra.dac.gov.in/',
    status: 'Active',
    grantAmount: '3% Interest Subvention',
    tags: ['Cold Storage', 'Warehousing', 'Post-Harvest']
  },
  {
    id: 'operation-greens',
    name: 'Operation Greens — TOP to TOTAL (MoFPI)',
    category: 'Infra & Storage',
    ministry: 'Ministry of Food Processing Industries (MoFPI)',
    benefit: '50% Subsidy on transportation and 50% subsidy on storage for Tomato, Onion, Potato, and 22 perishable notified crops.',
    eligibility: 'FPOs, Food Processors, and Logistics Aggregators transporting perishables through Kisan Rail or accredited cold storage.',
    targetAudience: 'Vegetable & Fruit FPOs',
    keyDocuments: ['Transport Freight Receipts / Railway RR Receipt', 'Storage Rent Invoice with geo-tag', 'Crop Origin Certificate from District Agriculture Officer'],
    applyUrl: 'https://mofpi.gov.in/schemes/operation-greens',
    status: 'Open',
    grantAmount: '50% Freight & Storage Subsidy',
    tags: ['Transport Subsidy', 'Perishables', 'MoFPI']
  },
  {
    id: 'smam-chc',
    name: 'SMAM Custom Hiring Centers (Farm Machinery Bank)',
    category: 'Farm Machinery',
    ministry: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    benefit: 'Up to 80% subsidy (up to ₹10 Lakhs) for establishing Custom Hiring Centers (CHCs) with High-Tech Farm Equipment and Drones.',
    eligibility: 'Registered FPOs with at least 50 farmer members in the cluster area.',
    targetAudience: 'FPOs providing Tractor & Harvester Rentals',
    keyDocuments: ['FPO Registration Certificate', 'List of proposed farm equipment with manufacturer quotations', 'Resolution passed in General Body Meeting'],
    applyUrl: 'https://agrimachinery.nic.in/',
    status: 'Active',
    grantAmount: 'Up to 80% Machinery Subsidy',
    tags: ['Tractor Bank', 'Drone Hire', 'Farm Machinery']
  }
];

function FpoSchemesView({ user, t, onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSchemes, setAppliedSchemes] = useState({});
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState(null);
  const [showEligibilityCalc, setShowEligibilityCalc] = useState(false);
  const [calcMembers, setCalcMembers] = useState(287);
  const [calcEquity, setCalcEquity] = useState(1250000);
  const [calcResult, setCalcResult] = useState(null);

  const categories = ['All', 'Direct Grants', 'Credit Guarantees', 'Infra & Storage', 'Farm Machinery'];

  const filteredSchemes = FPO_SCHEMES_LIST.filter(scheme => {
    const matchesCat = selectedCategory === 'All' || scheme.category === selectedCategory;
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scheme.benefit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scheme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();
    const appRef = `FPO-${selectedSchemeForApply.id.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setAppliedSchemes(prev => ({
      ...prev,
      [selectedSchemeForApply.id]: {
        appRef,
        appliedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Submitted to Portal'
      }
    }));
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setSelectedSchemeForApply(null);
  };

  const calculateEligibility = (e) => {
    e.preventDefault();
    const members = Number(calcMembers) || 0;
    const equity = Number(calcEquity) || 0;

    let sfacEligible = members >= 300;
    let sfacMaxGrant = Math.min(equity, 1500000);
    let nabardGuarantee = members >= 100 ? 'Eligible for up to ₹2 Crore guarantee cover' : 'Requires min 100 members';
    let aifEligible = '3% Interest Subvention eligible for packhouses & cold storage';

    setCalcResult({
      sfacEligible,
      sfacMaxGrant,
      nabardGuarantee,
      aifEligible,
      members,
      equity
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-amber-950/60 border border-amber-300/30 px-3 py-1 rounded-full text-xs font-bold text-amber-200">
              <Award className="w-3.5 h-3.5 text-amber-300" /> Central & State Govt Grants for FPOs
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              FPO Subsidies, Equity Grants & Credit Guarantees
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
              Access matching grants from SFAC up to ₹15 Lakhs, collateral-free credit cover from NABARD up to ₹2 Crores, and 50% perishable freight subsidies under Operation Greens.
            </p>
          </div>
          <button
            onClick={() => setShowEligibilityCalc(true)}
            className="px-5 py-3 bg-white hover:bg-amber-50 text-amber-900 font-black rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center gap-2 cursor-pointer text-xs sm:text-sm whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            Check FPO Eligibility Calculator
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search schemes by name, grant, or benefit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSchemes.map((scheme) => {
          const appliedInfo = appliedSchemes[scheme.id];
          return (
            <div
              key={scheme.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all p-6 flex flex-col justify-between group hover:border-amber-300"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full inline-block">
                      {scheme.category}
                    </span>
                    <h3 className="font-black text-slate-800 text-base group-hover:text-amber-700 transition">
                      {scheme.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-semibold">{scheme.ministry}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-black text-xs rounded-xl shadow-xs">
                      {scheme.grantAmount}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
                  {scheme.benefit}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Eligibility:</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-5">{scheme.eligibility}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Required Documents:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-5">
                    {scheme.keyDocuments.map((doc, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                        • {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {appliedInfo && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
                    <div>
                      <p className="font-bold text-emerald-900">Application Submitted ✅</p>
                      <p className="text-[10px] text-emerald-700">Ref: {appliedInfo.appRef} • {appliedInfo.appliedDate}</p>
                    </div>
                    <span className="text-[10px] bg-emerald-200 text-emerald-800 font-black px-2 py-0.5 rounded">
                      In Review
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                <a
                  href={scheme.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-700 transition"
                >
                  Official Portal <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => setSelectedSchemeForApply(scheme)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-sm transition hover:scale-105 flex items-center gap-1.5 cursor-pointer"
                >
                  <Handshake className="w-3.5 h-3.5" />
                  {appliedInfo ? 'Re-submit / Update' : 'Apply Online'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply Modal */}
      {selectedSchemeForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-amber-700 to-orange-700 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-white text-base">Apply for Scheme</h3>
                <p className="text-xs text-amber-200">{selectedSchemeForApply.name}</p>
              </div>
              <button
                onClick={() => setSelectedSchemeForApply(null)}
                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">FPO Name</label>
                <input
                  type="text"
                  readOnly
                  value={user?.fpoName || user?.name || 'Sahyadri Farmers Producer Co. Ltd'}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">CIN / Reg No.</label>
                  <input
                    type="text"
                    readOnly
                    value="U01409MH2021PTC361234"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Member Farmers</label>
                  <input
                    type="number"
                    defaultValue="287"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Estimated Grant / Loan Required (₹)</label>
                <input
                  type="text"
                  defaultValue="₹15,00,000"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Brief Proposal / Objective</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Establishment of 500 MT onion storage shed and grading facility for export pool"
                  defaultValue="Aggregating 1,200 MT Red Onion from 287 member farmers for institutional bulk contracts."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800">
                <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>All documents from FPO Document Hub will be automatically verified & attached.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSchemeForApply(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl transition shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Eligibility Calculator Modal */}
      {showEligibilityCalc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-amber-700 to-orange-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-200" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">FPO Scheme Eligibility Calculator</h3>
                  <p className="text-xs text-amber-200">Real-time SFAC, NABARD & AIF Subsidy Estimator</p>
                </div>
              </div>
              <button
                onClick={() => { setShowEligibilityCalc(false); setCalcResult(null); }}
                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={calculateEligibility} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Number of Active Shareholder Farmers</label>
                <input
                  type="number"
                  min="10"
                  value={calcMembers}
                  onChange={(e) => setCalcMembers(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Min 300 required for SFAC Equity Grant in plains; 100 in Hilly/NE states.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Total Paid-up Equity Capital Collected (₹)</label>
                <input
                  type="number"
                  min="10000"
                  step="50000"
                  value={calcEquity}
                  onChange={(e) => setCalcEquity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">SFAC matches 1:1 up to ₹15 Lakhs.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Calculate Eligible Benefits
              </button>

              {calcResult && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 animate-in zoom-in-95">
                  <h4 className="font-black text-amber-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Eligibility Assessment Results
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-amber-200/80 flex items-center justify-between">
                      <span className="font-bold text-slate-700">SFAC Matching Equity Grant:</span>
                      <span className="font-black text-emerald-700">₹{calcResult.sfacMaxGrant.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-amber-200/80 flex items-center justify-between">
                      <span className="font-bold text-slate-700">NABARD Credit Guarantee:</span>
                      <span className="font-black text-blue-700">Cover up to ₹2.00 Cr</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-amber-200/80 flex items-center justify-between">
                      <span className="font-bold text-slate-700">AIF Infrastructure Interest:</span>
                      <span className="font-black text-purple-700">3% Annual Subsidy</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-amber-900 leading-snug">
                    {calcResult.members >= 300
                      ? '🎉 Outstanding! Your FPO fulfills all requirements for the maximum ₹15L SFAC grant.'
                      : `💡 Tip: Add ${300 - calcResult.members} more farmers to cross the 300 shareholder threshold for automatic SFAC grant approval.`}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FPO Documents & Compliance Hub ─────────────────────────────────────────
const INITIAL_FPO_DOCS = [
  {
    id: 'DOC-001',
    title: 'Certificate of Incorporation (MCA)',
    category: 'Incorporation & Legal',
    docNo: 'CIN: U01409MH2021PTC361234',
    authority: 'Ministry of Corporate Affairs, Registrar of Companies Pune',
    issueDate: '12 May 2021',
    expiryDate: 'Permanent (Valid)',
    status: 'Verified',
    fileSize: '2.4 MB PDF',
    verifiedBy: 'MCA V3 Portal',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'DOC-002',
    title: 'APMC Unified Institutional Trade License',
    category: 'Trade & Food Safety Licenses',
    docNo: 'LIC-MH-APMC-NSK-4421',
    authority: 'Maharashtra State APMC Directorate & Lasalgaon APMC',
    issueDate: '01 Apr 2024',
    expiryDate: '31 Mar 2027',
    status: 'Verified',
    fileSize: '1.2 MB PDF',
    verifiedBy: 'State Agri Marketing Board',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'DOC-003',
    title: 'FSSAI Central Food Business Operator License',
    category: 'Trade & Food Safety Licenses',
    docNo: 'Reg No: 11521034000892',
    authority: 'Food Safety & Standards Authority of India (FSSAI Western Region)',
    issueDate: '15 Nov 2022',
    expiryDate: '14 Nov 2027',
    status: 'Verified',
    fileSize: '1.8 MB PDF',
    verifiedBy: 'FoSCoS Portal',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'DOC-004',
    title: 'Goods & Services Tax (GST) Registration',
    category: 'Incorporation & Legal',
    docNo: 'GSTIN: 27AAECS4491N1ZW',
    authority: 'Central Board of Indirect Taxes & Customs (CBIC)',
    issueDate: '20 Jun 2021',
    expiryDate: 'Active (Perpetual)',
    status: 'Verified',
    fileSize: '820 KB PDF',
    verifiedBy: 'GSTN Portal',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'DOC-005',
    title: 'Shareholder Members Registry (Form MGT-1)',
    category: 'Member Farmer Registries',
    docNo: 'REG-2026-FPO-MEM-287',
    authority: 'Sahyadri Farmers Producer Co. Board of Directors',
    issueDate: '15 Aug 2026',
    expiryDate: 'Updated Quarterly',
    status: 'Verified',
    fileSize: '3.6 MB PDF',
    verifiedBy: 'FPO Internal Audit',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'DOC-006',
    title: 'AGMARK Quality Grading & Packing License',
    category: 'Quality & Lab Assay Reports',
    docNo: 'AGMARK-NSK-2025-081',
    authority: 'Directorate of Marketing & Inspection (DMI), Nagpur',
    issueDate: '16 Oct 2023',
    expiryDate: '15 Oct 2026 (Renewal in 21 days)',
    status: 'Expiring Soon',
    fileSize: '1.5 MB PDF',
    verifiedBy: 'Govt AGMARK Lab',
    badgeColor: 'bg-amber-100 text-amber-800'
  },
  {
    id: 'DOC-007',
    title: 'NABL Certified Soil & Pesticide Residue Assay',
    category: 'Quality & Lab Assay Reports',
    docNo: 'NABL-MH-AGRI-8821',
    authority: 'National Accreditation Board for Testing Laboratories',
    issueDate: '10 Aug 2026',
    expiryDate: '09 Feb 2027',
    status: 'Verified',
    fileSize: '4.1 MB PDF',
    verifiedBy: 'NABL Lab Network',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  }
];

function FpoDocumentsView({ user, t }) {
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem('anaaj_fpo_documents');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_FPO_DOCS;
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [downloadToast, setDownloadToast] = useState(null);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Trade & Food Safety Licenses');
  const [newDocNo, setNewDocNo] = useState('');
  const [newAuthority, setNewAuthority] = useState('');
  const [newExpiry, setNewExpiry] = useState('');
  const [newFileName, setNewFileName] = useState('');

  const categories = [
    'All',
    'Incorporation & Legal',
    'Trade & Food Safety Licenses',
    'Member Farmer Registries',
    'Quality & Lab Assay Reports'
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.docNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.authority.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const verifiedCount = documents.filter(d => d.status === 'Verified').length;
  const expiringCount = documents.filter(d => d.status === 'Expiring Soon').length;

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const newDoc = {
      id: `DOC-00${documents.length + 1}`,
      title: newTitle || 'FPO Legal Document',
      category: newCategory,
      docNo: newDocNo || `REG-${Date.now().toString().slice(-6)}`,
      authority: newAuthority || 'Govt of Maharashtra',
      issueDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      expiryDate: newExpiry || 'Valid (3 Years)',
      status: 'Verified',
      fileSize: newFileName ? `${(Math.random() * 2 + 1).toFixed(1)} MB PDF` : '1.8 MB PDF',
      verifiedBy: 'DigiLocker / MCA Verified',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    try {
      localStorage.setItem('anaaj_fpo_documents', JSON.stringify(updated));
    } catch (e) {}

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setShowUploadModal(false);
    setNewTitle('');
    setNewDocNo('');
    setNewAuthority('');
    setNewExpiry('');
    setNewFileName('');
  };

  const triggerDownload = (doc) => {
    setDownloadToast(`Downloading ${doc.title}...`);
    setTimeout(() => {
      setDownloadToast(`✓ ${doc.title} downloaded successfully!`);
      setTimeout(() => setDownloadToast(null), 2500);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in slide-in-from-bottom">
          <Download className="w-4 h-4 text-emerald-400" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Compliance Health Overview Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl flex-shrink-0">
            📁
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-800">FPO Documents & Compliance Hub</h2>
              <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Grade A+ Compliance (98%)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Centralized repository for corporate registry, APMC mandi trading licenses, FSSAI certifications & quality assay records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex-1 md:flex-initial px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Documents</span>
            <FileText className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-black text-slate-800">{documents.length}</p>
          <span className="text-[10px] text-slate-400">All registered records</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-xs font-semibold">Verified & Active</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">{verifiedCount}</p>
          <span className="text-[10px] text-emerald-600 font-bold">100% legally binding</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-semibold">Action Required</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{expiringCount}</p>
          <span className="text-[10px] text-amber-700 font-bold">AGMARK license renewal</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-xs font-semibold">DigiLocker Sync</span>
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-blue-700">Connected</p>
          <span className="text-[10px] text-blue-600 font-bold">Auto-fetch enabled</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by doc name, number, or authority..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group hover:border-amber-300"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  📄
                </div>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                  doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {doc.status === 'Verified' ? '✓ Verified' : '⚠️ ' + doc.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-amber-700 transition">
                  {doc.title}
                </h3>
                <p className="text-[11px] font-mono text-amber-900 bg-amber-50 px-2 py-0.5 rounded inline-block mt-1 font-bold">
                  {doc.docNo}
                </p>
              </div>

              <div className="space-y-1 text-[11px] text-slate-500">
                <p className="truncate"><span className="font-semibold text-slate-700">Authority:</span> {doc.authority}</p>
                <p><span className="font-semibold text-slate-700">Valid:</span> {doc.expiryDate}</p>
                <p><span className="font-semibold text-slate-700">Size:</span> {doc.fileSize} • {doc.verifiedBy}</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="flex-1 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer border border-slate-200"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" /> View
              </button>
              <button
                onClick={() => triggerDownload(doc)}
                className="flex-1 py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer border border-amber-200"
              >
                <Download className="w-3.5 h-3.5 text-amber-600" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-amber-700 to-orange-700 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-white text-base">Upload FPO Document</h3>
                <p className="text-xs text-amber-200">Legal, licensing, & lab assay records</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FSSAI Central License Renewal"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="Incorporation & Legal">Incorporation & Legal</option>
                  <option value="Trade & Food Safety Licenses">Trade & Food Safety Licenses</option>
                  <option value="Member Farmer Registries">Member Farmer Registries</option>
                  <option value="Quality & Lab Assay Reports">Quality & Lab Assay Reports</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Document / Reg No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH-REG-8812"
                    value={newDocNo}
                    onChange={(e) => setNewDocNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 31 Dec 2027"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Issuing Authority *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Directorate of Marketing & Inspection, GoI"
                  value={newAuthority}
                  onChange={(e) => setNewAuthority(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Attach File (PDF, PNG, JPG)</label>
                <div
                  className="border-2 border-dashed border-slate-200 hover:border-amber-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-50/50 transition"
                  onClick={() => setNewFileName('FPO_Compliance_Cert_2026.pdf')}
                >
                  <Upload className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-700">
                    {newFileName ? `Attached: ${newFileName} ✓` : 'Click to simulate document upload'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">DigiLocker OCR ready</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl transition shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100">
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-amber-700 to-orange-700 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-white text-sm">{previewDoc.title}</h3>
                <p className="text-[11px] text-amber-200">{previewDoc.docNo}</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Official Document Canvas */}
            <div className="p-6 bg-slate-50">
              <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-inner relative overflow-hidden space-y-4">
                <div className="absolute right-4 bottom-4 text-7xl opacity-5 pointer-events-none font-serif font-black">
                  अ
                </div>

                <div className="text-center border-b border-slate-200 pb-3">
                  <p className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Government of India / State Directorate</p>
                  <h4 className="text-base font-black text-slate-800 mt-0.5">{previewDoc.authority}</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Verification Ref: {previewDoc.docNo}</p>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-bold text-slate-500">Issued To:</span>
                    <span className="font-black text-slate-900">{user?.fpoName || user?.name || 'Sahyadri Farmers Producer Co. Ltd'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-bold text-slate-500">Document Type:</span>
                    <span className="font-semibold text-slate-900">{previewDoc.category}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-bold text-slate-500">Issue Date:</span>
                    <span className="font-semibold text-slate-900">{previewDoc.issueDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-bold text-slate-500">Validity:</span>
                    <span className="font-black text-emerald-700">{previewDoc.expiryDate}</span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-black">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Digitally Signed & Validated</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">SHA-256 Verified</span>
                    <span className="text-[10px] font-bold text-slate-600">{previewDoc.verifiedBy}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">{previewDoc.fileSize}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerDownload(previewDoc)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function ManageFarmersView({ onFarmersChange, user }) {
  const isDemo = Boolean(user?.isDemo || user?.phone === '9876543210' || user?.phone === '+91 98231 99001' || user?.phone === '9823199001');
  const [farmers, setFarmers] = useState(() => (isDemo ? INITIAL_FPO_MEMBERS : []));
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newVillage, setNewVillage] = useState('');
  const [newCrop, setNewCrop] = useState('Onion');
  const [newQty, setNewQty] = useState('');
  const [newAcres, setNewAcres] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync farmer list up to parent so overview shows live count
  React.useEffect(() => { if (onFarmersChange) onFarmersChange(farmers); }, [farmers]);

  // Load from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    fetchFpoMembers().then((dbMembers) => {
      if (isMounted && dbMembers && dbMembers.length > 0) {
        const mapped = dbMembers.map(m => ({
          id: m.farmer_id || m.membership_code || m.id,
          name: m.farmer_name,
          village: m.farmer_village || 'Nashik',
          landAcres: m.land_acres || 3.0,
          crop: m.crop || 'Onion',
          lotReadyQtl: m.lot_ready_qtl || 25,
          contact: m.farmer_phone || '+91 98231 44521',
          status: m.status === 'active' ? 'Verified' : m.status,
          isLiveSupabase: true
        }));

        if (isDemo) {
          const existingIds = new Set(mapped.map(m => m.id));
          const rest = INITIAL_FPO_MEMBERS.filter(init => !existingIds.has(init.id));
          setFarmers([...mapped, ...rest]);
        } else {
          setFarmers(mapped);
        }
      }
    }).catch(err => console.warn('Supabase FPO members fetch error:', err));

    return () => { isMounted = false; };
  }, [isDemo]);

  const handleAddFarmer = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const newFarmer = {
      farmer_id: `F-${100 + farmers.length + 1}`,
      name: newName,
      farmer_name: newName,
      village: newVillage || 'Yeola, Nashik',
      farmer_village: newVillage || 'Yeola, Nashik',
      land_acres: Number(newAcres) || 3.0,
      landAcres: Number(newAcres) || 3.0,
      crop: newCrop,
      lot_ready_qtl: Number(newQty) || 25,
      lotReadyQtl: Number(newQty) || 25,
      farmer_phone: '+91 98231 ' + Math.floor(10000 + Math.random() * 90000),
      contact: '+91 98231 ' + Math.floor(10000 + Math.random() * 90000),
      status: 'Verified',
      isLiveSupabase: true
    };

    setFarmers(prev => [newFarmer, ...prev]);
    setShowAddModal(false);
    setNewName('');
    setNewQty('');
    setNewAcres('');
    setIsSaving(false);

    try {
      await addFpoMember(newFarmer);
      confetti({ particleCount: 50, spread: 60 });
    } catch (err) {
      console.warn('Supabase add farmer warning:', err);
    }
  };

  return (
    <div className="space-y-6">
      <FpoMembershipManager currentRole="fpo" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-800">👥 Member Farmer Registry</h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
              ⚡ Live Supabase
            </span>
          </div>
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
                  <td className="px-4 py-3 font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{f.name}</span>
                    {f.isLiveSupabase && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.2 rounded">
                        ⚡ Live
                      </span>
                    )}
                  </td>
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

function CropAggregationView({ user, t }) {
  const [members, setMembers] = useState(INITIAL_FPO_MEMBERS);
  const [selectedIds, setSelectedIds] = useState(['F-101', 'F-102', 'F-103', 'F-104']);
  const [bulkLotCreated, setBulkLotCreated] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedCode, setPublishedCode] = useState(null);

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

  const handleCreatePool = async () => {
    setIsPublishing(true);
    const listingPayload = {
      listing_code: `FPO-BULK-${Date.now().toString().slice(-6)}`,
      farmer_id: user?.id || 'fpo-sahyadri',
      farmer_name: user?.fpoName || user?.name || 'Sahyadri Farmers Producer Co.',
      phone: user?.phone || '+91 98221 44556',
      state: user?.state || 'Maharashtra',
      district: user?.district || 'Nashik',
      crop_name: 'Red Onion (Export Quality 55mm+)',
      variety: 'Garwa Bulk Grade A+',
      quantity_qtl: pooledQty,
      base_price_per_qtl: bulkPricePerQtl,
      mandi_name: 'Lasalgaon APMC Institutional Depot',
      moisture_pct: 11.2,
      quality_grade: 'A+ Export',
      status: 'ACTIVE'
    };

    const res = await createCropListing(listingPayload);
    setIsPublishing(false);
    setBulkLotCreated(true);
    setPublishedCode(res?.data?.listing_code || listingPayload.listing_code);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6">
      {bulkLotCreated && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">⚡</div>
            <div>
              <p className="text-xs font-black text-emerald-950">
                Bulk Consignment {publishedCode} Published to Live Marketplace!
              </p>
              <p className="text-[11px] text-emerald-800">
                {pooledQty} Quintals aggregated across {selectedIds.length} farmers at ₹{bulkPricePerQtl}/Qtl. Open for verified institutional bidding.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full">
            Supabase Synced ✓
          </span>
        </div>
      )}

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
            disabled={selectedIds.length === 0 || isPublishing}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-xl transition hover:scale-[1.02] cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isPublishing ? '⏳ Syncing Supabase...' : `🚀 Publish Bulk Lot (${pooledQty} Qtl)`}
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

function BulkSellingView({ user, t }) {
  const [dbListings, setDbListings] = useState([]);
  const [dbBids, setDbBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBidsModal, setShowBidsModal] = useState(false);
  const [selectedLotBids, setSelectedLotBids] = useState(null);
  const [actionToast, setActionToast] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [listings, bids] = await Promise.all([
        fetchCropListings(),
        fetchMarketBids()
      ]);
      if (listings) setDbListings(listings);
      if (bids) setDbBids(bids);
    } catch (err) {
      console.warn('Marketplace fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateBid = async (bidId, newStatus) => {
    const res = await updateBidStatus(bidId, newStatus);
    if (res?.success) {
      setDbBids(prev => prev.map(b => b.id === bidId ? { ...b, status: newStatus } : b));
      setActionToast(`✓ Bid status updated to ${newStatus} in Supabase!`);
      confetti({ particleCount: 40, spread: 50 });
      setTimeout(() => setActionToast(null), 4000);
    }
  };

  const staticLots = [
    { id: 'BL-001', crop: 'Red Onion (Export Quality 55mm+)', qty: '1,000 Quintals', price: '₹2,680/q', status: 'Active Bidding', bids: 4, topBidder: 'Sahyadri Agro Export' },
    { id: 'BL-002', crop: 'Sharbati Wheat (Grain Purity 99%)', qty: '600 Quintals', price: '₹2,200/q', status: 'Deal Locked in Escrow', bids: 2, topBidder: 'ITC Ltd Procurement' },
    { id: 'BL-003', crop: 'Soybean (Cleaned & Graded)', qty: '400 Quintals', price: '₹4,650/q', status: 'Negotiating', bids: 3, topBidder: 'Adani Wilmar Solvents' },
  ];

  return (
    <div className="space-y-5">
      {actionToast && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between text-xs font-bold animate-in slide-in-from-top-3">
          <span>{actionToast}</span>
          <button onClick={() => setActionToast(null)} className="text-white hover:text-emerald-200 font-bold">✕</button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-800">🤝 Institutional Bulk Selling & Contracts</h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
              ⚡ Live Supabase
            </span>
          </div>
          <p className="text-xs text-slate-500">Live listings posted to nationwide institutional food processors, mills, and exporters</p>
        </div>

        <button
          onClick={() => { setSelectedLotBids(null); setShowBidsModal(true); }}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs rounded-xl shadow-xs hover:from-amber-700 hover:to-orange-700 transition flex items-center gap-2"
        >
          <span>📩 Review Buyer Offers ({dbBids.length})</span>
        </button>
      </div>

      {/* Live Supabase Listings Section */}
      {dbListings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Active Supabase Marketplace Listings ({dbListings.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dbListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs hover:border-amber-400 transition">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                    {listing.listing_code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                    ⚡ Live Supabase
                  </span>
                </div>
                <h4 className="font-black text-slate-900 text-sm">{listing.crop_name}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Variety: <span className="font-semibold text-slate-700">{listing.variety || 'Standard'}</span> • Mandi: <span className="font-semibold text-slate-700">{listing.mandi_name}</span>
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400">Volume: </span>
                    <span className="text-xs font-black text-slate-800">{listing.quantity_qtl} Qtl</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Asking: </span>
                    <span className="text-xs font-black text-emerald-700">₹{listing.base_price_per_qtl}/Qtl</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Standard Institutional Contracts */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
          Enterprise & Exporter Supply Contracts
        </h3>
        <div className="space-y-4">
          {staticLots.map(l => (
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
                  onClick={() => { setSelectedLotBids(l); setShowBidsModal(true); }}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition"
                >
                  Review Bids
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buyer Bids Review Modal */}
      {showBidsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-heading font-black text-slate-900 text-lg flex items-center gap-2">
                  <span>📩 Institutional Buyer Bids & Escrow</span>
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    {dbBids.length} Offers
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedLotBids ? `Filtered for ${selectedLotBids.crop}` : 'All active buyer offers across registered lots'}
                </p>
              </div>
              <button onClick={() => setShowBidsModal(false)} className="text-slate-400 hover:text-slate-600 font-black text-sm">✕</button>
            </div>

            <div className="space-y-3">
              {dbBids.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-medium">
                  No active buyer bids in the pipeline yet. New bids will appear here in real-time.
                </div>
              ) : (
                dbBids.map(b => (
                  <div key={b.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{b.buyer_company || b.buyer_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({b.buyer_phone})</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Offering: <span className="font-black text-emerald-700">₹{b.bid_price_per_qtl}/Qtl</span> for <span className="font-bold">{b.quantity_qtl} Quintals</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Total Value: ₹{(b.bid_price_per_qtl * b.quantity_qtl).toLocaleString()} • Status: <span className="font-bold text-amber-700">{b.status}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {b.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleUpdateBid(b.id, 'ACCEPTED')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Accept
                          </button>
                          <button
                            onClick={() => handleUpdateBid(b.id, 'REJECTED')}
                            className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl font-bold text-xs transition flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs font-black px-3 py-1 rounded-full ${
                          b.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {b.status === 'ACCEPTED' ? '✓ Accepted & Locked' : '✕ Rejected'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
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

function MemberPaymentsView({ user }) {
  const [payouts, setPayouts] = useState([
    { id: 'FPO-PAY-01', farmer: 'Dnyaneshwar Patil', crop: 'Onion', qty: '28 Qtl', rate: '₹2,680/Q', gross: '₹75,040', cess: '₹1,125', netPayout: '₹73,915', rawAmount: 73915, status: 'Credited (UPI)' },
    { id: 'FPO-PAY-02', farmer: 'Sanjay Shinde', crop: 'Onion', qty: '35 Qtl', rate: '₹2,680/Q', gross: '₹93,800', cess: '₹1,407', netPayout: '₹92,393', rawAmount: 92393, status: 'Credited (NEFT)' },
    { id: 'FPO-PAY-03', farmer: 'Dnyaneshwar Patil', crop: 'Soybean (Kharif)', qty: '50 Qtl', rate: '₹4,850/Q', gross: '₹2,42,500', cess: '₹3,637', netPayout: '₹2,38,863', rawAmount: 238863, status: 'In Processing' },
    { id: 'FPO-PAY-04', farmer: 'Rameshwar Jadhav', crop: 'Onion', qty: '42 Qtl', rate: '₹2,680/Q', gross: '₹1,12,560', cess: '₹1,688', netPayout: '₹1,10,872', rawAmount: 110872, status: 'In Processing' },
  ]);
  const [toast, setToast] = useState(null);

  const handlePayFarmer = (p) => {
    sharedPaymentDB.recordPayment({
      fromRole: 'fpo',
      fromName: user?.fpoName || user?.name || 'Sahyadri Farmers Producer Co.',
      toFarmer: p.farmer,
      crop: `${p.crop} (${p.qty})`,
      amount: p.rawAmount,
      method: 'Direct DBT / FPO Settlement',
      orderId: p.id,
      notes: `FPO Member Distribution: ${p.gross} gross − ${p.cess} management fee`
    });

    setPayouts(prev => prev.map(item => item.id === p.id ? { ...item, status: 'Credited (Direct DBT) ✓' } : item));
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setToast(`✓ Payout of ${p.netPayout} dispatched to ${p.farmer}! Reflected in Farmer's Payment History.`);
    setTimeout(() => setToast(null), 6000);
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-xl flex items-center justify-between animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold">✓</div>
            <p className="text-xs font-bold">{toast}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-white hover:text-emerald-200 text-sm font-bold">✕</button>
        </div>
      )}

      <div>
        <h2 className="text-xl font-black text-slate-800">💳 Member Farmer Settlement & Payout Engine</h2>
        <p className="text-xs text-slate-500">Automated transparent distribution: Gross Buyer Escrow − 1.5% FPO Cess = Direct Farmer Account Credit (Synced with Farmer Ledger)</p>
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
                <th className="text-center px-4 py-3">Action</th>
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
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status.includes('Credited') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.status === 'In Processing' ? (
                      <button
                        onClick={() => handlePayFarmer(p)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition cursor-pointer"
                      >
                        Pay Farmer
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-bold">✓ Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── FPO Market Prices (wraps LiveMandiDashboard) ─────────────────────────────
function FpoMarketPrices({ t, lang }) {
  return <LiveMandiDashboard t={t} lang={lang} />;
}

// ─── FPO Chat (FPO-to-FPO + Buyer negotiation) ────────────────────────────────
function FpoChat({ t }) {
  const [activeContact, setActiveContact] = useState(0);
  const [messages, setMessages] = useState({
    0: [
      { sender: 'buyer', text: 'Namaste! Reliance Retail procurement team here. We need 1000 Qtl Grade A Red Onion for November export cycle.', time: '9:30 AM' },
      { sender: 'buyer', text: 'FPO bulk discount is applicable. Please share your aggregate lot certificate and moisture report.', time: '9:32 AM' },
    ],
    1: [
      { sender: 'other', text: 'Nashik FPO Federation: Our October bulk pool has reached 2400 Qtl. Are you joining this cycle?', time: 'Yesterday' },
      { sender: 'other', text: 'We secured ₹2,780/Qtl from Gulf Foods UAE. Joining gives your members a ₹100/Qtl premium over local mandi.', time: 'Yesterday' },
    ],
    2: [
      { sender: 'ai', text: '🙏 Namaste FPO Admin! Main Anaaj AI hoon. FPO management, bulk lot pricing, aggregation queries, ya govt scheme ke baare mein poochhen.', time: 'Just now' },
      { sender: 'ai', text: 'Tip: Onion export demand from Gulf region is high this week. Recommend holding bulk lots for 5–7 days for ₹150/Qtl premium.', time: 'Just now' },
    ],
  });
  const [inputText, setInputText] = useState('');

  const contacts = [
    { name: 'Reliance Retail Fresh', role: 'Institutional Buyer • Mumbai', avatar: '🏢', verified: true, active: true },
    { name: 'Nashik FPO Federation', role: 'FPO-to-FPO Network • Nashik', avatar: '🌾', verified: true, active: false },
    { name: 'Anaaj AI Advisor', role: 'AI FPO & Market Advisor • 24x7', avatar: '🤖', verified: true, active: true },
  ];

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    setMessages(prev => ({ ...prev, [activeContact]: [...(prev[activeContact] || []), { sender: 'me', text, time: 'Just now' }] }));
    setInputText('');
    setTimeout(() => {
      let replyText = 'Thank you! Our procurement desk has reviewed your FPO lot credentials. We will send an escrow offer within 2 hours.';
      if (activeContact === 2) replyText = '🌾 Anaaj AI: FPO aggregation data logged. Current market analysis shows optimal bulk lot size of 800–1000 Qtl for institutional deals.';
      setMessages(prev => ({ ...prev, [activeContact]: [...(prev[activeContact] || []), { sender: activeContact === 2 ? 'ai' : activeContact === 1 ? 'other' : 'buyer', text: replyText, time: 'Just now' }] }));
    }, 900);
  };

  const quickChips = ['Send FPO bulk lot certificate', 'Moisture report: 10.2% (Grade A)', 'Available for farm-gate pickup', 'Request escrow guarantee'];
  const currentChat = messages[activeContact] || [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[620px]">
      <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-100 bg-white">
          <h3 className="font-black text-slate-800 text-base">💬 FPO Communication Hub</h3>
          <p className="text-xs text-slate-400">Buyers, FPO networks & AI advisor</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {contacts.map((c, idx) => (
            <div key={idx} onClick={() => setActiveContact(idx)} className={`p-4 flex items-start gap-3 cursor-pointer transition ${activeContact === idx ? 'bg-amber-50/80 border-l-4 border-amber-600' : 'hover:bg-slate-100/60'}`}>
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xl flex-shrink-0 shadow-xs">{c.avatar}</div>
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
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
          <div className="w-10 h-10 rounded-2xl bg-amber-100/80 flex items-center justify-center text-xl">{contacts[activeContact].avatar}</div>
          <div>
            <h4 className="font-black text-slate-800 text-sm">{contacts[activeContact].name}</h4>
            <p className="text-xs text-slate-400">{contacts[activeContact].role}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
          {currentChat.map((m, idx) => {
            const isMe = m.sender === 'me';
            return (
              <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${isMe ? 'bg-amber-600 text-white rounded-br-none' : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none'}`}>
                  <p className="leading-relaxed">{m.text}</p>
                  <span className={`text-[10px] mt-1 block text-right font-medium ${isMe ? 'text-amber-100' : 'text-slate-400'}`}>{m.time}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-4 pt-2 pb-1 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto bg-slate-50/60">
          {quickChips.map((chip, idx) => (
            <button key={idx} onClick={() => handleSend(chip)} className="text-[11px] font-semibold text-slate-600 bg-white hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 border border-slate-200 rounded-full px-3 py-1 whitespace-nowrap transition cursor-pointer flex-shrink-0">{chip}</button>
          ))}
        </div>
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }} placeholder="Type message, propose price, share lot details..." className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <button onClick={() => handleSend()} disabled={!inputText.trim()} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5">
            <span>Send</span><span>➤</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FPO Government Schemes View ───────────────────────────────────────────────
function FpoGovtSchemes() {
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Post-Harvest Infrastructure', 'Crop Insurance', 'Market Integration', 'Income Support', 'State Direct Support', 'Farm Machinery Subsidy'];

  const fpoHighlight = ['aif', 'enam', 'pmfby']; // schemes most relevant for FPOs

  const filtered = activeCategory === 'All'
    ? GOVT_SCHEMES
    : GOVT_SCHEMES.filter(s => s.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-amber-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/30 text-amber-200 px-3 py-1 rounded-full border border-amber-400/30">
              🏛️ Central & State Government FPO Schemes
            </span>
            <h2 className="text-2xl font-black font-heading mt-2">Govt Schemes & Funding for FPOs</h2>
            <p className="text-xs text-amber-100/80 mt-1 max-w-xl">
              Discover PM-KISAN, AIF infrastructure funding, SFAC promotion grants, NABARD credit linkages, and ₹1 token crop insurance schemes for your FPO members.
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="bg-white/10 rounded-2xl px-4 py-3 text-center">
              <div className="text-2xl font-black text-amber-300">{GOVT_SCHEMES.length}</div>
              <div className="text-[10px] text-amber-200 font-bold">Active Schemes Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeCategory === cat
                ? 'bg-amber-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scheme Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map(scheme => {
          const isFpoRecommended = fpoHighlight.includes(scheme.id);
          return (
            <div
              key={scheme.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition hover:shadow-md ${
                isFpoRecommended ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200/90'
              }`}
            >
              {isFpoRecommended && (
                <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center gap-1.5">
                  <span className="text-[11px] font-black text-amber-700">⭐ Highly Recommended for FPOs</span>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-black text-slate-800 text-sm leading-tight">{scheme.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{scheme.ministry}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${scheme.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {scheme.status}
                  </span>
                </div>

                <div className="bg-amber-50 rounded-xl p-3 mb-3">
                  <p className="text-xs font-bold text-amber-900 flex items-start gap-1.5">
                    <span className="text-base shrink-0">💰</span>
                    <span>{scheme.benefit}</span>
                  </p>
                </div>

                <div className="space-y-2 mb-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Eligibility</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{scheme.eligibility}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Key Documents</p>
                    <div className="flex flex-wrap gap-1">
                      {scheme.keyDocuments.map((doc, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {scheme.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={scheme.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    🔗 Apply / Know More
                  </a>
                  <button
                    onClick={() => setSelected(selected === scheme.id ? null : scheme.id)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    {selected === scheme.id ? 'Less ▲' : 'Details ▼'}
                  </button>
                </div>

                {selected === scheme.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 animate-in slide-in-from-top-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target Audience</p>
                    <p className="text-xs text-slate-700 font-semibold">{scheme.targetAudience}</p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-2">State Coverage</p>
                    <p className="text-xs text-slate-700">{scheme.state}</p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-2">Scheme Category</p>
                    <p className="text-xs text-slate-700">{scheme.category}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FPO Quick Guide */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
        <h3 className="font-black text-base">📋 Quick FPO Funding Checklist</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Register on SFAC Portal', desc: 'Get FPO recognition & access to equity grants up to ₹15 Lakh from SFAC.', link: 'https://sfacindia.com/' },
            { step: '2', title: 'Apply for AIF Loan', desc: '3% interest subvention for cold storage, warehouse, grading & processing units.', link: 'https://agriinfra.dac.gov.in/' },
            { step: '3', title: 'Join e-NAM Platform', desc: 'Direct inter-state trade bypassing middlemen. Zero commission on ₹2 Crore+ turnover.', link: 'https://enam.gov.in/' },
          ].map(item => (
            <div key={item.step} className="bg-white/10 rounded-xl p-4 space-y-2">
              <div className="w-8 h-8 bg-amber-400/20 text-amber-300 rounded-lg flex items-center justify-center font-black text-sm">
                {item.step}
              </div>
              <p className="font-bold text-sm">{item.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[11px] text-amber-400 font-bold hover:underline">
                Open Portal →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function resolveFpoProfile(u) {
  const isDemoUser = Boolean(
    u?.isDemo === true ||
    u?.phone === '9876543210' ||
    u?.phone === '+91 98231 99001' ||
    u?.phone === '9823199001'
  );

  if (isDemoUser) {
    return {
      name: u?.name || 'Nashik District Farmer Producer Co.',
      regNo: u?.regNo || 'MH-FPO-2024-9921',
      phone: u?.phone || '+91 98231 99001',
      email: u?.email || 'contact@nashikfpo.org',
      city: 'Pimpalgaon Baswant',
      district: 'Nashik',
      state: 'Maharashtra',
      pincode: '422209',
      avatar: u?.avatar || '🤝',
      photoUrl: null,
      membersCount: 520,
      boardPresident: 'Balasaheb Vikhe Patil',
      primaryCrops: 'Red Onion, Grapes, Pomegranate, Lokwan Wheat',
      gstin: '27AABCS9912F1Z8',
      pan: 'AABCS9912F',
      warehouseLocation: 'Dindori MIDC CA Storage Hub',
      storageCapacity: '4,500 MT',
      verified: true,
      isDemo: true
    };
  }

  const details = u?.details || {};
  const cleanPhone = String(u?.phone || '').replace(/\D/g, '');

  return {
    name: u?.name || u?.fpoName || details.name || 'Registered FPO',
    regNo: u?.regNo || details.regNo || '',
    phone: u?.phone || (cleanPhone ? `+91 ${cleanPhone.slice(-10)}` : ''),
    email: u?.email || '',
    city: u?.city || u?.village || details.city || details.village || '',
    district: u?.district || details.district || '',
    state: u?.state || details.state || 'Maharashtra',
    pincode: u?.pincode || details.pincode || '',
    avatar: u?.avatar || details.avatar || '🤝',
    photoUrl: u?.photoUrl || details.photoUrl || null,
    membersCount: Number(u?.membersCount || u?.totalMembers || details.totalMembers) || 0,
    boardPresident: u?.boardPresident || u?.authPerson || details.authPerson || u?.name || '',
    primaryCrops: u?.primaryCrops || details.primaryCrops || (Array.isArray(details.crops) ? details.crops.join(', ') : 'All Commodities'),
    gstin: u?.gstin || details.gst || '',
    pan: details.pan || '',
    warehouseLocation: u?.warehouseLocation || details.warehouseLocation || (u?.district ? `${u.district} Storage Hub` : 'Storage Hub'),
    storageCapacity: u?.storageCapacity || details.storageCapacity || '',
    verified: true,
    isDemo: false
  };
}

export default function FpoDashboardNew({ user, onLogout, lang: appLang = 'en', setLang: appSetLang, t: propT }) {
  const lang = appLang || 'en';
  const setLang = appSetLang || (() => {});
  const t = propT || translations[lang] || translations.en;
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Lift farmers state here so DashboardOverview can show live count
  const [farmers, setFarmers] = useState(null); // null = not loaded yet, ManageFarmersView will sync
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [fpoProfile, setFpoProfile] = useState(() => {
    if (user) return resolveFpoProfile(user);
    try {
      const saved = localStorage.getItem('anaaj_fpo_profile');
      if (saved) return resolveFpoProfile(JSON.parse(saved));
    } catch (e) {}
    return resolveFpoProfile(null);
  });

  useEffect(() => {
    if (user) {
      setFpoProfile(resolveFpoProfile(user));
    }
  }, [user]);

  const handleUpdateFpoProfile = (newProfile) => {
    setFpoProfile(newProfile);
    try {
      localStorage.setItem('anaaj_fpo_profile', JSON.stringify(newProfile));
    } catch (e) {}
  };

  const navItems = [
    { id: 'dashboard', label: t?.dashOverview || 'Dashboard', icon: LayoutDashboard },
    { id: 'farmers', label: t?.dashManageFarmers || 'Manage Farmers', icon: Users },
    { id: 'aggregation', label: t?.dashCropAggregation || 'Crop Aggregation', icon: Layers },
    { id: 'market', label: t?.liveMandiPrices || 'Market Prices', icon: TrendingUp },
    { id: 'ai-storage', label: 'AI Storage & Sell Advisory', icon: Sparkles },
    { id: 'best-market', label: t?.dashProfitCalc || 'Best Market', icon: MapPin },
    { id: 'selling', label: t?.dashBulkSelling || 'Bulk Selling', icon: Handshake },
    { id: 'orders', label: t?.dashOrders || 'Consignment Orders', icon: Package },
    { id: 'payments', label: t?.dashPayments || 'Member Payouts', icon: CreditCard },
    { id: 'reviews', label: t?.dashReviews || 'Rate Bulk Buyers', icon: Star },
    { id: 'schemes', label: 'Govt Schemes & Grants', icon: Award },
    { id: 'docs', label: 'Documents & Compliance', icon: FileText },
    { id: 'chat', label: 'Buyer & Network Chat', icon: MessageSquare },
    { id: 'logistics', label: t?.dashLogistics || 'Logistics', icon: Truck },
    { id: 'weather', label: t?.dashWeather || 'Weather', icon: CloudSun },
    { id: 'help', label: t?.dashHelp || 'Help & Support', icon: HelpCircle },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardOverview farmers={farmers} onNavigate={setActiveSection} />;
      case 'farmers': return <ManageFarmersView onFarmersChange={setFarmers} user={user} />;
      case 'aggregation':
      case 'create-lot':
        return <CropAggregationView user={user} t={t} />;
      case 'market': return <FpoMarketPrices t={t} lang={lang} />;
      case 'storage':
      case 'ai-storage': 
        return (
          <div className="space-y-5 max-w-7xl mx-auto">
            <StorageAiAgent userProfile={user} />
          </div>
        );
      case 'best-market': return <NetProfitCalculator t={t} />;
      case 'selling':
      case 'matching':
        return <BulkSellingView user={user} t={t} />;
      case 'orders': return <FpoOrdersView />;
      case 'payments':
      case 'revenue':
        return <MemberPaymentsView user={user} />;
      case 'reviews': return <FpoBuyerReviews user={user} t={t} onNavigate={setActiveSection} />;
      case 'schemes': return <FpoSchemesView user={user} t={t} onNavigate={setActiveSection} />;
      case 'docs': return <FpoDocumentsView user={user} t={t} />;
      case 'chat': return <FpoChat t={t} />;
      case 'logistics': return <LogisticsStorage t={t} defaultTab="logistics" user={user} />;
      case 'weather': return <WeatherWidget t={t} />;
      case 'help': return <FarmerGrievance t={t} />;
      default: return <DashboardOverview farmers={farmers} onNavigate={setActiveSection} />;
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
        
        {/* Clickable FPO User Info (Top Left Corner) */}
        <div 
          onClick={() => setShowProfileModal(true)}
          className="p-3 mx-3 my-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-amber-700/60 transition-all cursor-pointer group shadow-xs"
          title="Click to view & edit FPO profile"
        >
           <div className="flex items-center gap-3">
             <div className="relative flex-shrink-0">
               {fpoProfile.photoUrl ? (
                 <img src={fpoProfile.photoUrl} alt={fpoProfile.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-400" />
               ) : (
                 <div className="w-11 h-11 bg-amber-700 rounded-full flex items-center justify-center text-2xl ring-2 ring-amber-400/50 shadow-inner">
                   {fpoProfile.avatar || '🤝'}
                 </div>
               )}
               <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[9px] text-slate-950 font-black border border-amber-950">
                 ✓
               </span>
             </div>
             <div className="min-w-0 flex-1">
               <div className="flex items-center justify-between">
                 <p className="font-bold text-white text-sm truncate group-hover:text-amber-200 transition">{fpoProfile.name}</p>
                 <Edit2 className="w-3.5 h-3.5 text-amber-300 opacity-75 group-hover:opacity-100 transition flex-shrink-0" />
               </div>
               <p className="text-amber-300 text-xs truncate">{fpoProfile.regNo}</p>
               <span className="text-[9px] text-amber-300 font-bold bg-amber-950/60 px-1.5 py-0.5 rounded inline-block mt-0.5">
                 Edit FPO Profile ✏️
               </span>
             </div>
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeSection === item.id ? 'bg-white/15 text-white' : 'text-amber-300 hover:bg-white/10 hover:text-white'
              }`}>
              <item.icon className="w-4 h-4" />
              <span className="truncate">{item.label}</span>
              {item.id === 'reviews' && (
                <span className="ml-auto text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full font-black">
                  3
                </span>
              )}
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
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold text-slate-800 capitalize">
                  FPO Federation Desk
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Aggregator Portal
                </span>
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
              <div 
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 cursor-pointer hover:bg-amber-100 transition"
                title="Click to view & edit profile"
              >
                {fpoProfile.photoUrl ? (
                  <img src={fpoProfile.photoUrl} alt="FPO" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <span className="text-xl">{fpoProfile.avatar || '🤝'}</span>
                )}
                <span className="text-sm font-bold text-slate-800 hidden sm:block">FPO Profile ✏️</span>
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
            <span className="hover:text-amber-600 cursor-pointer" onClick={() => setActiveSection('dashboard')}>Dashboard</span>
            {activeSection !== 'dashboard' && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-600 font-semibold capitalize">
                  {(navItems.find(n => n.id === activeSection) || NAV_ITEMS.find(n => n.id === activeSection))?.label || activeSection}
                </span>
              </>
            )}
          </div>

          <div className="animate-fade-in">
             {renderSection()}
          </div>
        </main>
      </div>

      {/* User Profile & Edit Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        role="fpo"
        profileData={fpoProfile}
        onSaveProfile={handleUpdateFpoProfile}
      />
    </div>
  );
}
