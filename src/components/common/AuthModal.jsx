import React, { useState } from 'react';
import { X, Sprout, Users, Building2, Phone, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import VoiceInputMic from './VoiceInputMic';
import { authService } from '../../services/authService';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onLoginSuccess, t }) {
  const [role, setRole] = useState('farmer'); // 'farmer' | 'fpo' | 'buyer'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState({ type: '', message: '' });

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorInfo({ type: '', message: '' });

    const cleanIdent = identifier.trim();
    if (!cleanIdent) {
      setErrorInfo({
        type: 'INVALID_INPUT',
        message: 'कृपया अपना मोबाइल नंबर या ईमेल आईडी दर्ज करें / Enter mobile or email'
      });
      return;
    }

    if (!password) {
      setErrorInfo({
        type: 'INVALID_INPUT',
        message: 'कृपया अपना पासवर्ड दर्ज करें / Please enter your password'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await authService.loginWithCredentials(cleanIdent, password, role);
      if (res.success && res.user) {
        onLoginSuccess(res.user, role);
        onClose();
      } else {
        setErrorInfo({
          type: res.errorType || 'AUTH_ERROR',
          message: res.error || 'लॉगिन विफल रहा। कृपया पुनः प्रयास करें।'
        });
      }
    } catch (err) {
      setErrorInfo({
        type: 'SERVER_ERROR',
        message: 'सर्वर से कनेक्ट करने में समस्या हुई।'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (selectedRole) => {
    const res = authService.loginAsDemo(selectedRole);
    if (res.success && res.user) {
      onLoginSuccess(res.user, selectedRole);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Sprout className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading">
                Portal Login / पोर्टल लॉगिन
              </h3>
              <p className="text-xs text-emerald-100">
                Secure Password-based access for registered Farmers, FPOs & Buyers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Your User Category / श्रेणी चुनें:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRole('farmer');
                  setErrorInfo({ type: '', message: '' });
                }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition cursor-pointer ${
                  role === 'farmer'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Sprout className={`w-5 h-5 ${role === 'farmer' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-xs">👨🌾 Farmer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('fpo');
                  setErrorInfo({ type: '', message: '' });
                }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition cursor-pointer ${
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
                onClick={() => {
                  setRole('buyer');
                  setErrorInfo({ type: '', message: '' });
                }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition cursor-pointer ${
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

          {/* User Not Found Warning Box with Redirect Button */}
          {errorInfo.type === 'USER_NOT_FOUND' && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl animate-in fade-in space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-amber-900">
                    ⚠️ खाता नहीं मिला! (Account Not Registered)
                  </p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    यह मोबाइल नंबर / ईमेल <strong>"{identifier}"</strong> Anaaj पोर्टल पर पंजीकृत नहीं है। कृपया पहले नया खाता बनाएं।
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  window.location.hash = '#register';
                  // trigger register flow via custom event or reload if needed
                  window.dispatchEvent(new CustomEvent('anaaj-open-register', { detail: { role } }));
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>📝 Create New Account / नया खाता बनाएं</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Wrong Password / General Error Banner */}
          {errorInfo.type && errorInfo.type !== 'USER_NOT_FOUND' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorInfo.message}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number or Email / मोबाइल नंबर या ईमेल *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400">
                  {identifier.includes('@') ? (
                    <Mail className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Phone className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorInfo.type) setErrorInfo({ type: '', message: '' });
                  }}
                  placeholder="10-digit mobile number or email"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                />
                <VoiceInputMic onResult={(val) => setIdentifier(String(val))} type="text" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password / पासवर्ड *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400">
                  <Lock className="w-4 h-4 text-emerald-600" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorInfo.type) setErrorInfo({ type: '', message: '' });
                  }}
                  placeholder="Enter your account password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? '⏳ Verifying Credentials...' : (
                <>
                  <span>Login / पोर्टल में प्रवेश करें</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ One-Click Instant Preview Access:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('farmer')}
                className="px-2 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 text-center cursor-pointer"
              >
                👨🌾 Demo Farmer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('fpo')}
                className="px-2 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200 text-center cursor-pointer"
              >
                🌾 Demo FPO
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('buyer')}
                className="px-2 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200 text-center cursor-pointer"
              >
                🏢 Demo Buyer
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
