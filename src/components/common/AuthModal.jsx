import React, { useState } from 'react';
import { X, Sprout, Users, Building2, Phone, Lock, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import VoiceInputMic from './VoiceInputMic';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onLoginSuccess, t }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [role, setRole] = useState('farmer'); // 'farmer' | 'fpo' | 'buyer'
  const [step, setStep] = useState(1); // 1: details, 2: OTP
  const [phone, setPhone] = useState('9823145678');
  const [name, setName] = useState('Dnyaneshwar Patil');
  const [location, setLocation] = useState('Nashik, Maharashtra');
  const [otp, setOtp] = useState(['5', '6', '1', '6']);

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const loggedUser = {
      name: name || (role === 'farmer' ? 'Dnyaneshwar Patil' : role === 'fpo' ? 'Sahyadri Agro FPO' : 'Adani Wilmar Ltd'),
      phone: phone || '9823145678',
      role: role,
      location: location || 'Nashik, Maharashtra'
    };
    onLoginSuccess(loggedUser, role);
    onClose();
  };

  const handleQuickDemoLogin = (selectedRole, demoName, demoLoc) => {
    setRole(selectedRole);
    setName(demoName);
    setLocation(demoLoc);
    const loggedUser = {
      name: demoName,
      phone: '9823145678',
      role: selectedRole,
      location: demoLoc
    };
    onLoginSuccess(loggedUser, selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-agri-800 to-agri-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Sprout className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading">
                {mode === 'login' ? 'KisanConnect Portal Login' : 'Register New Account'}
              </h3>
              <p className="text-xs text-emerald-100">
                OTP-based instant login for Farmers, FPOs & Buyers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Your User Category:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('farmer')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition ${
                  role === 'farmer'
                    ? 'border-agri-600 bg-agri-50 text-agri-900 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Sprout className={`w-5 h-5 ${role === 'farmer' ? 'text-agri-600' : 'text-slate-400'}`} />
                <span className="text-xs">👨🌾 Farmer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('fpo')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition ${
                  role === 'fpo'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Users className={`w-5 h-5 ${role === 'fpo' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="text-xs">🏢 FPO</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition ${
                  role === 'buyer'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Building2 className={`w-5 h-5 ${role === 'buyer' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-xs">🏭 Buyer</span>
              </button>
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {role === 'farmer' ? 'Full Name (as on Aadhaar/7-12)' : role === 'fpo' ? 'FPO Name & Reg. No' : 'Company / Mill Name'}
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={role === 'farmer' ? 'e.g. Dnyaneshwar Patil' : role === 'fpo' ? 'e.g. Sahyadri Agri FPO' : 'e.g. Adani Wilmar'}
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                    />
                    <VoiceInputMic onResult={setName} type="text" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (for OTP Login)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">+91</span>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98231 XXXXX"
                    className="w-full pl-12 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                  />
                  <VoiceInputMic onResult={val => setPhone(String(val).replace(/\D/g, '').slice(0, 10))} type="number" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Location / District
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Nashik, Maharashtra"
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
                  />
                  <VoiceInputMic onResult={setLocation} type="text" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Send 4-Digit OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                <span>OTP sent to <strong>+91 {phone}</strong></span>
                <button type="button" onClick={() => setStep(1)} className="text-agri-700 underline font-semibold">Change</button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 text-center">
                  Enter 4-Digit Verification Code
                </label>
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      defaultValue={otp[idx] || ''}
                      className="w-12 h-12 text-center text-lg font-bold rounded-xl border-2 border-agri-500 focus:outline-none focus:ring-2 focus:ring-agri-600 bg-slate-50"
                    />
                  ))}
                </div>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  (Auto-filled demo OTP: 5616)
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Enter Dashboard</span>
              </button>
            </form>
          )}

          {/* Quick Demo Test Buttons for Hackathon Judges */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ One-Click Instant Demo Access (Hackathon Judges):</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('farmer', 'Dnyaneshwar Patil (Farmer)', 'Nashik, Maharashtra')}
                className="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 text-center"
              >
                👨🌾 Demo Farmer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('fpo', 'Sahyadri Agro FPO (500 Farmers)', 'Dindori, Nashik')}
                className="px-2 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200 text-center"
              >
                🌾 Demo FPO
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('buyer', 'ITC Agri Procurement', 'Indore Hub')}
                className="px-2 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200 text-center"
              >
                🏢 Demo Buyer
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button type="button" onClick={() => setMode('register')} className="font-bold text-agri-700 hover:underline">
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button type="button" onClick={() => setMode('login')} className="font-bold text-agri-700 hover:underline">
                  Login here
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
