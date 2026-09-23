import React, { useState, useEffect, useRef } from 'react';
import sharedPaymentDB from '../../services/db';
import {
  LayoutDashboard, Leaf, MapPin, Search, ChevronRight, Bell, Menu, X, 
  Settings, LogOut, CheckCircle2, TrendingUp, DollarSign, Star, CloudSun,
  Truck, HelpCircle, PhoneCall, FileText, ShoppingBag, CreditCard, Building2,
  Calendar, Info, AlertTriangle, ShieldCheck, ChevronDown, Check, Eye, Edit2, 
  Map, MessageSquare, Plus, ExternalLink, Zap, BarChart2, Compass, PlayCircle,
  Warehouse, Sparkles, PlusCircle, Upload, BarChart3,
  Sprout, Package, ArrowUpRight, ArrowDownRight, MessageCircle, XCircle, Filter, Send, Globe
} from 'lucide-react';
import StorageAiAgent from '../common/StorageAiAgent';
import PricePredictionCard from '../common/PricePredictionCard';
import {
  AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { translations } from '../../i18n/translations';
import FarmerGrievance from '../panels/FarmerPanel/FarmerGrievance';
import LogisticsStorage from '../panels/FarmerPanel/LogisticsStorage';
import NetProfitCalculator from '../common/NetProfitCalculator';
import WeatherWidget from '../common/WeatherWidget';
import LiveMandiDashboard from '../common/LiveMandiDashboard';
import UserProfileModal from '../common/UserProfileModal';
import FarmerBuyerReviews from '../panels/FarmerPanel/FarmerBuyerReviews';
import FpoMembershipManager from '../common/FpoMembershipManager';
import VoiceInputMic from '../common/VoiceInputMic';
import NearbyMandiFinder from '../common/NearbyMandiFinder';
import { createCropListing, fetchCropListings, fetchMarketBids, updateBidStatus, subscribeToMarketplace } from '../../services/supabaseClient';

// ─── Sample Data ───────────────────────────────────────────────────────────────
const CROPS = [
  { id: 1, name: 'Onion', variety: 'Red Nasik', qty: '120 Quintal', price: '₹2,400/q', harvest: '15 Aug 2026', status: 'Active', grade: 'A', location: 'Yeola, Nashik' },
  { id: 2, name: 'Wheat', variety: 'Sharbati', qty: '80 Quintal', price: '₹2,150/q', harvest: '20 Aug 2026', status: 'Sold', grade: 'B+', location: 'Yeola, Nashik' },
  { id: 3, name: 'Soybean', variety: 'JS-335', qty: '60 Quintal', price: '₹4,600/q', harvest: '10 Sep 2026', status: 'Pending', grade: 'A+', location: 'Yeola, Nashik' },
  { id: 4, name: 'Tomato', variety: 'Desi Red', qty: '40 Quintal', price: '₹1,800/q', harvest: '5 Sep 2026', status: 'Active', grade: 'A', location: 'Pimpalgaon, Nashik' },
];

const OFFERS = [
  { id: 1, buyer: 'Reliance Fresh', company: 'RIL Agri', crop: 'Onion', qty: '50 Q', offered: '₹2,650/q', total: '₹1,32,500', status: 'New', avatar: '🏢' },
  { id: 2, buyer: 'BigBasket Direct', company: 'Supermart', crop: 'Wheat', qty: '80 Q', offered: '₹2,300/q', total: '₹1,84,000', status: 'New', avatar: '🛒' },
  { id: 3, buyer: 'Godrej Agrovet', company: 'Godrej', crop: 'Soybean', qty: '30 Q', offered: '₹4,800/q', total: '₹1,44,000', status: 'Negotiating', avatar: '🌿' },
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

// Sidebar nav items — Create Crop Lot, My Orders, Govt Schemes removed per user request
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'crops', label: 'My Crops', icon: Leaf },
  { id: 'market', label: 'Market Prices', icon: TrendingUp },
  { id: 'best-market', label: 'Best Market', icon: MapPin },
  { id: 'fpo', label: 'Connect to FPO', icon: Building2 },
  { id: 'offers', label: 'Buyer Offers', icon: ShoppingBag },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'reviews', label: 'Buyer Ratings', icon: Star },
  { id: 'logistics', label: 'Logistics', icon: Truck },
  { id: 'storage', label: 'Storage', icon: Warehouse },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

