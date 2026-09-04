import React from 'react';
import { Sprout, Wheat, Phone, Mail, MapPin, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export default function Footer({ setCurrentView, setLang }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Platform Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-600 to-emerald-500 text-white flex items-center justify-center shadow">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black font-heading text-white tracking-tight flex items-center">
                  <span className="text-amber-400 font-serif font-black text-3xl">अ</span>naaj
                </span>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">THE FARMER'S DIGITAL MARKET</p>
                <p className="text-[10px] text-slate-400">SIH 2026 • PS ID: 26132</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering Indian farmers and Farmer Producer Organizations (FPOs) with AI-driven price intelligence, transparent net-profit discovery, verified buyer matchmaking, and distress-sale prevention.
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Govt. of Maharashtra Innovation Society</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-emerald-400 transition">
                  🌾 Live APMC Mandi Rates
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('services')} className="hover:text-emerald-400 transition">
                  🤖 AI Price Prediction & Sell / Hold
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('services')} className="hover:text-emerald-400 transition">
                  💡 Smart Net Profit Calculator
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('map')} className="hover:text-emerald-400 transition">
                  🗺️ Interactive Mandi & Cold Storage Map
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('services')} className="hover:text-emerald-400 transition">
                  📦 FPO Collective Selling Engine
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('schemes')} className="hover:text-emerald-400 transition">
                  🏛️ PM-Kisan & MahaDBT Schemes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Weather & Agromet Feeds */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Official Integrations
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center justify-between">
                <span>Agmarknet (data.gov.in)</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded">Connected</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Meghdoot / IMD Agromet</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded">Live Advisory</span>
              </li>
              <li className="flex items-center justify-between">
                <span>e-NAM Unified Trade API</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded">Enabled</span>
              </li>
              <li className="flex items-center justify-between">
                <span>MahaDBT & PM-Kisan DBT</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded">Verified</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Farmer Helplines & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Farmer Support & Grievance
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <Phone className="w-4 h-4" />
                <span>1800-180-1551 (Kisan Helpline)</span>
              </div>
              <p className="text-[11px] text-slate-400">Toll-free 24x7 in 22 regional languages</p>
              <div className="flex items-center gap-2 text-slate-300 pt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>support@anaaj.mahagov.in</span>
              </div>
            </div>

            <div className="pt-1 flex gap-2">
              <span className="text-[11px] text-slate-400">Supported Languages:</span>
              <span className="text-[11px] text-emerald-400 font-semibold">EN • हिंदी • मराठी • ગુજરાતી • ਪੰਜਾਬੀ</span>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 <strong className="text-slate-300">अnaaj ("THE FARMER'S DIGITAL MARKET")</strong> — Smart India Hackathon Prototype. Developed for Maharashtra State Innovation Society.
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentView('about')} className="hover:text-slate-300">About SIH 2026</button>
            <button onClick={() => setCurrentView('schemes')} className="hover:text-slate-300">Schemes</button>
            <button onClick={() => setCurrentView('contact')} className="hover:text-slate-300">Contact KVK</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
