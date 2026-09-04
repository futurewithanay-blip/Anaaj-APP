import React, { useState } from 'react';
import { X, Sprout, Upload, Sparkles, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CreateLotModal({ isOpen, onClose, onAddLot }) {
  const [crop, setCrop] = useState('Onion (कांदा / Red Onion)');
  const [variety, setVariety] = useState('Gavran / Nashik Red');
  const [quantityQtl, setQuantityQtl] = useState(60);
  const [grade, setGrade] = useState('Grade A (Export Quality 55mm+)');
  const [moisturePercent, setMoisturePercent] = useState('11.0%');
  const [harvestDate, setHarvestDate] = useState('2026-08-30');
  const [location, setLocation] = useState('Dindori, Nashik, Maharashtra');
  const [expectedPrice, setExpectedPrice] = useState(2650);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLot = {
      id: `LOT-2026-${Math.floor(100 + Math.random() * 900)}`,
      crop,
      variety,
      quantityQtl: Number(quantityQtl),
      grade,
      moisturePercent,
      harvestDate,
      location,
      distanceFromMandi: '16 km',
      expectedPrice: Number(expectedPrice),
      status: 'Active (Bidding Open)',
      offersCount: 0,
      topOfferPrice: null,
      topBuyerName: null,
      image: crop.includes('Onion')
        ? 'https://images.unsplash.com/photo-1618512496249-a07fe83aa8cb?w=500&auto=format&fit=crop&q=60'
        : crop.includes('Soybean')
        ? 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=60'
    };

    onAddLot(newLot);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-agri-800 to-emerald-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Sprout className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold font-heading text-lg">Create New Crop Lot Listing</h3>
              <p className="text-xs text-emerald-100">Direct digital listing with AI grading & verified buyer matching</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Type</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500"
              >
                <option value="Onion (कांदा / Red Onion)">🧅 Onion (कांदा / Red Onion)</option>
                <option value="Soybean (सोयाबीन)">🌱 Soybean (सोयाबीन)</option>
                <option value="Cotton (कापूस / कपास)">☁️ Cotton (कापूस / कपास)</option>
                <option value="Wheat (गहू - Sharbati)">🌾 Wheat (गहू - Sharbati)</option>
                <option value="Tomato (टोमॅटो)">🍅 Tomato (टोमॅटो)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Variety / Cultivar</label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Gavran / Sharbati C-306"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-agri-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Quantity (Quintals)</label>
              <input
                type="number"
                min="1"
                required
                value={quantityQtl}
                onChange={(e) => setQuantityQtl(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-agri-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Moisture Level (%)</label>
              <input
                type="text"
                value={moisturePercent}
                onChange={(e) => setMoisturePercent(e.target.value)}
                placeholder="e.g. 11.0%"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-agri-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Harvest Date</label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-agri-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Quality Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-agri-500"
              >
                <option value="Grade A (Export Quality 55mm+)">Grade A (Export Quality 55mm+)</option>
                <option value="Grade B (FAQ / Good Domestic)">Grade B (FAQ / Good Domestic)</option>
                <option value="Grade C (Local Processing)">Grade C (Local Processing)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Reserve Price (₹/Quintal)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  required
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-emerald-800 focus:ring-2 focus:ring-agri-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Farm Pickup Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Village Mohadi, Dindori, Nashik, Maharashtra"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-agri-500"
            />
          </div>

          {/* AI Lot Verification Note */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <p>
              Your lot will be automatically verified against <strong>e-NAM Assaying standards</strong> and displayed to 40+ verified institutional buyers.
            </p>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Lot to Marketplace</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
