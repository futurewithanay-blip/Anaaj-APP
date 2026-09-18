import React, { useState, useEffect } from 'react';
import {
  Star, CheckCircle2, Clock, AlertTriangle, ShieldCheck,
  CreditCard, Scale, Truck, ThumbsUp, MessageSquare, ChevronRight,
  Filter, Search, ArrowUpRight, Sparkles, Building2, Calendar,
  Award, X, Send, UserCheck, AlertCircle
} from 'lucide-react';

// Initial preloaded pending orders awaiting farmer's review
const INITIAL_PENDING_BUYERS = [
  {
    orderId: 'ORD-001',
    buyer: 'Reliance Fresh',
    company: 'Reliance Retail Ltd (Agri Sourcing)',
    crop: 'Onion (Red Nasik)',
    qty: '50 Quintal',
    amount: '₹1,32,500',
    date: '28 Aug 2026',
    pickupLocation: 'Farmgate, Yeola (Nashik)',
    avatar: '🏢',
    status: 'Delivered & Paid'
  },
  {
    orderId: 'ORD-002',
    buyer: 'BigBasket Direct',
    company: 'Supermarket Grocery Supplies',
    crop: 'Wheat (Sharbati)',
    qty: '80 Quintal',
    amount: '₹1,84,000',
    date: '22 Aug 2026',
    pickupLocation: 'Pimpalgaon APMC Yard',
    avatar: '🛒',
    status: 'Delivered & Paid'
  },
  {
    orderId: 'ORD-003',
    buyer: 'Godrej Agrovet',
    company: 'Godrej Agrovet Sourcing Desk',
    crop: 'Soybean (JS-335)',
    qty: '25 Quintal',
    amount: '₹1,20,000',
    date: '02 Sep 2026',
    pickupLocation: 'Farmgate, Yeola',
    avatar: '🌿',
    status: 'Delivered & Paid'
  }
];

// Initial preloaded reviews submitted previously by this farmer
const INITIAL_PAST_REVIEWS = [
  {
    id: 'REV-F-101',
    orderId: 'ORD-098',
    buyer: 'ITC Agri Business Desk',
    company: 'ITC Limited (e-Choupal Network)',
    crop: 'Soybean (JS-335) • 40 Quintal',
    amount: '₹1,92,000',
    date: '12 Aug 2026',
    overallRating: 4.7,
    ratings: {
      payment: 5,     // Payment Reliability
      dealing: 5,     // Fair Dealing
      pickup: 4       // Timely Pickup
    },
    comment: 'Payment was released within 2 hours of digital weighment. No unfair dockage on moisture. Truck arrived with a slight 30 min delay but driver was very cooperative.',
    tags: ['⚡ Instant Escrow Release', '🤝 100% Price Honored', '⚖️ Honest Weighing'],
    recommended: true,
    verifiedBadge: true
  },
  {
    id: 'REV-F-102',
    orderId: 'ORD-085',
    buyer: 'Sahyadri Farmers Producer Hub',
    company: 'Sahyadri Agro Processing Ltd',
    crop: 'Onion (Red Nasik) • 60 Quintal',
    amount: '₹1,56,000',
    date: '25 Jul 2026',
    overallRating: 5.0,
    ratings: {
      payment: 5,
      dealing: 5,
      pickup: 5
    },
    comment: 'Exceptional buyer! Sent crate truck right to farmgate, weighed on electronic scale in front of me, and released full escrow payment without 1 rupee deduction.',
    tags: ['⚡ Instant Escrow Release', '🚚 Punctual Farmgate Pickup', '🛡️ Zero Deductions'],
    recommended: true,
    verifiedBadge: true
  }
];

// Verified buyers directory for reference
const TOP_VERIFIED_BUYERS = [
  {
    name: 'Reliance Fresh',
    category: 'Retail Giant',
    score: 4.8,
    paymentScore: 4.9,
    dealingScore: 4.8,
    pickupScore: 4.7,
    reviewsCount: 312,
    payoutSpeed: 'Within 4 Hours',
    verified: true
  },
  {
    name: 'ITC Agri Business',
    category: 'Institutional Buyer',
    score: 4.9,
    paymentScore: 5.0,
    dealingScore: 4.9,
    pickupScore: 4.8,
    reviewsCount: 524,
    payoutSpeed: 'Within 2 Hours',
    verified: true
  },
  {
    name: 'BigBasket Direct',
    category: 'E-Grocery Enterprise',
    score: 4.7,
    paymentScore: 4.8,
    dealingScore: 4.6,
    pickupScore: 4.7,
    reviewsCount: 240,
    payoutSpeed: 'Same Day',
    verified: true
  },
  {
    name: 'Godrej Agrovet',
    category: 'Agri-Processing',
    score: 4.8,
    paymentScore: 4.9,
    dealingScore: 4.8,
    pickupScore: 4.7,
    reviewsCount: 185,
    payoutSpeed: 'Within 6 Hours',
    verified: true
  }
];

