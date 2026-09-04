import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2, Clock, Plus, X } from 'lucide-react';

export default function FarmerGrievance({ t }) {
  const [grievances, setGrievances] = useState([
    {
      id: "GRV-2026-042",
      orderId: "ORD-9912 (Soybean 140 Qtl)",
      buyerName: "Adani Wilmar Ltd",
      category: "Payment Delay (>48h after delivery)",
      description: "Crop delivered on 28th Aug. Quality assay cleared but remaining 80% escrow payment not credited.",
      dateRaised: "2026-08-30",
      status: "In Review by Mandi Admin",
      statusType: "warning",
      resolutionETA: "Resolved in 24 Hours"
    },
    {
      id: "GRV-2026-018",
      orderId: "ORD-8840 (Onion 60 Qtl)",
      buyerName: "Sahyadri Agro",
      category: "Grading / Weighment Dispute",
      description: "Buyer claimed 3% excess moisture deduction. Re-tested with digital meter.",
      dateRaised: "2026-08-15",
      status: "Resolved • Full Payment Released",
      statusType: "success",
      resolutionETA: "Closed"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState('ORD-9950');
  const [category, setCategory] = useState('Payment Delay');
  const [description, setDescription] = useState('');

  const handleCreateGrievance = (e) => {
    e.preventDefault();
    const newG = {
      id: `GRV-2026-${Math.floor(100 + Math.random() * 900)}`,
      orderId,
      buyerName: "ITC Agri Procurement",
      category,
      description,
      dateRaised: new Date().toISOString().split('T')[0],
      status: "Ticket Created • Under Fast-Track Redressal",
      statusType: "warning",
      resolutionETA: "Within 48 Hours"
    };

    setGrievances([newG, ...grievances]);
    setShowModal(false);
    setDescription('');
    alert("Grievance ticket created successfully! Our APMC Ombudsman will contact you within 2 hours.");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-100 rounded-2xl border border-slate-200">
        <div>
          <h4 className="font-bold text-sm text-slate-900 font-heading flex items-center gap-2">
            <span>🛡️ Farmer Dispute & Escrow Grievance Redressal</span>
          </h4>
          <p className="text-xs text-slate-500">
            Backed by Maharashtra APMC Fast-Track Dispute Arbitration System (SIH 2026)
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Raise New Dispute Ticket</span>
        </button>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {grievances.map((g) => (
          <div key={g.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-500">{g.id}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-bold text-slate-800">{g.orderId}</span>
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
              <span>Against: <strong className="text-slate-700">{g.buyerName}</strong></span>
              <span>Date: {g.dateRaised}</span>
              <span className="text-emerald-700 font-bold">{g.resolutionETA}</span>
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
                <h4 className="font-bold text-sm">Raise Transaction Grievance</h4>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGrievance} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Order ID</label>
                <select
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="ORD-9912 (Soybean 140 Qtl)">ORD-9912 (Soybean 140 Qtl - Adani Wilmar)</option>
                  <option value="ORD-9950 (Onion 85 Qtl)">ORD-9950 (Onion 85 Qtl - Sahyadri Agro)</option>
                  <option value="ORD-9972 (Wheat 210 Qtl)">ORD-9972 (Wheat 210 Qtl - ITC Choupal)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dispute Reason</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="Payment Delay">Payment Delay (&gt;48 Hours)</option>
                  <option value="Quality Grading Disagreement">Quality Grading Disagreement</option>
                  <option value="Weighment Discrepancy">Weighment Discrepancy</option>
                  <option value="Transporter No-Show">Transporter Delayed / No-Show</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Explanation</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what happened with transaction date, weighbridge receipt slip numbers, etc."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
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
