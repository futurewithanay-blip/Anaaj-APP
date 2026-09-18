import React, { useState, useEffect, Fragment } from 'react';
import {
  LayoutDashboard, Search, FileText, Users, Handshake, Package,
  CreditCard, Truck, Star, MessageCircle, Bell, HelpCircle, LogOut,
  Globe, Menu, X, MapPin, CheckCircle2, ArrowUpRight, ArrowDownRight,
  Briefcase, Bookmark, BookmarkCheck, Filter, SlidersHorizontal,
  ChevronDown, ChevronUp, Download, AlertTriangle, RefreshCw, Plus,
  Shield, UserCircle, Upload, Clock, Send, Edit2, Trash2, Phone,
  TrendingUp, Zap, Award, Building2, Key, ExternalLink
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { translations } from '../../i18n/translations';
import { INITIAL_FARMER_LOTS, ACTIVITY_FEED, TRANSPORTER_LIST, INITIAL_BUYER_REQUIREMENTS } from '../../data/sampleLots';
import sharedPaymentDB from '../../services/db';
import confetti from 'canvas-confetti';
import porterService, { PORTER_VEHICLE_TYPES } from '../../services/porterService';
import UserProfileModal from '../common/UserProfileModal';
import FarmerGrievance from '../panels/FarmerPanel/FarmerGrievance';
import VoiceInputMic from '../common/VoiceInputMic';
import { fetchCropListings, placeBuyerBid } from '../../services/supabaseClient';

// ─── Color Palette & Helpers ────────────────────────────────────────────────
const STATUS_MAP = {
  Active:    'bg-blue-100 text-blue-700',
  Open:      'bg-blue-100 text-blue-700',
  Matched:   'bg-violet-100 text-violet-700',
  Fulfilled: 'bg-emerald-100 text-emerald-700',
  Expired:   'bg-slate-100 text-slate-500',
  Pending:   'bg-amber-100 text-amber-700',
  Accepted:  'bg-emerald-100 text-emerald-700',
  Rejected:  'bg-red-100 text-red-700',
  Countered: 'bg-orange-100 text-orange-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  'In Transit': 'bg-purple-100 text-purple-700',
  Delivered:  'bg-emerald-100 text-emerald-700',
  Completed:  'bg-slate-100 text-slate-600',
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${STATUS_MAP[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

function StarRating({ rating, size = 'sm' }) {
  const stars = Math.round(rating);
  const sz = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${sz} ${i <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
      ))}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, sub, color, trend, onClick }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend !== undefined && (
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

// ─── Price Trend Data ────────────────────────────────────────────────────────
const PRICE_DATA = [
  { day: 'Mon', onion: 2200, wheat: 2050, soybean: 4400, tomato: 1600 },
  { day: 'Tue', onion: 2350, wheat: 2100, soybean: 4500, tomato: 1750 },
  { day: 'Wed', onion: 2280, wheat: 2130, soybean: 4450, tomato: 1700 },
  { day: 'Thu', onion: 2400, wheat: 2150, soybean: 4600, tomato: 1800 },
  { day: 'Fri', onion: 2500, wheat: 2200, soybean: 4700, tomato: 1850 },
  { day: 'Sat', onion: 2450, wheat: 2180, soybean: 4650, tomato: 1820 },
  { day: 'Sun', onion: 2600, wheat: 2250, soybean: 4800, tomato: 1900 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 1. DASHBOARD OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
function DashboardOverview({ onNavigate }) {
  const [activeCrop, setActiveCrop] = useState('onion');

  const aiMatchedLots = [
    { id: 'LOT-2026-081', crop: 'Onion (Red Nasik)', seller: 'Dnyaneshwar Patil', score: 97, price: '₹2,650/Q', qty: '85 Qtl', location: 'Dindori, Nashik' },
    { id: 'LOT-2026-094', crop: 'Soybean (JS-335)',  seller: 'Latur Soybean FPO', score: 94, price: '₹5,120/Q', qty: '140 Qtl', location: 'Latur, MH' },
    { id: 'LOT-2026-112', crop: 'Wheat (Sharbati)',  seller: 'Bhopal Aggregators', score: 91, price: '₹2,880/Q', qty: '210 Qtl', location: 'Sehore, MP' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard icon={FileText}   label="Active Requirements" value="2"      sub="Looking for suppliers"   color="bg-blue-500"   trend={15} onClick={() => onNavigate('post-req')} />
        <SummaryCard icon={Handshake}  label="Pending Offers"      value="4"      sub="Awaiting farmer reply"   color="bg-amber-500"  trend={5}  onClick={() => onNavigate('my-offers')} />
        <SummaryCard icon={Package}    label="Orders In-Progress"  value="2"      sub="In transit now"          color="bg-violet-500"              onClick={() => onNavigate('orders')} />
        <SummaryCard icon={CreditCard} label="Payments Due"        value="₹1.5L"  sub="Next 7 days"             color="bg-rose-500"                onClick={() => onNavigate('payments')} />
        <SummaryCard icon={Briefcase}  label="Spend This Month"    value="₹24.5L" sub="Sep 2026"                color="bg-emerald-600" trend={10} onClick={() => onNavigate('payments')} />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onNavigate('post-req')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" /> Post New Requirement
        </button>
        <button
          onClick={() => onNavigate('find-crops')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition hover:scale-[1.02]"
        >
          <Search className="w-4 h-4" /> Search Farmer Lots
        </button>
        <button
          onClick={() => onNavigate('ai-matching')}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-sm transition hover:scale-[1.02]"
        >
          <Zap className="w-4 h-4" /> View AI Matches
        </button>
        <button
          onClick={() => onNavigate('help')}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl shadow-sm transition hover:scale-[1.02]"
        >
          <HelpCircle className="w-4 h-4" /> Help & Dispute Support
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800">🔔 Recent Activity</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {ACTIVITY_FEED.map(item => (
              <div key={item.id} className="p-4 hover:bg-slate-50/60 transition cursor-pointer" onClick={() => onNavigate(item.link)}>
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-relaxed">{item.message}</p>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Matched Lots Widget */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800">🤖 Top AI Matches</h3>
            <button onClick={() => onNavigate('ai-matching')} className="text-xs text-blue-600 font-bold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-50">
            {aiMatchedLots.map(lot => (
              <div key={lot.id} className="p-4 hover:bg-slate-50/60 transition">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-bold text-sm text-slate-800">{lot.crop}</p>
                    <p className="text-[11px] text-slate-500">{lot.seller} • {lot.location}</p>
                  </div>
                  <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-black whitespace-nowrap">
                    🎯 {lot.score}%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500">{lot.qty} • <span className="font-bold text-emerald-700">{lot.price}</span></span>
                  <button
                    onClick={() => onNavigate('ai-matching')}
                    className="text-[11px] text-blue-600 font-bold border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition"
                  >
                    Send Offer →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Trend Mini Chart */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800">📊 Price Trends</h3>
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
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={PRICE_DATA}>
                <defs>
                  <linearGradient id="priceGradDB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={v => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 11 }} />
                <Area type="monotone" dataKey={activeCrop} stroke="#2563eb" strokeWidth={2} fill="url(#priceGradDB)" dot={{ fill: '#2563eb', strokeWidth: 2, r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-slate-400 mt-1 text-center">₹/Quintal — last 7 days (live mandi data)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. FIND FARMER LOTS
// ═══════════════════════════════════════════════════════════════════════════════
function FindCropsView() {
  const [lots, setLots] = useState(INITIAL_FARMER_LOTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [sortBy, setSortBy] = useState('freshness');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [maxDistance, setMaxDistance] = useState(100);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedGrade, setSelectedGrade] = useState('Any');
  const [selectedLotForOffer, setSelectedLotForOffer] = useState(null);
  const [offerPrice, setOfferPrice] = useState(2650);
  const [offerSubmitted, setOfferSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadSupabaseLots() {
      try {
        const liveListings = await fetchCropListings('ACTIVE');
        if (isMounted && liveListings && liveListings.length > 0) {
          const cropImages = {
            Onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80',
            Wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80',
            Soybean: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&q=80',
            Tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80',
            Cotton: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&q=80'
          };
          const mapped = liveListings.map(l => ({
            id: l.listing_code || `LOT-${l.id.slice(0, 8).toUpperCase()}`,
            supabaseId: l.id,
            crop: `${l.crop_name}${l.variety ? ` (${l.variety})` : ''}`,
            cropType: l.crop_name,
            farmerName: l.farmer_name || 'Verified Farmer',
            farmerType: 'Smallholder Farmer (e-NAM Linked)',
            farmerRating: 4.8,
            reviewCount: 19,
            location: `${l.district || 'Nashik'}, ${l.state || 'MH'}`,
            distanceKm: 14,
            distanceFromMandi: l.mandi_name || 'Lasalgaon APMC (14 km)',
            quantityQtl: Number(l.quantity_qtl),
            expectedPrice: Number(l.base_price_per_qtl),
            grade: l.quality_grade || 'Grade A',
            moisturePercent: '11.5%',
            harvestDate: new Date(l.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            verified: true,
            image: l.image_url || cropImages[l.crop_name] || cropImages.Wheat,
            image_url: l.image_url || null,
            hasRealImage: Boolean(l.image_url),
            wishlist: false,
            isLiveSupabase: true
          }));

          setLots(prev => {
            const liveCodes = new Set(mapped.map(m => m.id));
            return [...mapped, ...prev.filter(p => !liveCodes.has(p.id))];
          });
        }
      } catch (err) {
        console.warn('Failed to load Supabase listings for buyer:', err);
      }
    }
    loadSupabaseLots();
    return () => { isMounted = false; };
  }, []);

  const toggleWishlist = (id) => {
    setLots(prev => prev.map(l => l.id === id ? { ...l, wishlist: !l.wishlist } : l));
  };

  const filteredLots = lots
    .filter(l => {
      const matchSearch = l.crop.toLowerCase().includes(searchTerm.toLowerCase()) || l.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCrop   = selectedCrop === 'All' || l.crop.toLowerCase().includes(selectedCrop.toLowerCase());
      const matchVerify = !verifiedOnly || l.verified;
      const matchDist   = l.distanceKm <= maxDistance;
      const matchPrice  = l.expectedPrice <= maxPrice;
      const matchGrade  = selectedGrade === 'Any' || l.grade.includes(selectedGrade);
      return matchSearch && matchCrop && matchVerify && matchDist && matchPrice && matchGrade;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.expectedPrice - b.expectedPrice;
      if (sortBy === 'price-desc') return b.expectedPrice - a.expectedPrice;
      if (sortBy === 'distance')   return a.distanceKm - b.distanceKm;
      if (sortBy === 'rating')     return b.farmerRating - a.farmerRating;
      return 0; // freshness = default order
    });

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    setOfferSubmitted(true);

    let bidResult = null;
    try {
      bidResult = await placeBuyerBid({
        listing_id: selectedLotForOffer?.supabaseId || null,
        buyer_id: 'buyer-corporate-1',
        buyer_name: 'Procurement Desk',
        buyer_company: 'AgriNova Direct Procurement',
        buyer_phone: '+91 98112 33445',
        bid_price_per_qtl: Number(offerPrice),
        quantity_qtl: Number(selectedLotForOffer?.quantityQtl) || 50,
        status: 'PENDING'
      });
    } catch (err) {
      console.warn('Failed to place bid in Supabase:', err);
    }

    const bidId = bidResult?.data?.id || `BID-${Date.now().toString().slice(-6)}`;
    alert(`💼 Digital Offer of ₹${Number(offerPrice).toLocaleString()}/Qtl submitted for lot ${selectedLotForOffer.id}!\n\nBid ID: ${bidId}\nDatabase: Supabase PostgreSQL (market_bids)\nStatus: Pending Farmer Review\nEscrow funds pre-authorized.`);
    setSelectedLotForOffer(null);
    setOfferSubmitted(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-800">🔍 Browse Verified Farmer Lots</h2>
          <p className="text-xs text-slate-500">Direct procurement from verified smallholders & FPOs</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Verified Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">
            <div className={`w-8 h-4 rounded-full transition-colors relative ${verifiedOnly ? 'bg-blue-500' : 'bg-slate-200'}`}>
              <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${verifiedOnly ? 'left-4' : 'left-0.5'}`} />
            </div>
            <Shield className={`w-3.5 h-3.5 ${verifiedOnly ? 'text-blue-600' : 'text-slate-400'}`} />
            Verified Only
            <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} className="sr-only" />
          </label>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by crop, variety, location, district..."
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <VoiceInputMic onResult={setSearchTerm} type="text" />
      </div>

      {/* Crop Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {['All','Onion','Soybean','Wheat','Tomato','Cotton'].map(c => (
          <button key={c} onClick={() => setSelectedCrop(c)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${selectedCrop === c ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Quality Grade</label>
            <div className="relative flex items-center">
              <select value={selectedGrade} onChange={e => setSelectedGrade(e.target.value)}
                className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-200 text-xs appearance-none bg-white">
                {['Any','Grade A','Grade A+','Grade B','Premium'].map(g => <option key={g}>{g}</option>)}
              </select>
              <VoiceInputMic onResult={setSelectedGrade} type="select" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Max Distance: {maxDistance} km</label>
            <input type="range" min={5} max={200} value={maxDistance} onChange={e => setMaxDistance(+e.target.value)}
              className="w-full accent-blue-600" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Max Price: ₹{maxPrice.toLocaleString()}/Q</label>
            <input type="range" min={500} max={10000} step={50} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
              className="w-full accent-blue-600" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs">
              <option value="freshness">Freshness (Recent)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="distance">Distance (Near First)</option>
              <option value="rating">Farmer Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Count */}
      <p className="text-xs text-slate-500 font-semibold">{filteredLots.length} lots found</p>

      {/* Lot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLots.map(lot => (
          <div key={lot.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            {/* Image */}
            <div className="relative">
              <img src={lot.image} alt={lot.crop} className="w-full h-40 object-cover rounded-t-2xl" />
              <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                {lot.hasRealImage && (
                  <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    📷 Real Photo
                  </span>
                )}
                {lot.verified && (
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" /> Verified
                  </span>
                )}
                {lot.isLiveSupabase && (
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    ⚡ Live Supabase
                  </span>
                )}
              </div>
              <button
                onClick={() => toggleWishlist(lot.id)}
                className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition"
              >
                {lot.wishlist
                  ? <BookmarkCheck className="w-4 h-4 text-blue-600 fill-blue-100" />
                  : <Bookmark className="w-4 h-4 text-slate-500" />}
              </button>
            </div>

            <div className="p-4 flex flex-col flex-1 space-y-3">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">{lot.id}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{lot.grade}</span>
                </div>
                <h3 className="font-black text-slate-800 text-base leading-tight">{lot.crop}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 flex-shrink-0" /> {lot.location} • {lot.distanceFromMandi}
                </p>
              </div>

              {/* Farmer Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-700">{lot.farmerName}</p>
                  <p className="text-[10px] text-slate-400">{lot.farmerType}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <StarRating rating={lot.farmerRating} />
                  <span className="text-[10px] text-slate-400">{lot.farmerRating} ({lot.reviewCount})</span>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-center">
                <div>
                  <div className="text-[10px] text-slate-400">Available Qty</div>
                  <div className="text-sm font-black text-slate-800">{lot.quantityQtl} Qtl</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Asking Price</div>
                  <div className="text-sm font-black text-emerald-700">₹{lot.expectedPrice}/Q</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-0.5">
                <div>💧 Moisture: <span className="font-semibold text-slate-700">{lot.moisturePercent}</span></div>
                <div>📅 Harvest: <span className="font-semibold text-slate-700">{lot.harvestDate}</span></div>
              </div>

              {/* CTA */}
              <button
                onClick={() => { setSelectedLotForOffer(lot); setOfferPrice(lot.expectedPrice); }}
                className="mt-auto w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Handshake className="w-3.5 h-3.5" /> Make Digital Offer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Offer Modal */}
      {selectedLotForOffer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-800 text-lg">💼 Propose Digital Offer</h3>
              <button onClick={() => setSelectedLotForOffer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Submitting offer for <span className="font-bold text-slate-800">{selectedLotForOffer.crop}</span> ({selectedLotForOffer.quantityQtl} Qtl) from <span className="font-bold">{selectedLotForOffer.farmerName}</span> in {selectedLotForOffer.location}.
            </p>
            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Your Price per Quintal (₹)</label>
                <div className="relative flex items-center">
                  <input type="number" value={offerPrice} onChange={e => setOfferPrice(+e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 font-black text-lg text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                  <VoiceInputMic onResult={val => setOfferPrice(Number(val))} type="number" />
                </div>
              </div>
              <div className="bg-blue-50/70 p-3 rounded-xl text-xs space-y-1 text-slate-700">
                <div className="flex justify-between"><span>Gross Lot Value:</span><span className="font-bold">₹{(offerPrice * selectedLotForOffer.quantityQtl).toLocaleString()}</span></div>
                <div className="flex justify-between text-blue-700"><span>Escrow Pre-authorization:</span><span className="font-bold">100% Secured</span></div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setSelectedLotForOffer(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={offerSubmitted}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition">
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

// ═══════════════════════════════════════════════════════════════════════════════
// 3. POST REQUIREMENT
// ═══════════════════════════════════════════════════════════════════════════════
function PostRequirement() {
  const [reqs, setReqs] = useState(INITIAL_BUYER_REQUIREMENTS);
  const [submitted, setSubmitted] = useState(false);
  const [savedAsDraft, setSavedAsDraft] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [visibility, setVisibility] = useState('all');
  const [formData, setFormData] = useState({ crop: '', qty: '', grade: 'A', maxPrice: '', deliveryDate: '', location: '', moisture: '', frequency: 'weekly' });

  const handleChange = (k, v) => setFormData(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReq = {
      id: `REQ-${7800 + Math.floor(Math.random() * 100)}`,
      buyerName: 'My Company',
      buyerType: 'Processor',
      crop: formData.crop,
      requiredQuantityQtl: +formData.qty,
      preferredGrade: `Grade ${formData.grade}`,
      maxMoisture: `${formData.moisture || 12}%`,
      maxPriceOffered: +formData.maxPrice,
      deliveryLocation: formData.location,
      fulfillmentTimeline: `By ${formData.deliveryDate}`,
      status: 'Open',
      verifiedScore: 99,
    };
    setReqs(prev => [newReq, ...prev]);
    setSubmitted(true);
    setFormData({ crop: '', qty: '', grade: 'A', maxPrice: '', deliveryDate: '', location: '', moisture: '', frequency: 'weekly' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const statusColors = { Open: 'bg-blue-100 text-blue-700', Matched: 'bg-violet-100 text-violet-700', Fulfilled: 'bg-emerald-100 text-emerald-700', Expired: 'bg-slate-100 text-slate-500' };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-xl font-black text-slate-800">📋 Post Procurement Requirement</h2>
        <p className="text-xs text-slate-500">AI will instantly match your requirement to 500+ verified farmer lots</p>
      </div>

      {/* Success Banner */}
      {submitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div><p className="font-bold text-emerald-800">Requirement Published!</p><p className="text-xs text-emerald-600">AI matching engine is notifying 120+ verified farmers.</p></div>
        </div>
      )}
      {savedAsDraft && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
          <Clock className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div><p className="font-bold text-amber-800">Saved as Draft</p><p className="text-xs text-amber-600">You can complete and publish this later.</p></div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Crop Name *</label>
                <div className="relative flex items-center">
                  <select required value={formData.crop} onChange={e => handleChange('crop', e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400 appearance-none bg-white">
                    <option value="">Select Crop...</option>
                    {['Onion','Wheat','Soybean','Rice','Cotton','Tomato','Potato','Maize'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <VoiceInputMic onResult={val => handleChange('crop', val)} type="select" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Required Quantity (Quintals) *</label>
                <div className="relative flex items-center">
                  <input type="number" required placeholder="e.g. 500" value={formData.qty} onChange={e => handleChange('qty', e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400" />
                  <VoiceInputMic onResult={val => handleChange('qty', val)} type="number" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Quality Grade</label>
                <div className="relative flex items-center">
                  <select value={formData.grade} onChange={e => handleChange('grade', e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400 appearance-none bg-white">
                    {['A+','A','B+','B','Any'].map(g => <option key={g}>{g}</option>)}
                  </select>
                  <VoiceInputMic onResult={val => handleChange('grade', val)} type="select" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Max Moisture Content (%)</label>
                <div className="relative flex items-center">
                  <input type="number" placeholder="e.g. 12" value={formData.moisture} onChange={e => handleChange('moisture', e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400" />
                  <VoiceInputMic onResult={val => handleChange('moisture', val)} type="number" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Maximum Price (₹/Quintal) *</label>
                <div className="relative flex items-center">
                  <input type="number" required placeholder="e.g. 2600" value={formData.maxPrice} onChange={e => handleChange('maxPrice', e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400" />
                  <VoiceInputMic onResult={val => handleChange('maxPrice', val)} type="number" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Delivery Deadline *</label>
                <input type="date" required value={formData.deliveryDate} onChange={e => handleChange('deliveryDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Delivery Location *</label>
                <div className="relative flex items-center">
                  <input type="text" required placeholder="e.g. Pune Warehouse, Pimpri-Chinchwad MIDC" value={formData.location} onChange={e => handleChange('location', e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400" />
                  <VoiceInputMic onResult={val => handleChange('location', val)} type="text" />
                </div>
              </div>
            </div>

            {/* Recurring Toggle */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-bold text-slate-700">🔁 Recurring Requirement</p>
                  <p className="text-xs text-slate-500">Auto-post same requirement at regular intervals</p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${recurring ? 'bg-blue-500' : 'bg-slate-300'}`} onClick={() => setRecurring(!recurring)}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${recurring ? 'left-6' : 'left-0.5'}`} />
                </div>
              </label>
              {recurring && (
                <div className="mt-3">
                  <select value={formData.frequency} onChange={e => handleChange('frequency', e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold">
                    <option value="weekly">Every Week</option>
                    <option value="biweekly">Every 2 Weeks</option>
                    <option value="monthly">Every Month</option>
                  </select>
                </div>
              )}
            </div>

            {/* Visibility Control */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <p className="text-sm font-bold text-slate-700 mb-2">👁️ Visibility Control</p>
              <div className="flex gap-3">
                {[
                  { val: 'all', label: 'All Verified Farmers', desc: 'Nationwide visibility' },
                  { val: 'region', label: 'Region-Specific', desc: 'Nearby districts only' },
                  { val: 'fpo', label: 'FPOs Only', desc: 'Bulk aggregators' },
                ].map(opt => (
                  <label key={opt.val} className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition ${visibility === opt.val ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    <input type="radio" name="visibility" value={opt.val} checked={visibility === opt.val} onChange={() => setVisibility(opt.val)} className="sr-only" />
                    <p className="text-xs font-bold text-slate-800">{opt.label}</p>
                    <p className="text-[10px] text-slate-500">{opt.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => { setSavedAsDraft(true); setTimeout(() => setSavedAsDraft(false), 3000); }}
                className="flex-1 py-3 border border-slate-300 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" /> Save as Draft
              </button>
              <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Publish Requirement
              </button>
            </div>
          </form>
        </div>

        {/* My Requirements List */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-black text-slate-700 text-sm">My Requirements</h3>
          {reqs.map(req => (
            <div key={req.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400">{req.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${statusColors[req.status] || 'bg-slate-100 text-slate-500'}`}>{req.status}</span>
              </div>
              <h4 className="font-bold text-sm text-slate-800">{req.crop}</h4>
              <div className="text-xs text-slate-500 space-y-0.5">
                <p>Qty: <strong className="text-slate-700">{req.requiredQuantityQtl} Qtl</strong> • Max: <strong className="text-emerald-700">₹{req.maxPriceOffered}/Q</strong></p>
                <p>📍 {req.deliveryLocation}</p>
              </div>
              {/* Status Tracker */}
              <div className="flex items-center gap-1 pt-1">
                {['Open','Matched','Fulfilled','Expired'].map((s, i) => {
                  const statuses = ['Open','Matched','Fulfilled','Expired'];
                  const current = statuses.indexOf(req.status);
                  const isActive = i <= current;
                  return (
                    <React.Fragment key={s}>
                      <div className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'}`}>{s}</div>
                      {i < 3 && <div className={`flex-1 h-0.5 rounded ${i < current ? 'bg-blue-400' : 'bg-slate-200'}`} />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. AI MATCHING
// ═══════════════════════════════════════════════════════════════════════════════
function AiMatchingView() {
  const [bulkExpanded, setBulkExpanded] = useState(false);

  const matches = [
    { id: 'MATCH-01', crop: 'Onion (Red Nasik)', seller: 'Sahyadri Farmers Producer Co.', type: 'FPO Bulk Consignment', location: 'Niphad Cluster (18 km)', available: '1,200 Quintals', price: '₹2,640/Q', score: 98, moisture: '10.8%', grade: 'Grade A Export', reason: 'Perfect volume match with your 500 Qtl requirement. Distance under 25km saves ₹18/q in freight. Zero rejected batches in last 6 months.' },
    { id: 'MATCH-02', crop: 'Wheat (Sharbati C-306)', seller: 'Bhopal Krishi Aggregators', type: 'Aggregated Lot', location: 'Sehore Hub (MP)', available: '800 Quintals', price: '₹2,180/Q', score: 94, moisture: '9.6%', grade: 'Grade A+', reason: 'Lowest moisture index assayed (9.6%). Direct rail freight rake loading available at Sehore yard.' },
    { id: 'MATCH-03', crop: 'Soybean (Cleaned & Graded)', seller: 'Latur Soybean FPO Union', type: 'Certified Organic', location: 'Latur Processing Area', available: '450 Quintals', price: '₹4,450/Q', score: 91, moisture: '10.0%', grade: 'Premium Solvent Grade', reason: 'Oil content verified at 19.4% via digital spectroscopy assay. FPO has 5-star quality track record.' },
  ];

  const bulkCombine = [
    { id: 'LOT-2026-091', farmer: 'Balaji Patil', qty: 180, price: 2620 },
    { id: 'LOT-2026-096', farmer: 'Nashik Kisan FPO', qty: 200, price: 2640 },
    { id: 'LOT-2026-103', farmer: 'Ramesh Gavit', qty: 120, price: 2630 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800">🤖 AI Intelligent Farmer & FPO Matching</h2>
        <p className="text-xs text-slate-500">Autonomous recommendation engine optimizing for price, distance, moisture assay & verified seller scores</p>
      </div>

      {/* Bulk Combine Suggestion */}
      <div className="bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200 rounded-2xl p-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setBulkExpanded(!bulkExpanded)}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-black text-violet-800 text-sm">Bulk Combine Suggestion</p>
              <p className="text-xs text-violet-600">AI found 3 smaller lots that together fulfill your 500 Qtl Onion requirement at avg ₹2,630/Q</p>
            </div>
          </div>
          {bulkExpanded ? <ChevronUp className="w-5 h-5 text-violet-500" /> : <ChevronDown className="w-5 h-5 text-violet-500" />}
        </div>
        {bulkExpanded && (
          <div className="mt-4 space-y-2">
            {bulkCombine.map(b => (
              <div key={b.id} className="flex items-center justify-between bg-white/80 rounded-xl p-3 text-xs">
                <span className="font-mono text-violet-700 font-bold">{b.id}</span>
                <span className="font-bold text-slate-700">{b.farmer}</span>
                <span className="text-slate-500">{b.qty} Qtl</span>
                <span className="font-bold text-emerald-700">₹{b.price}/Q</span>
              </div>
            ))}
            <div className="flex items-center justify-between bg-violet-100 rounded-xl p-3 text-xs font-black">
              <span className="text-violet-700">Combined Total</span>
              <span className="text-violet-700">{bulkCombine.reduce((a, b) => a + b.qty, 0)} Qtl</span>
              <span className="text-emerald-700">Avg ₹{Math.round(bulkCombine.reduce((a, b) => a + b.price, 0) / bulkCombine.length)}/Q</span>
            </div>
            <button
              onClick={() => alert('Bulk procurement offer sent to all 3 farmers! Escrow pre-authorized for ₹13,15,000.')}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              🤝 Send Bulk Offer to All 3 Farmers
            </button>
          </div>
        )}
      </div>

      {/* Individual Matches */}
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
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <div className={`text-2xl font-black ${m.score >= 95 ? 'text-emerald-600' : m.score >= 90 ? 'text-blue-600' : 'text-amber-600'}`}>{m.score}%</div>
                  <div className="text-[10px] text-slate-400">Match Score</div>
                </div>
                <div className={`w-1 h-12 rounded-full ${m.score >= 95 ? 'bg-emerald-400' : m.score >= 90 ? 'bg-blue-400' : 'bg-amber-400'}`} />
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
              💡 <span className="font-semibold text-slate-700">AI Reasoning:</span> {m.reason}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
              {[
                { label: 'Volume', val: m.available },
                { label: 'Price/Qtl', val: m.price, cls: 'text-emerald-700' },
                { label: 'Moisture', val: m.moisture },
                { label: 'Grade', val: m.grade, cls: 'text-blue-700' },
              ].map(stat => (
                <div key={stat.label} className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 mb-0.5">{stat.label}</div>
                  <div className={`text-xs font-black ${stat.cls || 'text-slate-800'}`}>{stat.val}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert(`Initiating direct procurement deal with ${m.seller} for ${m.crop} at ${m.price}. Escrow authorized.`)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              🤝 Instant Deal & Pre-authorize Escrow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. MY OFFERS & BIDS
// ═══════════════════════════════════════════════════════════════════════════════
function MyOffersView() {
  const [offers, setOffers] = useState([
    { id: 'OFF-101', farmer: 'Dnyaneshwar Patil', crop: 'Onion (Red Nasik)', qty: '50 Q', price: 2650, total: '₹1,32,500', status: 'Pending', date: '03 Sep 2026', thread: [
      { from: 'buyer', text: 'Offering ₹2,650/Q for your 50 Qtl Onion lot.', time: '03 Sep, 10:00 AM' },
    ]},
    { id: 'OFF-102', farmer: 'Nashik FPO Aggregators', crop: 'Wheat (Sharbati)', qty: '200 Q', price: 2150, total: '₹4,30,000', status: 'Accepted', date: '01 Sep 2026', thread: [
      { from: 'buyer', text: 'Offering ₹2,150/Q for 200 Qtl Wheat.', time: '01 Sep, 9:00 AM' },
      { from: 'farmer', text: 'Offer accepted! Loading scheduled for 5th Sep.', time: '01 Sep, 2:00 PM' },
    ]},
    { id: 'OFF-103', farmer: 'Ramesh Sharma', crop: 'Tomato (Desi)', qty: '20 Q', price: 1800, total: '₹36,000', status: 'Countered', counterPrice: 1900, date: '31 Aug 2026', thread: [
      { from: 'buyer', text: 'Offering ₹1,800/Q for Tomato lot.', time: '31 Aug, 11:00 AM' },
      { from: 'farmer', text: 'Minimum I can go is ₹1,900/Q due to quality Grade A. Please reconsider.', time: '31 Aug, 4:00 PM' },
    ]},
  ]);
  const [expandedOffer, setExpandedOffer] = useState(null);
  const [replyText, setReplyText] = useState('');

  const sendReply = (offerId) => {
    if (!replyText.trim()) return;
    setOffers(prev => prev.map(o => o.id === offerId
      ? { ...o, thread: [...o.thread, { from: 'buyer', text: replyText, time: 'Just now' }] }
      : o
    ));
    setReplyText('');
  };

  const withdrawOffer = (offerId) => {
    if (!window.confirm('Withdraw this offer?')) return;
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'Withdrawn' } : o));
  };

  const acceptCounter = (offerId) => {
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'Accepted', price: o.counterPrice } : o));
    alert('Counter-offer accepted! Updated to ₹' + offers.find(o => o.id === offerId)?.counterPrice + '/Q.');
  };

  const statusStyle = s =>
    s === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
    s === 'Countered' ? 'bg-amber-100 text-amber-800' :
    s === 'Rejected' ? 'bg-red-100 text-red-700' :
    s === 'Withdrawn' ? 'bg-slate-100 text-slate-500' :
    'bg-blue-100 text-blue-700';

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-800">🤝 Active Procurement Offers & Bids</h2>
        <p className="text-xs text-slate-500">Track negotiation status, counter-offers and digital contracts</p>
      </div>

      <div className="space-y-3">
        {offers.map(o => (
          <div key={o.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            {/* Main Row */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">{o.id}</span>
                  <span className="font-black text-slate-800 text-sm">{o.crop}</span>
                </div>
                <p className="text-xs text-slate-500">
                  Seller: <span className="font-semibold text-slate-700">{o.farmer}</span> • {o.qty} at <span className="font-bold text-emerald-700">₹{o.price}/Q</span> (Total: {o.total})
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Submitted on {o.date}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle(o.status)}`}>{o.status}</span>
                {o.status === 'Countered' && (
                  <button onClick={() => acceptCounter(o.id)}
                    className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition">
                    Accept ₹{o.counterPrice}/Q
                  </button>
                )}
                {o.status === 'Pending' && (
                  <button onClick={() => withdrawOffer(o.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-xl border border-red-200 hover:bg-red-100 transition flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Withdraw
                  </button>
                )}
                <button
                  onClick={() => setExpandedOffer(expandedOffer === o.id ? null : o.id)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  {expandedOffer === o.id ? 'Hide Chat' : 'View Thread'}
                </button>
              </div>
            </div>

            {/* Negotiation Thread */}
            {expandedOffer === o.id && (
              <div className="border-t border-slate-100 p-4 space-y-3 bg-slate-50/50">
                <p className="text-xs font-bold text-slate-500 mb-2">💬 Negotiation Thread</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {o.thread.map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs rounded-2xl px-3 py-2 text-xs ${msg.from === 'buyer' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'}`}>
                        <p>{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.from === 'buyer' ? 'text-blue-200' : 'text-slate-400'}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {o.status !== 'Accepted' && o.status !== 'Rejected' && o.status !== 'Withdrawn' && (
                  <div className="flex gap-2 mt-2">
                    <input value={replyText} onChange={e => setReplyText(e.target.value)}
                      placeholder="Type your counter message..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-400" />
                    <button onClick={() => sendReply(o.id)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Offer History */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-black text-slate-700 text-sm">📜 Offer History (Past 30 Days)</div>
        <div className="divide-y divide-slate-50 text-xs">
          {[
            { id: 'OFF-098', crop: 'Onion', farmer: 'Sahyadri FPO', status: 'Accepted', price: '₹2,600/Q', date: '22 Aug 2026' },
            { id: 'OFF-095', crop: 'Wheat', farmer: 'Kisan Aggregators', status: 'Rejected', price: '₹2,050/Q', date: '18 Aug 2026' },
            { id: 'OFF-090', crop: 'Soybean', farmer: 'Latur FPO', status: 'Accepted', price: '₹4,900/Q', date: '12 Aug 2026' },
          ].map(h => (
            <div key={h.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div>
                <span className="font-mono text-slate-400 mr-2">{h.id}</span>
                <span className="font-bold text-slate-700">{h.crop}</span>
                <span className="text-slate-400"> • {h.farmer}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-emerald-700">{h.price}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${h.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{h.status}</span>
                <span className="text-slate-400">{h.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. ORDERS & CONTRACTS
// ═══════════════════════════════════════════════════════════════════════════════
function OrdersView() {
  const orders = [
    { id: 'ORD-501', seller: 'Nashik FPO Cluster', crop: 'Wheat (Sharbati)', qty: '200 Qtl', amount: '₹4,30,000', status: 'In Transit', vehicle: 'MH-15-EG-4412', driver: 'Sunil Gaikwad', phone: '+91 98221 00213', eta: 'Today 5:30 PM', timeline: ['done','done','done','active',''] },
    { id: 'ORD-502', seller: 'Dnyaneshwar Patil', crop: 'Onion (Red Nasik)', qty: '50 Qtl', amount: '₹1,32,500', status: 'Confirmed', vehicle: 'MH-15-BJ-9021', driver: 'Kailash More', phone: '+91 94222 18940', eta: 'Tomorrow 11:00 AM', timeline: ['done','done','active','',''] },
  ];

  const timelineSteps = ['Order Placed', 'Quality Check', 'Dispatch', 'Delivery', 'Payment'];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-800">📦 Procurement Orders & Contracts</h2>
        <p className="text-xs text-slate-500">Live order status, e-Way bill compliance & delivery validation</p>
      </div>

      <div className="space-y-5">
        {orders.map(ord => (
          <div key={ord.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            {/* Order Header */}
            <div className="p-5 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md mr-2">{ord.id}</span>
                  <span className="font-black text-slate-800 text-base">{ord.crop}</span>
                  <span className="text-xs text-slate-500 ml-2">({ord.qty})</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-700 text-lg mr-3">{ord.amount}</span>
                  <StatusBadge status={ord.status} />
                </div>
              </div>

              {/* Timeline Stepper */}
              <div className="flex items-center mt-3">
                {timelineSteps.map((step, i) => {
                  const state = ord.timeline[i];
                  return (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${
                          state === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' :
                          state === 'active' ? 'bg-blue-500 border-blue-500 text-white animate-pulse' :
                          'bg-white border-slate-200 text-slate-300'
                        }`}>
                          {state === 'done' ? '✓' : i + 1}
                        </div>
                        <span className={`text-[9px] mt-1 font-bold text-center w-14 leading-tight ${
                          state === 'done' ? 'text-emerald-600' : state === 'active' ? 'text-blue-600' : 'text-slate-300'
                        }`}>{step}</span>
                      </div>
                      {i < timelineSteps.length - 1 && (
                        <div className={`flex-1 h-0.5 mb-4 mx-0.5 ${
                          ord.timeline[i] === 'done' ? 'bg-emerald-400' : 'bg-slate-200'
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Vehicle & Driver Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 text-xs">
              <div><span className="text-slate-400 block">Vehicle No.</span><span className="font-bold text-slate-700">{ord.vehicle}</span></div>
              <div><span className="text-slate-400 block">Driver</span><span className="font-bold text-slate-700">{ord.driver}</span><span className="text-slate-500 ml-1">{ord.phone}</span></div>
              <div><span className="text-slate-400 block">ETA</span><span className="font-bold text-blue-700">{ord.eta}</span></div>
            </div>

            {/* Actions */}
            <div className="p-4 flex flex-wrap gap-2 justify-end">
              <button onClick={() => alert(`Download Contract PDF for ${ord.id}`)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> Contract PDF
              </button>
              <button onClick={() => alert(`GPS Live Tracking: Vehicle ${ord.vehicle} on NH60`)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Live GPS Track
              </button>
              <button onClick={() => alert(`Dispute filed for ${ord.id}. Support team will contact within 2 hours.`)}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-200 transition flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Raise Dispute
              </button>
              <button onClick={() => alert(`Reorder initiated from ${ord.seller} for same specs.`)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Reorder
              </button>
              <button onClick={() => alert(`Confirming receipt of ${ord.id}. Escrow of ${ord.amount} released to farmer account.`)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm & Release Escrow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. PAYMENTS
// ═══════════════════════════════════════════════════════════════════════════════
function PaymentsView({ user }) {
  const [transactions, setTransactions] = useState([
    { id: 'TXN-8801', desc: 'Escrow Release: ORD-501 (Wheat 200 Qtl)', amount: '₹4,30,000', date: '28 Aug 2026', type: 'Payout Released', status: 'Success (NEFT)' },
    { id: 'TXN-8802', desc: 'Escrow Deposit: Advance for Onion Procurement', amount: '₹5,00,000', date: '25 Aug 2026', type: 'Wallet Deposit', status: 'Success (HDFC Bank)' },
    { id: 'TXN-8803', desc: 'Quality Assay Testing Fee (Lasalgaon Lab)', amount: '₹1,200', date: '24 Aug 2026', type: 'Lab Assay Fee', status: 'Success' },
  ]);

  const [schedule, setSchedule] = useState([
    { order: 'ORD-501', desc: 'Sharbati Wheat (200 Qtl) — Farmer Dnyaneshwar Patil', rawAmount: 215000, amount: '₹2,15,000', farmer: 'Dnyaneshwar Patil', due: '10 Sep 2026', status: 'Due' },
    { order: 'ORD-502', desc: 'Red Onion (50 Qtl) — Farmer Dnyaneshwar Patil', rawAmount: 132500, amount: '₹1,32,500', farmer: 'Dnyaneshwar Patil', due: '12 Sep 2026', status: 'Scheduled' },
    { order: 'ORD-501', desc: 'Sharbati Wheat (200 Qtl) — Installment 2/2', rawAmount: 215000, amount: '₹2,15,000', farmer: 'Dnyaneshwar Patil', due: '25 Sep 2026', status: 'Upcoming' },
  ]);

  const [payingItem, setPayingItem] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Escrow Release');
  const [escrowBalance, setEscrowBalance] = useState(2500000);
  const [paymentToast, setPaymentToast] = useState(null);

  const handleConfirmPayment = () => {
    if (!payingItem) return;

    const recorded = sharedPaymentDB.recordPayment({
      fromRole: 'buyer',
      fromName: user?.name || 'Adani Wilmar Ltd',
      toFarmer: payingItem.farmer,
      crop: payingItem.desc,
      amount: payingItem.rawAmount,
      method: paymentMethod,
      orderId: payingItem.order,
      accountMasked: 'SBI •••• 4321',
      notes: `Escrow milestone release for order ${payingItem.order}`
    });

    // Deduct from escrow balance
    setEscrowBalance(prev => Math.max(0, prev - payingItem.rawAmount));

    // Update schedule
    setSchedule(prev => prev.map(s => s.order === payingItem.order && s.desc === payingItem.desc ? { ...s, status: 'Paid ✓' } : s));

    // Add to transactions
    setTransactions(prev => [
      {
        id: recorded.id,
        desc: `Escrow Released: ${payingItem.desc}`,
        amount: payingItem.amount,
        date: 'Today',
        type: 'Payout Released',
        status: `Success (${paymentMethod})`
      },
      ...prev
    ]);

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setPaymentToast({
      title: 'Payment Credited Successfully!',
      message: `${payingItem.amount} transferred to ${payingItem.farmer} (SBI •••• 4321). Synced instantly to Farmer's Dashboard!`
    });
    setTimeout(() => setPaymentToast(null), 7000);
    setPayingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {paymentToast && (
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-xl flex items-center justify-between animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">✓</div>
            <div>
              <p className="font-black text-sm">{paymentToast.title}</p>
              <p className="text-xs text-emerald-100">{paymentToast.message}</p>
            </div>
          </div>
          <button onClick={() => setPaymentToast(null)} className="text-white hover:text-emerald-200 text-sm font-bold">✕</button>
        </div>
      )}

      <div>
        <h2 className="text-xl font-black text-slate-800">💳 Buyer Escrow Account & Settlements</h2>
        <p className="text-xs text-slate-500">Zero-risk settlement backed by RBI regulated nodal escrow accounts (Connected to Farmer Ledger)</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-600 text-white rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-blue-200 mb-1">Pre-funded Escrow Balance</div>
          <div className="text-2xl font-black">₹{(escrowBalance / 100000).toFixed(2)}L</div>
          <div className="text-[11px] text-blue-200 mt-1">Ready for 1-click deal locking</div>
        </div>
        <div className="bg-amber-500 text-white rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-amber-100 mb-1">Funds in Holding</div>
          <div className="text-2xl font-black">₹5,62,500</div>
          <div className="text-[11px] text-amber-100 mt-1">Held until delivery inspection</div>
        </div>
        <div className="bg-slate-800 text-white rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-slate-300 mb-1">Total Procured YTD</div>
          <div className="text-2xl font-black">₹1.48 Crore</div>
          <div className="text-[11px] text-slate-300 mt-1">42 verified farmer contracts</div>
        </div>
      </div>

      {/* BNPL / Credit Line Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-violet-200" />
            <span className="font-black text-base">AgriCredit Line — ₹50L Pre-Approved</span>
          </div>
          <p className="text-xs text-violet-200">Buy Now, Pay Later for bulk procurement. 30–90 day credit terms. Zero collateral for verified buyers.</p>
        </div>
        <button onClick={() => alert('AgriCredit application initiated. Your credit line of ₹50L is pre-approved based on your procurement history.')}
          className="flex-shrink-0 px-5 py-2.5 bg-white text-violet-700 font-black text-xs rounded-xl hover:bg-violet-50 transition cursor-pointer">
          Activate Credit
        </button>
      </div>

      {/* Payment Schedule */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-black text-slate-700 text-sm flex items-center justify-between">
          <span>📅 Upcoming Payment Schedule (Farmer Direct Settlements)</span>
          <span className="text-xs font-normal text-slate-400">Click Pay Now to credit farmer instantly</span>
        </div>
        <div className="divide-y divide-slate-50 text-xs">
          {schedule.map((s, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div>
                <span className="font-mono text-slate-400 mr-2">{s.order}</span>
                <span className="font-bold text-slate-700">{s.desc}</span>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Beneficiary: <strong className="text-slate-600">{s.farmer}</strong> • Due: <span className="font-bold text-slate-600">{s.due}</span>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <div className="font-black text-slate-800 text-sm">{s.amount}</div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  s.status === 'Paid ✓' ? 'bg-emerald-100 text-emerald-800' :
                  s.status === 'Due' ? 'bg-red-100 text-red-700' :
                  s.status === 'Scheduled' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {s.status}
                </span>
                {s.status === 'Due' && (
                  <button
                    onClick={() => setPayingItem(s)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer"
                  >
                    Pay Now
                  </button>
                )}
                {s.status === 'Scheduled' && (
                  <button
                    onClick={() => setPayingItem(s)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 transition cursor-pointer"
                  >
                    Pre-pay
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-black text-slate-700 text-sm">Settlement History & Tax Invoices</div>
        <div className="divide-y divide-slate-50 text-xs">
          {transactions.map(t => (
            <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div>
                <span className="font-mono text-slate-400 mr-2">{t.id}</span>
                <span className="font-bold text-slate-800">{t.desc}</span>
                <div className="text-[11px] text-slate-400 mt-0.5">{t.date} • {t.status}</div>
              </div>
              <div className="text-right flex items-center gap-3">
                <div className="font-black text-slate-800 text-sm">{t.amount}</div>
                <button onClick={() => alert(`Downloading GST Tax Invoice for ${t.id}`)}
                  className="flex items-center gap-1 text-[11px] text-blue-600 font-bold hover:underline cursor-pointer">
                  <Download className="w-3 h-3" /> Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Release Confirmation Modal */}
      {payingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                  💳
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">Release Escrow Payment to Farmer</h3>
                  <p className="text-xs text-slate-500">Order Ref: {payingItem.order}</p>
                </div>
              </div>
              <button
                onClick={() => setPayingItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-600">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficiary Farmer:</span>
                  <strong className="text-slate-800 text-sm">{payingItem.farmer}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficiary Account:</span>
                  <span className="font-mono font-bold text-emerald-700">SBI •••• 4321 (IFSC: SBIN0001234)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Crop Consignment:</span>
                  <span className="font-semibold text-slate-700">{payingItem.desc}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                  <span className="font-bold text-slate-800">Transfer Amount:</span>
                  <span className="font-black text-lg text-emerald-700">{payingItem.amount}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Payment Channel:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Escrow Release', label: '⚡ Escrow Balance', desc: 'Pre-funded instant' },
                    { id: 'NEFT / RTGS', label: '🏦 Corporate NEFT', desc: 'Bank gateway' },
                    { id: 'Corporate UPI', label: '📱 UPI Autopay', desc: 'Instant VPA credit' },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        paymentMethod === m.id
                          ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="font-bold text-xs">{m.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-800 flex items-start gap-2">
                <span>🛡️</span>
                <span>Once approved, this payout will be immediately dispatched to Farmer <strong>{payingItem.farmer}</strong> and reflected in the Farmer's Payment History ledger in real-time.</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPayingItem(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Authorize & Pay {payingItem.amount}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. LOGISTICS
// ═══════════════════════════════════════════════════════════════════════════════
function BuyerLogisticsView() {
  const [distanceKm, setDistanceKm] = useState(80);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState('porter'); // 'porter' | 'telemetry' | 'network'

  // Porter State
  const [isPorterConnected, setIsPorterConnected] = useState(porterService.isConfigured());
  const [showPorterKeyModal, setShowPorterKeyModal] = useState(false);
  const [porterInputKey, setPorterInputKey] = useState(porterService.getApiKey());
  const [selectedPorterVehicle, setSelectedPorterVehicle] = useState('tata_ace');
  const [porterBookings, setPorterBookings] = useState(porterService.getBookings());
  const [pickupLocation, setPickupLocation] = useState('Lasalgaon Farmer Cluster, Nashik');
  const [dropLocation, setDropLocation] = useState('Chakan Food Processing Hub, Pune');
  const [porterLoading, setPorterLoading] = useState(false);

  const selectedVehicleData = PORTER_VEHICLE_TYPES.find(v => v.id === selectedPorterVehicle) || PORTER_VEHICLE_TYPES[0];
  const vehicleFareEstimate = porterService.calculateFare(selectedPorterVehicle, distanceKm);

  const handleSavePorterKey = (e) => {
    e?.preventDefault();
    if (!porterInputKey.trim()) return;
    porterService.saveApiKey(porterInputKey.trim());
    setIsPorterConnected(true);
    setShowPorterKeyModal(false);
  };

  const handleBookPorter = () => {
    setPorterLoading(true);
    setTimeout(() => {
      const newBooking = porterService.createBooking({
        vehicleTypeId: selectedPorterVehicle,
        pickup: pickupLocation,
        drop: dropLocation,
        distanceKm,
        commodity: 'Wheat / Agri Commodity (200 Qtl)',
        estimatedFare: vehicleFareEstimate.totalFare
      });
      setPorterBookings(porterService.getBookings());
      setPorterLoading(false);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (err) {}
    }, 800);
  };

  const ratePerKm = selectedTransporter ? parseFloat(TRANSPORTER_LIST.find(t => t.id === selectedTransporter)?.rate.replace('₹','').replace('/km','')) : 18;
  const freightEstimate = Math.round(distanceKm * ratePerKm);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">🚚 Logistics, Dispatch & Tracking</h2>
          <p className="text-xs text-slate-500">Fleet telemetry, on-demand Porter.in booking & real-time trip monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPorterKeyModal(true)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              isPorterConnected
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            {isPorterConnected ? 'Porter API: Connected' : 'Connect Porter API'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-2">
        <button
          onClick={() => setActiveTab('porter')}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'porter'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          Porter.in On-Demand Dispatch
          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-black">Official API</span>
        </button>
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'telemetry'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Active Telemetry GPS
        </button>
        <button
          onClick={() => setActiveTab('network')}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'network'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Local Transporter Network
        </button>
      </div>

      {/* PORTER DISPATCH TAB */}
      {activeTab === 'porter' && (
        <div className="space-y-6">
          {/* Porter Brand Bar */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-6 text-white shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-700 font-black text-2xl shadow-inner">
                  P
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black tracking-tight">Porter.in Enterprise Transport</h3>
                    <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                      Direct Integration
                    </span>
                  </div>
                  <p className="text-xs text-blue-200 mt-1 max-w-xl">
                    Dispatch verified commercial vehicles for farm-gate harvest pickup. Bookings sync directly to <strong className="text-white">Porter.in</strong> and open on the official Porter tracking dashboard.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://porter.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/20"
                >
                  Visit Porter.in <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Vehicle Selection & Live Booking Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vehicle Fleet Selector */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">Select Porter Vehicle Fleet</h4>
                    <p className="text-xs text-slate-500">Live capacity & dynamic tariffs for agricultural transport</p>
                  </div>
                  <div className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {distanceKm} km transit
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PORTER_VEHICLE_TYPES.map(v => {
                    const fare = porterService.calculateFare(v.id, distanceKm);
                    const isSelected = selectedPorterVehicle === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedPorterVehicle(v.id)}
                        className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                            : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{v.icon}</span>
                            <div>
                              <p className="font-black text-slate-800 text-sm">{v.name}</p>
                              <p className="text-[11px] text-slate-500">Cap: {v.capacityKg} kg ({v.capacityQtl} Qtl)</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-slate-200/80 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                            ETA {v.etaMin}m
                          </span>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Base + Rate</span>
                            <span className="font-semibold text-slate-600">₹{v.baseFare} + ₹{v.perKmRate}/km</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Est. Fare (incl. GST)</span>
                            <span className="font-black text-sm text-blue-700">₹{fare.totalFare.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Porter Bookings History & Live Porter.in redirect */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">Your Porter.in Bookings</h4>
                    <p className="text-xs text-slate-500">Real-time status synced with official Porter website</p>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    {porterBookings.length} Trips
                  </span>
                </div>

                <div className="space-y-3">
                  {porterBookings.map(booking => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-blue-700 text-sm">{booking.id}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {booking.status}
                          </span>
                          <span className="text-xs text-slate-400">• {booking.vehicleName}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-semibold">
                          {booking.pickup} → {booking.drop} ({booking.distanceKm} km)
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Driver: <strong className="text-slate-700">{booking.driverName}</strong> ({booking.vehicleNumber}) • Tel: {booking.driverPhone}
                        </p>
                      </div>

                      <div className="flex flex-col md:items-end gap-2">
                        <span className="font-black text-slate-800 text-sm">
                          ₹{booking.estimatedFare?.toLocaleString()}
                        </span>
                        <a
                          href={booking.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-xs transition"
                        >
                          <span>Track on Porter.in</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Action Card */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <h4 className="font-black text-slate-800 text-sm pb-2 border-b border-slate-100">
                  Instant Dispatch Order
                </h4>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Pickup Farm / Mandi</label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Drop Processing / Warehouse</label>
                  <input
                    type="text"
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Distance</span>
                    <span className="text-blue-700">{distanceKm} km</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={300}
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(+e.target.value)}
                    className="w-full accent-blue-600"
                  />
                </div>

                {/* Fare Breakdown */}
                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Vehicle</span>
                    <span className="font-bold text-slate-800">{selectedVehicleData.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Base Fare</span>
                    <span>₹{vehicleFareEstimate.baseFare}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Distance ({distanceKm} km)</span>
                    <span>₹{vehicleFareEstimate.distanceFare}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (5%)</span>
                    <span>₹{vehicleFareEstimate.gst}</span>
                  </div>
                  <div className="flex justify-between text-blue-900 pt-2 border-t border-slate-200 font-black text-sm">
                    <span>Total Porter Fare:</span>
                    <span>₹{vehicleFareEstimate.totalFare.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookPorter}
                  disabled={porterLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  {porterLoading ? 'Contacting Porter Dispatch...' : `Confirm & Book ${selectedVehicleData.name}`}
                </button>

                <p className="text-[10px] text-slate-400 text-center">
                  Driver assigned within 3 mins. Official Porter.in tracking link sent via SMS and portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE SHIPMENT & TELEMETRY TAB */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-black text-slate-800">Shipment MH-15-EG-4412 (Wheat 200 Qtl)</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Route: Lasalgaon Cluster → Chakan Pune Processing Facility</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">On Schedule • 42 km remaining</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
              {[['Current Speed','54 km/h','text-slate-800'],['Transit Temp','24.2°C (Optimal)','text-emerald-700'],['Driver','Sunil Gaikwad','text-slate-700'],['ETA Gate','5:30 PM Today','text-blue-700']].map(([label,val,cls]) => (
                <div key={label} className="bg-slate-50 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 mb-0.5">{label}</div>
                  <div className={`font-black text-sm ${cls}`}>{val}</div>
                </div>
              ))}
            </div>
            <div className="bg-slate-100 h-48 rounded-xl flex items-center justify-center border border-slate-200">
              <div className="text-center">
                <div className="text-3xl mb-1">🗺️</div>
                <p className="font-bold text-xs text-slate-700">GPS Telemetry Stream Live</p>
                <p className="text-[11px] text-slate-400">Vehicle traversing Narayangaon bypass on NH60</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOCAL TRANSPORTER NETWORK TAB */}
      {activeTab === 'network' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transport Booking */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-black text-slate-700 text-sm">🚛 Book Nearby Transporter</div>
            <div className="divide-y divide-slate-50">
              {TRANSPORTER_LIST.map(tr => (
                <div key={tr.id} className={`p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition cursor-pointer ${selectedTransporter === tr.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedTransporter(tr.id === selectedTransporter ? null : tr.id)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-800">{tr.name}</span>
                      {!tr.available && <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full font-bold">Unavailable</span>}
                    </div>
                    <p className="text-xs text-slate-500">{tr.vehicle} • Cap: {tr.capacity}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating rating={tr.rating} />
                      <span className="text-[10px] text-slate-400">{tr.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-blue-700 text-sm">{tr.rate}</p>
                    {tr.available && (
                      <button onClick={e => { e.stopPropagation(); alert(`Booking ${tr.name}. Driver will contact at ${tr.contact}`); }}
                        className="text-[11px] text-white bg-blue-600 hover:bg-blue-700 px-2 py-0.5 rounded-lg font-bold mt-1 transition">Book</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {/* Freight Cost Estimator */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h4 className="font-black text-slate-700 text-sm mb-4">💰 Freight Cost Estimator</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Distance: {distanceKm} km</label>
                  <input type="range" min={10} max={500} value={distanceKm} onChange={e => setDistanceKm(+e.target.value)}
                    className="w-full accent-blue-600" />
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600"><span>Distance:</span><span className="font-bold">{distanceKm} km</span></div>
                  <div className="flex justify-between text-slate-600"><span>Rate:</span><span className="font-bold">₹{ratePerKm}/km {selectedTransporter ? `(${TRANSPORTER_LIST.find(t => t.id === selectedTransporter)?.name})` : '(avg)'}</span></div>
                  <div className="flex justify-between text-blue-800 pt-1 border-t border-blue-200 font-black text-sm"><span>Estimated Freight:</span><span>₹{freightEstimate.toLocaleString()}</span></div>
                </div>
              </div>
            </div>

            {/* Delivery Confirmation */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h4 className="font-black text-slate-700 text-sm mb-4">✅ Delivery Confirmation</h4>
              {deliveryConfirmed ? (
                <div className="text-center py-4">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="font-bold text-emerald-700">Delivery Confirmed!</p>
                  <p className="text-xs text-slate-500">Escrow payment released to farmer account.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition"
                    onClick={() => alert('Photo upload: Select delivery proof photo from your device.')}>
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-slate-600">Upload Delivery Photo</p>
                    <p className="text-[11px] text-slate-400">Weighment slip, condition photo</p>
                  </div>
                  <button onClick={() => setDeliveryConfirmed(true)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Confirm Receipt & Release Escrow
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PORTER API KEY MODAL */}
      {showPorterKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  P
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base">Porter.in API Configuration</h3>
                  <p className="text-[11px] text-slate-500">Enter your official Porter Partner API Key</p>
                </div>
              </div>
              <button
                onClick={() => setShowPorterKeyModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePorterKey} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Porter Partner API Secret Key
                </label>
                <input
                  type="text"
                  placeholder="prtr_live_agri_..."
                  value={porterInputKey}
                  onChange={(e) => setPorterInputKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Generated in your Porter Developer Console under Settings → API Keys.
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">Need Sandbox Demo Key?</span>
                  <button
                    type="button"
                    onClick={() => setPorterInputKey('prtr_live_agri_89a7f39b8120c4e1')}
                    className="text-[11px] text-blue-700 hover:text-blue-900 font-bold underline"
                  >
                    Load Demo Key
                  </button>
                </div>
                <p className="text-[10px] text-blue-700/80 mt-1">
                  Loads a pre-authorized test key allowing full fleet estimation and booking simulation.
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPorterKeyModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-sm transition"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// 9. REVIEWS (NEW)
// ═══════════════════════════════════════════════════════════════════════════════
function ReviewsView() {
  const [reviews, setReviews] = useState([
    { id: 1, farmer: 'Dnyaneshwar Patil', crop: 'Onion (Red Nasik)', order: 'ORD-490', rating: 5, comment: 'Excellent quality, Grade A export onions. Delivered on time, moisture exactly as promised. Will definitely order again!', date: '15 Aug 2026', myReview: true },
    { id: 2, farmer: 'Nashik FPO Aggregators', crop: 'Wheat (Sharbati)', order: 'ORD-465', rating: 4, comment: 'Good quality wheat, minor delay in delivery but FPO communicated proactively. Recommended.', date: '02 Aug 2026', myReview: true },
  ]);
  const [pendingReviews] = useState([
    { orderId: 'ORD-501', farmer: 'Nashik FPO Cluster', crop: 'Wheat 200 Qtl' },
    { orderId: 'ORD-502', farmer: 'Dnyaneshwar Patil', crop: 'Onion 50 Qtl' },
  ]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [selectedPending, setSelectedPending] = useState(null);

  const submitReview = (e) => {
    e.preventDefault();
    const pending = pendingReviews.find(p => p.orderId === selectedPending);
    if (!pending) return;
    setReviews(prev => [{
      id: Date.now(), farmer: pending.farmer, crop: pending.crop, order: pending.orderId,
      rating: newRating, comment: newComment, date: 'Today', myReview: true,
    }, ...prev]);
    setNewComment(''); setNewRating(5); setSelectedPending(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800">⭐ Reviews & Ratings</h2>
        <p className="text-xs text-slate-500">Rate farmers and FPOs to build trust across the AgriNova marketplace</p>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="font-black text-amber-800 text-sm mb-3">⏳ Pending Reviews ({pendingReviews.length})</p>
          <div className="space-y-2">
            {pendingReviews.map(p => (
              <div key={p.orderId} className="flex items-center justify-between bg-white rounded-xl p-3 border border-amber-100">
                <div>
                  <p className="text-xs font-bold text-slate-800">{p.farmer}</p>
                  <p className="text-[11px] text-slate-500">{p.orderId} • {p.crop}</p>
                </div>
                <button onClick={() => setSelectedPending(selectedPending === p.orderId ? null : p.orderId)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition">
                  Write Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      {selectedPending && (
        <form onSubmit={submitReview} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 animate-in fade-in">
          <h3 className="font-black text-slate-800">Write a Review for {pendingReviews.find(p => p.orderId === selectedPending)?.farmer}</h3>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setNewRating(n)}>
                  <Star className={`w-8 h-8 transition ${n <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200 hover:text-amber-200'}`} />
                </button>
              ))}
              <span className="text-sm font-black text-amber-600 ml-2 self-center">{newRating}.0 / 5.0</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Your Review</label>
            <textarea required value={newComment} onChange={e => setNewComment(e.target.value)} rows={3}
              placeholder="Describe the quality, delivery experience, communication..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400 resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setSelectedPending(null)}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-xs text-slate-600">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-sm transition">
              Submit Review
            </button>
          </div>
        </form>
      )}

      {/* Past Reviews */}
      <div className="space-y-4">
        <h3 className="font-black text-slate-700 text-sm">Your Past Reviews</h3>
        {reviews.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-black text-slate-800">{r.farmer}</p>
                <p className="text-xs text-slate-500">{r.order} • {r.crop}</p>
              </div>
              <div className="text-right">
                <StarRating rating={r.rating} size="md" />
                <p className="text-[11px] text-slate-400 mt-0.5">{r.date}</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-3">"{r.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 10. BUYER PROFILE & VERIFICATION (NEW)
// ═══════════════════════════════════════════════════════════════════════════════
function BuyerProfileView({ user }) {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Sahyadri Agro Processing Ltd',
    gst: user?.gst || '27AAXXX0000X1Z5',
    pan: 'AAXXX0000X',
    email: 'procurement@sahyadriagro.com',
    phone: '+91 98231 00001',
    address: 'Plot 45, MIDC Pimpri-Chinchwad, Pune - 411019',
    businessType: 'Food Processor & Exporter',
    annualTurnover: '₹5 Crore+',
  });
  const [saved, setSaved] = useState(false);

  const verificationItems = [
    { label: 'GST Certificate', status: 'verified', icon: '📋' },
    { label: 'PAN Card', status: 'verified', icon: '🪪' },
    { label: 'FSSAI License', status: 'verified', icon: '🏭' },
    { label: 'Bank Account (Escrow)', status: 'verified', icon: '🏦' },
    { label: 'Import Export Code (IEC)', status: 'pending', icon: '📦' },
    { label: 'Udyam Registration', status: 'not_uploaded', icon: '🏢' },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800">👤 Buyer Profile & Verification</h2>
          <p className="text-xs text-slate-500">Manage your business profile and compliance documents</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
          <Shield className="w-4 h-4 text-emerald-600" />
          <div>
            <p className="text-xs font-black text-emerald-800">Verified Buyer</p>
            <p className="text-[10px] text-emerald-600">Trust Score: 99%</p>
          </div>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <p className="text-sm font-bold text-emerald-800">Profile updated successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-slate-700 text-sm">Business Information</h3>
            <button onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition">
              <Edit2 className="w-3.5 h-3.5" /> {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            {[
              { label: 'Company Name', key: 'name' },
              { label: 'GST Number', key: 'gst' },
              { label: 'PAN Number', key: 'pan' },
              { label: 'Email Address', key: 'email' },
              { label: 'Phone Number', key: 'phone' },
              { label: 'Business Type', key: 'businessType' },
              { label: 'Annual Turnover', key: 'annualTurnover' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-[11px] font-bold text-slate-500 mb-0.5">{field.label}</label>
                {editMode ? (
                  <input value={profile[field.key]} onChange={e => setProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-400" />
                ) : (
                  <p className="text-sm font-semibold text-slate-800 bg-slate-50 px-3 py-2 rounded-xl">{profile[field.key]}</p>
                )}
              </div>
            ))}
            {editMode && (
              <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm transition mt-2">
                Save Changes
              </button>
            )}
          </form>
        </div>

        {/* Verification Documents */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-black text-slate-700 text-sm mb-5">Verification Documents</h3>
          <div className="space-y-3">
            {verificationItems.map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-bold text-slate-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'verified' && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                  {item.status === 'pending' && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Clock className="w-3 h-3" /> Under Review
                    </span>
                  )}
                  {item.status === 'not_uploaded' && (
                    <button onClick={() => alert(`Upload ${item.label}: Select file from device.`)}
                      className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 hover:bg-blue-100 transition">
                      <Upload className="w-3 h-3" /> Upload
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Trust Score Visual */}
          <div className="mt-5 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-700">AgriNova Trust Score</span>
              <span className="text-xl font-black text-emerald-700">99%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full" style={{ width: '99%' }} />
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">4 of 6 documents verified • 42 completed transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN BUYER DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function resolveBuyerProfile(u) {
  const isDemoUser = Boolean(
    u?.isDemo === true ||
    u?.phone === '9876543210' ||
    u?.phone === '+91 98231 00001' ||
    u?.phone === '9823100001'
  );

  if (isDemoUser) {
    return {
      name: u?.name || 'Sahyadri Agro Processing Ltd',
      gst: u?.gst || '27AAXXX0000X1Z5',
      pan: 'AAXXX0000X',
      fssai: '10022022000451',
      phone: '+91 98231 00001',
      email: 'procurement@sahyadriagro.com',
      address: 'Plot 45, MIDC Pimpri-Chinchwad, Pune',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '411019',
      avatar: '🏢',
      photoUrl: null,
      businessType: 'Food Processor & Bulk Commodity Exporter',
      annualTurnover: '₹15 Crore+',
      procurementCapacity: '2,500 Tonnes / Month',
      deliveryHubs: 'Pune Chakan Hub, Vashi Navi Mumbai Terminal',
      verified: true,
      trustScore: '99%',
      isDemo: true
    };
  }

  const details = u?.details || {};
  const cleanPhone = String(u?.phone || '').replace(/\D/g, '');

  return {
    name: u?.name || u?.businessName || details.businessName || 'Registered Enterprise Buyer',
    gst: u?.gst || details.gst || '',
    pan: details.pan || '',
    fssai: details.fssai || '',
    phone: u?.phone || (cleanPhone ? `+91 ${cleanPhone.slice(-10)}` : ''),
    email: u?.email || '',
    address: u?.address || u?.village || details.address || details.village || '',
    district: u?.district || details.district || '',
    state: u?.state || details.state || 'Maharashtra',
    pincode: u?.pincode || details.pincode || '',
    avatar: u?.avatar || details.avatar || '🏢',
    photoUrl: u?.photoUrl || details.photoUrl || null,
    businessType: u?.buyerType || details.buyerType || 'Agri Commodity Buyer / Processor',
    annualTurnover: details.annualTurnover || '',
    procurementCapacity: details.procurementCapacity || '',
    deliveryHubs: details.deliveryHubs || (u?.district ? `${u.district} Delivery Hub` : 'Main Distribution Center'),
    verified: true,
    trustScore: '99%',
    isDemo: false
  };
}

export default function BuyerDashboardNew({ user, onLogout, lang: appLang = 'en', setLang: appSetLang, t: propT }) {
  const lang = appLang || 'en';
  const setLang = appSetLang || (() => {});
  const t = propT || translations[lang] || translations.en;
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const [buyerProfile, setBuyerProfile] = useState(() => {
    if (user) return resolveBuyerProfile(user);
    try {
      const saved = localStorage.getItem('anaaj_buyer_profile');
      if (saved) return resolveBuyerProfile(JSON.parse(saved));
    } catch (e) {}
    return resolveBuyerProfile(null);
  });

  useEffect(() => {
    if (user) {
      setBuyerProfile(resolveBuyerProfile(user));
    }
  }, [user]);

  const handleUpdateBuyerProfile = (newProfile) => {
    setBuyerProfile(newProfile);
    try {
      localStorage.setItem('anaaj_buyer_profile', JSON.stringify(newProfile));
    } catch (e) {}
  };

  const navItems = [
    { id: 'dashboard',   label: 'Dashboard',            icon: LayoutDashboard },
    { id: 'find-crops',  label: 'Find Farmer Lots',     icon: Search },
    { id: 'post-req',    label: 'Post Requirement',      icon: FileText },
    { id: 'ai-matching', label: 'AI Farmer Matching',   icon: Zap },
    { id: 'my-offers',   label: 'My Offers & Bids',     icon: Handshake },
    { id: 'orders',      label: 'Orders & Contracts',   icon: Package },
    { id: 'payments',    label: 'Payments & Escrow',    icon: CreditCard },
    { id: 'logistics',   label: 'Logistics Tracking',   icon: Truck },
    { id: 'reviews',     label: 'Reviews & Ratings',    icon: Star },
    { id: 'profile',     label: 'Buyer Profile',        icon: UserCircle },
    { id: 'help',        label: t?.dashHelp || 'Help & Support', icon: HelpCircle },
  ];

  const navigate = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':   return <DashboardOverview onNavigate={navigate} />;
      case 'find-crops':  return <FindCropsView />;
      case 'post-req':    return <PostRequirement />;
      case 'ai-matching': return <AiMatchingView />;
      case 'my-offers':   return <MyOffersView />;
      case 'orders':      return <OrdersView />;
      case 'payments':    return <PaymentsView user={user} />;
      case 'logistics':   return <BuyerLogisticsView />;
      case 'reviews':     return <ReviewsView />;
      case 'profile':     return <BuyerProfileView user={buyerProfile} />;
      case 'help':        return <FarmerGrievance t={t} role="buyer" />;
      default:            return <DashboardOverview onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static z-50 inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-900 to-indigo-900 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
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

        {/* Clickable Buyer User Info (Top Left Corner) */}
        <div 
          onClick={() => setShowProfileModal(true)}
          className="p-3 mx-3 my-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-blue-700/60 transition-all cursor-pointer group shadow-xs"
          title="Click to view & edit buyer profile"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              {buyerProfile.photoUrl ? (
                <img src={buyerProfile.photoUrl} alt={buyerProfile.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-400" />
              ) : (
                <div className="w-11 h-11 bg-blue-700 rounded-full flex items-center justify-center text-2xl ring-2 ring-blue-400/50 shadow-inner">
                  {buyerProfile.avatar || '🏢'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] text-white font-black border border-blue-950">
                ✓
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-white text-sm truncate group-hover:text-blue-200 transition">{buyerProfile.name}</p>
                <Edit2 className="w-3.5 h-3.5 text-blue-300 opacity-75 group-hover:opacity-100 transition flex-shrink-0" />
              </div>
              <p className="text-blue-300 text-xs truncate">GST: {buyerProfile.gst}</p>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-bold">Verified Buyer • 99%</span>
                </div>
                <span className="text-[9px] text-blue-300 font-bold bg-blue-950/60 px-1 py-0.5 rounded">
                  Edit ✏️
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map(item => (
            <button key={item.id} onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeSection === item.id
                  ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-blue-300 hover:bg-white/10 hover:text-white'
              }`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
              {item.id === 'my-offers' && <span className="ml-auto text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-full font-bold">4</span>}
              {item.id === 'reviews' && <span className="ml-auto text-[10px] bg-red-400/20 text-red-300 px-1.5 py-0.5 rounded-full font-bold">2</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-blue-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-300 hover:bg-red-900/40 hover:text-red-300 transition cursor-pointer">
            <LogOut className="w-4 h-4" /> {t?.dashLogout || 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 lg:px-6 shadow-sm justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold text-slate-800 capitalize">
                Buyer Procurement Portal
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                Institutional Network
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Language */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <select value={lang} onChange={e => setLang(e.target.value)} className="bg-transparent font-bold outline-none cursor-pointer">
                <option value="en">EN</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
                <option value="gu">ગુજ</option>
                <option value="pa">ਪੰਜ</option>
              </select>
            </div>
            {/* Notifications */}
            <button className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center relative cursor-pointer hover:bg-slate-200 transition">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>
            {/* User Avatar */}
            <div 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-100 transition shadow-xs"
              title="Click to view & edit buyer profile"
            >
              {buyerProfile.photoUrl ? (
                <img src={buyerProfile.photoUrl} alt="Buyer" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <span className="text-xl">{buyerProfile.avatar || '🏢'}</span>
              )}
              <span className="text-xs font-bold text-slate-800 hidden sm:block truncate max-w-[120px]">{buyerProfile.name.split(' ')[0]}</span>
              <span className="text-[10px] font-bold text-blue-600 hidden sm:inline">✏️</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50">
          <div className="animate-in fade-in duration-200">
            {renderSection()}
          </div>
        </main>
      </div>

      {/* User Profile & Edit Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        role="buyer"
        profileData={buyerProfile}
        onSaveProfile={handleUpdateBuyerProfile}
      />
    </div>
  );
}
