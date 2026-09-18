import React, { useState, useRef, Fragment } from 'react';
import {
  Check, ArrowRight, ArrowLeft, Camera, Sprout, Users, Building2,
  ShieldCheck, MapPin, Phone, Mail, Lock, Eye, EyeOff, User,
  FileText, Warehouse, Truck, Leaf, Globe, Star, ChevronDown,
  Package, CreditCard, Award, BarChart2, AlertCircle, X
} from 'lucide-react';
import { translations } from '../../i18n/translations';
import KisanAwaazTrigger from '../kisanAwaaz/KisanAwaazTrigger';
import { FORM_REGISTRATION_S1 } from '../kisanAwaaz/KisanAwaazConfig';
import VoiceInputMic from '../kisanAwaaz/mode1/VoiceInputMic';
import { authService } from '../../services/authService';

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Basic Details' },
  { id: 2, label: 'Select Role' },
  { id: 3, label: 'Role Details' },
  { id: 4, label: 'Complete' },
];

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra',
  'Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi'];

const CROPS = ['Wheat','Rice','Maize','Soybean','Cotton','Sugarcane','Onion','Tomato','Potato',
  'Garlic','Chilli','Grapes','Pomegranate','Banana','Mango','Pulses','Oilseeds','Vegetables','Fruits','Other'];

const FARMER_SERVICES = ['Weather Alerts','Crop Disease Detection','Market Prices','Government Schemes',
  'Organic Farming Tips','Expert Advice'];

const FPO_ACTIVITIES = ['Aggregation','Procurement','Storage','Processing','Packaging',
  'Transportation','Direct Market Selling','Export'];

const BUYER_CROPS = ['Wheat','Rice','Potato','Onion','Tomato','Fruits','Vegetables',
  'Pulses','Oilseeds','Organic Products','Other'];

const QUALITY_PREFS = ['Organic','Natural','Conventional'];

const POPULAR_BANKS = [
  'State Bank of India (SBI)',
  'Bank of Baroda',
  'Punjab National Bank (PNB)',
  'Canara Bank',
  'Union Bank of India',
  'Bank of India',
  'Central Bank of India',
  'Indian Bank',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Maharashtra Gramin Bank',
  'Vidharbha Konkan Gramin Bank',
  'Baroda UP Bank',
  'Aryavart Bank',
  'Other Bank',
];

