import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Sparkles,
  Send,
  AlertCircle,
  FileText,
  MapPin,
  Check,
  X,
  Search,
  Filter,
  Phone,
  ArrowRight,
  ShieldCheck,
  Layers,
  Award,
  ChevronRight,
  UserCheck,
  Eye,
  Navigation,
  SlidersHorizontal
} from 'lucide-react';
import fpoMembershipService, { SEED_FPOS } from '../../services/fpoMembershipService';
import confetti from 'canvas-confetti';
import KisanAwaazTrigger from '../kisanAwaaz/KisanAwaazTrigger';
import { FORM_FPO_JOIN } from '../kisanAwaaz/KisanAwaazConfig';
import VoiceInputMic from '../kisanAwaaz/mode1/VoiceInputMic';

export default function FpoMembershipManager({
  currentRole = 'fpo',
  farmerProfile = {
    id: 'farmer-dnyaneshwar',
    name: 'Dnyaneshwar Patil',
    village: 'Niphad, Nashik',
    phone: '+91 98231 44521',
    crop: 'Onion & Wheat',
    landAcres: 3.5,
    harvestQty: '85 Quintals'
  }
}) {
  const [requests, setRequests] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState(currentRole === 'fpo' ? 'pending-requests' : 'search-fpos');

  // Search & Filter state for Farmer connecting to FPOs
  const [fpoSearchQuery, setFpoSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');
  // Maximum distance filter for nearby search (default to 20 km as requested)
  const [maxDistance, setMaxDistance] = useState(20);
  const [selectedFpoForRequest, setSelectedFpoForRequest] = useState(null); // Modal state
  const [customMessage, setCustomMessage] = useState('');
  const [customHarvestQty, setCustomHarvestQty] = useState(farmerProfile.harvestQty || '85 Quintals');

  // Detail Modal for FPO viewing full farmer profile of a request
  const [viewingFarmerProfileReq, setViewingFarmerProfileReq] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = () => {
    setRequests(fpoMembershipService.getJoinRequests());
    setMemberships(fpoMembershipService.getMemberships());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = fpoMembershipService.subscribe(() => {
      loadData();
    });
    return () => unsubscribe();
  }, []);

  // Filter FPOs based on search query, selected crop, and distance radius (default max 20km)
  const filteredFpos = useMemo(() => {
    return SEED_FPOS.filter(fpo => {
      const matchesSearch =
        fpo.name.toLowerCase().includes(fpoSearchQuery.toLowerCase()) ||
        fpo.district.toLowerCase().includes(fpoSearchQuery.toLowerCase()) ||
        fpo.state.toLowerCase().includes(fpoSearchQuery.toLowerCase()) ||
        fpo.village.toLowerCase().includes(fpoSearchQuery.toLowerCase()) ||
        fpo.primaryCrops.some(c => c.toLowerCase().includes(fpoSearchQuery.toLowerCase()));

      const matchesCrop = selectedCropFilter === 'ALL' || fpo.primaryCrops.some(c => c.toLowerCase().includes(selectedCropFilter.toLowerCase()));

      const matchesDistance = maxDistance === 'ALL' || fpo.distanceKm <= Number(maxDistance);

      return matchesSearch && matchesCrop && matchesDistance;
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [fpoSearchQuery, selectedCropFilter, maxDistance]);

  // Actions for FPO Admin
  const handleAccept = async (reqId) => {
    try {
      await fpoMembershipService.respondToRequest(reqId, 'accepted', 'Approved by FPO Executive Committee. Allotted member share.');
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      setSuccessMsg('Request accepted! Farmer is now an active member in the aggregation pool (Synced to Supabase).');
      setViewingFarmerProfileReq(null);
      loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.warn('Accept error:', err);
    }
  };

  const handleReject = async (reqId) => {
    const reason = prompt('Optional rejection note (e.g. Outside cluster boundary):') || 'Outside operational cluster';
    try {
      await fpoMembershipService.respondToRequest(reqId, 'rejected', reason);
      setViewingFarmerProfileReq(null);
      setSuccessMsg('Request marked as declined in Supabase.');
      loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.warn('Reject error:', err);
    }
  };

  // Farmer sends join request to selected FPO
  const handleSendJoinRequest = async (e) => {
    e.preventDefault();
    if (!selectedFpoForRequest) return;
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      await fpoMembershipService.createJoinRequest({
        farmer_id: farmerProfile.id,
        farmer_name: farmerProfile.name,
        farmer_village: farmerProfile.village,
        farmer_phone: farmerProfile.phone,
        farmer_crop: farmerProfile.crop,
        land_acres: farmerProfile.landAcres,
        harvest_qty: customHarvestQty,
        fpo_id: selectedFpoForRequest.id,
        fpo_name: selectedFpoForRequest.name,
        message: customMessage || `I have ${customHarvestQty} of ${farmerProfile.crop} ready for pooling and wish to join ${selectedFpoForRequest.name}.`
      });

      setSuccessMsg(`Connection request sent to ${selectedFpoForRequest.name} successfully! Synced to Supabase database.`);
      setSelectedFpoForRequest(null);
      setCustomMessage('');
      setActiveSubTab('my-requests');
      loadData();
      confetti({ particleCount: 40, spread: 50 });
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const myFarmerRequests = requests.filter(r => r.farmer_id === farmerProfile.id || r.farmer_phone === farmerProfile.phone);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
      
      {/* ─── Top Banner & Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1.5 bg-amber-100 text-amber-900 rounded-lg">
              <Building2 className="w-4 h-4 text-amber-700" />
            </span>
            <h3 className="font-black text-lg text-slate-900 font-heading flex items-center gap-2">
              <span>
                {currentRole === 'fpo' 
                  ? 'FPO Farmer Membership & Join Requests Desk' 
                  : 'Connect with Nearby FPOs (किसान उत्पादक संगठन से जुड़ें)'}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                ⚡ Live Supabase
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentRole === 'fpo' 
              ? 'Receive real-time join applications from local farmers, inspect full profile details, and approve/decline membership.'
              : 'Discover certified FPOs in your district, view collective pooling facilities, and send real-time connection requests.'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start">
          {currentRole === 'fpo' ? (
            <>
              <button
                onClick={() => setActiveSubTab('pending-requests')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeSubTab === 'pending-requests'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Incoming Join Requests ({pendingRequests.length})
              </button>
              <button
                onClick={() => setActiveSubTab('active-members')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeSubTab === 'active-members'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active Member Roster ({memberships.length})
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveSubTab('search-fpos')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeSubTab === 'search-fpos'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Search className="w-3 h-3 text-amber-600" />
                <span>Find Nearby FPOs</span>
              </button>
              <button
                onClick={() => setActiveSubTab('my-requests')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeSubTab === 'my-requests'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Applications ({myFarmerRequests.length})
              </button>
              <button
                onClick={() => setActiveSubTab('my-memberships')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeSubTab === 'my-memberships'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active Memberships
              </button>
            </>
          )}
        </div>
      </div>

      {/* Alert Messages */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ─── TAB 1 (FARMER): Search & Connect to Nearby FPOs ─────────────────── */}
      {activeSubTab === 'search-fpos' && (
        <div className="space-y-5">
          
          {/* Search Bar & Crop Filter Chips */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={fpoSearchQuery}
                onChange={(e) => setFpoSearchQuery(e.target.value)}
                placeholder="Search FPO by name, district (e.g. Nashik, Niphad, Dindori), or crop..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['ALL', 'Onion', 'Wheat', 'Soybean', 'Cotton', 'Pulses'].map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCropFilter(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedCropFilter === c
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* ─── Nearby Distance Radius Selector (Max 20km Default) ───────────── */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Navigation className="w-4 h-4 text-emerald-700" />
                </span>
                <div>
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                    Nearby Search Radius (निकटता दायरा):
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    Max range for nearby suggestions is <strong className="font-extrabold text-emerald-900">20 km</strong>. Adjust below if needed.
                  </p>
                </div>
              </div>

              {/* Active radius badge */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-700 text-white shadow-xs flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Max {maxDistance === 'ALL' ? 'Unlimited' : `${maxDistance} km`}</span>
                </span>
              </div>
            </div>

            {/* Quick Distance Presets & Slider */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-emerald-200/70">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMaxDistance(20)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer ${
                    maxDistance === 20
                      ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-500/50'
                      : 'bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  <span>📍 ≤ 20 km (Nearby Recommended)</span>
                  {maxDistance === 20 && <Check className="w-3 h-3 ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setMaxDistance(10)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    maxDistance === 10
                      ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-500/50'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>≤ 10 km (Hyperlocal)</span>
                  {maxDistance === 10 && <Check className="w-3 h-3 ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setMaxDistance(30)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    maxDistance === 30
                      ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-500/50'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>≤ 30 km</span>
                  {maxDistance === 30 && <Check className="w-3 h-3 ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setMaxDistance('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    maxDistance === 'ALL'
                      ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-500/50'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>Show All Distances</span>
                  {maxDistance === 'ALL' && <Check className="w-3 h-3 ml-0.5" />}
                </button>
              </div>

              {/* Slider for fine adjustment */}
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-emerald-200">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-bold text-slate-700">Radius:</span>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={maxDistance === 'ALL' ? 50 : maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-24 accent-emerald-700 cursor-pointer"
                />
                <span className="font-extrabold text-emerald-900 w-12 text-right">
                  {maxDistance === 'ALL' ? 'All' : `${maxDistance} km`}
                </span>
              </div>
            </div>

            {/* Results count indicator */}
            <div className="text-[11px] text-emerald-900 font-semibold flex items-center justify-between pt-1">
              <span>
                Found <strong>{filteredFpos.length}</strong> FPO{filteredFpos.length === 1 ? '' : 's'} within {maxDistance === 'ALL' ? 'all distances' : `≤ ${maxDistance} km`} of your farm ({farmerProfile.village || 'Niphad, Nashik'})
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                Sorted by nearest first
              </span>
            </div>
          </div>

          {/* FPO Cards Grid */}
          {filteredFpos.length === 0 ? (
            <div className="p-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-3">
              <MapPin className="w-10 h-10 text-slate-400 mx-auto" />
              <h5 className="font-extrabold text-sm text-slate-800">
                No FPOs found within {maxDistance === 'ALL' ? 'selected filters' : `≤ ${maxDistance} km`}
              </h5>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try widening your distance radius filter or clearing the crop search to view more collectives.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => setMaxDistance(20)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
                >
                  Reset to 20 km (Nearby Default)
                </button>
                <button
                  onClick={() => setMaxDistance('ALL')}
                  className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-300 transition cursor-pointer"
                >
                  Show All Distances
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFpos.map((fpo) => {
                // Check if farmer already has a pending or accepted request with this FPO
                const existingReq = myFarmerRequests.find(r => r.fpo_id === fpo.id);
                const isAlreadyMember = memberships.some(m => m.fpo_id === fpo.id && m.status === 'active');

                return (
                  <div
                    key={fpo.id}
                    className={`rounded-3xl border bg-white p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 ${
                      fpo.distanceKm <= 20
                        ? 'border-emerald-200 hover:border-emerald-400 ring-1 ring-emerald-500/10'
                        : 'border-slate-200 hover:border-amber-400'
                    }`}
                  >
                    <div className="space-y-3">
                      
                      {/* Distance & Rating Header */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-3 py-1 rounded-xl text-xs font-black inline-flex items-center gap-1.5 shadow-xs ${
                            fpo.distanceKm <= 20
                              ? 'bg-emerald-600 text-white shadow-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            <Navigation className="w-3.5 h-3.5" />
                            <span className="text-sm font-extrabold">{fpo.distanceKm} km</span>
                            <span className="text-[10px] font-bold opacity-90">away</span>
                          </span>

                          {fpo.distanceKm <= 20 && (
                            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                              ✓ ≤ 20km Nearby
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-black text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded-xl">
                          ★ {fpo.rating}
                        </span>
                      </div>

                      {/* Title & Location details */}
                      <div>
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Govt Registered FPO</span>
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900 font-heading mt-1.5 leading-snug">
                          {fpo.name}
                        </h4>
                        <p className="text-xs text-slate-600 flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            {fpo.village}, {fpo.district}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                            📍 {fpo.distanceKm} km from your farm
                          </span>
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {fpo.description}
                      </p>

                      {/* Transit Estimation Banner */}
                      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px]">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Estimated Transit:</span>
                        </span>
                        <span className="font-bold text-slate-800">
                          {fpo.distanceKm <= 5
                            ? '⚡ ~10-15 min (Farmgate Pickup)'
                            : fpo.distanceKm <= 10
                            ? '⚡ ~20 min (Zero Transit Loss)'
                            : fpo.distanceKm <= 20
                            ? '🚜 ~30-45 min (Same-Day Pooling)'
                            : '🚛 ~1.5+ hrs transit'}
                        </span>
                      </div>

                      {/* Crops handled */}
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {fpo.primaryCrops.map(crop => (
                          <span key={crop} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            🌾 {crop}
                          </span>
                        ))}
                      </div>

                      {/* Facilities badges */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Available Infrastructure:</span>
                        <div className="flex flex-wrap gap-1 text-[10px] text-slate-700">
                          {fpo.facilities.map((fac, idx) => (
                            <span key={idx} className="bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                              ✓ {fac}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Connection Button */}
                    <div className="pt-2 border-t border-slate-100">
                      {isAlreadyMember ? (
                        <div className="w-full py-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Connected (Active Member)</span>
                        </div>
                      ) : existingReq?.status === 'pending' ? (
                        <div className="w-full py-2 bg-amber-100 text-amber-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Request Pending Review</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedFpoForRequest(fpo)}
                          className="w-full py-2.5 bg-harvest-500 hover:bg-harvest-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Connect & Request to Join ({fpo.distanceKm} km)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ─── TAB 2 (FPO): Incoming Join Requests with Profile Details ─────────── */}
      {activeSubTab === 'pending-requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Incoming Real-time Farmer Applications ({pendingRequests.length})
            </h4>
            <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              ⚡ Real-time updates active
            </span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-bold text-slate-700 text-sm">No Pending Requests</p>
              <p className="text-xs text-slate-400 mt-0.5">When farmers find your FPO and apply to connect, their profile and crop readiness will appear here in real-time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-3xl border border-slate-200 hover:border-amber-400 bg-white transition space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 font-black flex items-center justify-center text-sm font-heading shrink-0">
                        {req.farmer_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-black text-sm text-slate-900 font-heading">{req.farmer_name}</h5>
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                            {req.farmer_village}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{req.id}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                          <span>Landholding: <strong>{req.land_acres} Acres</strong></span>
                          <span>•</span>
                          <span>Crops: <strong className="text-slate-800">{req.farmer_crop}</strong></span>
                          <span>•</span>
                          <span>Ready Volume: <strong className="text-emerald-700">{req.harvest_qty || 'Available'}</strong></span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => setViewingFarmerProfileReq(req)}
                        className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>View Profile</span>
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-3 py-2 border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Add Member</span>
                      </button>
                    </div>
                  </div>

                  {/* Message Quote */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700">
                    <span className="font-bold text-slate-500 text-[10px] uppercase block mb-0.5">Farmer Message:</span>
                    "{req.message}"
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Applied on: {new Date(req.requested_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="font-semibold text-amber-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Awaiting Board Approval
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3 (FPO): Active Member Roster ─────────────────────────────────── */}
      {activeSubTab === 'active-members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Member Farmers ({memberships.length})
            </h4>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
              Eligible for Collective Aggregation Contracts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Membership ID</th>
                  <th className="py-3 px-3">Farmer Name</th>
                  <th className="py-3 px-3">Village</th>
                  <th className="py-3 px-3">Land Holding</th>
                  <th className="py-3 px-3">Primary Crop</th>
                  <th className="py-3 px-3">Ready Harvest</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {memberships.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono text-slate-400 font-bold">{m.id}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{m.farmer_name}</td>
                    <td className="py-3 px-3">{m.village}</td>
                    <td className="py-3 px-3">{m.land_acres} Acres</td>
                    <td className="py-3 px-3 font-semibold text-amber-800">{m.crop}</td>
                    <td className="py-3 px-3 font-black text-emerald-700">{m.lot_ready_qtl || 25} Qtl</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active Member
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 4 (FARMER): Sent Requests List ──────────────────────────────── */}
      {activeSubTab === 'my-requests' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              My FPO Join Applications ({myFarmerRequests.length})
            </h4>
            <button
              onClick={() => setActiveSubTab('search-fpos')}
              className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
            >
              + Browse More FPOs
            </button>
          </div>

          {myFarmerRequests.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="font-bold text-slate-700 text-sm">No applications submitted yet</p>
              <p className="text-xs text-slate-400 mt-1">Browse verified FPOs to request connection and pooled sales.</p>
            </div>
          ) : (
            myFarmerRequests.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">{r.fpo_name}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Submitted on: {new Date(r.requested_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    r.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : r.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "{r.message}"
                </p>
                {r.response_note && (
                  <p className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                    <strong>FPO Response:</strong> {r.response_note}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── TAB 5 (FARMER): Active Memberships ──────────────────────────────── */}
      {activeSubTab === 'my-memberships' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              My Active FPO Affiliations
            </h4>
            <button
              onClick={() => setActiveSubTab('search-fpos')}
              className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
            >
              + Search Another FPO
            </button>
          </div>

          <div className="p-5 rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/40 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  ✓ Active Affiliated Member
                </span>
                <h5 className="font-extrabold text-base text-slate-900 mt-1">
                  Sahyadri Farmers Producer Co. Ltd (Nashik)
                </h5>
                <p className="text-xs text-slate-600">
                  Member ID: <strong>MEM-001 (F-101)</strong> • Allotted Shares: 10 Equity Shares
                </p>
              </div>
              <span className="text-xs font-black text-emerald-700">98% Verified</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-emerald-200 text-xs text-slate-700">
              <div>
                <span className="text-slate-500 block text-[10px]">Active Commodity Pool:</span>
                <strong className="text-slate-900">Red Onion & Soybean</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Bulk Premium Access:</span>
                <strong className="text-emerald-700">+₹120/Qtl over APMC</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Direct DBT Bank:</span>
                <strong className="text-slate-900">SBI •••• 4321</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Farmer Applying to Selected FPO ──────────────────────────── */}
      {selectedFpoForRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
                  Join Application
                </span>
                <h3 className="font-black text-slate-900 text-base font-heading mt-1">
                  Request to Join {selectedFpoForRequest.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFpoForRequest(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendJoinRequest} className="space-y-4 text-xs">

              {/* KisanAwaaz — voice pre-fill for FPO join request (additive, isolated) */}
              {/* onVoiceSubmit pre-fills state; user confirms via existing "Send Request" button */}
              <KisanAwaazTrigger
                formConfig={FORM_FPO_JOIN}
                onVoiceSubmit={(v) => {
                  if (v.customHarvestQty) setCustomHarvestQty(v.customHarvestQty);
                  if (v.customMessage)    setCustomMessage(v.customMessage);
                }}
                onPreFill={(v) => {
                  if (v.customHarvestQty) setCustomHarvestQty(v.customHarvestQty);
                  if (v.customMessage)    setCustomMessage(v.customMessage);
                }}
              />

              {/* Target FPO Summary */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-amber-950">{selectedFpoForRequest.name}</h4>
                    <p className="text-[11px] text-amber-900 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-700 shrink-0" />
                      <span>{selectedFpoForRequest.village}, {selectedFpoForRequest.district}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs inline-flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      <span>{selectedFpoForRequest.distanceKm} km away</span>
                    </span>
                    {selectedFpoForRequest.distanceKm <= 20 && (
                      <span className="block text-[10px] text-emerald-800 font-extrabold mt-0.5">
                        ✓ Within ≤20km Nearby Range
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 pt-1 border-t border-amber-200/60 text-[11px] text-amber-900">
                  <span>Primary Crops: <strong>{selectedFpoForRequest.primaryCrops.join(', ')}</strong></span>
                  <span>Turnover: <strong>{selectedFpoForRequest.annualTurnover}</strong></span>
                </div>
              </div>

              {/* Ready Harvest Volume */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ready Harvest Volume for Pooling (तैयार फसल की मात्रा) *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={customHarvestQty}
                    onChange={(e) => setCustomHarvestQty(e.target.value)}
                    placeholder="e.g. 85 Quintals / 150 Crates"
                    className="w-full pl-3.5 pr-10 py-2 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <VoiceInputMic onResult={setCustomHarvestQty} type="text" />
                </div>
              </div>

              {/* Custom Message */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Note to FPO Board & Aggregation Manager *
                </label>
                <div className="relative flex">
                  <textarea
                    required
                    rows={3}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="e.g. I have 85 Qtl Grade A Onion ready for immediate dispatch from Niphad. Requesting enrollment in next export lot."
                    className="w-full pl-3.5 pr-10 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <div className="absolute right-0 top-0 bottom-0 flex items-center pr-1 pointer-events-none">
                    <div className="pointer-events-auto">
                      <VoiceInputMic onResult={setCustomMessage} type="text" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Farmer Profile Auto-Filled Details */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1 text-slate-600">
                <span className="font-bold text-slate-500 uppercase text-[10px] block">Your Verified Profile Details:</span>
                <div className="flex justify-between">
                  <span>Farmer Name:</span>
                  <strong className="text-slate-900">{farmerProfile.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Contact Phone:</span>
                  <span className="text-slate-800">{farmerProfile.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Village / Cluster:</span>
                  <span className="text-slate-800">{farmerProfile.village}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cultivated Land:</span>
                  <span className="text-slate-800">{farmerProfile.landAcres} Acres</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedFpoForRequest(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-harvest-500 hover:bg-harvest-400 text-slate-950 font-black rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Real-Time Request</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: FPO Admin Viewing Full Farmer Profile Details ─────────────── */}
      {viewingFarmerProfileReq && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base font-heading">
                  Applicant Farmer Profile
                </h3>
              </div>
              <button
                onClick={() => setViewingFarmerProfileReq(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Identity Header */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center font-heading">
                  {viewingFarmerProfileReq.farmer_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{viewingFarmerProfileReq.farmer_name}</h4>
                  <p className="text-[11px] text-slate-500">{viewingFarmerProfileReq.farmer_village}</p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                    Aadhaar / 7-12 Verified
                  </span>
                </div>
              </div>

              {/* Profile Details List */}
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Contact Number:</span>
                  <strong className="text-slate-800">{viewingFarmerProfileReq.farmer_phone || '+91 98231 XXXXX'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Cultivable Land:</span>
                  <strong className="text-slate-800">{viewingFarmerProfileReq.land_acres} Acres</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Primary Crops:</span>
                  <strong className="text-amber-800">{viewingFarmerProfileReq.farmer_crop}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Immediate Ready Lot:</span>
                  <strong className="text-emerald-700">{viewingFarmerProfileReq.harvest_qty || 'Available for Pooling'}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Application Date:</span>
                  <span className="text-slate-700">{new Date(viewingFarmerProfileReq.requested_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Application Note */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-900 block">Farmer's Message:</span>
                <p className="italic leading-relaxed text-[11px]">"{viewingFarmerProfileReq.message}"</p>
              </div>

              {/* Actions inside modal */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleReject(viewingFarmerProfileReq.id)}
                  className="flex-1 py-2.5 border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold rounded-xl cursor-pointer"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleAccept(viewingFarmerProfileReq.id)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve & Add Member</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
