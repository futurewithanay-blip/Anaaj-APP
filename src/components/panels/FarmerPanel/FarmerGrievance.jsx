import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2, Clock, Plus, X, MessageSquare, Phone, HelpCircle } from 'lucide-react';
import KisanAwaazTrigger from '../../kisanAwaaz/KisanAwaazTrigger';
import { FORM_GRIEVANCE_FARMER, FORM_GRIEVANCE_BUYER } from '../../kisanAwaaz/KisanAwaazConfig';
import VoiceInputMic from '../../kisanAwaaz/mode1/VoiceInputMic';
import { submitFarmerGrievance, fetchFarmerGrievances, isSupabaseConfigured } from '../../../services/supabaseClient';

export default function FarmerGrievance({ t, role = 'farmer' }) {
  const isBuyer = role === 'buyer';

  const defaultGrievances = isBuyer ? [
    {
      id: "GRV-2026-092",
      orderId: "ORD-9821 (Sharbati Wheat 200 Qtl)",
      counterpartyName: "Dnyaneshwar Patil (Farmer)",
      category: "Quality / Moisture Variance",
      description: "Assay lab reported 13.8% moisture vs contracted <12%. Fast-track moisture adjustment requested via APMC assayer.",
      dateRaised: "2026-09-02",
      status: "In Review by Mandi Assayer",
      statusType: "warning",
      resolutionETA: "Resolution within 24 Hours"
    },
    {
      id: "GRV-2026-061",
      orderId: "ORD-9740 (Red Onion 150 Qtl)",
      counterpartyName: "Nashik FPO Sangh (Producer Co.)",
      category: "Logistics / Delivery Delay",
      description: "Transporter delayed dispatch by 36 hours beyond contract window. Demurrage waiver processed.",
      dateRaised: "2026-08-22",
      status: "Resolved • Demurrage Adjusted",
      statusType: "success",
      resolutionETA: "Closed"
    }
  ] : [
    {
      id: "GRV-2026-042",
      orderId: "ORD-9912 (Soybean 140 Qtl)",
      counterpartyName: "Adani Wilmar Ltd (Buyer)",
      category: "Payment Delay (>48h after delivery)",
      description: "Crop delivered on 28th Aug. Quality assay cleared but remaining escrow payout was pending bank verification.",
      dateRaised: "2026-08-30",
      status: "In Review by Mandi Admin",
      statusType: "warning",
      resolutionETA: "Resolved in 24 Hours"
    },
    {
      id: "GRV-2026-018",
      orderId: "ORD-8840 (Onion 60 Qtl)",
      counterpartyName: "Sahyadri Agro (Buyer)",
      category: "Grading / Weighment Dispute",
      description: "Buyer claimed 3% excess moisture deduction. Re-tested with digital meter; agreement reached.",
      dateRaised: "2026-08-15",
      status: "Resolved • Full Payment Released",
      statusType: "success",
      resolutionETA: "Closed"
    }
  ];

  const [grievances, setGrievances] = useState(defaultGrievances);
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState(isBuyer ? 'ORD-9821 (Wheat 200 Qtl)' : 'ORD-9950 (Onion 85 Qtl)');
  const [category, setCategory] = useState(isBuyer ? 'Quality / Moisture Variance' : 'Payment Delay');
  const [description, setDescription] = useState('');

  // Load grievances from Supabase PostgreSQL on mount
  useEffect(() => {
    let isMounted = true;
    async function loadGrievances() {
      try {
        const dbTickets = await fetchFarmerGrievances();
        if (isMounted && dbTickets && dbTickets.length > 0) {
          const formatted = dbTickets.map(t => ({
            id: t.ticket_code || t.id,
            orderId: t.subject || `TKT-${t.category}`,
            counterpartyName: isBuyer ? "Kisan Agro Member / Transporter" : "Corporate Procurement Desk",
            category: t.category,
            description: t.description,
            dateRaised: t.created_at ? t.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            status: t.status === 'UNDER_REVIEW' ? 'Under Review by Mandi Admin' : t.status,
            statusType: t.status === 'RESOLVED' ? 'success' : 'warning',
            resolutionETA: 'Within 24-48 Hours'
          }));
          setGrievances([...formatted, ...defaultGrievances]);
        }
      } catch (err) {
        console.warn('Could not load grievances from Supabase:', err);
      }
    }
    loadGrievances();
    return () => { isMounted = false; };
  }, [isBuyer]);

  const handleCreateGrievance = async (e) => {
    e.preventDefault();
    const newG = {
      id: `GRV-2026-${Math.floor(100 + Math.random() * 900)}`,
      orderId,
      counterpartyName: isBuyer ? "Kisan Agro Member / Transporter" : "Corporate Procurement Desk",
      category,
      description,
      dateRaised: new Date().toISOString().split('T')[0],
      status: "Ticket Created • Under Fast-Track Redressal",
      statusType: "warning",
      resolutionETA: "Within 24-48 Hours"
    };

    // Save permanently to Supabase
    const dbRes = await submitFarmerGrievance({
      ticket_code: newG.id,
      farmer_name: isBuyer ? 'Registered Buyer' : 'Dnyaneshwar Patil',
      phone: '+91 98231 44521',
      category: category,
      subject: orderId,
      description: description,
      priority: 'HIGH'
    });

    setGrievances([newG, ...grievances]);
    setShowModal(false);
    setDescription('');
    const notice = dbRes?.source === 'supabase' ? ' (Saved to Supabase PostgreSQL)' : '';
    alert(`Grievance ticket created successfully!${notice} Our APMC Ombudsman & Escrow Trustee will contact you within 2 hours.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl border border-slate-700 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-red-500/20 text-red-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-red-500/30">
              Dispute Redressal & Ombudsman
            </span>
            <span className="text-[11px] text-slate-300 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>APMC Statutory Arbitration Backed</span>
            </span>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
              isSupabaseConfigured()
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                : 'bg-slate-700 text-slate-300 border-slate-600'
            }`}>
              {isSupabaseConfigured() ? '🟢 Supabase PostgreSQL Synced' : '🔵 Local Storage Mode'}
            </span>
          </div>

          <h4 className="font-black text-lg font-heading flex items-center gap-2">
            <span>🛡️ {isBuyer ? "Buyer Dispute & Escrow Grievance Redressal" : "Farmer & FPO Dispute Redressal"}</span>
          </h4>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            {isBuyer 
              ? "Fast-track resolution for quality grading mismatches, weighbridge discrepancies, dispatch delays, or escrow refunds."
              : "Direct dispute arbitration for payment delays, moisture deduction disagreements, and transporter disputes."}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-center px-4 py-2.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-red-600/30 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Raise New Grievance Ticket</span>
        </button>
      </div>

      {/* Fast Contact Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400">APMC Toll-Free Helpline</div>
            <div className="text-xs font-black text-slate-800">1800-233-0199 (24x7)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400">Escrow Trustee Arbitration</div>
            <div className="text-xs font-black text-emerald-700">Legally Guaranteed Settlement</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-400">Average Turnaround Time</div>
            <div className="text-xs font-black text-amber-700">&lt; 24 Hours Resolution</div>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Active & Past Grievance Tickets ({grievances.length})
          </h4>
          <span className="text-[11px] text-slate-400">Live Status from Mandi Ombudsman</span>
        </div>

        {grievances.map((g) => (
          <div key={g.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">{g.id}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-bold text-slate-700">{g.orderId}</span>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                g.statusType === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {g.status}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 font-heading">{g.category}</h4>
              <p className="text-xs text-slate-600 mt-1">{g.description}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <span>Counterparty: <strong className="text-slate-700">{g.counterpartyName}</strong></span>
              <span>Date Raised: <strong>{g.dateRaised}</strong></span>
              <span className="text-emerald-700 font-black">{g.resolutionETA}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Grievance Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-red-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <h4 className="font-bold text-sm">
                  {isBuyer ? "Raise Buyer Dispute Ticket" : "Raise Transaction Grievance"}
                </h4>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white hover:opacity-80 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGrievance} className="p-6 space-y-4">

              {/* KisanAwaaz — voice-guided grievance filing (additive, isolated) */}
              <KisanAwaazTrigger
                formConfig={isBuyer ? FORM_GRIEVANCE_BUYER : FORM_GRIEVANCE_FARMER}
                onVoiceSubmit={(v) => {
                  const newG = {
                    id: `GRV-2026-${Math.floor(100 + Math.random() * 900)}`,
                    orderId:           v.orderId   || orderId,
                    counterpartyName:  isBuyer ? 'Kisan Agro Member / Transporter' : 'Corporate Procurement Desk',
                    category:          v.category  || category,
                    description:       v.description || description,
                    dateRaised:        new Date().toISOString().split('T')[0],
                    status:            'Ticket Created • Under Fast-Track Redressal',
                    statusType:        'warning',
                    resolutionETA:     'Within 24-48 Hours',
                  };
                  setGrievances([newG, ...grievances]);
                  setShowModal(false);
                  alert('Grievance ticket created successfully! Our APMC Ombudsman & Escrow Trustee will contact you within 2 hours.');
                }}
                onPreFill={(v) => {
                  if (v.orderId)      setOrderId(v.orderId);
                  if (v.category)     setCategory(v.category);
                  if (v.description)  setDescription(v.description);
                }}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Order ID</label>
                <div className="relative flex items-center">
                  <select
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-300 text-xs font-bold appearance-none bg-white"
                  >
                    {isBuyer ? (
                      <>
                        <option value="ORD-9821 (Wheat 200 Qtl - Dnyaneshwar Patil)">ORD-9821 (Wheat 200 Qtl - Dnyaneshwar Patil)</option>
                        <option value="ORD-9740 (Onion 150 Qtl - Nashik FPO)">ORD-9740 (Onion 150 Qtl - Nashik FPO)</option>
                        <option value="ORD-9610 (Soybean 120 Qtl - Latur Hub)">ORD-9610 (Soybean 120 Qtl - Latur Hub)</option>
                      </>
                    ) : (
                      <>
                        <option value="ORD-9912 (Soybean 140 Qtl - Adani Wilmar)">ORD-9912 (Soybean 140 Qtl - Adani Wilmar)</option>
                        <option value="ORD-9950 (Onion 85 Qtl - Sahyadri Agro)">ORD-9950 (Onion 85 Qtl - Sahyadri Agro)</option>
                        <option value="ORD-9972 (Wheat 210 Qtl - ITC Choupal)">ORD-9972 (Wheat 210 Qtl - ITC Choupal)</option>
                      </>
                    )}
                  </select>
                  <VoiceInputMic onResult={setOrderId} type="select" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dispute Reason / Category</label>
                <div className="relative flex items-center">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-300 text-xs font-bold appearance-none bg-white"
                  >
                    {isBuyer ? (
                      <>
                        <option value="Quality / Moisture Variance">Quality / Moisture Variance (Exceeding Contract Spec)</option>
                        <option value="Weighbridge / Quantity Shortage">Weighbridge / Quantity Shortage at Gate</option>
                        <option value="Delivery Delay (>48h after dispatch)">Delivery / Transit Delay</option>
                        <option value="Transporter Delayed / Goods Damaged">Transporter Mishandling / Goods Damaged</option>
                        <option value="Escrow Refund / Cancellation Request">Escrow Refund / Order Cancellation Request</option>
                      </>
                    ) : (
                      <>
                        <option value="Payment Delay">Payment Delay (&gt;48 Hours after Delivery)</option>
                        <option value="Quality Grading Disagreement">Quality Grading Disagreement / Arbitrary Deduction</option>
                        <option value="Weighment Discrepancy">Weighment Discrepancy at APMC Gate</option>
                        <option value="Transporter No-Show">Transporter Delayed / No-Show</option>
                      </>
                    )}
                  </select>
                  <VoiceInputMic onResult={setCategory} type="select" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Explanation & Evidence</label>
                <div className="relative flex">
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain what happened with transaction date, weighbridge receipt slip numbers, assay certificate details, etc."
                    className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500"
                  ></textarea>
                  <div className="absolute right-0 top-0 bottom-0 flex items-center pr-1 pointer-events-none">
                    <div className="pointer-events-auto">
                      <VoiceInputMic onResult={setDescription} type="text" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Submit Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
