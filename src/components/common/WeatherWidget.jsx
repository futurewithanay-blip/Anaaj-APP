import React, { useState } from 'react';
import { CloudRain, Sun, Wind, Droplets, Thermometer, AlertTriangle, CheckCircle, Info, ChevronRight, ShieldAlert } from 'lucide-react';
import { DISTRICT_WEATHER_ADVISORIES } from '../../data/weatherData';

export default function WeatherWidget({ t }) {
  const [selectedDistrictIdx, setSelectedDistrictIdx] = useState(0);
  const currentData = DISTRICT_WEATHER_ADVISORIES[selectedDistrictIdx];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
      
      {/* Meghdoot Portal Sub-Header Ribbon */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 text-white p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-sky-500/30 text-sky-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-sky-400/30">
                Meghdoot / IMD Agromet Advisory
              </span>
              <span className="text-xs text-sky-200/80 hidden md:inline">
                {currentData.bulletinNo}
              </span>
            </div>
            <h3 className="text-xl font-bold font-heading mt-1 flex items-center gap-2">
              <span>🌾 Agromet District Forecast & Advisory</span>
            </h3>
            <p className="text-xs text-sky-200">
              {currentData.validTill}
            </p>
          </div>

          {/* District Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-sky-200">Select District:</span>
            <select
              value={selectedDistrictIdx}
              onChange={(e) => setSelectedDistrictIdx(Number(e.target.value))}
              className="bg-sky-950/80 text-white text-xs font-bold px-3 py-2 rounded-xl border border-sky-600/50 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {DISTRICT_WEATHER_ADVISORIES.map((item, idx) => (
                <option key={idx} value={idx}>
                  📍 {item.district}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Weather Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-sky-200">Temperature</p>
              <p className="text-base font-bold text-white leading-tight">{currentData.temp}</p>
              <p className="text-[10px] text-sky-300">Min: {currentData.tempMin} | Max: {currentData.tempMax}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-400/20 text-sky-300">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-sky-200">Relative Humidity</p>
              <p className="text-base font-bold text-white leading-tight">{currentData.humidity}</p>
              <p className="text-[10px] text-sky-300">Optimal for spraying</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-400/20 text-indigo-300">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-sky-200">Wind Velocity</p>
              <p className="text-base font-bold text-white leading-tight">{currentData.windSpeed}</p>
              <p className="text-[10px] text-sky-300">Normal drift</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-400/20 text-emerald-300">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-sky-200">Rainfall Forecast</p>
              <p className="text-xs font-bold text-white leading-tight">{currentData.rainfallForecast}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Localized Crop Advisory Cards */}
      <div className="p-5 bg-slate-50/50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <span>Crop-Specific Advisory for {currentData.district}</span>
          </h4>
          <span className="text-[11px] text-slate-500">Source: Agromet Field Unit (AMFU)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentData.advisories.map((adv, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition hover:shadow-sm ${
                adv.severity === 'warning'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : adv.severity === 'success'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-blue-50/70 border-blue-200 text-blue-950'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold text-sm font-heading">{adv.crop}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  adv.severity === 'warning'
                    ? 'bg-amber-200 text-amber-900'
                    : adv.severity === 'success'
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-blue-200 text-blue-900'
                }`}>
                  {adv.stage}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700">
                {adv.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
