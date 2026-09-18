import React from 'react';
import { PhoneCall, MessageSquareText, Radio, ShieldCheck, Sparkles } from 'lucide-react';
import { MANDI_ARRIVAL_TICKER } from '../../data/mandiData';

export default function TopGovtHeader({ lang, t, onOpenSmsModal }) {
  return (
    <header className="bg-slate-900 text-white text-xs border-b border-slate-800">
      {/* Tricolor Indicator Line */}
      <div className="tricolor-bar w-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Info Strip */}
        <div className="py-1.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-slate-400 pl-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.topOfficialPortal || "Official Agro-Market Intelligence & Price Discovery Portal"}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenSmsModal}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-harvest-300 px-2.5 py-1 rounded transition border border-harvest-500/30"
              title="Query Mandi Prices without Internet"
            >
              <MessageSquareText className="w-3.5 h-3.5 text-harvest-400" />
              <span className="font-medium">{t.topSmsMode || "SMS / USSD Mode (*99#)"}</span>
            </button>

            <a
              href="tel:18001801551"
              className="flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 font-medium"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">{t.helpline}</span>
              <span className="sm:hidden font-bold">1800-180-1551</span>
            </a>
          </div>
        </div>

        {/* Live Mandi Ticker Strip (Meghdoot / Agmarknet Live Arrivals) */}
        <div className="py-1.5 flex items-center overflow-hidden bg-slate-950/70 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex items-center gap-2 pr-4 text-harvest-400 font-semibold uppercase tracking-wider shrink-0 border-r border-slate-800 text-[11px]">
            <Radio className="w-3 h-3 text-red-500 animate-pulse" />
            <span>{t.topLiveTicker || "Live Mandi Ticker:"}</span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1 relative">
            <div className="animate-marquee-slow flex items-center gap-8 text-[11px]">
              {MANDI_ARRIVAL_TICKER.concat(MANDI_ARRIVAL_TICKER).map((item, idx) => (
                <div key={idx} className="inline-flex items-center gap-2">
                  <span className="font-semibold text-slate-200">{item.crop}</span>
                  <span className="text-slate-400">({item.mandi})</span>
                  <span className="font-bold text-emerald-400">{item.price}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    item.status === 'up' ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                  }`}>
                    {item.change}
                  </span>
                  <span className="text-slate-700">|</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
