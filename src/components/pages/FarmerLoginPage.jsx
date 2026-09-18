import React, { useState } from 'react';
import { Sprout, Phone, Mail, Lock, Eye, EyeOff, ChevronLeft, ArrowRight, AlertCircle, Sparkles, UserCheck } from 'lucide-react';
import VoiceInputMic from '../common/VoiceInputMic';
import { authService } from '../../services/authService';

export default function FarmerLoginPage({ onLoginSuccess, onBack, onRegister }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState({ type: '', message: '' });

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorInfo({ type: '', message: '' });

    const cleanIdent = identifier.trim();
    if (!cleanIdent) {
      setErrorInfo({
        type: 'INVALID_INPUT',
        message: 'कृपया अपना पंजीकृत मोबाइल नंबर या ईमेल आईडी दर्ज करें / Enter registered mobile or email'
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
      const res = await authService.loginWithCredentials(cleanIdent, password, 'farmer');
      if (res.success && res.user) {
        onLoginSuccess(res.user, 'farmer');
      } else {
        setErrorInfo({
          type: res.errorType || 'AUTH_ERROR',
          message: res.error || 'लॉगिन विफल रहा। कृपया विवरण पुनः जांचें।'
        });
      }
    } catch (err) {
      setErrorInfo({
        type: 'SERVER_ERROR',
        message: 'सर्वर से कनेक्ट करने में समस्या हुई। कृपया पुनः प्रयास करें।'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setLoading(true);
    try {
      const res = authService.loginAsDemo('farmer');
      if (res.success && res.user) {
        onLoginSuccess(res.user, 'farmer');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        {/* Back navigation */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-700 text-sm font-medium mb-6 transition group cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Choose different role / भूमिका बदलें
        </button>

        <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-900/10 border border-emerald-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-green-600 p-7 text-white text-center relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-emerald-500/30 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/40">
              ⚡ Secure Account Login
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
              <Sprout className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-black font-heading mb-1">Farmer Portal / किसान पोर्टल</h1>
            <p className="text-emerald-100 text-xs">Direct Selling • MSP Benchmark • Live Price Linkage</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100">
            <button
              type="button"
              className="flex-1 py-3.5 text-sm font-bold transition capitalize text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50"
            >
              🔑 Login / लॉगिन
            </button>
            <button
              type="button"
              onClick={onRegister}
              className="flex-1 py-3.5 text-sm font-bold transition capitalize text-slate-400 hover:text-emerald-700 cursor-pointer"
            >
              📝 Register / नया पंजीकरण
            </button>
          </div>

          <div className="p-7 space-y-5">
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
                      यह मोबाइल नंबर / ईमेल <strong>"{identifier}"</strong> Anaaj पोर्टल पर पंजीकृत नहीं है। किसान सेवाओं और वास्तविक मंडी दरों का लाभ उठाने के लिए कृपया पहले निःशुल्क खाता बनाएं।
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onRegister}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>📝 Create Account / नया खाता बनाएं (1 Min)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Wrong Password / General Error Banner */}
            {errorInfo.type && errorInfo.type !== 'USER_NOT_FOUND' && (
              <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorInfo.message}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Phone / Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
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
                    placeholder="10-digit mobile or email address"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-semibold text-slate-800"
                  />
                  <VoiceInputMic onResult={(val) => setIdentifier(String(val))} type="text" />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-600">
                    Password / पासवर्ड *
                  </label>
                </div>
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
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-semibold text-slate-800"
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

              {/* Submit Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? '⏳ Verifying Credentials...' : (
                  <>
                    🌾 Enter Farmer Dashboard / किसान लॉगिन
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Link to Registration */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Don't have an account? / नया खाता नहीं है?{' '}
                <button
                  type="button"
                  onClick={onRegister}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Register here / पंजीकरण करें
                </button>
              </p>
            </div>

            {/* Quick Demo Login Option */}
            <div className="border-t border-dashed border-slate-200 pt-4">
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 font-bold mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Evaluation Mode / डेमो खाता परीक्षण:</span>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                👨‍🌾 Quick Demo Login (Dnyaneshwar Patil - Verified Farmer)
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-4">
          🔒 Secured by Supabase Cloud PostgreSQL • OTP Phone Verification on Registration
        </p>
      </div>
    </div>
  );
}
