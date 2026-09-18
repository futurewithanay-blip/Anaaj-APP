import React, { useState, useEffect } from 'react';
import {
  Star, CheckCircle2, Clock, AlertTriangle, ShieldCheck,
  CreditCard, Scale, Truck, ThumbsUp, MessageSquare, ChevronRight,
  Filter, Search, ArrowUpRight, Sparkles, Building2, Calendar,
  Award, X, Send, Layers, FileCheck, DollarSign, Users, Briefcase
} from 'lucide-react';

// Sample pending bulk orders awaiting FPO review
const INITIAL_FPO_PENDING_BUYERS = [
  {
    orderId: 'ORD-901',
    buyer: 'Reliance Retail Wholesale',
    company: 'Reliance Agri Bulk Sourcing Ltd',
    crop: 'Onion (Red Nasik Aggregation)',
    qty: '500 Quintal (50 MT)',
    amount: '₹12,50,000',
    date: '29 Aug 2026',
    fleetDispatched: '2x 14-Wheeler Multi-Axle Trucks',
    dispatchHub: 'Dindori FPO Aggregation Center, Nashik',
    avatar: '🏢',
    status: 'Consignment Delivered'
  },
  {
    orderId: 'ORD-902',
    buyer: 'BigBasket Institutional Wholesale',
    company: 'Supermarket Grocery Wholesale Desk',
    crop: 'Wheat (Sharbati A+)',
    qty: '200 Quintal (20 MT)',
    amount: '₹4,30,000',
    date: '24 Aug 2026',
    fleetDispatched: '1x 10-Wheeler Truck',
    dispatchHub: 'Yeola Central Collection Yard',
    avatar: '🛒',
    status: 'Consignment Delivered'
  },
  {
    orderId: 'BL-003',
    buyer: 'Adani Wilmar Agri Sourcing',
    company: 'Adani Wilmar Ltd (Edible Oil & Grains)',
    crop: 'Soybean (JS-335 Grade A)',
    qty: '600 Quintal (60 MT)',
    amount: '₹28,80,000',
    date: '03 Sep 2026',
    fleetDispatched: '3x Heavy Commercial Trucks',
    dispatchHub: 'Pimpalgaon CA Storage Terminal',
    avatar: '🌾',
    status: 'Consignment Delivered'
  }
];

// Sample past bulk reviews submitted by the FPO
const INITIAL_FPO_PAST_REVIEWS = [
  {
    id: 'REV-FPO-201',
    orderId: 'BL-001',
    buyer: 'ITC Agri Business Desk',
    company: 'ITC Limited (Choupal Saagar Bulk Procurement)',
    crop: 'Lokwan Wheat • 1,000 Quintal (100 MT)',
    amount: '₹25,00,000',
    date: '16 Aug 2026',
    overallRating: 4.9,
    ratings: {
      payment: 5,     // Payment Reliability & Escrow Release
      contract: 5,    // Bulk Contract Fulfillment & Fair Dealing
      logistics: 4.8  // Timely Bulk Pickup & Vehicle Dispatch
    },
    comment: 'Outstanding institutional buyer! 1,000 Quintals lifted seamlessly across 4 multi-axle trailers. Moisture tested via standard calibrated NIR sensor in FPO lab with zero arbitrary deductions. Full ₹25 Lakh escrow released in 6 hours.',
    tags: ['💰 Swift Escrow Payout', '🚛 Fleet On Schedule', '🌾 Zero Dockage', '📄 Transparent Moisture QA'],
    recommended: true,
    verifiedBadge: true
  },
  {
    id: 'REV-FPO-202',
    orderId: 'ORD-884',
    buyer: 'Britannia Agro Sourcing',
    company: 'Britannia Industries Ltd',
    crop: 'Sharbati Wheat • 400 Quintal (40 MT)',
    amount: '₹9,20,000',
    date: '04 Aug 2026',
    overallRating: 4.7,
    ratings: {
      payment: 5,
      contract: 4.5,
      logistics: 4.7
    },
    comment: 'Procured 400 Quintals for biscuit manufacturing unit. Punctual fleet arrival at warehouse dock. Minor delay in sampling lab report but payment was remitted immediately thereafter.',
    tags: ['💰 Swift Escrow Payout', '🤝 Contract Honored', '⚖️ Certified Weighbridge'],
    recommended: true,
    verifiedBadge: true
  }
];

