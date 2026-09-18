import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Phone,
  ArrowRight,
  TrendingUp,
  Truck,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sliders,
  ExternalLink,
  ChevronDown,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import {
  getNearbyMandis,
  EXTENDED_GEO_MANDIS
} from '../../services/mandiLocationService';

const POPULAR_CROPS = [
  { id: 'onion', name: 'Onion (प्याज / कांदा)', icon: '🧅' },
  { id: 'wheat', name: 'Wheat (गेहूं / गहू)', icon: '🌾' },
  { id: 'soybean', name: 'Soybean (सोयाबीन)', icon: '🫘' },
  { id: 'tomato', name: 'Tomato (टमाटर / टोमॅटो)', icon: '🍅' },
  { id: 'cotton', name: 'Cotton (कपास / कापूस)', icon: '☁️' },
  { id: 'potato', name: 'Potato (आलू / बटाटा)', icon: '🥔' },
  { id: 'mustard', name: 'Mustard (सरसों / मोहरी)', icon: '🟡' },
  { id: 'chana', name: 'Chana / Gram (चना / हरभरा)', icon: '🧆' },
  { id: 'tur', name: 'Tur Dal (अरहर / तूर)', icon: '🌱' },
  { id: 'paddy', name: 'Paddy / Rice (धान / भात)', icon: '🍚' }
];

const PRESET_ORIGINS = [
  { label: 'Nashik / Yeola (Maharashtra)', lat: 20.0059, lng: 73.7898 },
  { label: 'Pune / Khed (Maharashtra)', lat: 18.5204, lng: 73.8567 },
  { label: 'Latur / Marathwada (Maharashtra)', lat: 18.4088, lng: 76.5604 },
  { label: 'Nagpur / Vidarbha (Maharashtra)', lat: 21.1458, lng: 79.0882 },
  { label: 'Prayagraj / Bundelkhand (UP)', lat: 25.4358, lng: 81.8463 },
  { label: 'Varanasi / Purvanchal (UP)', lat: 25.3176, lng: 82.9739 },
  { label: 'Lucknow / Awadh (UP)', lat: 26.8467, lng: 80.9462 },
  { label: 'Indore / Malwa (MP)', lat: 22.7196, lng: 75.8577 },
  { label: 'Sehore / Bhopal (MP)', lat: 23.2031, lng: 77.0844 },
  { label: 'Khanna / Ludhiana (Punjab)', lat: 30.7050, lng: 76.2181 },
  { label: 'Karnal / Kurukshetra (Haryana)', lat: 29.6857, lng: 76.9905 },
  { label: 'Kota / Hadoti (Rajasthan)', lat: 25.1830, lng: 75.8450 },
  { label: 'Rajkot / Saurashtra (Gujarat)', lat: 22.3039, lng: 70.8022 }
];