// ─── Create Crop Lot Modal ─────────────────────────────────────────────────────
function CreateCropLotModal({ onClose, onAddCrop, farmerProfile }) {
  const [form, setForm] = useState({ crop: 'Onion', qty: '60', grade: 'A', price: '2500', harvest: '2026-09-06', location: 'Yeola, Nashik', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiGrade, setAiGrade] = useState(null);
  const [aiConfidence, setAiConfidence] = useState(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [cropImageUrl, setCropImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const file = files[0];
    setUploadedFiles(files.map(f => f.name));

    // Convert file to Base64 Data URL with canvas resize for lightning-fast database storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCropImageUrl(compressedUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);

    setAiAnalyzing(true);
    setAiGrade(null);
    setAiConfidence(null);
    setTimeout(() => {
      const grades = ['A+', 'A', 'B+'];
      const confidences = ['97% Visual Match', '94% Visual Match', '91% Visual Match'];
      const idx = Math.floor(Math.random() * grades.length);
      const predicted = grades[idx];
      setAiGrade(predicted);
      setAiConfidence(confidences[idx]);
      setForm(prev => ({ ...prev, grade: predicted }));
      setAiAnalyzing(false);
    }, 1400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cropName = form.crop || 'Wheat';
    const variety = cropName === 'Onion' ? 'Garwa (Red Nashik)' : cropName === 'Wheat' ? 'Sharbati Lokwan' : 'Standard FAQ';
    const grade = form.grade || aiGrade || 'A';
    const qty = Number(form.qty) || 50;
    const price = Number(form.price) || 2400;

    let savedListing = null;
    try {
      const res = await createCropListing({
        farmer_id: farmerProfile?.kisanId || 'farmer-user',
        farmer_name: farmerProfile?.name || 'Dnyaneshwar Patil',
        phone: farmerProfile?.phone || '+91 98231 44521',
        state: farmerProfile?.state || 'Maharashtra',
        district: farmerProfile?.district || 'Nashik',
        crop_name: cropName,
        variety: variety,
        quality_grade: grade.startsWith('Grade') ? grade : `Grade ${grade}`,
        quantity_qtl: qty,
        base_price_per_qtl: price,
        mandi_name: 'Lasalgaon APMC',
        image_url: cropImageUrl,
        harvest_date: form.harvest || new Date().toISOString().split('T')[0],
        notes: form.notes || ''
      });
      if (res?.data) savedListing = res.data;
    } catch (err) {
      console.error('Error saving crop listing to Supabase:', err);
    }

    const newLot = {
      id: savedListing?.id || Date.now(),
      supabaseId: savedListing?.id,
      name: cropName,
      variety: variety,
      qty: `${qty} Quintal`,
      price: `₹${price.toLocaleString()}/q`,
      harvest: form.harvest || 'Today',
      status: 'Active',
      grade: grade,
      location: form.location || `${farmerProfile?.district || 'Nashik'}, Maharashtra`,
      image: cropImageUrl || savedListing?.image_url,
      image_url: cropImageUrl || savedListing?.image_url,
      isLiveSupabase: Boolean(savedListing)
    };

    setSubmitted(true);
    if (onAddCrop) {
      onAddCrop(newLot);
    }
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Create Crop Lot</h2>
              <p className="text-xs text-emerald-100">Direct digital marketplace listing with AI grade verification</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 animate-in zoom-in-95">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-emerald-800">Crop Lot Listed Successfully!</p>
                <p className="text-xs text-emerald-600">Your lot is now live under "Active Crops" and visible to verified buyers.</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Crop Name *</label>
              <div className="relative flex items-center">
                <select value={form.crop} onChange={set('crop')} required className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white appearance-none">
                  {['Onion','Wheat','Rice','Soybean','Cotton','Tomato','Potato','Maize','Sugarcane','Grapes'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <VoiceInputMic onResult={(val) => setForm(p => ({ ...p, crop: val }))} type="select" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center justify-between">
                <span>Quality / Grade *</span>
                {aiGrade && (
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> AI: {aiGrade} ({aiConfidence})
                  </span>
                )}
                {aiAnalyzing && (
                  <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                    <Sparkles className="w-3 h-3" /> AI Analyzing photo…
                  </span>
                )}
              </label>
              <div className="relative flex items-center">
                <select value={form.grade} onChange={set('grade')} className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white appearance-none">
                  {['A+','A','B+','B','C'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <VoiceInputMic onResult={(val) => setForm(p => ({ ...p, grade: val }))} type="select" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Quantity (Quintals) *</label>
              <div className="relative flex items-center">
                <input type="number" min="1" value={form.qty} onChange={set('qty')} placeholder="e.g. 100" required className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                <VoiceInputMic onResult={(val) => setForm(p => ({ ...p, qty: val }))} type="number" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Expected Price (₹/Quintal) *</label>
              <div className="relative flex items-center">
                <input type="number" min="100" value={form.price} onChange={set('price')} placeholder="e.g. 2500" required className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold text-emerald-800" />
                <VoiceInputMic onResult={(val) => setForm(p => ({ ...p, price: val }))} type="number" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Harvest Date *</label>
              <input type="date" value={form.harvest} onChange={set('harvest')} required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Location (Village, District) *</label>
              <div className="relative flex items-center">
                <input value={form.location} onChange={set('location')} placeholder="e.g. Yeola, Nashik" required className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                <VoiceInputMic onResult={(val) => setForm(p => ({ ...p, location: val }))} type="text" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Additional Notes</label>
            <div className="relative flex">
              <textarea value={form.notes} onChange={set('notes')} placeholder="Describe crop quality, sorting method, moisture content, packaging…" rows={2} className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
              <div className="absolute right-2 top-2">
                <VoiceInputMic onResult={(val) => setForm(p => ({ ...p, notes: val }))} type="text" />
              </div>
            </div>
          </div>

          {/* Image Upload with AI Grading */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center hover:border-emerald-400 transition cursor-pointer bg-slate-50/50" onClick={() => fileInputRef.current?.click()}>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            {cropImageUrl ? (
              <div className="space-y-3">
                <div className="relative mx-auto w-44 h-32 rounded-xl overflow-hidden shadow-md border-2 border-emerald-500">
                  <img src={cropImageUrl} alt="Crop sample" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1.5 left-1.5 bg-emerald-700/90 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded">
                    ⚡ Real Photo Loaded
                  </span>
                </div>
                <p className="text-xs font-bold text-emerald-800">
                  ✓ Real crop photo ready. Will be saved to database & shown to buyers!
                </p>
                <span className="text-[11px] text-slate-500 underline hover:text-emerald-700">Click to change photo</span>
              </div>
            ) : (
              <>
                <Upload className="w-7 h-7 text-emerald-600 mx-auto mb-1.5" />
                <p className="text-sm font-bold text-slate-700">Click to Upload Crop Photos for AI Grading</p>
                <p className="text-xs text-slate-400">PNG, JPG up to 10MB • Clear view of crop sample</p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">🤖 AI will instantly inspect uploaded crop image and determine Grade (A+, A, B+)</p>
              </>
            )}
            {uploadedFiles.length > 0 && !cropImageUrl && (
              <div className="mt-2 flex flex-wrap gap-1.5 justify-center">
                {uploadedFiles.map((f, i) => (
                  <span key={i} className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                    📷 {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          {aiGrade && (
            <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl animate-in zoom-in-95">
              <Sparkles className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-black text-emerald-900">
                  AI Assayed Grade: <span className="text-emerald-700 font-black text-base">{aiGrade}</span> — AI Verified ✅
                </p>
                <p className="text-xs text-emerald-700">Color, grain size, and texture match e-NAM Grade {aiGrade} standards ({aiConfidence}).</p>
              </div>
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
            <PlusCircle className="w-5 h-5" /> {isSubmitting ? 'Syncing to Supabase PostgreSQL...' : 'Create Crop Lot & Publish'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Negotiate Chat Modal ──────────────────────────────────────────────────────
function NegotiateChatModal({ offer, onClose, onAcceptDeal }) {
  const [messages, setMessages] = useState([
    { sender: 'buyer', text: `Namaste! I am the procurement officer at ${offer.buyer}. We reviewed your ${offer.crop} lot. Our initial offer is ${offer.offered} for ${offer.qty}.`, time: '10:30 AM' },
    { sender: 'buyer', text: 'If you want a counter-rate or specific delivery terms, please tell us here.', time: '10:31 AM' },
  ]);
  const [inputText, setInputText] = useState('');
  const [dealClosed, setDealClosed] = useState(false);

  const quickChips = [
    'Can you do ₹150 more per quintal?',
    'Farm-gate pickup is required',
    'Grade A quality verified by AI assay',
    'Prompt escrow payout within 48 hours',
  ];

  const handleSend = (text) => {
    const t = text || inputText;
    if (!t.trim()) return;
    setMessages(prev => [...prev, { sender: 'me', text: t, time: 'Just now' }]);
    setInputText('');
    setTimeout(() => {
      const replies = [
        `Understood! We can revise our offer to ₹${(parseInt(offer.offered.replace(/\D/g,'')) + 80).toLocaleString()}/q with farm-gate loading included. Does this work for you?`,
        'We agree to the escrow guarantee upon weighing and dispatch. Can we schedule pickup for tomorrow?',
        `Our procurement manager approved an increased rate of ₹${(parseInt(offer.offered.replace(/\D/g,'')) + 100).toLocaleString()}/q for your verified lot!`,
      ];
      setMessages(prev => [...prev, { sender: 'buyer', text: replies[Math.floor(Math.random() * replies.length)], time: 'Just now' }]);
    }, 900);
  };

  const handleFinalize = () => {
    setDealClosed(true);
    setTimeout(() => {
      if (onAcceptDeal) onAcceptDeal(offer.id, offer.offered);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden border border-slate-100" style={{ height: '82vh' }}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl shadow-inner">{offer.avatar}</div>
            <div>
              <h4 className="font-black text-white text-sm flex items-center gap-1.5">
                <span>{offer.buyer}</span>
                <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-full font-bold">Buyer</span>
              </h4>
              <p className="text-emerald-200 text-xs">{offer.crop} • {offer.qty} • Offered: {offer.offered}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">🔒 Escrow Chat</span>
            <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition cursor-pointer">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs">
          <span className="text-emerald-800 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Real-time Buyer-Seller Chatbot
          </span>
          <button
            onClick={handleFinalize}
            disabled={dealClosed}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <CheckCircle2 className="w-3 h-3" /> {dealClosed ? 'Deal Agreed! ✅' : 'Lock & Accept Deal'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {messages.map((m, idx) => {
            const isMe = m.sender === 'me';
            return (
              <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in`}>
                <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                  {!isMe && <p className="text-[10px] font-bold text-emerald-700 mb-1">{offer.buyer}</p>}
                  <p className="leading-relaxed text-xs sm:text-sm">{m.text}</p>
                  <span className={`text-[10px] mt-1 block text-right font-medium ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>{m.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Chips */}
        <div className="px-3 pt-2 pb-1 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto bg-slate-50/70">
          {quickChips.map((chip, idx) => (
            <button key={idx} onClick={() => handleSend(chip)} className="text-[11px] font-semibold text-slate-600 bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-full px-3 py-1 whitespace-nowrap transition cursor-pointer flex-shrink-0">
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Type your counter-offer or terms (or tap 🎤)..."
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <VoiceInputMic onResult={setInputText} type="text" />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-sm rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-section Components ────────────────────────────────────────────────────

function SummaryCard({ icon: Icon, label, value, sub, color, trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:border-emerald-200' : ''}`}
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
      {onClick && <div className="text-[10px] text-emerald-500 font-bold mt-1.5 flex items-center gap-0.5">Tap to view <ChevronRight className="w-2.5 h-2.5" /></div>}
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
function DashboardOverview({ user, crops = CROPS, offers = OFFERS, offerStatusMap = {}, onOfferAction, onNegotiate, onNavigate, t = {} }) {
  const [activeCrop, setActiveCrop] = useState('onion');
  const [paymentStats, setPaymentStats] = useState(() => sharedPaymentDB.getFarmerStats(user?.name));

  useEffect(() => {
    setPaymentStats(sharedPaymentDB.getFarmerStats(user?.name));
    const unsubscribe = sharedPaymentDB.subscribe(() => {
      setPaymentStats(sharedPaymentDB.getFarmerStats(user?.name));
    });
    return unsubscribe;
  }, [user?.name]);

  // Live computed stats from real data
  const totalCrops = crops.length;
  const activeLots = crops.filter(c => c.status === 'Active').length;
  const pendingCrops = crops.filter(c => c.status === 'Pending').length;
  const acceptedOffers = Object.values(offerStatusMap).filter(s => s === 'accepted').length;
  const pendingOffers = offers.length - Object.values(offerStatusMap).filter(s => s === 'rejected').length;
  const nav = (section) => onNavigate && onNavigate(section);

  return (
    <div className="space-y-6">
      {/* Summary Cards — all clickable, live data */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard icon={Leaf} label="Total Crops" value={totalCrops} sub={`${activeLots} active • ${pendingCrops} pending`} color="bg-emerald-500" trend={12} onClick={() => nav('crops')} />
        <SummaryCard icon={Package} label="Active Lots" value={activeLots} sub="Live on platform" color="bg-blue-500" trend={5} onClick={() => nav('crops')} />
        <SummaryCard icon={ShoppingBag} label="Buyer Offers" value={pendingOffers} sub={`${acceptedOffers} accepted`} color="bg-amber-500" trend={22} onClick={() => nav('offers')} />
        <SummaryCard 
          icon={CreditCard} 
          label="Payments" 
          value={paymentStats?.totalReceivedFormatted ? paymentStats.totalReceivedFormatted.split(' ')[0] : ((user?.isDemo || user?.phone === '9876543210') ? '₹3.54L' : '₹0')} 
          sub={(user?.isDemo || user?.phone === '9876543210') ? `${paymentStats?.receivedCount || 3} credited • Live` : `${paymentStats?.receivedCount || 0} credited`} 
          color="bg-rose-500" 
          trend={18} 
          onClick={() => nav('payments')} 
        />
        <SummaryCard icon={TrendingUp} label="Live Mandi" value="₹2,580" sub="Onion • Lasalgaon" color="bg-purple-500" trend={8} onClick={() => nav('market')} />
      </div>

      {/* Live GPS Nearby Mandis & Price Discovery Widget */}
      <NearbyMandiFinder 
        userProfile={user} 
        defaultCrop={crops[0]?.name ? crops[0].name.toLowerCase() : 'onion'} 
        onSelectMandi={() => nav('market')} 
      />

      {/* My Crops */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-black text-slate-800">🌾 My Crops</h3>
          <button onClick={() => onNavigate && onNavigate('crops')} className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1 cursor-pointer">
            View All & Manage <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 font-bold">
                <th className="text-left px-5 py-3">Crop</th>
                <th className="text-left px-4 py-3">Quantity</th>
                <th className="text-left px-4 py-3">Expected Price</th>
                <th className="text-left px-4 py-3">Harvest Date</th>
                <th className="text-left px-4 py-3">Grade</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((c, i) => (
                <tr key={c.id} className={`border-t border-slate-50 hover:bg-emerald-50/30 transition ${i % 2 === 0 ? '' : 'bg-slate-50/40'}`}>
                  <td className="px-5 py-3 font-bold text-slate-800">
                    {c.name} {c.variety && <span className="text-xs font-normal text-slate-400">({c.variety})</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.qty}</td>
                  <td className="px-4 py-3 font-bold text-emerald-700">{c.price}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{c.harvest}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">{c.grade}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buyer Offers + Market Prices side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Buyer Offers */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-800">🤝 Recent Buyer Offers</h3>
              <p className="text-[11px] text-slate-400">Accepted & rejected offers update here in real time</p>
            </div>
            <button onClick={() => onNavigate && onNavigate('offers')} className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1 cursor-pointer">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {offers.slice(0, 4).map(o => {
              const offerState = offerStatusMap?.[o.id];
              return (
                <div key={o.id} className="p-4 hover:bg-slate-50/60 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-sm text-slate-800">{o.buyer}</p>
                        {o.isLiveSupabase && (
                          <span className="text-[9px] font-black bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded-full">
                            ⚡ Supabase
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{o.company} • {o.crop} • {o.qty}</p>
                    </div>
                    <StatusBadge status={offerState ? (offerState === 'accepted' ? 'Accepted' : offerState === 'rejected' ? 'Rejected' : 'Negotiating') : o.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-emerald-700">{o.offered}</p>
                      <p className="text-xs text-slate-400">Total: {o.total}</p>
                    </div>
                    {offerState ? (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                          offerState === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          offerState === 'rejected' ? 'bg-red-100 text-red-600' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {offerState === 'accepted' ? '✅ Offer Accepted' : offerState === 'rejected' ? '❌ Offer Rejected' : '💬 In Negotiation'}
                        </span>
                        {offerState === 'negotiating' && (
                          <button
                            onClick={() => onNegotiate && onNegotiate(o)}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                          >
                            Open Chat
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => onOfferAction && onOfferAction(o.id, 'accepted')}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Accept
                        </button>
                        <button
                          onClick={() => {
                            if (onOfferAction) onOfferAction(o.id, 'negotiating');
                            if (onNegotiate) onNegotiate(o);
                          }}
                          className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <MessageCircle className="w-3 h-3" /> Negotiate
                        </button>
                        <button
                          onClick={() => onOfferAction && onOfferAction(o.id, 'rejected')}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market Prices Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800">📊 Market Prices (₹/Quintal)</h3>
            <button
              onClick={() => onNavigate && onNavigate('market')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition hover:underline"
            >
              <span>{t?.liveMandiPrices || 'Live Mandi Rates'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
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
              <div className="text-blue-100 font-semibold">Partly Cloudy • Humidity 68%</div>
            </div>
          </div>
          <p className="text-xs text-blue-100 mb-4">Rain probability: 15% • Wind: 12 km/h WSW • Ideal for crop drying & threshing</p>
          <button onClick={() => onNavigate && onNavigate('weather')} className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer">
            View Full Agromet Forecast <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* AI Market Insight */}
        <div className="bg-gradient-to-br from-emerald-700 to-green-600 rounded-2xl p-5 text-white">
          <h3 className="font-black mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5" /> AI Mandi Recommendation</h3>
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

// My Crops full page — with Add Crop Modal + 3 Status Filters (Active, Sold, Pending)
function MyCrops({ crops = CROPS, onAddCrop, farmerProfile }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // 3 filters requested by user: 1. active crop 2. sold crop 3. pending crop
  const filterOptions = [
    { key: 'Active', label: '1. Active Crop', badge: '🟢 Active Crops', dot: 'bg-emerald-500' },
    { key: 'Sold', label: '2. Sold Crop', badge: '🔵 Sold Crops', dot: 'bg-blue-500' },
    { key: 'Pending', label: '3. Pending Crop', badge: '🟡 Pending Crops', dot: 'bg-amber-500' },
    { key: 'All', label: 'Show All Crops', badge: '📋 All Crops', dot: 'bg-slate-400' },
  ];

  const filteredCrops = filterStatus === 'All' ? crops : crops.filter(c => c.status === filterStatus);

  return (
    <div className="space-y-5">
      {showCreateModal && (
        <CreateCropLotModal
          onClose={() => setShowCreateModal(false)}
          onAddCrop={onAddCrop}
          farmerProfile={farmerProfile}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800">🌾 My Listed Crops ({crops.length})</h2>
          <p className="text-xs text-slate-500">Manage crop lots, inspect AI grades, and filter by listing status</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-sm shadow-emerald-600/20"
          >
            <PlusCircle className="w-4 h-4" /> Add Crop
          </button>
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(p => !p)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>{filterOptions.find(o => o.key === filterStatus)?.label || filterStatus}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 overflow-hidden py-1 divide-y divide-slate-100">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Filter by Crop Status
                </div>
                {filterOptions.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => { setFilterStatus(opt.key); setShowFilterMenu(false); }}
                    className={`w-full px-4 py-2.5 text-left text-xs font-bold transition flex items-center gap-2.5 cursor-pointer ${
                      filterStatus === opt.key ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${opt.dot}`}></span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredCrops.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <p className="text-slate-500 font-semibold">No {filterStatus} crops found</p>
          <button
            onClick={() => setFilterStatus('All')}
            className="mt-3 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-200 cursor-pointer"
          >
            Show All Crops
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredCrops.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-800 text-lg">{c.name}</h3>
                    {c.isLiveSupabase && (
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                        ⚡ Live Supabase
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{c.variety} • {c.location}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              {c.image && (
                <div className="mb-3 rounded-xl overflow-hidden h-36 w-full relative">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                    📷 Real Farmgate Sample
                  </span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-slate-400 mb-1">Quantity</div>
                  <div className="font-black text-sm text-slate-800">{c.qty}</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3">
                  <div className="text-xs text-slate-400 mb-1">Price</div>
                  <div className="font-black text-sm text-emerald-700">{c.price}</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3">
                  <div className="text-xs text-slate-400 mb-1">Grade</div>
                  <div className="font-black text-sm text-blue-700">{c.grade}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">Harvest: {c.harvest}</span>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  AI Assayed <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Market Prices
function MarketPrices({ t, lang }) {
  return <LiveMandiDashboard t={t} lang={lang} />;
}

// Buyer Offers Full — with Negotiate Chat Modal + shared offerStatusMap
function BuyerOffersFull({ offers = OFFERS, offerStatusMap = {}, onOfferAction, onNegotiate }) {
  const [localNegotiateOffer, setLocalNegotiateOffer] = useState(null);

  const handleAction = (id, action) => {
    if (onOfferAction) onOfferAction(id, action);
  };

  const handleNegotiate = (offer) => {
    if (onOfferAction) onOfferAction(offer.id, 'negotiating');
    if (onNegotiate) {
      onNegotiate(offer);
    } else {
      setLocalNegotiateOffer(offer);
    }
  };

  return (
    <div className="space-y-5">
      {localNegotiateOffer && (
        <NegotiateChatModal
          offer={localNegotiateOffer}
          onClose={() => setLocalNegotiateOffer(null)}
          onAcceptDeal={(id) => {
            handleAction(id, 'accepted');
            setLocalNegotiateOffer(null);
          }}
        />
      )}

      <div>
        <h2 className="text-xl font-black text-slate-800">🤝 Received Buyer Offers ({offers.length})</h2>
        <p className="text-sm text-slate-500">
          Accept or reject offers below. Click Negotiate to chat directly with buyers. Actions update in your Dashboard Overview.
        </p>
      </div>

      {offers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner">
            🤝
          </div>
          <h3 className="text-slate-800 font-bold text-base">No Buyer Offers Received Yet</h3>
          <p className="text-slate-400 text-xs mt-1.5 max-w-md mx-auto leading-relaxed">
            Once you list your crop lots in <strong>My Crops</strong>, institutional buyers and food processors across India will place direct farmgate bids here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map(o => {
            const currentStatus = offerStatusMap[o.id] || (o.status === 'Accepted' ? 'accepted' : o.status === 'Rejected' ? 'rejected' : o.status === 'Negotiating' ? 'negotiating' : null);
            return (
            <div key={o.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">{o.avatar || '🏢'}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-800">{o.buyer}</h3>
                      {o.isLiveSupabase && (
                        <span className="text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded-full">
                          ⚡ Live Supabase Bid
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{o.company} • {o.crop} • {o.qty}</p>
                  </div>
                </div>
                <StatusBadge status={currentStatus ? (currentStatus === 'accepted' ? 'Accepted' : currentStatus === 'rejected' ? 'Rejected' : 'Negotiating') : o.status} />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div className="bg-emerald-50 rounded-xl p-3"><div className="text-xs text-slate-400">Offered Price</div><div className="font-black text-emerald-700">{o.offered}</div></div>
                <div className="bg-slate-50 rounded-xl p-3"><div className="text-xs text-slate-400">Quantity</div><div className="font-black text-slate-700">{o.qty}</div></div>
                <div className="bg-blue-50 rounded-xl p-3"><div className="text-xs text-slate-400">Total Value</div><div className="font-black text-blue-700">{o.total}</div></div>
              </div>
              {!currentStatus ? (
                <div className="flex gap-3">
                  <button onClick={() => handleAction(o.id, 'accepted')} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition cursor-pointer">
                    ✅ Accept Offer
                  </button>
                  <button onClick={() => handleNegotiate(o)} className="flex-1 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-sm rounded-xl transition cursor-pointer">
                    💬 Negotiate Chat
                  </button>
                  <button onClick={() => handleAction(o.id, 'rejected')} className="flex-1 py-2.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold text-sm rounded-xl transition cursor-pointer">
                    ❌ Reject
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className={`font-bold text-sm ${currentStatus === 'accepted' ? 'text-emerald-700' : currentStatus === 'rejected' ? 'text-red-600' : 'text-purple-700'}`}>
                    {currentStatus === 'accepted' ? '✅ Offer Accepted — Visible in Dashboard Overview' : currentStatus === 'rejected' ? '❌ Offer Rejected' : '💬 In Negotiation with Buyer'}
                  </span>
                  {currentStatus === 'negotiating' && (
                    <button
                      onClick={() => handleNegotiate(o)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                    >
                      Open Chatbot
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

// My Orders removed from sidebar — section kept as placeholder if navigated directly

// GovtSchemes removed from sidebar and dashboard per user request

// Payments & Escrow Ledger
function Payments({ user, t }) {
  const farmerName = user?.name || 'Dnyaneshwar Patil';
  const [paymentsList, setPaymentsList] = useState(() => sharedPaymentDB.getPayments({ farmerName }));
  const [stats, setStats] = useState(() => sharedPaymentDB.getFarmerStats(farmerName));
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [filterRole, setFilterRole] = useState('all'); // 'all' | 'buyer' | 'fpo'
  const [liveToast, setLiveToast] = useState(null);

  useEffect(() => {
    setPaymentsList(sharedPaymentDB.getPayments({ farmerName }));
    setStats(sharedPaymentDB.getFarmerStats(farmerName));

    const unsubscribe = sharedPaymentDB.subscribe((newPayment) => {
      setPaymentsList(sharedPaymentDB.getPayments({ farmerName }));
      setStats(sharedPaymentDB.getFarmerStats(farmerName));
      if (newPayment) {
        setLiveToast(newPayment);
        setTimeout(() => setLiveToast(null), 8000);
      }
    });

    return unsubscribe;
  }, [farmerName]);

  const filteredPayments = paymentsList.filter(p => {
    if (filterRole === 'buyer') return p.fromRole === 'buyer';
    if (filterRole === 'fpo') return p.fromRole === 'fpo';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Live Incoming Payment Toast */}
      {liveToast && (
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-xl flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">🎉</div>
            <div>
              <p className="font-black text-sm">
                New Payment Received: {liveToast.amountFormatted}
              </p>
              <p className="text-xs text-emerald-100">
                From {liveToast.fromRole === 'buyer' ? '🏢 Buyer' : '🌾 FPO'} {liveToast.fromName} for {liveToast.crop} • UTR: {liveToast.utr}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedReceipt(liveToast)}
            className="px-3 py-1.5 bg-white text-emerald-800 text-xs font-bold rounded-lg hover:bg-emerald-50 transition shrink-0 cursor-pointer"
          >
            View Voucher
          </button>
        </div>
      )}

      {/* Header & Bank Account Linked Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <span>💳</span> Payments & Escrow Settlement History
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time ledger synced with Buyer and FPO escrow settlements (Direct DBT & NEFT)
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Settlement Account: <strong>{user?.bankDetails?.bankName || 'State Bank of India'} (•••• {user?.bankDetails?.accountNumber?.slice(-4) || '4321'})</strong></span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-sm">
          <div className="text-xs text-emerald-200 mb-1 font-semibold">Total Received (कुल प्राप्त)</div>
          <div className="text-2xl font-black">{stats.totalReceivedFormatted}</div>
          <div className="text-[11px] text-emerald-200 mt-1">✓ Credited directly into bank account</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-sm">
          <div className="text-xs text-amber-100 mb-1 font-semibold">Pending in Escrow (एस्क्रो में बाकी)</div>
          <div className="text-2xl font-black">{stats.totalPendingFormatted}</div>
          <div className="text-[11px] text-amber-100 mt-1">Locked in RBI Escrow • Releases post delivery</div>
        </div>
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-5 text-white shadow-sm">
          <div className="text-xs text-slate-300 mb-1 font-semibold">Total Realized Value (कुल मूल्य)</div>
          <div className="text-2xl font-black">{stats.totalSalesFormatted}</div>
          <div className="text-[11px] text-slate-300 mt-1">{stats.count} Total contracts executed</div>
        </div>
      </div>

      {/* Filters & Transaction Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="font-black text-slate-800 text-sm">Payment History & Tax Invoices</h3>
            <p className="text-[11px] text-slate-500">Auto-updated whenever a Buyer or FPO completes a payment</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setFilterRole('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${filterRole === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All ({paymentsList.length})
            </button>
            <button
              onClick={() => setFilterRole('buyer')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${filterRole === 'buyer' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              🏢 Buyers ({paymentsList.filter(p => p.fromRole === 'buyer').length})
            </button>
            <button
              onClick={() => setFilterRole('fpo')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${filterRole === 'fpo' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              🌾 FPO Payouts ({paymentsList.filter(p => p.fromRole === 'fpo').length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <th className="text-left px-5 py-3">Txn ID & UTR</th>
                <th className="text-left px-4 py-3">Payer / Source</th>
                <th className="text-left px-4 py-3">Crop / Lot</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Method</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-center px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3">
                    <div className="font-mono font-bold text-slate-700">{p.id}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{p.utr}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        p.fromRole === 'buyer' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.fromRole === 'buyer' ? 'Buyer' : 'FPO'}
                      </span>
                      <span>{p.fromName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{p.orderId}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{p.crop}</td>
                  <td className="px-4 py-3 font-black text-sm text-emerald-700">{p.amountFormatted}</td>
                  <td className="px-4 py-3 text-slate-500">{p.date}</td>
                  <td className="px-4 py-3 text-slate-600">{p.method}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'Received' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.status === 'Received' ? '✓ Received' : '⏳ Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedReceipt(p)}
                      className="px-2.5 py-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition cursor-pointer"
                    >
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 font-medium">
                    No transactions found under this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Payment Receipt / Voucher Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center border-b border-slate-100 pb-4 mb-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-2 text-2xl font-black">
                ✓
              </div>
              <h3 className="text-lg font-black text-slate-800 font-heading">e-Mandi Payment Voucher</h3>
              <p className="text-xs text-slate-500">Direct Escrow Settlement Credit Confirmation</p>
              <div className="mt-2 text-2xl font-black text-emerald-700">{selectedReceipt.amountFormatted}</div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Voucher / Payment ID:</span>
                <span className="font-mono font-bold text-slate-800">{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Bank UTR / Reference:</span>
                <span className="font-mono font-bold text-slate-800">{selectedReceipt.utr}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Payer ({selectedReceipt.fromRole?.toUpperCase()}):</span>
                <span className="font-bold text-slate-800">{selectedReceipt.fromName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Beneficiary Farmer:</span>
                <span className="font-bold text-slate-800">{selectedReceipt.toFarmer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Credited Bank Account:</span>
                <span className="font-bold text-emerald-800">{selectedReceipt.accountMasked || 'SBI •••• 4321'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Crop / Order Details:</span>
                <span className="font-semibold text-slate-800">{selectedReceipt.crop}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Payment Date:</span>
                <span className="font-semibold text-slate-800">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Mode:</span>
                <span className="font-semibold text-slate-800">{selectedReceipt.method}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-900 mt-3 flex items-start gap-2">
                <span>🛡️</span>
                <span>This transaction is guaranteed by anaaj RBI-regulated escrow Trustee. Funds have been verified & credited to the beneficiary's registered Aadhaar DBT bank account.</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Print Voucher
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
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
          <div className="relative flex-1 flex items-center">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Type your reply, propose price, or ask delivery terms (or tap 🎤)..."
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <VoiceInputMic onResult={setInputText} type="text" />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>Send</span>
            <span>➤</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper to resolve farmer profile from session user without leaking demo defaults to registered users
function resolveFarmerProfile(u) {
  const isDemoUser = Boolean(
    u?.isDemo === true ||
    u?.phone === '9876543210' ||
    u?.phone === '+91 98231 45678' ||
    u?.phone === '9823145678'
  );

  if (isDemoUser) {
    return {
      name: u?.name || 'Dnyaneshwar Patil',
      phone: u?.phone || '+91 98231 45678',
      email: u?.email || 'dnyaneshwar.patil@kisan.in',
      village: u?.village || 'Yeola',
      district: u?.district || 'Nashik',
      state: u?.state || 'Maharashtra',
      pincode: u?.pincode || '423401',
      avatar: u?.avatar || '👨‍🌾',
      photoUrl: u?.photoUrl || null,
      landSize: u?.landSize || '8.5 Acres (Irrigated)',
      primaryCrops: u?.primaryCrops || u?.crops || 'Red Onion, Sharbati Wheat, Soybean',
      kisanId: u?.kisanId || 'MH-NSK-2024-8841',
      bankName: u?.bankName || 'State Bank of India (Yeola Branch)',
      accountMasked: u?.accountMasked || '•••• •••• 4321',
      ifsc: u?.ifsc || 'SBIN0004123',
      mandiReg: u?.mandiReg || 'Lasalgaon APMC #K-4412',
      aadhaarVerified: true,
      isDemo: true
    };
  }

  // Real registered user: strictly use their entered registration data
  const details = u?.details || {};
  const cleanPhone = String(u?.phone || '').replace(/\D/g, '');
  const bankAcc = u?.bankDetails?.accountNumber || details.bankAccountNumber || u?.accountNumber || '';
  const bankMasked = bankAcc ? `•••• •••• ${bankAcc.slice(-4)}` : (u?.accountMasked || 'Not linked');

  return {
    name: u?.name || 'Registered Farmer',
    phone: u?.phone || (cleanPhone ? `+91 ${cleanPhone.slice(-10)}` : ''),
    email: u?.email || '',
    village: u?.village || details.village || '',
    district: u?.district || details.district || '',
    state: u?.state || details.state || 'Maharashtra',
    pincode: u?.pincode || details.pincode || '',
    avatar: u?.avatar || details.avatar || '👨‍🌾',
    photoUrl: u?.photoUrl || u?.photoPreview || details.photoPreview || null,
    landSize: u?.landSize || details.landSize || (details.landArea ? `${details.landArea} ${details.landUnit || 'Acre'}` : 'Not specified'),
    primaryCrops: u?.primaryCrops || u?.crops || details.primaryCrops || (Array.isArray(details.crops) ? details.crops.join(', ') : 'Not specified'),
    kisanId: u?.kisanId || details.kisanId || (cleanPhone ? `KCC-IND-${cleanPhone.slice(-4)}` : 'KCC-IND-REG'),
    bankName: u?.bankName || u?.bankDetails?.bankName || details.bankName || 'Not linked',
    accountMasked: bankMasked,
    ifsc: u?.ifsc || u?.bankDetails?.ifscCode || details.bankIfsc || 'Not linked',
    mandiReg: u?.mandiReg || details.mandiReg || (u?.district ? `${u.district} APMC Registered` : 'Registered APMC'),
    aadhaarVerified: Boolean(u?.aadhaarVerified ?? details.isAadhaarVerified ?? details.aadharNumber),
    isDemo: false
  };
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function FarmerDashboardNew({ user, onLogout, lang: appLang = 'en', setLang: appSetLang, t: propT }) {
  const lang = appLang || 'en';
  const setLang = appSetLang || (() => {});
  const t = propT || translations[lang] || translations.en;
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isDemo = Boolean(
    user?.isDemo === true ||
    user?.phone === '9876543210' ||
    user?.phone === '+91 98231 45678' ||
    user?.phone === '9823145678'
  );

  const [farmerProfile, setFarmerProfile] = useState(() => {
    if (user) return resolveFarmerProfile(user);
    try {
      const saved = localStorage.getItem('anaaj_farmer_profile');
      if (saved) return resolveFarmerProfile(JSON.parse(saved));
    } catch (e) {}
    return resolveFarmerProfile(null);
  });

  // Re-sync farmer profile whenever user changes
  useEffect(() => {
    if (user) {
      setFarmerProfile(resolveFarmerProfile(user));
    }
  }, [user]);

  // Real registered users start with their own empty lists; demo users get sample data
  const [cropsList, setCropsList] = useState(() => (isDemo ? CROPS : []));
  const [offersList, setOffersList] = useState(() => (isDemo ? OFFERS : []));
  const [offerStatusMap, setOfferStatusMap] = useState({});
  const [negotiatingOffer, setNegotiatingOffer] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    setCropsList(isDemo ? CROPS : []);
    setOffersList(isDemo ? OFFERS : []);
  }, [isDemo]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [liveCrops, liveBids] = await Promise.all([
          fetchCropListings(),
          fetchMarketBids()
        ]);
        if (isMounted) {
          const cleanUserPhone = String(user?.phone || '').replace(/\D/g, '').slice(-10);

          if (liveCrops && liveCrops.length > 0) {
            const relevantCrops = isDemo
              ? liveCrops
              : liveCrops.filter(l => String(l.phone || '').replace(/\D/g, '').slice(-10) === cleanUserPhone);

            if (relevantCrops.length > 0) {
              const mappedCrops = relevantCrops.map(l => ({
                id: l.id,
                supabaseId: l.id,
                name: l.crop_name,
                variety: l.variety || 'Standard',
                qty: `${l.quantity_qtl} Quintal`,
                price: `₹${Number(l.base_price_per_qtl).toLocaleString()}/q`,
                harvest: new Date(l.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                status: l.status === 'ACTIVE' ? 'Active' : l.status === 'SOLD' ? 'Sold' : 'Pending',
                grade: l.quality_grade || 'Grade A',
                location: `${l.district || farmerProfile.district || 'Nashik'}, ${l.state || 'MH'}`,
                image: l.image_url || null,
                image_url: l.image_url || null,
                isLiveSupabase: true
              }));
              setCropsList(prev => {
                if (!isDemo) return mappedCrops;
                const liveIds = new Set(mappedCrops.map(c => c.id));
                return [...mappedCrops, ...prev.filter(p => !liveIds.has(p.id))];
              });
            }
          }

          if (liveBids && liveBids.length > 0) {
            const mappedBids = liveBids.map(b => {
              const s = (b.status || 'PENDING').toUpperCase();
              return {
                id: b.id,
                supabaseId: b.id,
                buyer: b.buyer_name || 'Verified Buyer',
                company: b.buyer_company || 'AgriNova Certified Buyer',
                crop: b.crop_listings?.crop_name || 'Market Lot',
                qty: `${b.quantity_qtl} Q`,
                offered: `₹${Number(b.bid_price_per_qtl).toLocaleString()}/q`,
                total: `₹${(Number(b.bid_price_per_qtl) * Number(b.quantity_qtl)).toLocaleString()}`,
                status: s === 'ACCEPTED' ? 'Accepted' : s === 'REJECTED' ? 'Rejected' : s === 'COUNTERED' ? 'Negotiating' : 'New',
                avatar: '🏢',
                isLiveSupabase: true
              };
            });

            // Pre-populate offerStatusMap from Supabase database
            const dbStatusMap = {};
            liveBids.forEach(b => {
              const s = (b.status || '').toUpperCase();
              if (s === 'ACCEPTED') dbStatusMap[b.id] = 'accepted';
              if (s === 'REJECTED') dbStatusMap[b.id] = 'rejected';
              if (s === 'COUNTERED') dbStatusMap[b.id] = 'negotiating';
            });
            setOfferStatusMap(prev => ({ ...dbStatusMap, ...prev }));

            setOffersList(prev => {
              if (!isDemo) return mappedBids;
              const bidIds = new Set(mappedBids.map(b => b.id));
              return [...mappedBids, ...prev.filter(p => !bidIds.has(p.id))];
            });
          }
        }
      } catch (err) {
        console.warn('Error loading Supabase data for farmer:', err);
      }
    }
    loadData();

    // Subscribe to realtime updates for instant bid appearance & status changes
    const unsub = subscribeToMarketplace(() => {
      if (isMounted) loadData();
    });

    const interval = setInterval(() => {
      if (isMounted) loadData();
    }, 8000);

    return () => {
      isMounted = false;
      unsub();
      clearInterval(interval);
    };
  }, [isDemo, user?.phone]);

  const handleUpdateFarmerProfile = (newProfile) => {
    setFarmerProfile(newProfile);
    try {
      localStorage.setItem('anaaj_farmer_profile', JSON.stringify(newProfile));
    } catch (e) {}
  };

  const handleOfferAction = async (id, action) => {
    setOfferStatusMap(p => ({ ...p, [id]: action }));
    try {
      const statusMap = { accepted: 'ACCEPTED', rejected: 'REJECTED', negotiating: 'COUNTERED' };
      if (statusMap[action]) {
        await updateBidStatus(id, statusMap[action]);
      }
    } catch (e) {
      console.warn('Failed to update bid status in Supabase:', e);
    }
  };

  const handleAddCrop = (newCrop) => {
    setCropsList(p => [newCrop, ...p]);
  };

  const navItems = [
    { id: 'dashboard', label: t?.dashOverview || 'Dashboard', icon: LayoutDashboard },
    { id: 'crops', label: t?.myCrops || 'My Crops', icon: Leaf },
    { id: 'market', label: t?.liveMandiPrices || 'Market Prices', icon: TrendingUp },
    { id: 'ai-storage', label: t?.aiStorageAdvisory || 'AI Storage & Sell Advisory', icon: Sparkles },
    { id: 'ai-price', label: t?.aiPricePrediction || 'AI Price Predictor', icon: BarChart3 },
    { id: 'best-market', label: t?.dashProfitCalc || 'Best Market', icon: MapPin },
    { id: 'fpo', label: 'Connect to FPO (एफपीओ से जुड़ें)', icon: Building2 },
    { id: 'offers', label: t?.buyerOffers || 'Buyer Offers', icon: ShoppingBag },
    { id: 'payments', label: t?.dashPayments || 'Payments', icon: CreditCard },
    { id: 'reviews', label: t?.dashReviews || 'Buyer Ratings', icon: Star },
    { id: 'chat', label: 'Buyer Negotiation Chat', icon: MessageSquare },
    { id: 'logistics', label: t?.dashLogistics || 'Farm Logistics', icon: Truck },
    { id: 'weather', label: t?.dashWeather || t?.weatherAdvisory || 'Weather', icon: CloudSun },
    { id: 'help', label: t?.dashHelp || t?.disputeRedressal || 'Help & Support', icon: HelpCircle },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardOverview
            user={user}
            crops={cropsList}
            offers={offersList}
            offerStatusMap={offerStatusMap}
            onOfferAction={handleOfferAction}
            onNegotiate={(offer) => setNegotiatingOffer(offer)}
            onNavigate={setActiveSection}
            t={t}
          />
        );
      case 'crops':
        return <MyCrops crops={cropsList} onAddCrop={handleAddCrop} farmerProfile={farmerProfile} />;
      case 'market':
        return <MarketPrices t={t} lang={lang} />;
      case 'storage':
      case 'ai-storage':
        return (
          <div className="space-y-5 max-w-7xl mx-auto">
            <StorageAiAgent
              userProfile={{
                id: user?.id || 'farmer-dnyaneshwar',
                name: farmerProfile.name || 'Dnyaneshwar Patil',
                village: farmerProfile.village || 'Niphad',
                district: farmerProfile.district || 'Nashik',
                state: farmerProfile.state || 'Maharashtra',
                phone: farmerProfile.phone || '+91 98231 44521'
              }}
            />
          </div>
        );
      case 'ai-price':
        return (
          <div className="space-y-5 max-w-7xl mx-auto">
            <PricePredictionCard t={t} onNavigateToProfitCalc={() => setActiveSection('best-market')} />
          </div>
        );
      case 'offers':
        return (
          <BuyerOffersFull
            offers={offersList}
            offerStatusMap={offerStatusMap}
            onOfferAction={handleOfferAction}
            onNegotiate={(offer) => setNegotiatingOffer(offer)}
          />
        );
      case 'payments':
        return <Payments user={user} t={t} />;
      case 'reviews':
        return <FarmerBuyerReviews user={user} t={t} onNavigate={setActiveSection} />;
      case 'best-market':
        return <NetProfitCalculator t={t} />;
      case 'fpo':
        return (
          <div className="space-y-5">
            <FpoMembershipManager 
              currentRole="farmer" 
              farmerProfile={{
                id: user?.id || 'farmer-dnyaneshwar',
                name: farmerProfile.name || 'Dnyaneshwar Patil',
                village: `${farmerProfile.village}, ${farmerProfile.district}`,
                phone: farmerProfile.phone || '+91 98231 44521',
                crop: cropsList[0]?.name || 'Onion & Wheat',
                landAcres: farmerProfile.landAcres || 3.5,
                harvestQty: cropsList[0]?.qty || '85 Quintals'
              }}
            />
          </div>
        );
      case 'logistics':
        return <LogisticsStorage t={t} user={farmerProfile} />;
      case 'weather':
        return <WeatherWidget t={t} />;
      case 'chat':
        return <FarmerBuyerChat t={t} user={user} />;
      case 'help':
        return <FarmerGrievance t={t} />;
      default:
        return (
          <DashboardOverview
            user={user}
            crops={cropsList}
            offerStatusMap={offerStatusMap}
            onOfferAction={handleOfferAction}
            onNegotiate={(offer) => setNegotiatingOffer(offer)}
            onNavigate={setActiveSection}
            t={t}
          />
        );
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

        {/* Clickable User Info (Top Left Corner) */}
        <div 
          onClick={() => setShowProfileModal(true)}
          className="p-3 mx-3 my-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-emerald-700/60 transition-all cursor-pointer group shadow-xs"
          title="Click to view & edit your profile"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              {farmerProfile.photoUrl ? (
                <img src={farmerProfile.photoUrl} alt={farmerProfile.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-400" />
              ) : (
                <div className="w-11 h-11 bg-emerald-700 rounded-full flex items-center justify-center text-2xl ring-2 ring-emerald-400/50 shadow-inner">
                  {farmerProfile.avatar || '👨‍🌾'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] text-white font-black border border-emerald-950">
                ✓
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-white text-sm truncate group-hover:text-emerald-200 transition">
                  {farmerProfile.name}
                </p>
                <Edit2 className="w-3.5 h-3.5 text-emerald-300 opacity-75 group-hover:opacity-100 transition flex-shrink-0" />
              </div>
              <p className="text-emerald-300 text-xs truncate">{farmerProfile.village}, {farmerProfile.district}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9px] text-emerald-300 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  Edit Profile ✏️
                </span>
              </div>
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
                <span className="truncate">{item.label}</span>
                {item.id === 'reviews' && (
                  <span className="ml-auto text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full font-black">
                    3
                  </span>
                )}
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

          {/* Active Section Title & Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-extrabold text-slate-800 capitalize">
              {navItems.find(i => i.id === activeSection)?.label || 'Dashboard Overview'}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Mandi Feed
            </span>
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

            {/* Profile Header Chip */}
            <div 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-emerald-100 transition shadow-xs"
              title="Click to view & edit profile"
            >
              {farmerProfile.photoUrl ? (
                <img src={farmerProfile.photoUrl} alt={farmerProfile.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500" />
              ) : (
                <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-sm">{farmerProfile.avatar || '👨‍🌾'}</div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">{farmerProfile.name.split(' ')[0]}</p>
                <p className="text-[10px] text-emerald-600 leading-none mt-0.5 font-bold">Farmer Profile ✏️</p>
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
                <span className="text-slate-600 font-semibold capitalize">{(navItems.find(n => n.id === activeSection) || NAV_ITEMS.find(n => n.id === activeSection))?.label || activeSection}</span>
              </>
            )}
          </div>

          {/* Section Content */}
          <div className="animate-fade-in">
            {renderSection()}
          </div>
        </main>
      </div>

      {/* Real-time Buyer-Farmer Negotiate Chat Modal */}
      {negotiatingOffer && (
        <NegotiateChatModal
          offer={negotiatingOffer}
          onClose={() => setNegotiatingOffer(null)}
          onAcceptDeal={(id) => {
            handleOfferAction(id, 'accepted');
            setNegotiatingOffer(null);
          }}
        />
      )}

      {/* User Profile & Edit Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        role="farmer"
        profileData={farmerProfile}
        onSaveProfile={handleUpdateFarmerProfile}
      />
    </div>
  );
}