// Corporate institutional buyer trust directory
const CORPORATE_BUYER_SCORECARD = [
  {
    name: 'ITC Agri Business',
    type: 'FMCG Conglomerate',
    score: 4.9,
    paymentScore: 5.0,
    contractScore: 4.9,
    logisticsScore: 4.8,
    bulkVolume: '14,200 MT Procured',
    avgPayout: 'Within 6 Hours',
    verified: true
  },
  {
    name: 'Reliance Retail Wholesale',
    type: 'National Retail Network',
    score: 4.8,
    paymentScore: 4.9,
    contractScore: 4.8,
    logisticsScore: 4.7,
    bulkVolume: '22,500 MT Procured',
    avgPayout: 'Within 12 Hours',
    verified: true
  },
  {
    name: 'Adani Wilmar',
    type: 'Agro-Processing & Grains',
    score: 4.7,
    paymentScore: 4.8,
    contractScore: 4.7,
    logisticsScore: 4.6,
    bulkVolume: '18,800 MT Procured',
    avgPayout: 'Same Day',
    verified: true
  },
  {
    name: 'BigBasket Wholesale',
    type: 'Enterprise Quick Commerce',
    score: 4.7,
    paymentScore: 4.8,
    contractScore: 4.6,
    logisticsScore: 4.7,
    bulkVolume: '8,400 MT Procured',
    avgPayout: 'Within 24 Hours',
    verified: true
  }
];

const BULK_TAGS = [
  '💰 Swift Escrow Payout',
  '🚛 Multi-Axle Fleet On Time',
  '🌾 Zero Unfair Rejection',
  '📄 Transparent Moisture QA',
  '🤝 Long-Term Contract Partner',
  '🛡️ 100% Contract Honored',
  '⚖️ Certified Weighbridge Used',
  '📦 Bulk Crates & Pallets Provided',
  '📞 Excellent Procurement Team'
];