const QUICK_TAGS = [
  '⚡ Instant Escrow Release',
  '🤝 100% Price Honored',
  '🚚 Punctual Farmgate Pickup',
  '⚖️ Honest Weighing',
  '🛡️ Zero Hidden Cuts',
  '📞 Polite Communication',
  '📦 Quality Crates Provided',
  '⭐ Highly Recommended'
];

export default function FarmerBuyerReviews({ user, t, onNavigate }) {
  // Local state persisted in localStorage
  const [pendingBuyers, setPendingBuyers] = useState(() => {
    try {
      const saved = localStorage.getItem('anaaj_farmer_pending_reviews');
      return saved ? JSON.parse(saved) : INITIAL_PENDING_BUYERS;
    } catch (e) {
      return INITIAL_PENDING_BUYERS;
    }
  });

  const [pastReviews, setPastReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('anaaj_farmer_past_reviews');
      return saved ? JSON.parse(saved) : INITIAL_PAST_REVIEWS;
    } catch (e) {
      return INITIAL_PAST_REVIEWS;
    }
  });

  // Modal State
  const [selectedBuyerOrder, setSelectedBuyerOrder] = useState(null);
  const [paymentRating, setPaymentRating] = useState(5);
  const [dealingRating, setDealingRating] = useState(5);
  const [pickupRating, setPickupRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [selectedTags, setSelectedTags] = useState(['⚡ Instant Escrow Release', '🤝 100% Price Honored']);
  const [recommendBuyer, setRecommendBuyer] = useState(true);
  const [successToast, setSuccessToast] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'history' | 'directory'

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('anaaj_farmer_pending_reviews', JSON.stringify(pendingBuyers));
    } catch (e) {}
  }, [pendingBuyers]);

  useEffect(() => {
    try {
      localStorage.setItem('anaaj_farmer_past_reviews', JSON.stringify(pastReviews));
    } catch (e) {}
  }, [pastReviews]);

  // Calculate dynamic average
  const calculatedOverall = ((paymentRating + dealingRating + pickupRating) / 3).toFixed(1);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleOpenRatingModal = (order) => {
    setSelectedBuyerOrder(order);
    setPaymentRating(5);
    setDealingRating(5);
    setPickupRating(5);
    setCommentText('');
    setSelectedTags(['⚡ Instant Escrow Release', '🤝 100% Price Honored']);
    setRecommendBuyer(true);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!selectedBuyerOrder) return;

    const newReview = {
      id: `REV-F-${Date.now()}`,
      orderId: selectedBuyerOrder.orderId,
      buyer: selectedBuyerOrder.buyer,
      company: selectedBuyerOrder.company,
      crop: `${selectedBuyerOrder.crop} • ${selectedBuyerOrder.qty}`,
      amount: selectedBuyerOrder.amount,
      date: 'Just Now',
      overallRating: parseFloat(calculatedOverall),
      ratings: {
        payment: paymentRating,
        dealing: dealingRating,
        pickup: pickupRating
      },
      comment: commentText || 'Satisfactory experience with this buyer. Fair dealing and timely payment.',
      tags: selectedTags,
      recommended: recommendBuyer,
      verifiedBadge: true
    };

    // Add to past reviews & remove from pending
    setPastReviews(prev => [newReview, ...prev]);
    setPendingBuyers(prev => prev.filter(p => p.orderId !== selectedBuyerOrder.orderId));

    const buyerName = selectedBuyerOrder.buyer;
    setSelectedBuyerOrder(null);
    setSuccessToast(`Thank you! Your rating for ${buyerName} has been recorded on the Anaaj Farmer Network.`);
    setActiveTab('history');

    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  // Helper star rating renderer
  const renderInteractiveStars = (val, setVal, color = 'amber') => {
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
                  ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
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
                ? 'text-amber-400 fill-amber-400'
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
        <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Banner / Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -bottom-10 opacity-10 pointer-events-none">
          <Star className="w-64 h-64 text-white fill-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-emerald-100 text-xs font-black uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            Farmer Protection & Trust Scoring
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            ⭐ Buyer Reviews & Ratings (खरीदार मूल्यांकन)
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Rate corporate buyers & traders on <strong className="text-white">Payment Reliability</strong>, <strong className="text-white">Fair Dealing</strong>, and <strong className="text-white">Timely Pickup</strong>. Your genuine feedback empowers 50,000+ farmers to identify honest, prompt buyers!
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-600/60">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-emerald-200 font-semibold">Pending Ratings</p>
              <p className="text-2xl font-black text-amber-300 mt-0.5">{pendingBuyers.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-emerald-200 font-semibold">Past Reviews Given</p>
              <p className="text-2xl font-black text-white mt-0.5">{pastReviews.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-emerald-200 font-semibold">Avg Buyer Rating</p>
              <p className="text-2xl font-black text-emerald-200 mt-0.5">4.8 / 5.0</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-emerald-200 font-semibold">Escrow Protection</p>
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
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Ratings</span>
          {pendingBuyers.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
              activeTab === 'pending' ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'
            }`}>
              {pendingBuyers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeTab === 'history'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>My Past Reviews ({pastReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeTab === 'directory'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Top Buyer Trust Index</span>
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 1: PENDING REVIEWS
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-800">
                ⏳ Completed Orders Awaiting Your Rating
              </h2>
              <p className="text-xs text-slate-500">
                Buyers whose crops have been delivered. Please rate their payment speed, honest grading, and pickup punctuality.
              </p>
            </div>
          </div>

          {pendingBuyers.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
                ✨
              </div>
              <p className="font-bold text-slate-700 text-base">All Caught Up!</p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                You have rated all completed buyers. When a new buyer finishes payment and pickup for your crop lot, they will appear here.
              </p>
              <button
                onClick={() => setActiveTab('history')}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                View Your Past Reviews
              </button>
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
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl shrink-0">
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

                    {/* Order Details */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 mb-4 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Order Ref:</span>
                        <span className="font-mono font-bold text-slate-700">{order.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Crop & Qty:</span>
                        <span className="font-bold text-slate-800">{order.crop} • {order.qty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Payout:</span>
                        <span className="font-black text-emerald-700">{order.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pickup Date:</span>
                        <span className="font-semibold text-slate-600">{order.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleOpenRatingModal(order)}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Rate This Buyer</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 2: PAST REVIEWS
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-800">
              📋 Your Past Buyer Reviews ({pastReviews.length})
            </h2>
            <p className="text-xs text-slate-500">
              Ratings and detailed performance scores you have contributed to the Anaaj marketplace.
            </p>
          </div>

          <div className="space-y-4">
            {pastReviews.map(review => (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:border-emerald-200 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 text-base">
                        {review.buyer}
                      </h3>
                      {review.verifiedBadge && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" /> Verified Deal
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {review.company} • Order <span className="font-mono font-bold text-slate-700">{review.orderId}</span> ({review.crop})
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span className="font-black text-lg text-slate-900">{review.overallRating}</span>
                      <span className="text-xs text-slate-400">/ 5.0</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{review.date}</span>
                  </div>
                </div>

                {/* Specific Criteria Scorecards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Payment Reliability
                    </span>
                    <div className="flex items-center gap-1">
                      {renderDisplayStars(review.ratings.payment)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-blue-600" /> Fair Dealing & Price
                    </span>
                    <div className="flex items-center gap-1">
                      {renderDisplayStars(review.ratings.dealing)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-purple-600" /> Timely Pickup
                    </span>
                    <div className="flex items-center gap-1">
                      {renderDisplayStars(review.ratings.pickup)}
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-emerald-50/40 rounded-xl p-3 border border-emerald-100/60 my-2.5 italic">
                  "{review.comment}"
                </div>

                {/* Tags & Recommendation */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {review.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {review.recommended && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      <ThumbsUp className="w-3 h-3" /> Recommended to other farmers
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 3: BUYER DIRECTORY / TRUST INDEX
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-800">
              🏆 Verified Buyer Trust Directory
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated reputation scores from hundreds of verified farmers across Maharashtra & MP mandis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOP_VERIFIED_BUYERS.map((buyer, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 text-base">{buyer.name}</h3>
                      {buyer.verified && (
                        <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{buyer.category} • {buyer.reviewsCount} farmer reviews</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-black text-slate-900 text-base">{buyer.score}</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold">{buyer.payoutSpeed}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Payment Reliability
                    </span>
                    <span className="font-bold text-slate-800">{buyer.paymentScore} / 5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-blue-600" /> Fair Dealing & Grading
                    </span>
                    <span className="font-bold text-slate-800">{buyer.dealingScore} / 5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-purple-600" /> Timely Pickup & Transport
                    </span>
                    <span className="font-bold text-slate-800">{buyer.pickupScore} / 5.0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          INTERACTIVE RATING MODAL (Farmer rates Buyer)
      ──────────────────────────────────────────────────────────────────────── */}
      {selectedBuyerOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-t-3xl">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-black text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  Rate Buyer
                </div>
                <h2 className="text-lg font-black text-white">
                  Rate {selectedBuyerOrder.buyer}
                </h2>
                <p className="text-xs text-emerald-100">
                  Order {selectedBuyerOrder.orderId} • {selectedBuyerOrder.crop} ({selectedBuyerOrder.qty})
                </p>
              </div>
              <button
                onClick={() => setSelectedBuyerOrder(null)}
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
                  <p className="text-xs font-bold text-amber-900">Calculated Overall Score</p>
                  <p className="text-[11px] text-amber-700">Average of Payment, Fair Dealing & Pickup</p>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-black text-lg text-slate-900">{calculatedOverall}</span>
                  <span className="text-xs text-slate-400">/ 5.0</span>
                </div>
              </div>

              {/* 3 Core Criteria Required by User Prompt */}
              <div className="space-y-4">
                {/* 1. Payment Reliability */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        1. Payment Reliability (भुगतान विश्वसनीयता) *
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Was payment released promptly through escrow without unnecessary cuts or delays?
                      </p>
                    </div>
                  </div>
                  {renderInteractiveStars(paymentRating, setPaymentRating)}
                  <div className="text-[11px] font-semibold text-emerald-700 mt-1">
                    {paymentRating === 5 && '✓ Instant & full payout released via escrow'}
                    {paymentRating === 4 && '✓ Payout received within agreed timeline'}
                    {paymentRating === 3 && '• Acceptable payment with minor delay'}
                    {paymentRating === 2 && '⚠ Delay in bank transfer or disputed deduction'}
                    {paymentRating === 1 && '❌ Severe payment delay or withheld money'}
                  </div>
                </div>

                {/* 2. Fair Dealing */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-blue-600" />
                        2. Fair Dealing (उचित व्यवहार व तौल) *
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Did the buyer respect the agreed price and do honest weighing without unfair rejections?
                      </p>
                    </div>
                  </div>
                  {renderInteractiveStars(dealingRating, setDealingRating)}
                  <div className="text-[11px] font-semibold text-blue-700 mt-1">
                    {dealingRating === 5 && '✓ 100% price honored, transparent electronic weighing'}
                    {dealingRating === 4 && '✓ Fair grading and courteous communication'}
                    {dealingRating === 3 && '• Standard dealing, minor moisture arguments'}
                    {dealingRating === 2 && '⚠ Attempted price reduction at farmgate'}
                    {dealingRating === 1 && '❌ Unfair rejection or predatory renegotiation'}
                  </div>
                </div>

                {/* 3. Timely Pickup */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-purple-600" />
                        3. Timely Pickup (समय पर उठाव व वाहन) *
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Did the buyer dispatch vehicle on schedule and handle loading smoothly?
                      </p>
                    </div>
                  </div>
                  {renderInteractiveStars(pickupRating, setPickupRating)}
                  <div className="text-[11px] font-semibold text-purple-700 mt-1">
                    {pickupRating === 5 && '✓ Punctual truck arrival, swift crate loading'}
                    {pickupRating === 4 && '✓ Vehicle arrived on agreed day'}
                    {pickupRating === 3 && '• Minor delay in truck arrival (2-4 hours)'}
                    {pickupRating === 2 && '⚠ Significant delay, made farmer wait full day'}
                    {pickupRating === 1 && '❌ Failed pickup schedule, crop quality affected'}
                  </div>
                </div>
              </div>

              {/* Quick Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Highlight Key Experiences (Click to select)
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TAGS.map(tag => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                          active
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
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
                  Detailed Feedback for Other Farmers (आपकी राय)
                </label>
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  rows={3}
                  placeholder="Share details about payment speed, weighing accuracy, or logistics..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none bg-slate-50/50"
                />
              </div>

              {/* Recommendation Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <ThumbsUp className={`w-4 h-4 ${recommendBuyer ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold text-slate-800">
                    Recommend this buyer to other farmers?
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recommendBuyer}
                    onChange={e => setRecommendBuyer(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBuyerOrder(null)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Rating ({calculatedOverall} ⭐)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