/* ─────────────────────────────────────────────
   REUSABLE FIELD COMPONENTS
───────────────────────────────────────────── */
function Label({ children, required }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function FieldWrap({ icon: Icon, children, error }) {
  return (
    <div>
      <div className={`flex items-center border rounded-lg overflow-hidden bg-white transition-all ${error ? 'border-red-400' : 'border-gray-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100'}`}>
        {Icon && (
          <span className="px-3 py-3 bg-gray-50 border-r border-gray-200 text-gray-400">
            <Icon className="w-4 h-4" />
          </span>
        )}
        {children}
      </div>
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

function Input({ icon, error, voiceConfig, ...props }) {
  const handleVoice = (val) => {
    if (voiceConfig?.onResult) {
      voiceConfig.onResult(val);
    } else if (props.onChange) {
      props.onChange({ target: { value: val } });
    }
  };
  const voiceType = voiceConfig?.type || (props.type === 'number' ? 'number' : 'text');

  return (
    <FieldWrap icon={icon} error={error}>
      <div className="flex-1 relative flex items-center">
        <input 
          {...props} 
          className={`w-full py-3 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400 pl-3 pr-10`} 
        />
        <VoiceInputMic onResult={handleVoice} type={voiceType} />
      </div>
    </FieldWrap>
  );
}

function Select({ icon, error, children, voiceConfig, ...props }) {
  const selectRef = useRef(null);
  const handleVoice = (val) => {
    if (voiceConfig?.onResult) {
      voiceConfig.onResult(val);
    } else if (props.onChange) {
      props.onChange({ target: { value: val } });
    }
  };

  return (
    <FieldWrap icon={icon} error={error}>
      <div className="flex-1 relative flex items-center">
        <select 
          ref={selectRef}
          {...props} 
          className="w-full px-3 py-3 text-sm outline-none bg-transparent text-gray-800 appearance-none pr-14"
        >
          {children}
        </select>
        <div className="absolute right-2 flex items-center gap-1">
          <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none shrink-0" />
          <VoiceInputMic targetRef={selectRef} onResult={handleVoice} type="select" />
        </div>
      </div>
    </FieldWrap>
  );
}

function RadioGroup({ options, value, onChange, name }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map(opt => (
        <label key={opt} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-all ${value === opt ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600 hover:border-teal-300'}`}>
          <input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} className="sr-only" />
          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${value === opt ? 'border-teal-500' : 'border-gray-300'}`}>
            {value === opt && <span className="w-2 h-2 rounded-full bg-teal-500" />}
          </span>
          {opt}
        </label>
      ))}
    </div>
  );
}

function MultiSelect({ options, selected, onChange }) {
  const toggle = (opt) => {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
    else onChange([...selected, opt]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => toggle(opt)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${selected.includes(opt) ? 'bg-teal-500 border-teal-500 text-white' : 'border-gray-300 text-gray-600 hover:border-teal-400'}`}>
          {selected.includes(opt) && <Check className="w-3 h-3" />}
          {opt}
        </button>
      ))}
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-gray-50 border-b border-gray-100">
        {Icon && <Icon className="w-4 h-4 text-teal-600" />}
        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h4>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function FullRow({ children }) {
  return <div className="sm:col-span-2">{children}</div>;
}

/* ─────────────────────────────────────────────
   PROGRESS INDICATOR (Interactive & clickable)
───────────────────────────────────────────── */
function ProgressBar({ currentStep, onStepClick, maxStep = 1, t }) {
  const steps = [
    { id: 1, label: t?.regStep1 || 'Basic Details' },
    { id: 2, label: t?.regStep2 || 'Select Role' },
    { id: 3, label: t?.regStep3 || 'Role Details' },
    { id: 4, label: t?.regStep4 || 'Complete' },
  ];

  return (
    <div className="flex items-center justify-center gap-0 px-6 py-6 max-w-2xl mx-auto">
      {steps.map((s, idx) => {
        const done = currentStep > s.id;
        const active = currentStep === s.id;
        const isClickable = s.id <= Math.max(currentStep, maxStep);
        return (
          <React.Fragment key={s.id}>
            <button
              type="button"
              onClick={() => isClickable && onStepClick && onStepClick(s.id)}
              disabled={!isClickable}
              className={`flex flex-col items-center gap-1.5 transition-all outline-none group ${
                isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                done ? 'bg-teal-500 border-teal-500 text-white shadow-sm' :
                active ? 'bg-teal-500 border-teal-500 text-white ring-4 ring-teal-100 shadow-md scale-110' :
                'bg-white border-gray-300 text-gray-400 group-hover:border-teal-300'
              }`}>
                {done ? <Check className="w-4 h-4 stroke-[2.5]" /> : s.id}
              </div>
              <span className={`text-xs font-semibold whitespace-nowrap transition-colors ${
                active ? 'text-teal-700 font-bold' : done ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-600'
              }`}>
                {s.label}
              </span>
            </button>
            {idx < STEPS.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-20 md:w-28 mx-1 sm:mx-2 mb-5 transition-all duration-500 ${
                currentStep > s.id ? 'bg-teal-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 1 — BASIC DETAILS
───────────────────────────────────────────── */
function Step1({ data, onChange, onNext, otpSent, otpVerified, onSendOtp, onVerifyOtp, otp, setOtp, t, receivedOtpCode, otpLoading }) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  const initials = data.name ? data.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'US';

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      setGoogleConnected(true);
      onChange('name', 'Dnyaneshwar Patil');
      onChange('email', 'dnyaneshwar.patil@gmail.com');
      if (!data.mobile) onChange('mobile', '9876543210');
      if (!data.password) onChange('password', 'GooglePass@2026');
      if (!data.confirmPassword) onChange('confirmPassword', 'GooglePass@2026');
      onChange('termsAccepted', true);

      // Auto trigger OTP verification simulation
      onSendOtp();
      setTimeout(() => {
        onVerifyOtp(['1', '2', '3', '4']);
      }, 150);
    }, 600);
  };

  const validate = () => {
    const e = {};
    if (!data.name.trim()) e.name = t?.regFullName ? `${t.regFullName} is required` : 'Full name is required';
    if (!/^\d{10}$/.test(data.mobile)) e.mobile = 'Enter a valid 10-digit mobile number';
    if (!otpVerified) e.otp = 'Please verify your mobile number with OTP (or click Auto Fill & Verify)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email address';
    if (data.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (data.password !== data.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!data.termsAccepted) e.terms = 'You must accept the Terms & Conditions';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  return (
    <div className="space-y-5 max-w-2xl mx-auto animate-in fade-in duration-200">
      {/* Profile Photo */}
      <div className="flex flex-col items-center mb-6">
        <div
          className="relative cursor-pointer group"
          onClick={() => fileRef.current?.click()}
          title="Click to upload profile photo"
        >
          <div className="w-24 h-24 rounded-full bg-teal-500 flex items-center justify-center text-white text-2xl font-black shadow-lg overflow-hidden border-2 border-white ring-4 ring-teal-100 group-hover:ring-teal-300 transition">
            {data.photoPreview ? (
              <img src={data.photoPreview} className="w-full h-full object-cover" alt="preview" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileRef.current?.click();
            }}
            className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-teal-400 flex items-center justify-center shadow-md hover:bg-teal-50 hover:scale-110 transition cursor-pointer"
            title="Upload photo"
          >
            <Camera className="w-4 h-4 text-teal-600" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-xs text-gray-500 hover:text-teal-600 mt-2 font-medium transition cursor-pointer"
        >
          {t?.regUploadPhoto || 'Click camera icon to upload profile photo'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) onChange('photoPreview', URL.createObjectURL(f));
          }}
        />
      </div>

      {/* Google Login Option */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3 text-center shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 text-teal-700">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            Quick Registration with Google
          </span>
          <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">Fast Track</span>
        </div>

        {googleConnected ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-800 text-xs font-bold animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs border border-emerald-200 shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 leading-tight">Google Account Connected</p>
                <p className="text-[11px] text-emerald-700 font-medium">dnyaneshwar.patil@gmail.com</p>
              </div>
            </div>
            <span className="bg-emerald-600 text-white text-[10px] px-2.5 py-1 rounded-lg font-extrabold uppercase tracking-wider shrink-0">
              Auto Filled ✓
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-white hover:bg-slate-100/90 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-sm hover:shadow transition-all duration-150 cursor-pointer active:scale-98"
          >
            {googleLoading ? (
              <span className="text-xs text-slate-600 font-bold flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></span>
                Connecting Google Account...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google / गूगल से जारी रखें</span>
              </>
            )}
          </button>
        )}

        <div className="relative flex items-center justify-center pt-1">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-slate-50 px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider absolute">
            or fill details manually / या विवरण स्वयं भरें
          </span>
        </div>
      </div>

      {/* Full Name */}
      {/* KisanAwaaz — voice pre-fill for Step 1 non-security fields (additive, isolated) */}
      {/* NOTE: password/OTP collection by voice is explicitly excluded (voice-security constraint) */}
      <KisanAwaazTrigger
        formConfig={FORM_REGISTRATION_S1}
        onVoiceSubmit={(v) => {
          // Only pre-fill — user must confirm and submit the form themselves.
          // Password/OTP are intentionally never passed from voice.
          if (v.name)    onChange('name',    v.name);
          if (v.phone)   onChange('phone',   v.phone);
          if (v.village) onChange('village', v.village);
          if (v.state)   onChange('state',   v.state);
          if (v.pincode) onChange('pincode', v.pincode);
        }}
        onPreFill={(v) => {
          if (v.name)    onChange('name',    v.name);
          if (v.phone)   onChange('phone',   v.phone);
          if (v.village) onChange('village', v.village);
          if (v.state)   onChange('state',   v.state);
          if (v.pincode) onChange('pincode', v.pincode);
        }}
      />

      {/* Full Name */}
      <div>
        <Label required>{t?.regFullName || 'Full Name'}</Label>
        <Input
          icon={User}
          placeholder={t?.regFullNamePlaceholder || 'Enter your full name'}
          value={data.name}
          onChange={e => onChange('name', e.target.value)}
          error={errors.name}
          voiceConfig={{ onResult: (val) => onChange('name', val), type: 'text' }}
        />
      </div>

      {/* Mobile + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>{t?.regMobile || 'Mobile Number'}</Label>
          <div className={`flex items-center border rounded-lg overflow-hidden bg-white transition-all ${
            errors.mobile ? 'border-red-400' : 'border-gray-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100'
          }`}>
            <span className="px-3 py-3 bg-gray-50 border-r border-gray-200 text-gray-400">
              <Phone className="w-4 h-4" />
            </span>
            <input
              type="tel"
              maxLength={10}
              placeholder={t?.regMobilePlaceholder || '10-digit mobile number'}
              value={data.mobile}
              onChange={e => onChange('mobile', e.target.value.replace(/\D/g, ''))}
              disabled={otpVerified}
              className="flex-1 px-3 py-3 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
            />
            {!otpVerified && (
              <button
                type="button"
                onClick={onSendOtp}
                disabled={data.mobile.length !== 10}
                className="px-3.5 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white text-xs font-bold whitespace-nowrap transition cursor-pointer"
              >
                {otpSent ? (t?.regResendOtp || 'Resend OTP') : (t?.regSendOtp || 'Send OTP')}
              </button>
            )}
          </div>
          {errors.mobile && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.mobile}</p>}

          {/* OTP input & auto-fill simulation */}
          {otpSent && !otpVerified && (
            <div className="mt-3 p-3.5 bg-teal-50 rounded-xl border-2 border-teal-300 animate-in fade-in space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-teal-900 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
                  ⚡ Supabase Live SMS OTP (+91-{data.mobile})
                </p>
                {receivedOtpCode ? (
                  <span className="text-[10px] bg-teal-200 text-teal-900 font-mono px-2 py-0.5 rounded font-black tracking-widest">
                    Code: {receivedOtpCode}
                  </span>
                ) : (
                  <span className="text-[10px] bg-teal-200/70 text-teal-900 font-mono px-2 py-0.5 rounded font-bold">
                    Demo: 1234
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-1">
                {[0, 1, 2, 3].map(i => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={otp[i]}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      const n = [...otp];
                      n[i] = val;
                      setOtp(n);
                      if (val && i < 3) document.getElementById(`reg-otp-${i + 1}`)?.focus();
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !otp[i] && i > 0) {
                        document.getElementById(`reg-otp-${i - 1}`)?.focus();
                      }
                    }}
                    id={`reg-otp-${i}`}
                    className="w-10 h-10 text-center text-lg font-bold border border-teal-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 bg-white text-slate-800"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const codeToFill = receivedOtpCode ? receivedOtpCode.split('') : ['1', '2', '3', '4'];
                    setOtp(codeToFill);
                    setTimeout(() => onVerifyOtp(codeToFill), 150);
                  }}
                  className="ml-auto text-xs font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer whitespace-nowrap"
                >
                  ⚡ {t?.regAutoVerify || 'Auto Fill & Verify'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => onVerifyOtp(otp)}
                disabled={otpLoading}
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {otpLoading ? 'Verifying with Database...' : (t?.regVerifyOtp || 'Verify OTP')}
              </button>
            </div>
          )}

          {otpVerified && (
            <div className="mt-2 flex items-center gap-1.5 text-teal-700 text-xs font-bold bg-teal-50 px-2.5 py-1.5 rounded-lg border border-teal-200">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>{t?.regMobileVerified || 'Mobile number verified successfully ✓'}</span>
            </div>
          )}
          {errors.otp && !otpVerified && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.otp}</p>}
        </div>

        <div>
          <Label required>{t?.regEmail || 'Email Address'}</Label>
          <Input
            icon={Mail}
            type="email"
            placeholder={t?.regEmailPlaceholder || 'Enter your email'}
            value={data.email}
            onChange={e => onChange('email', e.target.value)}
            error={errors.email}
          />
        </div>
      </div>

      {/* Password row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>{t?.regPassword || 'Password'}</Label>
          <FieldWrap icon={Lock} error={errors.password}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder={t?.regPassPlaceholder || 'Enter a strong password'}
              value={data.password}
              onChange={e => onChange('password', e.target.value)}
              className="flex-1 px-3 py-3 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="px-3 py-3 text-gray-400 hover:text-teal-600 transition cursor-pointer"
              title={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </FieldWrap>
          {errors.password && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
        </div>
        <div>
          <Label required>{t?.regConfirmPass || 'Confirm Password'}</Label>
          <FieldWrap icon={Lock} error={errors.confirmPassword}>
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder={t?.regConfirmPassPlaceholder || 'Confirm your password'}
              value={data.confirmPassword}
              onChange={e => onChange('confirmPassword', e.target.value)}
              className="flex-1 px-3 py-3 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(p => !p)}
              className="px-3 py-3 text-gray-400 hover:text-teal-600 transition cursor-pointer"
              title={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </FieldWrap>
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirmPassword}</p>}
        </div>
      </div>

      {/* Terms */}
      <div className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
        errors.terms ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
      }`}>
        <input
          type="checkbox"
          id="terms"
          checked={data.termsAccepted}
          onChange={e => onChange('termsAccepted', e.target.checked)}
          className="mt-1 w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500 cursor-pointer accent-teal-600"
        />
        <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer select-none leading-relaxed">
          {t?.iAgree || 'I agree to the'}{' '}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}
            className="text-teal-600 font-bold hover:underline cursor-pointer"
          >
            {t?.termsAndConditions || 'Terms & Conditions'}
          </button>{' '}
          {t?.and || 'and'}{' '}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }}
            className="text-teal-600 font-bold hover:underline cursor-pointer"
          >
            {t?.privacyPolicy || 'Privacy Policy'}
          </button>
        </label>
      </div>
      {errors.terms && <p className="text-xs text-red-500 -mt-3 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.terms}</p>}

      {/* Continue Button */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-12 py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-200 hover:shadow-lg hover:scale-102 transition cursor-pointer"
        >
          <span>→ {t?.btnContinue || 'Continue'}</span>
        </button>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 font-heading">Anaaj Platform Terms & Conditions</h3>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-gray-600 space-y-2 max-h-60 overflow-y-auto leading-relaxed pr-1">
              <p>1. <strong>Platform Access</strong>: Anaaj is a smart digital agricultural marketplace connecting farmers, FPOs, and verified buyers across India under SIH 2026 guidelines.</p>
              <p>2. <strong>Crop Declarations</strong>: All registered crop lots, quantities, and quality parameters must be truthful and subject to mandi or warehouse quality verification.</p>
              <p>3. <strong>Pricing & Transactions</strong>: Price predictions are AI-assisted estimates based on real mandi arrival patterns and historical futures data.</p>
              <p>4. <strong>Security & Fair Trade</strong>: Users agree not to post deceptive listings or manipulate bids. Violations will result in immediate suspension.</p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 font-heading">Anaaj Data Privacy Policy</h3>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-gray-600 space-y-2 max-h-60 overflow-y-auto leading-relaxed pr-1">
              <p>1. <strong>Personal Data</strong>: Your mobile number, landholding, and personal credentials are stored securely and never sold to 3rd party advertisers.</p>
              <p>2. <strong>Regulatory Compliance</strong>: Data handling complies with the Digital Personal Data Protection (DPDP) Act of India.</p>
              <p>3. <strong>Location Services</strong>: Geospatial and mandi mapping utilizes your district/GPS coordinates strictly for calculating real transport freight and net profits.</p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 2 — SELECT ROLE
───────────────────────────────────────────── */
function Step2({ selectedRole, onSelect, onNext, onPrev, t }) {
  const roles = [
    {
      id: 'farmer',
      Icon: Sprout,
      emoji: '🌾',
      title: t?.roleFarmerTitle || 'Farmer',
      subtitle: t?.roleFarmerSub || 'किसान (Individual Farmer)',
      desc: t?.roleFarmerDesc || 'Grow better. Sell smarter.',
      features: ['Crop listings & market prices', 'AI price predictions', 'Direct buyer connections', 'Weather & scheme alerts']
    },
    {
      id: 'fpo',
      Icon: Users,
      emoji: '🤝',
      title: t?.roleFpoTitle || 'FPO',
      subtitle: t?.roleFpoSub || 'किसान उत्पादक संगठन (Producer Co.)',
      desc: t?.roleFpoDesc || 'Grow together. Scale together.',
      features: ['Manage member farmers', 'Bulk aggregation & storage', 'Collective bargaining', 'Revenue distribution']
    },
    {
      id: 'buyer',
      Icon: Building2,
      emoji: '🏢',
      title: t?.roleBuyerTitle || 'Buyer',
      subtitle: t?.roleBuyerSub || 'खरीदार (Institutional / Trader)',
      desc: t?.roleBuyerDesc || 'Source directly. Buy efficiently.',
      features: ['Browse verified crop lots', 'AI farmer matching', 'Post procurement needs', 'Digital contracts & payments']
    },
  ];

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-gray-800 mb-2 font-heading">{t?.regChooseRole || 'Choose Your Role'}</h2>
        <p className="text-gray-500">{t?.regChooseRoleSub || 'Tell us how you want to participate in the Anaaj Marketplace'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {roles.map(({ id, Icon, emoji, title, subtitle, desc, features }) => {
          const selected = selectedRole === id;
          return (
            <div key={id} onClick={() => onSelect(id)}
              className={`relative rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                selected ? 'border-teal-500 shadow-xl shadow-teal-100 -translate-y-1' : 'border-gray-200 hover:border-teal-300 hover:shadow-md'
              }`}>
              {selected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className={`h-1.5 ${selected ? 'bg-teal-500' : 'bg-gray-200'} transition-colors`} />
              <div className="p-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl ${selected ? 'bg-teal-100' : 'bg-gray-100'}`}>
                  {emoji}
                </div>
                <h3 className={`text-lg font-black mb-0.5 ${selected ? 'text-teal-800' : 'text-gray-800'}`}>{title}</h3>
                <p className="text-xs text-gray-400 mb-2 font-medium">{subtitle}</p>
                <p className={`text-sm font-semibold mb-4 ${selected ? 'text-teal-600' : 'text-gray-500'}`}>{desc}</p>
                <ul className="space-y-2">
                  {features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${selected ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button onClick={onPrev} className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-teal-600 font-semibold text-sm rounded-lg border border-gray-200 hover:border-teal-300 transition cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> {t?.btnPrevious || 'Previous'}
        </button>
        <button onClick={onNext} disabled={!selectedRole}
          className="flex items-center gap-2 px-8 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm rounded-lg shadow-md shadow-teal-100 transition cursor-pointer">
          {t?.btnContinue || 'Continue'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 3 — FARMER FORM
───────────────────────────────────────────── */
function FarmerForm({ data, onChange, errors = {} }) {
  const upd = (k, v) => onChange('farmer', k, v);

  return (
    <div className="space-y-5">
      <SectionCard icon={MapPin} title="Farming Location">
        <div><Label required>State</Label>
          <Select value={data.state||''} onChange={e=>upd('state',e.target.value)} error={errors.state}>
            <option value="">Select State</option>
            {STATES.map(s=><option key={s}>{s}</option>)}
          </Select></div>
        <div><Label required>District</Label><Input placeholder="e.g. Nashik" value={data.district||''} onChange={e=>upd('district',e.target.value)} error={errors.district} voiceConfig={{onResult: v=>upd('district',v), type:'text'}}/></div>
        <div><Label required>Block / Tehsil</Label><Input placeholder="e.g. Niphad" value={data.block||''} onChange={e=>upd('block',e.target.value)} error={errors.block} voiceConfig={{onResult: v=>upd('block',v), type:'text'}}/></div>
        <div><Label required>Village</Label><Input placeholder="e.g. Ozar" value={data.village||''} onChange={e=>upd('village',e.target.value)} error={errors.village} voiceConfig={{onResult: v=>upd('village',v), type:'text'}}/></div>
        <div><Label required>Pincode</Label><Input placeholder="e.g. 422206" value={data.pincode||''} onChange={e=>upd('pincode',e.target.value)} error={errors.pincode} voiceConfig={{onResult: v=>upd('pincode',v), type:'number'}}/></div>
      </SectionCard>

      <SectionCard icon={Leaf} title="Farm Details">
        <div>
          <Label required>Total Land Area</Label>
          <div className="flex gap-2">
            <div className="flex-1 relative flex items-center border rounded-lg focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 bg-white">
              <input type="number" placeholder="e.g. 5" value={data.landArea||''} onChange={e=>upd('landArea',e.target.value)}
                className={`w-full pl-3 pr-10 py-3 text-sm outline-none bg-transparent ${errors.landArea ? 'border-red-400' : 'border-gray-300'}`} />
              <VoiceInputMic onResult={v=>upd('landArea',v)} type="number" />
            </div>
            <select value={data.landUnit||'Acre'} onChange={e=>upd('landUnit',e.target.value)}
              className="w-28 px-3 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500 bg-white">
              <option>Acre</option><option>Hectare</option><option>Bigha</option>
            </select>
          </div>
        </div>
        <div><Label>Cultivated Area</Label>
          <div className="relative flex items-center">
            <input type="number" placeholder="Cultivated area" value={data.cultivatedArea||''} onChange={e=>upd('cultivatedArea',e.target.value)}
              className="w-full pl-3 pr-10 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white" />
            <VoiceInputMic onResult={v=>upd('cultivatedArea',v)} type="number" />
          </div>
        </div>
        <FullRow><Label>Land Ownership</Label>
          <RadioGroup name="ownership" options={['Own','Leased','Both']} value={data.ownership||'Own'} onChange={v=>upd('ownership',v)}/></FullRow>
      </SectionCard>

      {/* 🛡️ AADHAAR CARD VERIFICATION SECTION */}
      <SectionCard icon={ShieldCheck} title="Aadhaar Card Verification / आधार सत्यापन">
        <div>
          <Label required>Aadhaar Number / 12-अंकीय आधार संख्या</Label>
          <div className="relative">
            <input
              type="text"
              maxLength={14}
              placeholder="XXXX XXXX XXXX"
              value={data.aadharNumber || ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
                const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
                upd('aadharNumber', formatted);
              }}
              className={`w-full px-3 py-3 text-sm border rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-mono tracking-wider ${errors.aadharNumber ? 'border-red-400' : 'border-gray-300'}`}
            />
            {data.isAadhaarVerified && (
              <span className="absolute right-3 top-2.5 text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Verified
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">12 digits unique identification number issued by UIDAI</p>
        </div>

        <div>
          <Label required>Name as on Aadhaar / आधार पर नाम</Label>
          <Input
            placeholder="Full Name as printed on Aadhaar"
            value={data.aadharName || ''}
            onChange={(e) => upd('aadharName', e.target.value)}
            voiceConfig={{ onResult: (val) => upd('aadharName', val), type: 'text' }}
          />
          <p className="text-[11px] text-gray-500 mt-1">Must match your government identity record</p>
        </div>

        <FullRow>
          {!data.isAadhaarVerified ? (
            <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    UIDAI e-KYC Verification (OTP Authentication)
                  </p>
                  <p className="text-[11px] text-teal-700 mt-0.5">
                    Verify via OTP sent to the mobile number registered with your Aadhaar for direct subsidy & mandi settlement.
                  </p>
                </div>
                {!data.aadharOtpSent && (
                  <button
                    type="button"
                    disabled={!data.aadharNumber || data.aadharNumber.replace(/\s/g, '').length < 12}
                    onClick={() => {
                      upd('aadharOtpSent', true);
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition shrink-0 ${
                      data.aadharNumber && data.aadharNumber.replace(/\s/g, '').length === 12
                        ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer shadow-sm'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Send Aadhaar OTP
                  </button>
                )}
              </div>

              {data.aadharOtpSent && (
                <div className="pt-2 border-t border-teal-200/60 flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:w-56">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP (e.g. 123456)"
                      value={data.aadharOtp || ''}
                      onChange={(e) => upd('aadharOtp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-3 py-2 text-sm text-center font-mono tracking-widest border border-teal-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-200 bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={!data.aadharOtp || data.aadharOtp.length < 6}
                    onClick={() => {
                      upd('isAadhaarVerified', true);
                      upd('aadharOtpSent', false);
                    }}
                    className={`w-full sm:w-auto px-5 py-2 text-xs font-bold rounded-lg transition ${
                      data.aadharOtp && data.aadharOtp.length === 6
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Verify & Authenticate
                  </button>
                  <button
                    type="button"
                    onClick={() => upd('aadharOtpSent', false)}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Resend OTP
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-900">Aadhaar e-KYC Verified Successfully</p>
                  <p className="text-[11px] text-emerald-700">Authenticated with UIDAI • Linked with NPCI Direct Benefit Transfer (DBT)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  upd('isAadhaarVerified', false);
                  upd('aadharOtp', '');
                }}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold underline"
              >
                Re-verify
              </button>
            </div>
          )}
        </FullRow>

        <FullRow>
          <Label>Upload Aadhaar Card Document (Optional)</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="border-2 border-dashed border-gray-200 hover:border-teal-400 rounded-xl p-4 text-center cursor-pointer transition bg-gray-50/50 hover:bg-white relative block">
              <input
                type="file"
                accept="image/*,.pdf"
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files?.[0]) upd('aadharFrontDoc', e.target.files[0].name);
                }}
              />
              <FileText className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-xs font-semibold text-gray-700">
                {data.aadharFrontDoc ? `📄 ${data.aadharFrontDoc}` : 'Upload Aadhaar Front'}
              </p>
              <p className="text-[10px] text-gray-400">PDF, JPG, PNG up to 5MB</p>
            </label>

            <label className="border-2 border-dashed border-gray-200 hover:border-teal-400 rounded-xl p-4 text-center cursor-pointer transition bg-gray-50/50 hover:bg-white relative block">
              <input
                type="file"
                accept="image/*,.pdf"
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files?.[0]) upd('aadharBackDoc', e.target.files[0].name);
                }}
              />
              <FileText className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-xs font-semibold text-gray-700">
                {data.aadharBackDoc ? `📄 ${data.aadharBackDoc}` : 'Upload Aadhaar Back'}
              </p>
              <p className="text-[10px] text-gray-400">PDF, JPG, PNG up to 5MB</p>
            </label>
          </div>
        </FullRow>
      </SectionCard>

      {/* 💳 BANK ACCOUNT DETAILS SECTION */}
      <SectionCard icon={CreditCard} title="Bank Account Details / बैंक खाता विवरण">
        <FullRow>
          <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                Direct Benefit Transfer (DBT) & Escrow Mandi Settlement Account
                <span className="bg-emerald-200/70 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">24-Hr Payout</span>
              </p>
              <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                Crop sales earnings, mandi MSP payments, and government subsidies (PM-KISAN) will be transferred directly to this verified account without intermediaries.
              </p>
            </div>
          </div>
        </FullRow>

        {/* Account Holder Name */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label required>Account Holder Name / खाताधारक का नाम</Label>
            {data.aadharName && (
              <button
                type="button"
                onClick={() => upd('bankHolderName', data.aadharName)}
                className="text-[11px] text-teal-600 hover:text-teal-800 font-semibold underline cursor-pointer"
              >
                Use Aadhaar Name
              </button>
            )}
          </div>
          <Input
            placeholder="Full Name as in Bank Passbook"
            value={data.bankHolderName || ''}
            onChange={(e) => upd('bankHolderName', e.target.value)}
            error={errors.bankHolderName}
          />
          <p className="text-[11px] text-gray-500 mt-1">Must match the name on your passbook or cheque</p>
        </div>

        {/* Bank Name */}
        <div>
          <Label required>Bank Name / बैंक का नाम</Label>
          <Select
            value={data.bankName || ''}
            onChange={(e) => upd('bankName', e.target.value)}
            error={errors.bankName}
          >
            <option value="">Select Bank / बैंक चुनें</option>
            {POPULAR_BANKS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </Select>
          {data.bankName === 'Other Bank' && (
            <div className="mt-2">
              <Input
                placeholder="Enter your Bank Name"
                value={data.otherBankName || ''}
                onChange={(e) => upd('otherBankName', e.target.value)}
                error={errors.otherBankName}
              />
            </div>
          )}
        </div>

        {/* Account Number */}
        <div>
          <Label required>Bank Account Number / बैंक खाता संख्या</Label>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Enter 9–18 digit Account Number"
            value={data.bankAccountNumber || ''}
            onChange={(e) => upd('bankAccountNumber', e.target.value.replace(/\D/g, '').slice(0, 18))}
            error={errors.bankAccountNumber}
          />
          <p className="text-[11px] text-gray-500 mt-1">Account number for receiving direct crop payments</p>
        </div>

        {/* Confirm Account Number */}
        <div>
          <Label required>Confirm Account Number / खाता संख्या की पुष्टि</Label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Re-enter Account Number"
              value={data.confirmBankAccountNumber || ''}
              onChange={(e) => upd('confirmBankAccountNumber', e.target.value.replace(/\D/g, '').slice(0, 18))}
              className={`w-full px-3 py-3 text-sm border rounded-lg outline-none transition-all ${
                errors.confirmBankAccountNumber
                  ? 'border-red-400 bg-red-50/20'
                  : data.confirmBankAccountNumber && data.bankAccountNumber === data.confirmBankAccountNumber
                  ? 'border-emerald-500 bg-emerald-50/30'
                  : data.confirmBankAccountNumber && data.bankAccountNumber !== data.confirmBankAccountNumber
                  ? 'border-red-400 bg-red-50/20'
                  : 'border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
              }`}
            />
            {data.confirmBankAccountNumber && (
              <span className="absolute right-3 top-3 text-xs font-bold">
                {data.bankAccountNumber === data.confirmBankAccountNumber ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4 stroke-[3]" /> Matched
                  </span>
                ) : (
                  <span className="text-red-500">Doesn't match</span>
                )}
              </span>
            )}
          </div>
          {errors.confirmBankAccountNumber && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {data.confirmBankAccountNumber && data.bankAccountNumber !== data.confirmBankAccountNumber
                ? 'Account numbers do not match'
                : 'Please confirm your account number'}
            </p>
          )}
          {!errors.confirmBankAccountNumber && (
            <p className="text-[11px] text-gray-500 mt-1">Re-enter to ensure 100% accuracy</p>
          )}
        </div>

        {/* IFSC Code */}
        <div>
          <Label required>IFSC Code / आईएफएससी कोड</Label>
          <Input
            placeholder="e.g. SBIN0001234"
            maxLength={11}
            value={data.bankIfsc || ''}
            onChange={(e) => upd('bankIfsc', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11))}
            error={errors.bankIfsc}
          />
          <p className="text-[11px] text-gray-500 mt-1">11-character code found on passbook or cheque</p>
        </div>

        {/* Branch Name */}
        <div>
          <Label>Branch Name / शाखा का नाम</Label>
          <Input
            placeholder="e.g. Yeola / Nashik Main"
            value={data.bankBranch || ''}
            onChange={(e) => upd('bankBranch', e.target.value)}
          />
          <p className="text-[11px] text-gray-500 mt-1">Town or district branch of your bank</p>
        </div>

        {/* Account Type */}
        <FullRow>
          <Label>Account Type / खाता प्रकार</Label>
          <RadioGroup
            name="accountType"
            options={['Savings Account (बचत)', 'Current Account (चालू)', 'Kisan Credit Card (KCC)']}
            value={data.accountType || 'Savings Account (बचत)'}
            onChange={(v) => upd('accountType', v)}
          />
        </FullRow>

        {/* Optional UPI ID / VPA */}
        <div>
          <Label>UPI ID / VPA (Optional / वैकल्पिक)</Label>
          <Input
            placeholder="e.g. 9876543210@upi / name@sbi"
            value={data.bankUpi || ''}
            onChange={(e) => upd('bankUpi', e.target.value.toLowerCase().trim())}
          />
          <p className="text-[11px] text-gray-500 mt-1">For instant small token payments & mandi notifications</p>
        </div>

        {/* Aadhaar-Bank / DBT Linkage Checkbox */}
        <div className="flex items-center">
          <label className="flex items-start gap-3 p-3.5 border border-gray-200 rounded-xl bg-gray-50/70 hover:bg-white cursor-pointer transition w-full">
            <input
              type="checkbox"
              checked={data.isDbtLinked ?? true}
              onChange={(e) => upd('isDbtLinked', e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-gray-300 cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-bold text-gray-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-teal-600 stroke-[3]" />
                Aadhaar Seeded / DBT Linked (आधार लिंक खाता)
              </span>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                This bank account is linked with Aadhaar & NPCI for direct government schemes & PM-KISAN benefits.
              </p>
            </div>
          </label>
        </div>

        {/* Passbook / Cancelled Cheque upload (Optional) */}
        <FullRow>
          <Label>Upload Bank Passbook / Cancelled Cheque (Optional)</Label>
          <label className="border-2 border-dashed border-gray-200 hover:border-teal-400 rounded-xl p-4 text-center cursor-pointer transition bg-gray-50/50 hover:bg-white relative block">
            <input
              type="file"
              accept="image/*,.pdf"
              className="sr-only"
              onChange={(e) => {
                if (e.target.files?.[0]) upd('bankPassbookDoc', e.target.files[0].name);
              }}
            />
            <CreditCard className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-xs font-semibold text-gray-700">
              {data.bankPassbookDoc ? `📄 ${data.bankPassbookDoc}` : 'Upload Passbook Front Page or Cancelled Cheque'}
            </p>
            <p className="text-[10px] text-gray-400">PDF, JPG, PNG up to 5MB (Used for fast-track verification)</p>
          </label>
        </FullRow>
      </SectionCard>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 3 — FPO FORM
───────────────────────────────────────────── */
function FpoForm({ data, onChange }) {
  const upd = (k, v) => onChange('fpo', k, v);

  return (
    <div className="space-y-5">
      <SectionCard icon={FileText} title="Organization Details">
        <FullRow><Label required>FPO Name</Label><Input placeholder="e.g. Sahyadri Farmers Producer Company" value={data.name||''} onChange={e=>upd('name',e.target.value)}/></FullRow>
        <div><Label>FPO Registration Number</Label><Input placeholder="e.g. U01100MH2000PTC..." value={data.regNo||''} onChange={e=>upd('regNo',e.target.value)}/></div>
        <div><Label>FPO Type</Label>
          <Select value={data.fpoType||''} onChange={e=>upd('fpoType',e.target.value)}>
            <option value="">Select Type</option>
            {['FPO','FPC','Cooperative','Farmer Society','Other'].map(t=><option key={t}>{t}</option>)}
          </Select></div>
        <div><Label>Year of Establishment</Label>
          <input type="number" placeholder="e.g. 2015" value={data.yearEst||''} onChange={e=>upd('yearEst',e.target.value)}
            className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></div>
      </SectionCard>

      <SectionCard icon={User} title="Authorized Contact">
        <div><Label required>Authorized Person Name</Label><Input placeholder="Full Name" value={data.authPerson||''} onChange={e=>upd('authPerson',e.target.value)}/></div>
        <div><Label required>Designation</Label><Input placeholder="e.g. CEO / Director" value={data.designation||''} onChange={e=>upd('designation',e.target.value)}/></div>
        <div><Label>Contact Number</Label><Input icon={Phone} placeholder="Mobile" value={data.contactNo||''} onChange={e=>upd('contactNo',e.target.value)}/></div>
        <div><Label>Email</Label><Input icon={Mail} type="email" placeholder="Email" value={data.email||''} onChange={e=>upd('email',e.target.value)}/></div>
      </SectionCard>

      <SectionCard icon={MapPin} title="Organization Location">
        <div><Label required>State</Label>
          <Select value={data.state||''} onChange={e=>upd('state',e.target.value)}>
            <option value="">Select State</option>
            {STATES.map(s=><option key={s}>{s}</option>)}
          </Select></div>
        <div><Label required>District</Label><Input placeholder="e.g. Nashik" value={data.district||''} onChange={e=>upd('district',e.target.value)}/></div>
        <div><Label>Block / Tehsil</Label><Input placeholder="Block" value={data.block||''} onChange={e=>upd('block',e.target.value)}/></div>
        <div><Label>Village / City</Label><Input placeholder="Village or City" value={data.village||''} onChange={e=>upd('village',e.target.value)}/></div>
        <div><Label>Pincode</Label><Input placeholder="Pincode" value={data.pincode||''} onChange={e=>upd('pincode',e.target.value)}/></div>
      </SectionCard>

      <SectionCard icon={BarChart2} title="FPO Capacity">
        <div><Label required>Total Farmer Members</Label>
          <input type="number" placeholder="e.g. 500" value={data.totalMembers||''} onChange={e=>upd('totalMembers',e.target.value)}
            className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></div>
        <div><Label>Active Farmer Members</Label>
          <input type="number" placeholder="e.g. 450" value={data.activeMembers||''} onChange={e=>upd('activeMembers',e.target.value)}
            className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></div>
        <div><Label>Villages Covered</Label>
          <input type="number" placeholder="e.g. 12" value={data.villages||''} onChange={e=>upd('villages',e.target.value)}
            className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></div>
        <div><Label>Total Aggregated Land (Acres)</Label>
          <input type="number" placeholder="e.g. 2400" value={data.totalLand||''} onChange={e=>upd('totalLand',e.target.value)}
            className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></div>
      </SectionCard>

      <SectionCard icon={Leaf} title="Agricultural Activities">
        <FullRow><Label>Primary Crops</Label>
          <MultiSelect options={['Wheat','Rice','Potato','Vegetables','Fruits','Pulses','Oilseeds','Other']} selected={data.crops||[]} onChange={v=>upd('crops',v)} /></FullRow>
        <FullRow><Label>FPO Activities</Label>
          <MultiSelect options={FPO_ACTIVITIES} selected={data.activities||[]} onChange={v=>upd('activities',v)} /></FullRow>
      </SectionCard>

      <SectionCard icon={Warehouse} title="Infrastructure">
        <div><Label>Warehouse Available?</Label><RadioGroup name="warehouse" options={['Yes','No']} value={data.warehouse||'No'} onChange={v=>upd('warehouse',v)}/></div>
        <div><Label>Cold Storage Available?</Label><RadioGroup name="coldStorage" options={['Yes','No']} value={data.coldStorage||'No'} onChange={v=>upd('coldStorage',v)}/></div>
        <div><Label>Processing Unit?</Label><RadioGroup name="processing" options={['Yes','No']} value={data.processing||'No'} onChange={v=>upd('processing',v)}/></div>
        <div><Label>Transportation?</Label><RadioGroup name="transport" options={['Yes','No']} value={data.transport||'No'} onChange={v=>upd('transport',v)}/></div>
        <div><Label>GST Number</Label><Input placeholder="GST (optional)" value={data.gst||''} onChange={e=>upd('gst',e.target.value)}/></div>
        <div><Label>Website</Label><Input icon={Globe} placeholder="https://..." value={data.website||''} onChange={e=>upd('website',e.target.value)}/></div>
      </SectionCard>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 3 — BUYER FORM
───────────────────────────────────────────── */
function BuyerForm({ data, onChange }) {
  const upd = (k, v) => onChange('buyer', k, v);

  return (
    <div className="space-y-5">
      <SectionCard icon={Building2} title="Business Details">
        <div><Label required>Business / Company Name</Label><Input placeholder="Company Name" value={data.businessName||''} onChange={e=>upd('businessName',e.target.value)}/></div>
        <div><Label required>Buyer Type</Label>
          <Select value={data.buyerType||''} onChange={e=>upd('buyerType',e.target.value)}>
            <option value="">Select Type</option>
            {['Wholesaler','Retailer','Processor','Exporter','Restaurant / Hotel','Institutional Buyer','Distributor','Other'].map(t=><option key={t}>{t}</option>)}
          </Select></div>
      </SectionCard>

      <SectionCard icon={User} title="Contact Details">
        <div><Label required>Contact Person</Label><Input placeholder="Full Name" value={data.contactPerson||''} onChange={e=>upd('contactPerson',e.target.value)}/></div>
        <div><Label>Designation</Label><Input placeholder="e.g. Procurement Manager" value={data.designation||''} onChange={e=>upd('designation',e.target.value)}/></div>
        <div><Label>Mobile Number</Label><Input icon={Phone} placeholder="Mobile" value={data.mobile||''} onChange={e=>upd('mobile',e.target.value)}/></div>
        <div><Label>Email</Label><Input icon={Mail} type="email" placeholder="Email" value={data.email||''} onChange={e=>upd('email',e.target.value)}/></div>
      </SectionCard>

      <SectionCard icon={MapPin} title="Business Location">
        <div><Label required>State</Label>
          <Select value={data.state||''} onChange={e=>upd('state',e.target.value)}>
            <option value="">Select State</option>
            {STATES.map(s=><option key={s}>{s}</option>)}
          </Select></div>
        <div><Label required>District</Label><Input placeholder="e.g. Pune" value={data.district||''} onChange={e=>upd('district',e.target.value)}/></div>
        <div><Label required>City / Town</Label><Input placeholder="e.g. Pune City" value={data.city||''} onChange={e=>upd('city',e.target.value)}/></div>
        <div><Label>Pincode</Label><Input placeholder="Pincode" value={data.pincode||''} onChange={e=>upd('pincode',e.target.value)}/></div>
      </SectionCard>

      <SectionCard icon={Package} title="Procurement Requirements">
        <FullRow><Label>Products / Crops Interested In</Label>
          <MultiSelect options={BUYER_CROPS} selected={data.crops||[]} onChange={v=>upd('crops',v)} /></FullRow>
        <div>
          <Label>Required Quantity</Label>
          <div className="flex gap-2">
            <input type="number" placeholder="e.g. 500" value={data.qty||''} onChange={e=>upd('qty',e.target.value)}
              className="flex-1 px-3 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500" />
            <select value={data.qtyUnit||'Quintal'} onChange={e=>upd('qtyUnit',e.target.value)}
              className="w-28 px-3 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500 bg-white">
              <option>Kg</option><option>Quintal</option><option>Ton</option>
            </select>
          </div>
        </div>
        <div><Label>Purchase Frequency</Label>
          <Select value={data.frequency||'As Required'} onChange={e=>upd('frequency',e.target.value)}>
            {['Daily','Weekly','Monthly','Seasonal','As Required'].map(f=><option key={f}>{f}</option>)}
          </Select></div>
      </SectionCard>

      <SectionCard icon={Award} title="Quality Preferences">
        <FullRow><Label>Quality Standards</Label>
          <MultiSelect options={QUALITY_PREFS} selected={data.quality||[]} onChange={v=>upd('quality',v)} /></FullRow>
        <div><Label>Grade / Quality Spec</Label><Input placeholder="e.g. Grade A, Premium" value={data.grade||''} onChange={e=>upd('grade',e.target.value)}/></div>
        <div><Label>Certification Required?</Label><RadioGroup name="cert" options={['Yes','No']} value={data.certRequired||'No'} onChange={v=>upd('certRequired',v)}/></div>
      </SectionCard>

      <SectionCard icon={Truck} title="Delivery & Payment">
        <div><Label>Preferred Delivery Location</Label><Input icon={MapPin} placeholder="City / Area" value={data.deliveryLoc||''} onChange={e=>upd('deliveryLoc',e.target.value)}/></div>
        <div><Label>Preferred Payment Terms</Label>
          <Select value={data.paymentTerms||''} onChange={e=>upd('paymentTerms',e.target.value)}>
            <option value="">Select Terms</option>
            {['Advance','On Delivery','7 Days','15 Days','30 Days'].map(t=><option key={t}>{t}</option>)}
          </Select></div>
        <div><Label>GST Number</Label><Input placeholder="GST (optional)" value={data.gst||''} onChange={e=>upd('gst',e.target.value)}/></div>
        <div><Label>Website</Label><Input icon={Globe} placeholder="https://..." value={data.website||''} onChange={e=>upd('website',e.target.value)}/></div>
      </SectionCard>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 3 WRAPPER — DYNAMIC BY ROLE
───────────────────────────────────────────── */
function Step3({ selectedRole, roleDetails, onChange, onNext, onPrev }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const d = roleDetails[selectedRole] || {};
    const e = {};
    if (selectedRole === 'farmer') {
      if (!d.state) e.state = 'Required';
      if (!d.district) e.district = 'Required';
      if (!d.block) e.block = 'Required';
      if (!d.village) e.village = 'Required';
      if (!d.pincode) e.pincode = 'Required';
      if (!d.landArea) e.landArea = 'Required';
      if (!d.aadharNumber || d.aadharNumber.replace(/\s/g, '').length < 12) e.aadharNumber = 'Required';
      if (!d.bankHolderName?.trim()) e.bankHolderName = 'Account Holder Name is required';
      if (!d.bankName) e.bankName = 'Bank Name is required';
      if (!d.bankAccountNumber || d.bankAccountNumber.length < 9) e.bankAccountNumber = 'Valid Account Number (min 9 digits) is required';
      if (!d.confirmBankAccountNumber || d.bankAccountNumber !== d.confirmBankAccountNumber) e.confirmBankAccountNumber = 'Account numbers must match';
      if (!d.bankIfsc || d.bankIfsc.length < 11) e.bankIfsc = '11-character IFSC code is required';
    }
    if (selectedRole === 'fpo') {
      if (!d.name) e.name = 'Required';
      if (!d.authPerson) e.authPerson = 'Required';
      if (!d.designation) e.designation = 'Required';
      if (!d.state) e.state = 'Required';
      if (!d.district) e.district = 'Required';
      if (!d.totalMembers) e.totalMembers = 'Required';
    }
    if (selectedRole === 'buyer') {
      if (!d.businessName) e.businessName = 'Required';
      if (!d.buyerType) e.buyerType = 'Required';
      if (!d.contactPerson) e.contactPerson = 'Required';
      if (!d.state) e.state = 'Required';
      if (!d.district) e.district = 'Required';
      if (!d.city) e.city = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  const roleIcons = { farmer: Sprout, fpo: Users, buyer: Building2 };
  const RoleIcon = roleIcons[selectedRole] || Sprout;
  const roleLabels = { farmer: 'Farmer Details', fpo: 'FPO Details', buyer: 'Buyer Details' };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6 p-4 bg-teal-50 rounded-xl border border-teal-100">
        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
          <RoleIcon className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h3 className="font-black text-teal-800 capitalize">{roleLabels[selectedRole]}</h3>
          <p className="text-xs text-teal-600">Fill in your details to complete the profile</p>
        </div>
      </div>

      {selectedRole === 'farmer' && <FarmerForm data={roleDetails.farmer || {}} onChange={onChange} errors={errors} />}
      {selectedRole === 'fpo' && <FpoForm data={roleDetails.fpo || {}} onChange={onChange} />}
      {selectedRole === 'buyer' && <BuyerForm data={roleDetails.buyer || {}} onChange={onChange} />}

      {Object.keys(errors).length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" /> Please fill in all required fields before continuing.
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={onPrev} className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-teal-600 font-semibold text-sm rounded-lg border border-gray-200 hover:border-teal-300 transition">
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        <button onClick={handleNext}
          className="flex items-center gap-2 px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm rounded-lg shadow-md shadow-teal-100 transition">
          Complete Registration <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 4 — COMPLETE
───────────────────────────────────────────── */
function Step4({ basicDetails, selectedRole, roleDetails, onGoToDashboard, onEditProfile, t }) {
  const rd = roleDetails[selectedRole] || {};
  const roleMessages = {
    farmer: 'Your Farmer profile has been successfully created.',
    fpo: 'Your FPO profile has been successfully created.',
    buyer: 'Your Buyer profile has been successfully created.',
  };
  const summaryFields = {
    farmer: [
      { label: 'Role', value: 'Farmer 🌾' },
      { label: 'Name', value: basicDetails.name },
      { label: 'Location', value: [rd.district, rd.state].filter(Boolean).join(', ') || '—' },
      { label: 'Aadhaar Verification', value: rd.aadharNumber ? `Verified (•••• ${rd.aadharNumber.replace(/\s/g, '').slice(-4)})` : (rd.isAadhaarVerified ? 'Verified ✅' : 'Pending') },
      { label: 'Bank Account', value: rd.bankAccountNumber ? `${rd.bankName === 'Other Bank' ? (rd.otherBankName || 'Bank') : (rd.bankName || 'Bank')} (•••• ${rd.bankAccountNumber.slice(-4)})` : '—' },
      { label: 'Farm Size', value: rd.landArea ? `${rd.landArea} ${rd.landUnit || 'Acre'}` : '—' },
      { label: 'Land Ownership', value: rd.ownership || 'Own' },
    ],
    fpo: [
      { label: 'Role', value: 'FPO 🤝' },
      { label: 'FPO Name', value: rd.name || '—' },
      { label: 'Authorized Person', value: basicDetails.name },
      { label: 'Location', value: [rd.district, rd.state].filter(Boolean).join(', ') || '—' },
      { label: 'Total Members', value: rd.totalMembers ? `${rd.totalMembers} Farmers` : '—' },
      { label: 'Reg. Number', value: rd.regNo || '—' },
    ],
    buyer: [
      { label: 'Role', value: 'Buyer 🏢' },
      { label: 'Business Name', value: rd.businessName || '—' },
      { label: 'Contact Person', value: basicDetails.name },
      { label: 'Location', value: [rd.city, rd.state].filter(Boolean).join(', ') || '—' },
      { label: 'Buyer Type', value: rd.buyerType || '—' },
      { label: 'Products', value: (rd.crops||[]).join(', ') || '—' },
    ],
  };

  return (
    <div className="max-w-lg mx-auto text-center py-6">
      {/* Success animation */}
      <div className="relative w-28 h-28 mx-auto mb-6">
        <div className="absolute inset-0 bg-teal-100 rounded-full animate-ping opacity-30" />
        <div className="relative w-28 h-28 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-2xl shadow-teal-300">
          <Check className="w-14 h-14 text-white stroke-[3]" />
        </div>
      </div>

      <h2 className="text-3xl font-black text-gray-800 mb-2 font-heading">{t?.regCompleteTitle || 'Registration Complete!'}</h2>
      <p className="text-gray-500 mb-1 font-semibold">{t?.regWelcome || 'Welcome to the Anaaj (अनाज) Digital Market'}</p>
      <p className="text-sm text-teal-600 font-medium mb-8">{roleMessages[selectedRole]}</p>

      {/* Profile summary card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5 mb-6 text-left">
        <div className="flex items-center gap-4 pb-4 mb-4 border-b border-gray-100">
          <div className="w-14 h-14 rounded-full bg-teal-500 flex items-center justify-center text-white text-xl font-black overflow-hidden border-2 border-teal-200">
            {basicDetails.photoPreview ? (
              <img src={basicDetails.photoPreview} className="w-full h-full object-cover" alt="profile" />
            ) : (
              basicDetails.name?.charAt(0)?.toUpperCase() || 'U'
            )}
          </div>
          <div>
            <p className="font-black text-gray-800 text-lg">{basicDetails.name}</p>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-wide">{selectedRole}</span>
          </div>
        </div>

        <div className="space-y-2">
          {(summaryFields[selectedRole] || []).map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-semibold text-gray-800 text-right max-w-[60%]">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-gray-500">{t?.regProfileCompletion || 'Profile Completion'}</span>
            <span className="text-teal-600">100%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full w-full transition-all duration-1000" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={onEditProfile}
          className="px-6 py-3 border border-gray-300 text-gray-600 hover:border-teal-400 hover:text-teal-600 font-semibold text-sm rounded-xl transition cursor-pointer">
          {t?.regEditProfile || '← Edit Profile'}
        </button>
        <button onClick={() => onGoToDashboard(basicDetails, selectedRole, rd)}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-200 hover:shadow-lg transition cursor-pointer">
          {t?.regGoToDashboard || 'Go to Dashboard'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN REGISTRATION FLOW
───────────────────────────────────────────── */
export default function RegistrationFlow({ onComplete, onBack, initialRole = '', lang = 'en', setLang, t: propT }) {
  const t = propT || translations[lang] || translations.en;
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(initialRole || '');

  const [basicDetails, setBasicDetails] = useState({
    name: '', mobile: '', email: '', password: '', confirmPassword: '', termsAccepted: false, photoPreview: null,
  });
  const [roleDetails, setRoleDetails] = useState({ farmer: {}, fpo: {}, buyer: {} });
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);

  const updateBasic = (key, val) => setBasicDetails(p => ({ ...p, [key]: val }));

  const updateRoleDetail = (role, key, val) =>
    setRoleDetails(p => ({ ...p, [role]: { ...p[role], [key]: val } }));

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const goToStep = (s) => {
    setStep(s);
    setMaxStep(p => Math.max(p, s));
  };

  const [receivedOtpCode, setReceivedOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const handleSendOtp = async () => {
    const clean = basicDetails.mobile.replace(/\D/g, '');
    if (clean.length === 10) {
      setOtpLoading(true);
      try {
        const res = await authService.sendOtp(clean, selectedRole || 'farmer');
        if (res.success) {
          setOtpSent(true);
          setReceivedOtpCode(res.otp);
        }
      } catch (err) {
        console.warn('[RegistrationFlow] sendOtp error:', err);
      } finally {
        setOtpLoading(false);
      }
    }
  };

  const handleVerifyOtp = async (providedOtp) => {
    const code = Array.isArray(providedOtp) ? providedOtp.join('') : otp.join('');
    if (code.length === 4) {
      setOtpLoading(true);
      try {
        const res = await authService.verifyOtp(basicDetails.mobile, code, selectedRole || 'farmer');
        if (res.success) {
          setOtpVerified(true);
        }
      } catch (err) {
        console.warn('[RegistrationFlow] verifyOtp error:', err);
      } finally {
        setOtpLoading(false);
      }
    }
  };

  const handleGoToDashboard = async (basic, role, rd) => {
    const chosenRole = role || 'farmer';
    const user = {
      name: basic.name,
      phone: basic.mobile,
      email: basic.email,
      role: chosenRole,
      location: rd.district || rd.city || 'Nashik, Maharashtra',
      state: rd.state || 'Maharashtra',
      photoPreview: basic.photoPreview,
      ...(chosenRole === 'farmer' ? {
        primaryCrop: rd.primaryCrop || 'Wheat',
        landArea: rd.landArea || '5',
        landUnit: rd.landUnit || 'Acre',
        farmingType: rd.farmingType || 'Natural',
        bankDetails: {
          accountHolderName: rd.bankHolderName || basic.name,
          bankName: rd.bankName === 'Other Bank' ? (rd.otherBankName || 'Other Bank') : (rd.bankName || ''),
          accountNumber: rd.bankAccountNumber || '',
          ifscCode: rd.bankIfsc || '',
          branchName: rd.bankBranch || '',
          accountType: rd.accountType || 'Savings Account (बचत)',
          upiId: rd.bankUpi || '',
          isDbtLinked: rd.isDbtLinked ?? true,
          bankPassbookDoc: rd.bankPassbookDoc || null,
        }
      } : {}),
      ...(chosenRole === 'fpo' ? { fpoName: rd.name || 'Sahyadri Farmers Producer Co.', totalMembers: rd.totalMembers || '350' } : {}),
      ...(chosenRole === 'buyer' ? { businessName: rd.businessName || 'Kisan Agro Traders', buyerType: rd.buyerType || 'Wholesaler' } : {}),
    };

    // Save profile directly into Supabase user_profiles
    try {
      await authService.registerUser({
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        village: rd.village || rd.city || 'Yeola',
        district: rd.district || 'Nashik',
        state: user.state || 'Maharashtra',
        pincode: rd.pincode || '',
        avatar: user.photoPreview || (chosenRole === 'fpo' ? '🏢' : chosenRole === 'buyer' ? '🏢' : '👨‍🌾'),
        details: rd
      });
    } catch (e) {
      console.warn('[RegistrationFlow] registerUser error:', e);
    }

    onComplete(user, chosenRole);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Teal Header with 'अnaaj' and Subtitle ── */}
      <div className="relative bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 text-white px-6 py-8 text-center overflow-hidden shadow-sm">
        {/* decorative circles */}
        <div className="absolute top-0 left-0 w-44 h-44 bg-teal-400/25 rounded-full -translate-x-16 -translate-y-16 pointer-events-none" />
        <div className="absolute bottom-0 right-8 w-32 h-32 bg-teal-400/20 rounded-full translate-y-10 pointer-events-none" />
        <div className="absolute top-4 right-20 w-12 h-12 bg-teal-300/25 rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl w-full mx-auto flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-teal-100 hover:text-white text-sm font-semibold transition px-3 py-1.5 rounded-xl hover:bg-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> {t?.btnBack || 'Back'}
            </button>

            {/* Language Switcher */}
            {setLang && (
              <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/20">
                <Globe className="w-3.5 h-3.5 text-teal-200" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer"
                >
                  <option value="en" className="text-slate-900">English</option>
                  <option value="hi" className="text-slate-900">हिंदी</option>
                  <option value="mr" className="text-slate-900">मराठी</option>
                  <option value="gu" className="text-slate-900">ગુજરાતી</option>
                  <option value="pa" className="text-slate-900">ਪੰਜਾਬੀ</option>
                </select>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-1 mb-1">
            <h1 className="flex items-center justify-center gap-0.5 text-4xl sm:text-5xl font-black text-white font-heading tracking-tight drop-shadow-sm">
              <span className="text-amber-300 font-serif font-black text-5xl sm:text-6xl drop-shadow">अ</span>naaj
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-black uppercase tracking-[0.28em] text-teal-100/95 font-heading drop-shadow-xs">
            {t?.tagline || "THE FARMER'S DIGITAL MARKET"}
          </p>
        </div>
      </div>

      {/* ── Clickable Progress Bar ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <ProgressBar currentStep={step} maxStep={maxStep} onStepClick={setStep} t={t} />
      </div>

      {/* ── Form Area ── */}
      <main className="flex-1 px-4 py-8">
        {step === 1 && (
          <Step1
            data={basicDetails}
            onChange={updateBasic}
            onNext={() => goToStep(2)}
            otpSent={otpSent}
            otpVerified={otpVerified}
            onSendOtp={handleSendOtp}
            onVerifyOtp={handleVerifyOtp}
            otp={otp}
            setOtp={setOtp}
            t={t}
            receivedOtpCode={receivedOtpCode}
            otpLoading={otpLoading}
          />
        )}
        {step === 2 && (
          <Step2
            selectedRole={selectedRole}
            onSelect={handleRoleSelect}
            onNext={() => goToStep(3)}
            onPrev={() => goToStep(1)}
            t={t}
          />
        )}
        {step === 3 && (
          <Step3
            selectedRole={selectedRole}
            roleDetails={roleDetails}
            onChange={updateRoleDetail}
            onNext={() => goToStep(4)}
            onPrev={() => goToStep(2)}
            t={t}
          />
        )}
        {step === 4 && (
          <Step4
            basicDetails={basicDetails}
            selectedRole={selectedRole}
            roleDetails={roleDetails}
            onGoToDashboard={handleGoToDashboard}
            onEditProfile={() => goToStep(3)}
            t={t}
          />
        )}
      </main>
    </div>
  );
}