export default function FpoBuyerReviews({ user, t, onNavigate }) {
  // Local state persisted in localStorage
  const [pendingBuyers, setPendingBuyers] = useState(() => {
    try {
      const saved = localStorage.getItem('anaaj_fpo_pending_reviews');
      return saved ? JSON.parse(saved) : INITIAL_FPO_PENDING_BUYERS;
    } catch (e) {
      return INITIAL_FPO_PENDING_BUYERS;
    }
  });

  const [pastReviews, setPastReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('anaaj_fpo_past_reviews');
      return saved ? JSON.parse(saved) : INITIAL_FPO_PAST_REVIEWS;
    } catch (e) {
      return INITIAL_FPO_PAST_REVIEWS;
    }
  });

  // Modal State
  const [selectedBulkOrder, setSelectedBulkOrder] = useState(null);
  const [paymentRating, setPaymentRating] = useState(5);
  const [contractRating, setContractRating] = useState(5);
  const [logisticsRating, setLogisticsRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [selectedTags, setSelectedTags] = useState(['💰 Swift Escrow Payout', '🌾 Zero Unfair Rejection']);
  const [recommendBuyer, setRecommendBuyer] = useState(true);
  const [successToast, setSuccessToast] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'history' | 'directory'

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('anaaj_fpo_pending_reviews', JSON.stringify(pendingBuyers));
    } catch (e) {}
  }, [pendingBuyers]);

  useEffect(() => {
    try {
      localStorage.setItem('anaaj_fpo_past_reviews', JSON.stringify(pastReviews));
    } catch (e) {}
  }, [pastReviews]);

  // Calculate dynamic average
  const calculatedOverall = ((paymentRating + contractRating + logisticsRating) / 3).toFixed(1);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleOpenRatingModal = (order) => {
    setSelectedBulkOrder(order);
    setPaymentRating(5);
    setContractRating(5);
    setLogisticsRating(5);
    setCommentText('');
    setSelectedTags(['💰 Swift Escrow Payout', '🌾 Zero Unfair Rejection', '🚛 Multi-Axle Fleet On Time']);
    setRecommendBuyer(true);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!selectedBulkOrder) return;

    const newReview = {
      id: `REV-FPO-${Date.now()}`,
      orderId: selectedBulkOrder.orderId,
      buyer: selectedBulkOrder.buyer,
      company: selectedBulkOrder.company,
      crop: `${selectedBulkOrder.crop} • ${selectedBulkOrder.qty}`,
      amount: selectedBulkOrder.amount,
      date: 'Just Now',
      overallRating: parseFloat(calculatedOverall),
      ratings: {
        payment: paymentRating,
        contract: contractRating,
        logistics: logisticsRating
      },
      comment: commentText || 'Smooth bulk transaction. The buyer honored the agreed contract and dispatched transport on time.',
      tags: selectedTags,
      recommended: recommendBuyer,
      verifiedBadge: true
    };

    setPastReviews(prev => [newReview, ...prev]);
    setPendingBuyers(prev => prev.filter(p => p.orderId !== selectedBulkOrder.orderId));

    const buyerName = selectedBulkOrder.buyer;
    setSelectedBulkOrder(null);
    setSuccessToast(`Bulk rating for ${buyerName} published! FPO cooperatives across the state can now see this trust scorecard.`);
    setActiveTab('history');

    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  // Helper star rating renderer
  const renderInteractiveStars = (val, setVal) => {
    return (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => setVal(star)}
            className="p-1 hover:scale-115 transition-transform cursor-pointer focus:outline-none"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                star <= val
                  ? 'text-amber-500 fill-amber-500 drop-shadow-xs'
                  : 'text-slate-200 fill-slate-100 hover:text-amber-200'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 font-black text-sm text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
          {val}.0
        </span>
      </div>
    );
  };

  const renderDisplayStars = (rating) => {
    const full = Math.floor(rating);
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <Star
            key={s}
            className={`w-4 h-4 ${
              s <= full
                ? 'text-amber-500 fill-amber-500'
                : 'text-slate-200 fill-slate-100'
            }`}
          />
        ))}
        <span className="ml-1.5 font-black text-xs text-slate-800">{rating}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {successToast && (
        <div className="bg-amber-600 text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-amber-200 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-amber-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-amber-950 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -bottom-10 opacity-10 pointer-events-none">
          <Briefcase className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-amber-200 text-xs font-black uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            FPO Collective Bargaining & Buyer Accountability
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            🌾 Bulk Order Buyer Ratings & Reviews (थोक खरीदार मूल्यांकन)
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Rate institutional buyers who procured your aggregated bulk lots. Score them on <strong className="text-white">Escrow Payment Speed</strong>, <strong className="text-white">Bulk Contract Fulfillment</strong>, and <strong className="text-white">Fleet Dispatch & Pickup</strong>.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-amber-700/60">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-amber-200 font-semibold">Pending Bulk Reviews</p>
              <p className="text-2xl font-black text-amber-300 mt-0.5">{pendingBuyers.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-amber-200 font-semibold">Bulk Consignments Rated</p>
              <p className="text-2xl font-black text-white mt-0.5">{pastReviews.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-amber-200 font-semibold">Bulk Volume Evaluated</p>
              <p className="text-2xl font-black text-amber-200 mt-0.5">2,700 Q</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-amber-200 font-semibold">Escrow Settlement Rate</p>
              <p className="text-2xl font-black text-white mt-0.5">100%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeTab === 'pending'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Bulk Reviews</span>
          {pendingBuyers.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
              activeTab === 'pending' ? 'bg-amber-950 text-amber-300' : 'bg-amber-100 text-amber-800'
            }`}>
              {pendingBuyers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeTab === 'history'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Past Bulk Reviews ({pastReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeTab === 'directory'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Institutional Buyer Scorecard</span>
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 1: PENDING BULK REVIEWS
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-800">
                📦 Institutional Buyers with Delivered Bulk Consignments
              </h2>
              <p className="text-xs text-slate-500">
                These buyers have completed bulk orders. Rate their contract fulfillment, payment release, and fleet logistics.
              </p>
            </div>
          </div>

          {pendingBuyers.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
                🤝
              </div>
              <p className="font-bold text-slate-700 text-base">All Bulk Buyers Rated!</p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                No pending bulk reviews. As soon as another corporate buyer completes pickup and escrow payment for an aggregated lot, they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingBuyers.map(order => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
                          {order.avatar}
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-sm leading-tight">
                            {order.buyer}
                          </h3>
                          <p className="text-[11px] text-slate-500 truncate max-w-[170px]">
                            {order.company}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {order.status}
                      </span>
                    </div>

                    {/* Bulk Contract Specs */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 mb-4 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Bulk Lot ID:</span>
                        <span className="font-mono font-bold text-slate-700">{order.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Commodity & Volume:</span>
                        <span className="font-bold text-slate-900">{order.crop}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Lot Volume:</span>
                        <span className="font-black text-amber-800 bg-amber-100/60 px-1.5 py-0.5 rounded">{order.qty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Payout Settled:</span>
                        <span className="font-black text-emerald-700 text-sm">{order.amount}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500">Vehicle Fleet:</span>
                        <span className="font-semibold text-slate-700 truncate max-w-[160px]">{order.fleetDispatched}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleOpenRatingModal(order)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Star className="w-4 h-4 text-amber-200 fill-amber-200" />
                    <span>Rate Bulk Procurement Buyer</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 2: PAST BULK REVIEWS
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-800">
              📋 FPO Collective Ratings Log ({pastReviews.length})
            </h2>
            <p className="text-xs text-slate-500">
              Verified evaluations of institutional buyers who purchased aggregated bulk lots from your FPO.
            </p>
          </div>

          <div className="space-y-4">
            {pastReviews.map(review => (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:border-amber-200 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 text-base">
                        {review.buyer}
                      </h3>
                      {review.verifiedBadge && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" /> Verified Bulk Contract
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {review.company} • Contract <span className="font-mono font-bold text-slate-700">{review.orderId}</span> ({review.crop})
                    </p>
                    <p className="text-xs font-bold text-emerald-700 mt-0.5">
                      Contract Payout: {review.amount}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span className="font-black text-lg text-slate-900">{review.overallRating}</span>
                      <span className="text-xs text-slate-400">/ 5.0</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{review.date}</span>
                  </div>
                </div>

                {/* Specific Bulk Criteria Scorecards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-3 bg-amber-50/40 rounded-xl p-3 border border-amber-100/60">
                  <div className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
                    <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Payment & Escrow Settlement
                    </span>
                    <div className="flex items-center gap-1">
                      {renderDisplayStars(review.ratings.payment)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
                    <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-blue-600" /> Bulk Contract & Moisture QA
                    </span>
                    <div className="flex items-center gap-1">
                      {renderDisplayStars(review.ratings.contract)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
                    <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-purple-600" /> Bulk Fleet Dispatch & Pickup
                    </span>
                    <div className="flex items-center gap-1">
                      {renderDisplayStars(review.ratings.logistics)}
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100 my-2.5 italic">
                  "{review.comment}"
                </div>

                {/* Tags & Recommendation */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {review.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200 shadow-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {review.recommended && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                      <ThumbsUp className="w-3 h-3" /> Recommended to FPO Co-ops
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 3: INSTITUTIONAL BUYER SCORECARD
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-800">
              🏆 Institutional Corporate Buyer Trust Scorecard
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated procurement track record from FPO networks across India for large-scale grain & commodity purchases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CORPORATE_BUYER_SCORECARD.map((corp, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 text-base">{corp.name}</h3>
                      {corp.verified && (
                        <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Enterprise Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{corp.type} • {corp.bulkVolume}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-black text-slate-900 text-base">{corp.score}</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold">{corp.avgPayout}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Escrow Settlement Speed
                    </span>
                    <span className="font-bold text-slate-800">{corp.paymentScore} / 5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-blue-600" /> Bulk Contract & Fair QA
                    </span>
                    <span className="font-bold text-slate-800">{corp.contractScore} / 5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-purple-600" /> Fleet Dispatch Punctuality
                    </span>
                    <span className="font-bold text-slate-800">{corp.logisticsScore} / 5.0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          INTERACTIVE BULK RATING MODAL (FPO rates Bulk Buyer)
      ──────────────────────────────────────────────────────────────────────── */}
      {selectedBulkOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-amber-900 to-orange-800 text-white rounded-t-3xl">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-black text-amber-300">
                  <Layers className="w-3.5 h-3.5 text-amber-300" />
                  Rate Institutional Bulk Buyer
                </div>
                <h2 className="text-lg font-black text-white">
                  Rate {selectedBulkOrder.buyer}
                </h2>
                <p className="text-xs text-amber-100">
                  Bulk Lot {selectedBulkOrder.orderId} • {selectedBulkOrder.crop} ({selectedBulkOrder.qty})
                </p>
              </div>
              <button
                onClick={() => setSelectedBulkOrder(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
              {/* Dynamic Overall Score Banner */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-900">Institutional Trust Score</p>
                  <p className="text-[11px] text-amber-700">Average of Payment Escrow, Contract Fulfillment & Logistics</p>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-black text-lg text-slate-900">{calculatedOverall}</span>
                  <span className="text-xs text-slate-400">/ 5.0</span>
                </div>
              </div>

              {/* 3 Core Bulk Criteria */}
              <div className="space-y-4">
                {/* 1. Payment Reliability & Escrow Release */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        1. Payment Reliability & Escrow Release (भुगतान व एस्क्रो) *
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Was the bulk consignment payout (RTGS/Escrow) released promptly as per contractual terms?
                      </p>
                    </div>
                  </div>
                  {renderInteractiveStars(paymentRating, setPaymentRating)}
                  <div className="text-[11px] font-semibold text-emerald-700 mt-1">
                    {paymentRating === 5 && '✓ Full bulk escrow released within hours of weighment'}
                    {paymentRating === 4 && '✓ Payment cleared within standard 24-hour cycle'}
                    {paymentRating === 3 && '• Minor delay in finance approval (2-3 days)'}
                    {paymentRating === 2 && '⚠ Delayed payment or dispute over bank remittance'}
                    {paymentRating === 1 && '❌ Unacceptable delay in bulk settlement'}
                  </div>
                </div>

                {/* 2. Bulk Contract Fulfillment & Fair Dealing */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-blue-600" />
                        2. Contract Fulfillment & Fair Dealing (अनुबंध पूर्ति व गुणवत्ता जांच) *
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Did the buyer adhere to agreed bulk rate and conduct fair, transparent moisture & grade testing without mass dockage?
                      </p>
                    </div>
                  </div>
                  {renderInteractiveStars(contractRating, setContractRating)}
                  <div className="text-[11px] font-semibold text-blue-700 mt-1">
                    {contractRating === 5 && '✓ 100% contract rate honored, zero arbitrary dockage'}
                    {contractRating === 4 && '✓ Fair lab sampling and professional assessment'}
                    {contractRating === 3 && '• Standard quality adjustments without major disputes'}
                    {contractRating === 2 && '⚠ Attempted price renegotiation after trucks arrived'}
                    {contractRating === 1 && '❌ Unfair mass rejection of acceptable grade commodity'}
                  </div>
                </div>

                {/* 3. Timely Bulk Pickup & Fleet Dispatch */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-purple-600" />
                        3. Timely Fleet Dispatch & Pickup (वाहन फ्लीट व उठाव समयबद्धता) *
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Did the corporate buyer dispatch multi-axle trucks on schedule and lift the consignment swiftly?
                      </p>
                    </div>
                  </div>
                  {renderInteractiveStars(logisticsRating, setLogisticsRating)}
                  <div className="text-[11px] font-semibold text-purple-700 mt-1">
                    {logisticsRating === 5 && '✓ Entire fleet arrived on schedule with zero dock clogging'}
                    {logisticsRating === 4 && '✓ Trucks arrived on designated dispatch dates'}
                    {logisticsRating === 3 && '• Minor staggering in vehicle arrival'}
                    {logisticsRating === 2 && '⚠ Significant fleet delay, blocking warehouse bays'}
                    {logisticsRating === 1 && '❌ Cancelled or severely delayed transport trucks'}
                  </div>
                </div>
              </div>

              {/* Quick Bulk Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Key Bulk Procurement Highlights (Click to select)
                </label>
                <div className="flex flex-wrap gap-2">
                  {BULK_TAGS.map(tag => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                          active
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Written Review */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  FPO Evaluation Notes (अन्य FPO के लिए राय)
                </label>
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  rows={3}
                  placeholder="Share details about weighbridge experience, payment speed, or lab test fairness..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none bg-slate-50/50"
                />
              </div>

              {/* Recommendation Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <ThumbsUp className={`w-4 h-4 ${recommendBuyer ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold text-slate-800">
                    Recommend this corporate buyer to other FPO cooperatives?
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recommendBuyer}
                    onChange={e => setRecommendBuyer(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBulkOrder(null)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Bulk Rating ({calculatedOverall} ⭐)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