export default function NearbyMandiFinder({ defaultCrop = 'onion', userProfile = null, onSelectMandi = null }) {
  // Coords State: defaults to farmer's district or Nashik
  const [coords, setCoords] = useState({ lat: 20.0059, lng: 73.7898 });
  const [locationName, setLocationName] = useState('Nashik (Default Origin)');
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState('');

  // Filtering Controls
  const [selectedCrop, setSelectedCrop] = useState(defaultCrop);
  const [maxRadiusKm, setMaxRadiusKm] = useState(250);
  const [batchQuantityQtl, setBatchQuantityQtl] = useState(50);
  const [selectedMandiId, setSelectedMandiId] = useState(null);

  // Auto-align with userProfile village/district on load
  useEffect(() => {
    if (userProfile?.district) {
      const match = PRESET_ORIGINS.find(o =>
        o.label.toLowerCase().includes(userProfile.district.toLowerCase())
      );
      if (match) {
        setCoords({ lat: match.lat, lng: match.lng });
        setLocationName(`${userProfile.village || userProfile.district}, ${userProfile.district}`);
      }
    }
  }, [userProfile]);

  // Request HTML5 Browser Geolocation
  const handleDetectLiveGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser. Please choose your district manually.');
      return;
    }

    setIsDetectingGps(true);
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setCoords({ lat: userLat, lng: userLng });
        setIsGpsActive(true);
        setIsDetectingGps(false);
        setLocationName(`Live GPS (${userLat.toFixed(2)}°N, ${userLng.toFixed(2)}°E)`);

        // Reverse identify nearest district label
        let closestPreset = PRESET_ORIGINS[0];
        let minD = Infinity;
        PRESET_ORIGINS.forEach(p => {
          const d = Math.hypot(p.lat - userLat, p.lng - userLng);
          if (d < minD) {
            minD = d;
            closestPreset = p;
          }
        });
        if (minD < 1.5) {
          setLocationName(`📍 Live GPS: Near ${closestPreset.label.split('/')[0].trim()}`);
        } else {
          setLocationName(`📍 Live GPS Coordinates (${userLat.toFixed(3)}°N, ${userLng.toFixed(3)}°E)`);
        }
      },
      (error) => {
        setIsDetectingGps(false);
        setIsGpsActive(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('GPS location permission denied. You can select your district from the list below.');
        } else {
          setGpsError('Unable to acquire GPS fix. Please select your nearest district from the dropdown.');
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  // Nearby Mandis computed in real time
  const nearbyMandis = useMemo(() => {
    return getNearbyMandis({
      userLat: coords.lat,
      userLng: coords.lng,
      commodity: selectedCrop,
      maxRadiusKm,
      userQuantityQtl: batchQuantityQtl
    });
  }, [coords, selectedCrop, maxRadiusKm, batchQuantityQtl]);

  const bestMandi = nearbyMandis[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-5 p-5 sm:p-6">
      
      {/* ── HEADER & GPS STATUS BAR ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              📍
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Nearby Mandis & Real-Time Price Breakdown
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Live GPS location ke hisab se as-pass ki mandis ka distance, transit deductions aur actual <strong>Net In-Hand Munafa</strong>
          </p>
        </div>

        {/* GPS Action Button & Location Pill */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleDetectLiveGps}
            disabled={isDetectingGps}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 ${
              isGpsActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : isGpsActive ? 'fill-current' : ''}`} />
            <span>{isDetectingGps ? 'Locating via GPS...' : isGpsActive ? 'GPS Active (Re-detect)' : '📍 Use My Live GPS'}</span>
          </button>

          {/* Manual Origin Dropdown */}
          <div className="relative flex-1 md:w-60">
            <select
              value={coords.lat}
              onChange={(e) => {
                const selectedLat = parseFloat(e.target.value);
                const found = PRESET_ORIGINS.find(p => p.lat === selectedLat);
                if (found) {
                  setCoords({ lat: found.lat, lng: found.lng });
                  setLocationName(found.label);
                  setIsGpsActive(false);
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer truncate"
            >
              {PRESET_ORIGINS.map((p) => (
                <option key={p.label} value={p.lat}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* GPS Error Alert if Denied */}
      {gpsError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Current Detected Origin Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="font-bold text-emerald-950">Active Origin:</span>
          <span className="font-semibold text-emerald-800">{locationName}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-emerald-800 font-medium">
          <span>Found <strong>{nearbyMandis.length} Mandis</strong> within {maxRadiusKm} km</span>
        </div>
      </div>

      {/* ── COMMODITY CHIPS & RADIUS FILTER ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select Crop to Compare Real-time Rates:
          </span>
          {/* Radius Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[50, 100, 250, 450].map((r) => (
              <button
                key={r}
                onClick={() => setMaxRadiusKm(r)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  maxRadiusKm === r
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r === 450 ? 'All' : `${r}km`}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Scrolling Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {POPULAR_CROPS.map((c) => {
            const isSelected = selectedCrop === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCrop(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/40'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.name.split('(')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TOP RECOMMENDATION HIGHLIGHT BANNER ── */}
      {bestMandi && (
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
                🏆 Recommended Selling Point
              </span>
              <span className="text-xs text-emerald-200 font-semibold">• Highest Net Realization</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black">{bestMandi.name}</h3>
            <p className="text-xs text-emerald-100">
              {bestMandi.district}, {bestMandi.state} • <strong>{bestMandi.distanceKm} km away</strong> ({bestMandi.drivingTime} drive)
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/20 pt-3 md:pt-0">
            <div className="text-left md:text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Net In-Hand Rate</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-300">
                ₹{bestMandi.netInHandPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-200 block">/ Quintal (All Deductions Included)</span>
            </div>

            <a
              href={bestMandi.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <span>Navigate</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* ── DETAILED MANDIS COMPARISON GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nearbyMandis.map((mandi, idx) => {
          const isSelected = selectedMandiId === mandi.id;
          return (
            <div
              key={mandi.id}
              onClick={() => setSelectedMandiId(isSelected ? null : mandi.id)}
              className={`rounded-2xl border transition-all p-4.5 space-y-3 cursor-pointer ${
                mandi.badges.some(b => b.text.includes('Best Net'))
                  ? 'border-emerald-300 bg-emerald-50/30 ring-1 ring-emerald-200'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Header with Badges & Distance */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                    {mandi.name}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{mandi.district}, {mandi.state}</span>
                  </p>
                </div>
                <span className="px-2 py-1 rounded-lg text-xs font-black bg-slate-100 text-slate-700 shrink-0">
                  {mandi.distanceKm} km
                </span>
              </div>

              {/* Badges List */}
              {mandi.badges.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {mandi.badges.map((b) => (
                    <span
                      key={b.text}
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${b.color}`}
                    >
                      {b.text}
                    </span>
                  ))}
                  {mandi.eNamEnabled && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      e-NAM
                    </span>
                  )}
                </div>
              )}

              {/* Price Breakdown Box */}
              <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 border border-slate-100 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Gross Mandi Price:</span>
                  <span className="font-bold text-slate-800">₹{mandi.grossRate.toLocaleString('en-IN')}/Qtl</span>
                </div>
                <div className="flex justify-between items-center text-rose-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3" /> Transport Deduct ({mandi.distanceKm} km):
                  </span>
                  <span className="font-bold">-₹{mandi.transportPerQtl}/Qtl</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Mandi Cess & Tax ({mandi.mandiCessPercent}%):</span>
                  <span className="font-medium">-₹{mandi.mandiCess}/Qtl</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between items-center">
                  <span className="font-black text-slate-900">Net In-Hand Realization:</span>
                  <span className="font-black text-emerald-700 text-base">
                    ₹{mandi.netInHandPrice.toLocaleString('en-IN')}/Qtl
                  </span>
                </div>
              </div>

              {/* Batch Total Profit Preview */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>For 50 Qtl Batch:</span>
                <span className="font-bold text-slate-800">
                  Net Profit: ₹{mandi.totalNetProfit.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <a
                  href={mandi.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
                >
                  <Navigation className="w-3 h-3 text-emerald-600" />
                  <span>Directions</span>
                </a>

                {mandi.phone && (
                  <a
                    href={`tel:${mandi.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                    title={`Call ${mandi.name} Helpline (${mandi.phone})`}
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
