import React, { useState } from 'react';
import { Users, ChevronLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function FpoLoginPage({ onLoginSuccess, onBack, onRegister }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => { setOtpSent(true); setLoading(false); }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        name: 'Nashik Kisan Utpadak Sangh FPO',
        phone: phone || '9765432100',
        role: 'fpo',
        regNo: 'MH-FPO-2021-4872',
        district: 'Nashik',
        members: 287,
        avatar: '🤝',
      }, 'fpo');
    }, 1500);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        name: 'Nashik Kisan Utpadak Sangh FPO',
        phone: '9765432100',
        role: 'fpo',
        regNo: 'MH-FPO-2021-4872',
        district: 'Nashik',
        members: 287,
        avatar: '🤝',
      }, 'fpo');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-amber-700 text-sm font-medium mb-6 transition group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Choose different role
        </button>

        <div className="bg-white rounded-3xl shadow-2xl shadow-amber-900/10 border border-amber-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-black mb-1">FPO Portal</h1>
            <p className="text-amber-200 text-sm">किसान उत्पादक संगठन • <span className="font-bold">अnaaj</span></p>
          </div>

          <div className="flex border-b border-slate-100">
            <button className="flex-1 py-3.5 text-sm font-bold transition capitalize text-amber-700 border-b-2 border-amber-600 bg-amber-50/50">
              🔑 Login
            </button>
            <button onClick={onRegister} className="flex-1 py-3.5 text-sm font-bold transition capitalize text-slate-400 hover:text-slate-600">
              📝 Register FPO
            </button>
          </div>

          <div className="p-7 space-y-5">

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">CEO / Manager Mobile *</label>
              <div className="flex gap-2">
                <span className="px-3 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-600">+91</span>
                <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile" className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
            </div>

            {!otpSent ? (
              <button onClick={handleSendOtp} disabled={phone.length < 10 || loading} className="w-full py-3 bg-amber-100 text-amber-700 font-bold text-sm rounded-xl border border-amber-200 hover:bg-amber-200 transition disabled:opacity-50">
                {loading ? '⏳ Sending OTP...' : '📲 Send OTP'}
              </button>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Enter OTP *</label>
                <div className="flex gap-2 items-center">
                  <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit OTP" className="flex-1 px-4 py-3 rounded-xl border border-amber-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono tracking-widest" />
                  {otp.length === 6 && <CheckCircle2 className="w-5 h-5 text-amber-500" />}
                </div>
                <p className="text-xs text-amber-600 mt-1">✅ OTP sent to +91-{phone} (Demo: any 6 digits)</p>
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-sm rounded-xl shadow-lg shadow-amber-600/30 transition flex items-center justify-center gap-2">
              {loading ? '⏳ Verifying...' : (<>🤝 Enter FPO Dashboard <ArrowRight className="w-4 h-4" /></>)}
            </button>

            <div className="border-t border-dashed border-slate-200 pt-4">
              <p className="text-center text-xs text-slate-400 mb-3">For Demo / Hackathon</p>
              <button onClick={handleDemoLogin} className="w-full py-3 bg-amber-50 border border-amber-200 text-amber-800 font-bold text-sm rounded-xl hover:bg-amber-100 transition flex items-center justify-center gap-2">
                🤝 Quick Demo Login (FPO)
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-slate-400 text-xs mt-4">🔒 SFAC-registered FPO Verification • Govt. of India</p>
      </div>
    </div>
  );
}
