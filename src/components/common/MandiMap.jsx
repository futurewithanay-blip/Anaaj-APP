import React, { useState } from 'react';
import { MapPin, Navigation, Warehouse, Truck, Search, Filter, Phone, CheckCircle2, Star, ShieldCheck, Compass } from 'lucide-react';
import { MANDI_COMMODITIES } from '../../data/mandiData';

export default function MandiMap({ t }) {
  const [selectedCrop, setSelectedCrop] = useState('onion');
  const [radiusKm, setRadiusKm] = useState(100);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Mock Map Nodes with coordinates and amenities
  const mapNodes = [
    {
      id: "node-1",
      name: "Lasalgaon APMC (Asia's #1 Onion Hub)",
      type: "mandi",
      district: "Nashik, Maharashtra",
      lat: 20.14,
      lng: 74.22,
      x: "32%",
      y: "42%",
      price: "₹2,580/Q",
      arrivals: "14,500 Qtl",
      activeBuyers: 42,
      distanceKm: 18,
      rating: 4.9,
      storageAvailable: "3,200 MT (Gramin Cold Hub)",
      phone: "02550-266224",
      highlight: true
    },
    {
      id: "node-2",
      name: "Pimpalgaon Baswant APMC",
      type: "mandi",
      district: "Nashik, Maharashtra",
      lat: 20.16,
      lng: 73.98,
      x: "26%",
      y: "36%",
      price: "₹2,620/Q",
      arrivals: "9,800 Qtl",
      activeBuyers: 31,
      distanceKm: 32,
      rating: 4.8,
      storageAvailable: "1,800 MT",
      phone: "02550-250020",
    },
    {
      id: "node-3",
      name: "Narayangaon Tomato & Veg Mandi",
      type: "mandi",
      district: "Pune, Maharashtra",
      lat: 19.12,
      lng: 73.97,
      x: "28%",
      y: "65%",
      price: "₹1,780/Q",
      arrivals: "18,000 Crates",
      activeBuyers: 52,
      distanceKm: 85,
      rating: 4.9,
      storageAvailable: "4,000 MT CA Storage",
      phone: "02132-242045",
    },
    {
      id: "node-4",
      name: "Pune Gultekdi Market Yard",
      type: "mandi",
      district: "Pune, Maharashtra",
      lat: 18.49,
      lng: 73.86,
      x: "24%",
      y: "82%",
      price: "₹2,750/Q",
      arrivals: "22,000 Qtl",
      activeBuyers: 68,
      distanceKm: 165,
      rating: 4.7,
      storageAvailable: "8,500 MT Central Warehousing",
      phone: "020-24263000",
    },
    {
      id: "node-5",
      name: "MahaAgro Cold Storage & Logistics Hub",
      type: "warehouse",
      district: "Dindori, Nashik",
      lat: 20.20,
      lng: 73.83,
      x: "20%",
      y: "30%",
      price: "₹5/Q/day",
      arrivals: "Capacity: 10,000 MT",
      activeBuyers: "18 Transporters on Standby",
      distanceKm: 14,
      rating: 4.9,
      storageAvailable: "4,500 MT Available Now",
      phone: "0253-299100",
    }
  ];

  const filteredNodes = mapNodes.filter((n) => n.distanceKm <= radiusKm);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
      
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-agri-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              Interactive GIS Market Map
            </span>
          </div>
          <h3 className="text-xl font-bold font-heading flex items-center gap-2">
            <span>🗺️ Smart Mandi & Warehouse Map</span>
          </h3>
          <p className="text-xs text-slate-300">
            Real-time geospatial discovery of APMC markets, cold storages & transport routes
          </p>
        </div>

        {/* Filter Radius Control */}
        <div className="flex items-center gap-3 bg-white/10 p-2 rounded-2xl border border-white/10">
          <span className="text-xs font-semibold text-slate-200">Search Radius:</span>
          <div className="flex gap-1">
            {[25, 50, 100, 200].map((r) => (
              <button
                key={r}
                onClick={() => setRadiusKm(r)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                  radiusKm === r ? 'bg-harvest-500 text-slate-950' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        
        {/* Left Interactive Map Visualizer */}
        <div className="lg:col-span-2 relative bg-slate-950 min-h-[420px] p-6 flex flex-col justify-between overflow-hidden">
          
          {/* Top Map Controls Overlay */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-xs text-white">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Current GPS: <strong>Nashik District Hub, Maharashtra</strong></span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> APMC Mandis</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span> Cold Storages</span>
            </div>
          </div>

          {/* Interactive Map Surface Simulation */}
          <div className="relative w-full h-[320px] my-4 rounded-2xl border border-slate-800/80 bg-slate-900 overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Range Circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-emerald-500/20 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-emerald-500/10 pointer-events-none"></div>
            
            {/* Farmer Center Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
              <div className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-400/40 animate-ping"></div>
              <span className="text-[10px] font-bold text-white bg-slate-900 px-2 py-0.5 rounded shadow mt-1">Your Farm</span>
            </div>

            {/* Map Node Pins */}
            {filteredNodes.map((node) => {
              const isSelected = selectedMarker?.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedMarker(node)}
                  style={{ top: node.y, left: node.x }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-all duration-200 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div className={`p-2 rounded-2xl shadow-lg border flex items-center gap-1.5 ${
                    node.type === 'mandi'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-900/50'
                      : 'bg-sky-600 text-white border-sky-400 shadow-sky-900/50'
                  }`}>
                    {node.type === 'mandi' ? <MapPin className="w-4 h-4" /> : <Warehouse className="w-4 h-4" />}
                    <span className="text-[11px] font-bold">{node.price}</span>
                  </div>
                  <span className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow-xl whitespace-nowrap z-30">
                    {node.name} ({node.distanceKm} km)
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Click on any market or storage pin above to view live trading volume, buyers and contact details.
          </p>
        </div>

        {/* Right Details Panel */}
        <div className="p-6 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-4">
          {selectedMarker ? (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    selectedMarker.type === 'mandi' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {selectedMarker.type === 'mandi' ? 'APMC Mandi Hub' : 'Cold Storage & Warehousing'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{selectedMarker.distanceKm} km away</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 font-heading mt-2">
                  {selectedMarker.name}
                </h4>
                <p className="text-xs text-slate-500">{selectedMarker.district}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Average Price:</span>
                  <strong className="text-emerald-700 text-sm">{selectedMarker.price}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Today's Arrivals:</span>
                  <strong className="text-slate-800">{selectedMarker.arrivals}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Buyers:</span>
                  <strong className="text-slate-800">{selectedMarker.activeBuyers}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cold Storage:</span>
                  <span className="text-slate-700 font-medium">{selectedMarker.storageAvailable}</span>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={`tel:${selectedMarker.phone}`}
                  className="w-full py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Mandi Office ({selectedMarker.phone})</span>
                </a>

                <button
                  onClick={() => alert(`Navigating route to ${selectedMarker.name} (${selectedMarker.distanceKm} km)`)}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 flex items-center justify-center gap-2 transition"
                >
                  <Compass className="w-3.5 h-3.5 text-slate-500" />
                  <span>Get Driving Route & Freight Quote</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Select a Location on Map</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Discover live buyer demand, warehouse space, and estimated transport times for markets in your region.
              </p>
            </div>
          )}

          {/* Quick Stats Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Mandis in {radiusKm}km: <strong>{filteredNodes.length}</strong></span>
            <span className="text-emerald-700 font-bold">100% e-NAM Linked</span>
          </div>
        </div>

      </div>
    </div>
  );
}
