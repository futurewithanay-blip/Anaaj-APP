import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind, Droplets, MapPin, Filter, Sparkles, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { WEATHER_DATA } from '../../data/weatherData';
import { getLiveWeather } from '../../services/apiClient';

export default function WeatherWidget({ t }) {
  const states = Object.keys(WEATHER_DATA);
  const [selectedState, setSelectedState] = useState(states[0]);
  const districtList = WEATHER_DATA[selectedState] || [];
  const [selectedDistrict, setSelectedDistrict] = useState(districtList[0]?.district || '');
  const [liveWeather, setLiveWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Active weather item fallback from local benchmark data
  const currentData = districtList.find(d => d.district === selectedDistrict) || districtList[0] || {};

  useEffect(() => {
    let isMounted = true;
    setLoadingWeather(true);
    getLiveWeather({ district: selectedDistrict, state: selectedState })
      .then((data) => {
        if (isMounted && data) {
          setLiveWeather(data);
        }
      })
      .catch((err) => {
        console.warn('Weather fetch error:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingWeather(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDistrict, selectedState]);

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const newDistList = WEATHER_DATA[newState] || [];
    if (newDistList.length > 0) {
      setSelectedDistrict(newDistList[0].district);
    }
  };

  const handleRefresh = () => {
    setLoadingWeather(true);
    getLiveWeather({ district: selectedDistrict, state: selectedState })
      .then((data) => {
        if (data) setLiveWeather(data);
      })
      .finally(() => setLoadingWeather(false));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
      
      {/* Meghdoot Portal Header */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 text-white p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {liveWeather?.source ? (
                <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-400/40 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  ⚡ {liveWeather.source}
                </span>
              ) : (
                <span className="bg-sky-500/30 text-sky-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-sky-400/30">
                  Meghdoot / IMD Agromet Advisory
                </span>
              )}
              <span className="text-xs text-sky-200/80 hidden md:inline">
                {currentData.bulletinNo}
              </span>
            </div>
            <h3 className="text-xl font-bold font-heading mt-1 flex items-center gap-2">
              <span>🌾 Agromet State & District Weather Forecast</span>
            </h3>
            <p className="text-xs text-sky-200">
              {liveWeather ? `Real-time conditions for ${selectedDistrict}, ${selectedState}` : currentData.validTill}
            </p>
          </div>

          {/* Dual State and District Filter */}
          <div className="flex flex-wrap items-center gap-2 bg-sky-950/70 p-2 rounded-2xl border border-sky-600/40">
            <div className="flex items-center gap-1.5 text-xs text-sky-200 font-bold px-2">
              <Filter className="w-3.5 h-3.5 text-sky-400" />
              <span>Location Filter:</span>
            </div>

            {/* State Select */}
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="bg-sky-900 text-white text-xs font-bold px-3 py-2 rounded-xl border border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  🗺️ {st}
                </option>
              ))}
            </select>

            {/* District Select */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-sky-900 text-white text-xs font-bold px-3 py-2 rounded-xl border border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
            >
              {districtList.map((item) => (
                <option key={item.district} value={item.district}>
                  📍 {item.district}
                </option>
              ))}
            </select>

            <button
              onClick={handleRefresh}
              disabled={loadingWeather}
              title="Refresh live meteorological sensor feed"
              className="p-2 bg-sky-900 hover:bg-sky-800 text-sky-200 rounded-xl border border-sky-500/50 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingWeather ? 'animate-spin' : ''}`} />
            </button>
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
              <p className="text-base font-bold text-white leading-tight">
                {liveWeather?.temperature_c !== undefined ? `${liveWeather.temperature_c}°C` : currentData.temp}
              </p>
              <p className="text-[10px] text-sky-300">
                {liveWeather?.conditions || `Min: ${currentData.tempMin} | Max: ${currentData.tempMax}`}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-400/20 text-sky-300">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-sky-200">Relative Humidity</p>
              <p className="text-base font-bold text-white leading-tight">
                {liveWeather?.humidity_pct !== undefined ? `${liveWeather.humidity_pct}%` : currentData.humidity}
              </p>
              <p className="text-[10px] text-sky-300">
                {liveWeather?.humidity_pct > 75 ? '⚠️ High (Moisture risk)' : 'Optimal for spraying'}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-400/20 text-indigo-300">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-sky-200">Wind Velocity</p>
              <p className="text-base font-bold text-white leading-tight">{currentData.windSpeed || '12 km/h'}</p>
              <p className="text-[10px] text-sky-300">Normal drift</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-400/20 text-emerald-300">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-sky-200">Rainfall Forecast</p>
              <p className="text-xs font-bold text-white leading-tight">
                {liveWeather?.rainfall_mm !== undefined ? `${liveWeather.rainfall_mm} mm` : currentData.rainfallForecast}
              </p>
              <p className="text-[10px] text-sky-300">
                {liveWeather?.is_raining ? '🌧️ Rain Detected' : 'Clear / No precipitation'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Localized Crop Advisory Cards & Live Agri Risk */}
      <div className="p-5 bg-slate-50/50 space-y-4">
        {/* Real-time Agricultural Risk & Storage Penalty Banner */}
        {liveWeather?.advisory && (
          <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs ${
            liveWeather.risk_level === 'HIGH'
              ? 'bg-rose-50 border-rose-200 text-rose-950'
              : liveWeather.risk_level === 'MODERATE'
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl text-white font-bold shrink-0 ${
                liveWeather.risk_level === 'HIGH' ? 'bg-rose-600' : liveWeather.risk_level === 'MODERATE' ? 'bg-amber-600' : 'bg-emerald-600'
              }`}>
                {liveWeather.risk_level === 'HIGH' ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-sm">
                    Live Agri Risk Assessment: {liveWeather.risk_level} RISK
                  </span>
                  {liveWeather.moisture_penalty_pct > 0 && (
                    <span className="text-[10px] font-black bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded-full">
                      +{liveWeather.moisture_penalty_pct}% Moisture Penalty
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1 text-slate-700 leading-relaxed font-medium">
                  {liveWeather.advisory}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-1">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <span>Crop-Specific Advisory for {currentData.district}, {selectedState}</span>
          </h4>
          <span className="text-[11px] text-slate-500">Source: Agromet Field Unit (AMFU)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentData.advisories?.map((adv, idx) => (
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

