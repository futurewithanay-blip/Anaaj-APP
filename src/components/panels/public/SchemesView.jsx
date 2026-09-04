import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ExternalLink, Sparkles, HelpCircle, FileText, ArrowRight } from 'lucide-react';
import { GOVT_SCHEMES } from '../../../data/schemesData';
import confetti from 'canvas-confetti';

export default function SchemesView({ t }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEligibilityTool, setShowEligibilityTool] = useState(false);

  // Eligibility Tool State
  const [farmerLandAcres, setFarmerLandAcres] = useState('3.5');
  const [farmerState, setFarmerState] = useState('Maharashtra');
  const [hasAadhaarLinkedBank, setHasAadhaarLinkedBank] = useState(true);
  const [isLoanee, setIsLoanee] = useState(false);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);

  const filteredSchemes = GOVT_SCHEMES.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const handleRunEligibility = (e) => {
    e.preventDefault();
    const matches = GOVT_SCHEMES.filter((s) => {
      if (farmerState !== 'Maharashtra' && s.id === 'namo-shetkari') return false;
      return true;
    });

    setEligibleSchemes(matches);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-agri-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-400/30">
                🏛️ Central & State Government Portal Linkage
              </span>
              <span className="text-xs text-emerald-200">MahaDBT & MoA&FW Direct Services</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
              Government Schemes & Direct Financial Subsidies
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
              Discover verified agricultural schemes, income support (₹12,000/yr), ₹1 token crop insurance, 50% machinery subsidies, and 3% interest subventions on farm warehouses.
            </p>
          </div>

          <button
            onClick={() => setShowEligibilityTool(!showEligibilityTool)}
            className="px-5 py-3.5 bg-harvest-500 hover:bg-harvest-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-xl shadow-harvest-600/30 transition flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{showEligibilityTool ? 'Hide Eligibility Tool' : 'Check Eligibility (AI Tool)'}</span>
          </button>
        </div>
      </div>

      {/* Interactive AI Eligibility Assessment Tool */}
      {showEligibilityTool && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 sm:p-8 shadow-xl space-y-6 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>Instant Farmer Scheme Eligibility Assessment Tool</span>
              </h3>
              <p className="text-xs text-slate-500">
                Answer 3 simple questions to find out exact monetary benefits and direct application links
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              AI Powered
            </span>
          </div>

          <form onSubmit={handleRunEligibility} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Landholding (Acres)</label>
              <input
                type="number"
                step="0.1"
                required
                value={farmerLandAcres}
                onChange={(e) => setFarmerLandAcres(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State of Residence</label>
              <select
                value={farmerState}
                onChange={(e) => setFarmerState(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
              >
                <option value="Maharashtra">Maharashtra (Eligible for Namo Shetkari)</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Punjab">Punjab</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Aadhaar Linked Bank Account?</label>
              <select
                value={hasAadhaarLinkedBank ? 'yes' : 'no'}
                onChange={(e) => setHasAadhaarLinkedBank(e.target.value === 'yes')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
              >
                <option value="yes">Yes, NPCI Aadhaar Seeding Done</option>
                <option value="no">No / Not Sure</option>
              </select>
            </div>

            <div className="sm:col-span-3 pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Evaluate My Scheme Entitlements</span>
              </button>
            </div>
          </form>

          {/* Results Area */}
          {eligibleSchemes.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300 space-y-3">
              <h4 className="font-bold text-sm text-emerald-950 font-heading">
                🎉 Congratulations! You are eligible for {eligibleSchemes.length} Government Schemes:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {eligibleSchemes.map((s) => (
                  <div key={s.id} className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-slate-900">{s.name}</strong>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Eligible</span>
                    </div>
                    <p className="text-xs font-bold text-emerald-700">{s.benefit}</p>
                    <a
                      href={s.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-agri-700 hover:underline pt-1"
                    >
                      <span>Direct Apply Online</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Schemes Directory Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'all', label: 'All Schemes (' + GOVT_SCHEMES.length + ')' },
          { id: 'income', label: '💰 Income Support (PM-Kisan & Namo)' },
          { id: 'insurance', label: '🛡️ Crop Insurance (PMFBY ₹1 Scheme)' },
          { id: 'infra', label: '🏗️ Post-Harvest & Cold Storage (AIF)' },
          { id: 'machinery', label: '🚜 Farm Machinery & Drone Subsidy' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setSelectedCategory(btn.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === btn.id
                ? 'bg-agri-800 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Schemes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((s) => (
          <div key={s.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {s.category}
                </span>
                <span className="text-xs font-bold text-slate-500">{s.state}</span>
              </div>

              <h3 className="font-bold text-base text-slate-900 font-heading leading-tight">{s.name}</h3>
              <p className="text-xs text-slate-500">{s.ministry}</p>

              {/* Benefit Highlight */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                <span className="text-[10px] font-bold uppercase text-amber-800 block">Monetary Benefit:</span>
                <p className="text-xs font-bold mt-0.5">{s.benefit}</p>
              </div>

              {/* Eligibility Criteria */}
              <div className="space-y-1 text-xs text-slate-600">
                <p className="text-[11px] font-bold text-slate-700">Eligibility:</p>
                <p className="text-slate-600 leading-relaxed">{s.eligibility}</p>
              </div>

              {/* Required Documents */}
              <div>
                <p className="text-[11px] font-bold text-slate-700 mb-1">Required Documents:</p>
                <div className="flex flex-wrap gap-1">
                  {s.keyDocuments.map((doc, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                      ✓ {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <a
                href={s.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
