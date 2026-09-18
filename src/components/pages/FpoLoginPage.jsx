import React, { useState } from 'react';
import { Building2, Phone, Mail, Lock, Eye, EyeOff, ChevronLeft, ArrowRight, AlertCircle, Sparkles, Users } from 'lucide-react';
import VoiceInputMic from '../common/VoiceInputMic';
import { authService } from '../../services/authService';

export default function FpoLoginPage({ onLoginSuccess, onBack, onRegister }) {
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
        message: 'कृपया FPO का पंजीकृत मोबाइल नंबर या ईमेल आईडी दर्ज करें / Enter registered mobile or email'
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
      const res = await authService.loginWithCredentials(cleanIdent, password, 'fpo');
      if (res.success && res.user) {
        onLoginSuccess(res.user, 'fpo');
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
      const res = authService.loginAsDemo('fpo');
      if (res.success && res.user) {
        onLoginSuccess(res.user, 'fpo');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-amber-700 text-sm font-medium mb-6 transition group cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Choose different role / भूमिका बदलें
        </button>

        <div className="bg-white rounded-3xl shadow-2xl shadow-amber-900/10 border border-amber-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-7 text-white text-center relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-amber-400/30 text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300/40">
              ⚡ Verified FPO Auth
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
              <Users className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-black font-heading mb-1">FPO Portal / किसान उत्पादक संगठन</h1>
            <p className="text-amber-100 text-xs">Collective Bargaining • Bulk Contracts • Storage Pools</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100">
            <button
              type="button"
              className="flex-1 py-3.5 text-sm font-bold transition capitalize text-amber-700 border-b-2 border-amber-600 bg-amber-50/50"
            >
              🔑 Login / लॉगिन
            </button>
            <button
              type="button"
              onClick={onRegister}
              className="flex-1 py-3.5 text-sm font-bold transition capitalize text-slate-400 hover:text-amber-700 cursor-pointer"
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
                      ⚠️ FPO खाता नहीं मिला! (Account Not Registered)
                    </p>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      यह मोबाइल नंबर / ईमेल <strong>"{identifier}"</strong> पंजीकृत FPO में नहीं मिला। अपने किसान समूह के लिए Anaaj मंच से जुड़ने के लिए कृपया पहले पंजीकरण पूरा करें।
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onRegister}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>📝 Register New FPO / नया FPO पंजीकृत करें</span>
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
              {/* Phone / Email */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  CEO / Manager Mobile or Email *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400">
                    {identifier.includes('@') ? (
                      <Mail className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Phone className="w-4 h-4 text-amber-600" />
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
                    placeholder="10-digit mobile or official email"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold text-slate-800"
                  />
                  <VoiceInputMic onResult={(val) => setIdentifier(String(val))} type="text" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Password / पासवर्ड *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400">
                    <Lock className="w-4 h-4 text-amber-600" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorInfo.type) setErrorInfo({ type: '', message: '' });
                    }}
                    placeholder="Enter FPO account password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold text-slate-800"
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
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-sm rounded-xl shadow-lg shadow-amber-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? '⏳ Verifying Credentials...' : (
                  <>
                    🌾 Enter FPO Dashboard / FPO लॉगिन
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                New FPO or Cooperative Society?{' '}
                <button
                  type="button"
                  onClick={onRegister}
                  className="font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  Register here / पंजीकरण करें
                </button>
              </p>
            </div>

            {/* Quick Demo Login Option */}
            <div className="border-t border-dashed border-slate-200 pt-4">
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 font-bold mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Evaluation Mode / डेमो खाता:</span>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                🌾 Quick Demo Login (Sahyadri Agro FPO)
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
