import React, { useState } from 'react';
import { Calculator, TrendingUp, Truck, ShieldAlert, Award, ArrowRight, CheckCircle2, DollarSign } from 'lucide-react';
import { MANDI_COMMODITIES } from '../../data/mandiData';

export default function NetProfitCalculator({ t }) {
  const [selectedCropId, setSelectedCropId] = useState('onion');
  const [quantityQtl, setQuantityQtl] = useState(50); // 50 Quintals default
  const [dieselRatePerKm, setDieselRatePerKm] = useState(1.4); // ₹1.4 per quintal-km
  const [storageDays, setStorageDays] = useState(0); // days in holding

  const crop = MANDI_COMMODITIES.find((c) => c.id === selectedCropId) || MANDI_COMMODITIES[0];

  // Calculate net profit for each mandi
  const calculatedMandis = crop.mandis.map((m) => {
    const grossPricePerQtl = m.price;
    const grossRevenue = grossPricePerQtl * quantityQtl;

    // Transport cost = distance * rate
    const transportCostPerQtl = Math.round(m.distanceKm * dieselRatePerKm);
    const totalTransport = transportCostPerQtl * quantityQtl;

    // Mandi Cess & Unloading (~₹20 per qtl + mandi cess)
    const mandiCessTotal = (m.mandiCess + 18) * quantityQtl;

    // Storage cost (₹5 per qtl per day if any)
    const storageCostTotal = storageDays * 5 * quantityQtl;

    // Total expenses
    const totalExpenses = totalTransport + mandiCessTotal + storageCostTotal;

    // Real Net Take-Home Profit
    const netProfitTotal = grossRevenue - totalExpenses;
    const netProfitPerQtl = Math.round(netProfitTotal / quantityQtl);

    return {
      ...m,
      grossPricePerQtl,
      grossRevenue,
      transportCostPerQtl,
      totalTransport,
      mandiCessTotal,
      storageCostTotal,
      totalExpenses,
      netProfitTotal,
      netProfitPerQtl,
    };
  });

  // Find the true best market by highest Net Profit
  const bestMandi = [...calculatedMandis].sort((a, b) => b.netProfitTotal - a.netProfitTotal)[0];
  const highestGrossMandi = [...calculatedMandis].sort((a, b) => b.grossPricePerQtl - a.grossPricePerQtl)[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
      
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-900 via-harvest-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-400/30">
              💡 Smart Arbitrage & Net Take-Home Formula
            </span>
          </div>
          <h3 className="text-xl font-bold font-heading flex items-center gap-2">
            <span>{t.netProfitCalc}</span>
          </h3>
          <p className="text-xs text-amber-200/80">
            Real Net Take-Home = Listed Price − Transport (₹/km) − Mandi Cess − Storage/Handling
          </p>
        </div>

        {/* Crop Selector */}
        <select
          value={selectedCropId}
          onChange={(e) => setSelectedCropId(e.target.value)}
          className="bg-amber-950 text-amber-100 text-xs font-bold px-3 py-2 rounded-xl border border-amber-600/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {MANDI_COMMODITIES.map((c) => (
            <option key={c.id} value={c.id}>
              🌾 {c.name.split('(')[0].trim()}
            </option>
          ))}
        </select>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Sliders for Dynamic Farmer Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Lot Volume (Quantity):</span>
              <span className="text-agri-700 font-extrabold text-sm">{quantityQtl} Quintals</span>
            </div>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={quantityQtl}
              onChange={(e) => setQuantityQtl(Number(e.target.value))}
              className="w-full accent-agri-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-1">1 Quintal = 100 Kilograms</p>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Transporter Freight (₹/Qtl-Km):</span>
              <span className="text-amber-700 font-extrabold text-sm">₹{dieselRatePerKm}/Q-km</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.1"
              value={dieselRatePerKm}
              onChange={(e) => setDieselRatePerKm(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-1">Standard Tempo/Truck freight rate</p>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Warehouse / Cold Storage:</span>
              <span className="text-indigo-700 font-extrabold text-sm">{storageDays} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={storageDays}
              onChange={(e) => setStorageDays(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-1">₹5/Qtl per day Gramin Bhandar</p>
          </div>
        </div>

        {/* Insight Callout: Why Highest Price != Best Profit */}
        {highestGrossMandi.name !== bestMandi.name && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="font-bold text-sm block">💡 Smart Market Recommendation Alert:</strong>
              <p>
                Although <strong>{highestGrossMandi.name}</strong> has the highest listed rate of <strong>₹{highestGrossMandi.price}/Q</strong>, high transport distance ({highestGrossMandi.distanceKm} km) eats into your margin!
              </p>
              <p className="text-emerald-800 font-bold">
                👉 Recommended: <strong>{bestMandi.name}</strong> yields the highest net in-hand profit of <strong>₹{bestMandi.netProfitTotal.toLocaleString()}</strong> (₹{bestMandi.netProfitPerQtl}/Qtl net).
              </p>
            </div>
          </div>
        )}

        {/* Comparative Cards Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {calculatedMandis.map((m, idx) => {
            const isBest = m.name === bestMandi.name;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                  isBest
                    ? 'bg-emerald-50/90 border-2 border-emerald-500 shadow-md ring-4 ring-emerald-500/10'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {isBest && (
                  <div className="absolute -top-3 left-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Award className="w-3 h-3" />
                    <span>True Best Market</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1 mt-1">
                    <h4 className="font-bold text-sm text-slate-900 font-heading">{m.name}</h4>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-bold">
                      {m.distanceKm} km
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{m.district}, {m.state}</p>

                  {/* Financial Breakdown */}
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Listed Mandi Rate:</span>
                      <strong className="text-slate-900">₹{m.grossPricePerQtl}/Q</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Gross Revenue:</span>
                      <span className="font-semibold">₹{m.grossRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-600 text-[11px]">
                      <span>Transport ({m.distanceKm}km):</span>
                      <span>-₹{m.totalTransport.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-600 text-[11px]">
                      <span>Cess & Unloading:</span>
                      <span>-₹{m.mandiCessTotal.toLocaleString()}</span>
                    </div>
                    {m.storageCostTotal > 0 && (
                      <div className="flex justify-between text-red-600 text-[11px]">
                        <span>Storage ({storageDays}d):</span>
                        <span>-₹{m.storageCostTotal.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Net Take-Home */}
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Net In-Hand:</span>
                    <span className={`text-xl font-black font-heading ${isBest ? 'text-emerald-700' : 'text-slate-800'}`}>
                      ₹{m.netProfitTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    (₹{m.netProfitPerQtl} / Quintal Net)
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
