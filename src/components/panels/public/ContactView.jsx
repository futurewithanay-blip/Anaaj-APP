import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactView({ t }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Nashik');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const kvkCenters = [
    { district: "Nashik KVK", center: "Krishi Vigyan Kendra, Yashwantrao Chavan Maharashtra Open University (YCMOU), Nashik", phone: "0253-2230100" },
    { district: "Pune KVK", center: "Krishi Vigyan Kendra, Narayangaon, Junnar (Pune)", phone: "02132-242045" },
    { district: "Nagpur KVK", center: "ICAR-Central Institute for Cotton Research (CICR) KVK, Nagpur", phone: "07103-275536" },
    { district: "Latur KVK", center: "Krishi Vigyan Kendra, Vasantrao Naik Marathwada Krishi Vidyapeeth, Latur", phone: "02382-245220" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-agri-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-agri-800">
        <div className="max-w-3xl space-y-3">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-400/30">
            24x7 Farmer Assistance & KVK Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Get in Touch & District Support
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Reach out to our toll-free farmer helpline, connect with your district Krishi Vigyan Kendra (KVK) agronomists, or submit an official inquiry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Helpline & KVK Directory (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Toll Free Call Box */}
          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
                <Phone className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-base text-emerald-950 font-heading">Kisan Call Center (KCC)</h4>
                <p className="text-xs text-emerald-800">Toll-free 24x7 in 22 regional Indian languages</p>
              </div>
            </div>
            <a
              href="tel:18001801551"
              className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition text-center"
            >
              1800-180-1551
            </a>
          </div>

          {/* District KVK Centers Directory */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 font-heading">
              Maharashtra District Krishi Vigyan Kendras (KVK)
            </h3>
            <div className="space-y-3">
              {kvkCenters.map((kvk, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">{kvk.district}</strong>
                    <a href={`tel:${kvk.phone}`} className="text-agri-700 font-bold hover:underline">
                      📞 {kvk.phone}
                    </a>
                  </div>
                  <p className="text-slate-500 text-[11px]">{kvk.center}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Contact Form (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 font-heading">
              Send an Inquiry or Grievance
            </h3>
            <p className="text-xs text-slate-500">
              Our agriculture desk will respond within 4 business hours.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">Inquiry Received!</h4>
                <p className="text-xs text-emerald-700">
                  Your ticket #INQ-2026-89 has been registered. An SMS confirmation has been dispatched.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rameshwar Shinde"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-agri-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98231 XXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-agri-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  >
                    <option value="Nashik">Nashik</option>
                    <option value="Pune">Pune</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Latur">Latur</option>
                    <option value="Yavatmal">Yavatmal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Inquiry</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can our agri desk assist you today?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-agri-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
