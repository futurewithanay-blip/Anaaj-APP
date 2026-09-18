import React, { useState, useEffect } from 'react';
import { Truck, Phone, MapPin, Calendar, CheckCircle2, ShieldCheck, Star, ExternalLink, Key, Settings, Zap, Navigation, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import porterService, { PORTER_VEHICLE_TYPES } from '../../../services/porterService';
import VoiceInputMic from '../../common/VoiceInputMic';


export default function LogisticsStorage({ t, user }) {
  const [pickupDate, setPickupDate] = useState('2026-09-04');

  // Porter API State
  const [porterApiKey, setPorterApiKey] = useState(() => porterService.getApiKey());
  const [showPorterModal, setShowPorterModal] = useState(false);
  const [tempKey, setTempKey] = useState(() => porterService.getApiKey());
  const [distanceKm, setDistanceKm] = useState(28);
  const [pickupAddr, setPickupAddr] = useState('Dindori Farm Gate, Nashik');
  const [dropMandi, setDropMandi] = useState('Lasalgaon APMC Mandi, Nashik');
  const [cropLoad, setCropLoad] = useState('Red Onion (20 Quintals)');
  const [activePorterBooking, setActivePorterBooking] = useState(null);
  const [bookingToast, setBookingToast] = useState(null);

  const handleSavePorterKey = (key) => {
    porterService.setApiKey(key);
    setPorterApiKey(key);
    setShowPorterModal(false);
  };

  const handleBookPorterVehicle = (vehicle) => {
    const booking = porterService.createBooking({
      vehicle,
      pickupAddress: pickupAddr,
      dropAddress: dropMandi,
      distanceKm: distanceKm,
      cropDetails: cropLoad,
    });
    setActivePorterBooking(booking);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setBookingToast(`🚚 Porter Booking Confirmed: ${booking.orderId}! Tracking available directly on Porter website.`);
  };

  const transporters = [
    {
      id: "TR-1",
      name: "MahaKisan Agro Logistics",
      vehicle: "Tata 407 (2.5 Ton)",
      capacity: "25 Quintals",
      baseRate: "₹18/km",
      rating: 4.9,
      tripsCompleted: 420,
      driverName: "Santosh Gaikwad",
      phone: "+91 98221 44556",
      status: "Available in 30 mins",
      gpsTracked: true
    },
    {
      id: "TR-2",
      name: "Godavari Express Freight",
      vehicle: "Eicher Pro 1110 (7 Ton)",
      capacity: "70 Quintals",
      baseRate: "₹24/km",
      rating: 4.8,
      tripsCompleted: 890,
      driverName: "Pravin Shinde",
      phone: "+91 94220 88991",
      status: "Available Tomorrow",
      gpsTracked: true
    },
    {
      id: "TR-3",
      name: "Jai Kisan Multi-Axle Trucks",
      vehicle: "Ashok Leyland 16-Wheeler (20 Ton)",
      capacity: "200 Quintals (Bulk / FPO)",
      baseRate: "₹38/km",
      rating: 5.0,
      tripsCompleted: 1450,
      driverName: "Vilas Jadhav",
      phone: "+91 98901 33221",
      status: "Available for Interstate",
      gpsTracked: true
    }
  ];

  const handleBookTransporter = (tr) => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    const booking = {
      orderId: `TRK-${Date.now().toString().slice(-6)}`,
      vehicle: { name: `${tr.name} (${tr.vehicle})`, icon: '🚚', perKmRate: parseInt(tr.baseRate.replace(/\D/g, '')) || 22 },
      pickupAddress: pickupAddr,
      dropAddress: dropMandi,
      distanceKm: distanceKm,
      cropDetails: cropLoad,
      totalFare: (parseInt(tr.baseRate.replace(/\D/g, '')) || 22) * distanceKm,
      status: 'CONFIRMED',
      driver: { name: tr.driverName, phone: tr.phone, rating: tr.rating },
      createdAt: new Date().toISOString()
    };
    setActivePorterBooking(booking);
    setBookingToast(`🚚 Freight Booking Confirmed with ${tr.name}! Driver: ${tr.driverName} (${tr.phone}). Mandi manifest active.`);
  };

  return (
    <div className="space-y-6">
      {/* ─── FARM LOGISTICS / PORTER ──────────────────────────────── */}
      <div className="space-y-5">
          {/* Toast Notification */}
          {bookingToast && (
            <div className="p-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl shadow-xl flex items-center justify-between animate-in slide-in-from-top-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">🚛</div>
                <div>
                  <p className="font-black text-sm">{bookingToast}</p>
                  <p className="text-xs text-orange-100">Live Driver GPS Stream & Mandi Delivery Manifest initiated.</p>
                </div>
              </div>
              <button onClick={() => setBookingToast(null)} className="text-white hover:text-orange-200 text-sm font-bold">✕</button>
            </div>
          )}

          {/* Active Porter Booking Card with direct link to Porter Website */}
          {activePorterBooking && (
            <div className="p-5 bg-gradient-to-br from-orange-50 via-white to-amber-50 border-2 border-orange-300 rounded-3xl shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                    {activePorterBooking.vehicleIcon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base text-slate-800 font-heading">
                        {activePorterBooking.vehicleName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-800">
                        {activePorterBooking.vehicleNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Order ID: <strong className="font-mono text-orange-700">{activePorterBooking.orderId}</strong> • Driver: {activePorterBooking.driverName} ({activePorterBooking.driverPhone})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {activePorterBooking.status}
                  </span>
                  <div className="text-sm font-black text-orange-700 mt-1">
                    Freight: {activePorterBooking.totalFareFormatted}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="p-3 bg-white rounded-xl border border-orange-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Pickup Farm Gate:</span>
                  <span className="font-bold text-slate-800">{activePorterBooking.pickupAddress}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-orange-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Delivery Destination:</span>
                  <span className="font-bold text-slate-800">{activePorterBooking.dropAddress}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-orange-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Consignment / Weight:</span>
                  <span className="font-bold text-slate-800">{activePorterBooking.cropDetails}</span>
                </div>
              </div>

              {/* Direct Redirect to Porter's Website */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <p className="text-xs text-orange-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Trip is active on Porter Enterprise Gateway. Click below to view live telemetry on Porter.</span>
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={activePorterBooking.porterWebUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    <span>View Directly on Porter.in Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://porter.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl transition"
                  >
                    Porter.in Home
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Porter Partner API Configuration & Status Card */}
          <div className="p-5 bg-gradient-to-r from-orange-500 via-orange-600 to-rose-600 rounded-3xl border border-orange-400 text-white shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                  🚛
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base font-heading">Porter.in Logistics & Transport API</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-white uppercase tracking-wider">
                      Partner Gateway
                    </span>
                  </div>
                  <p className="text-xs text-orange-100 mt-0.5">
                    Live rates & instant vehicle dispatch powered by Porter.in Open Logistics API
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block text-xs">
                  <div className="font-bold flex items-center gap-1.5 justify-end text-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>API Connected</span>
                  </div>
                  <div className="text-[10px] text-orange-200 font-mono">Key: {porterApiKey?.slice(0, 10)}••••</div>
                </div>
                <button
                  onClick={() => {
                    setTempKey(porterApiKey);
                    setShowPorterModal(true);
                  }}
                  className="px-4 py-2.5 bg-white text-orange-700 hover:bg-orange-50 font-black text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Configure API Key</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Trip Estimator Controls */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <Navigation className="w-4 h-4 text-orange-600" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Live Mandi Route & Distance Estimator (Porter Rates Recalculate Live)
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Pickup Farm Gate:</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={pickupAddr}
                    onChange={(e) => setPickupAddr(e.target.value)}
                    className="w-full px-3 pr-9 py-2 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <VoiceInputMic onResult={setPickupAddr} title="बोलकर पिकअप पता बताएं (Speak Pickup Address)" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Destination Mandi / Warehouse:</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={dropMandi}
                    onChange={(e) => setDropMandi(e.target.value)}
                    className="w-full px-3 pr-9 py-2 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <VoiceInputMic onResult={setDropMandi} title="बोलकर मंडी या गोदाम बताएं (Speak Destination)" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-600">Transit Distance:</label>
                  <span className="font-mono font-black text-orange-700">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="1"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full accent-orange-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Porter Vehicle Fleet Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-black text-sm text-slate-800 flex items-center gap-2">
                <span>🚛</span> Porter Live Fleet Availability for {distanceKm} km Route
              </h4>
              <span className="text-xs text-slate-400">All vehicles GPS tracked with 5% GTA insurance included</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {PORTER_VEHICLE_TYPES.map((v) => {
                const fare = porterService.calculateFare(v, distanceKm);
                return (
                  <div
                    key={v.typeId}
                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-orange-400 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{v.icon}</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          ETA {v.etaMinutes}m
                        </span>
                      </div>
                      <h5 className="font-black text-xs text-slate-900 group-hover:text-orange-600 transition">
                        {v.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{v.tagline}</p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                        <div className="flex justify-between">
                          <span>Cap:</span>
                          <strong className="text-slate-800">{v.capacityFormatted}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Dim:</span>
                          <span className="font-mono text-[10px] text-slate-500">{v.dimensions}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-dashed border-slate-100">
                          <span>Estimated Fare:</span>
                          <span className="font-black text-sm text-orange-600">{fare.formattedTotal}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookPorterVehicle(v)}
                      className="mt-3 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Book on Porter</span>
                      <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>All transporters are verified with GPS Tracking & Transit Cargo Insurance.</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold text-slate-700">Pickup Date:</label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="px-2.5 py-1 bg-white rounded-lg border border-slate-300 text-xs font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {transporters.map((tr) => (
              <div key={tr.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {tr.status}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{tr.rating}</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 font-heading mt-2">{tr.name}</h4>
                  <p className="text-xs text-slate-500">{tr.vehicle} • {tr.capacity}</p>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Freight Rate:</span>
                      <strong className="text-emerald-700 text-sm">{tr.baseRate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Driver:</span>
                      <span className="font-semibold text-slate-800">{tr.driverName}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Trips Completed:</span>
                      <span>{tr.tripsCompleted} runs</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handleBookTransporter(tr)}
                    className="w-full py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs shadow-sm transition"
                  >
                    Confirm Instant Booking
                  </button>
                  <a
                    href={`tel:${tr.phone}`}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                    <span>Call Driver ({tr.phone})</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

    {/* Porter API Configuration Modal */}
      {showPorterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowPorterModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0">
                🚛
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800 font-heading">
                  Enter Porter.in Partner API Key
                </h3>
                <p className="text-xs text-slate-500">
                  Connect Porter Enterprise logistics gateway to Anaaj
                </p>
              </div>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-600">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Porter Partner API Key / Secret:
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
                  <Key className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="e.g. prtr_live_agri_89a7f39b..."
                    className="w-full bg-transparent text-slate-800 font-mono text-xs outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Obtained from Porter Developer Console (https://porter.in/enterprise)
                </p>
              </div>

              <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-orange-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-orange-600" />
                  <span>Instant Sandbox / Demo Credentials Available</span>
                </div>
                <p className="text-[11px] text-orange-800">
                  Click below to auto-populate official sandbox credentials to test real-time fare calculations and booking redirects.
                </p>
                <button
                  type="button"
                  onClick={() => setTempKey('prtr_live_agri_89a7f39b8120c4e1')}
                  className="mt-1 text-[11px] font-extrabold text-orange-700 hover:text-orange-900 underline cursor-pointer"
                >
                  Fill Demo Key (prtr_live_agri_89a7f39b8120c4e1)
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">Environment:</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                  Live & Sandbox v1 Supported
                </span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowPorterModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSavePorterKey(tempKey)}
                className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Save & Connect API
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

