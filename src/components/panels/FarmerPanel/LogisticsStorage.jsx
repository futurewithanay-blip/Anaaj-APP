import React, { useState } from 'react';
import { Truck, Warehouse, Phone, MapPin, Calendar, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LogisticsStorage({ t, defaultTab = 'logistics' }) {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'logistics' | 'storage'
  const [pickupDate, setPickupDate] = useState('2026-09-04');
  const [vehicleType, setVehicleType] = useState('Tata 407 (2.5 MT / 25 Quintals)');

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

  const storages = [
    {
      id: "WH-1",
      name: "MahaAgro Cold Storage Hub",
      location: "Dindori MIDC, Nashik",
      type: "Controlled Atmosphere (CA) Onion & Veg Storage",
      totalCapacity: "10,000 MT",
      availableCapacity: "4,500 MT",
      ratePerQtlDay: "₹5.00",
      accreditation: "WDRA Certified • Govt. Subsidized",
      phone: "0253-299100",
      distanceKm: 14,
      rating: 4.9
    },
    {
      id: "WH-2",
      name: "Gramin Bhandaran Warehouse (PACS)",
      location: "Pimpalgaon, Nashik",
      type: "Dry Grain & Pulse Silo",
      totalCapacity: "5,000 MT",
      availableCapacity: "1,200 MT",
      ratePerQtlDay: "₹3.50",
      accreditation: "e-NWR Electronic Negotiable Receipt Linked",
      phone: "02550-251122",
      distanceKm: 28,
      rating: 4.7
    }
  ];

  const handleBookTransporter = (tr) => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    alert(`🚚 Booking Confirmed with ${tr.name}!\nDriver: ${tr.driverName} (${tr.phone})\nPickup Date: ${pickupDate}\nGPS Tracking link sent to your mobile.`);
  };

  const handleBookStorage = (st) => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    alert(`❄️ Space Reserved at ${st.name}!\nLocation: ${st.location}\nRate: ${st.ratePerQtlDay}/Qtl/day\ne-NWR receipt will be generated upon arrival.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('logistics')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'logistics' ? 'bg-white text-agri-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Book Farm Transport</span>
        </button>
        <button
          onClick={() => setActiveTab('storage')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'storage' ? 'bg-white text-agri-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Warehouse className="w-4 h-4 text-sky-600" />
          <span>Nearby Cold Storage & Silos</span>
        </button>
      </div>

      {activeTab === 'logistics' ? (
        <div className="space-y-4">
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
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-900 flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-sky-600" />
            <span>WDRA-accredited warehouses offer e-NWR receipts eligible for instant 70% pledge loan at 7% interest!</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storages.map((st) => (
              <div key={st.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    {st.distanceKm} km away
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{st.rating}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-base text-slate-900 font-heading">{st.name}</h4>
                  <p className="text-xs text-slate-500">{st.location}</p>
                  <p className="text-[11px] text-sky-700 font-semibold mt-1">{st.type}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Available Space:</span>
                    <strong className="text-emerald-700">{st.availableCapacity} (of {st.totalCapacity})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rental Rate:</span>
                    <strong className="text-slate-900">{st.ratePerQtlDay} / Quintal / Day</strong>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>Accreditation:</span>
                    <span className="font-medium text-slate-700">{st.accreditation}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleBookStorage(st)}
                    className="flex-1 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs shadow-sm transition"
                  >
                    Reserve Storage Space
                  </button>
                  <a
                    href={`tel:${st.phone}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
