import React, { useState, useRef } from 'react';
import {
  Check, ArrowRight, ArrowLeft, Camera, Sprout, Users, Building2,
  ShieldCheck, MapPin, Phone, Mail, Lock, Eye, EyeOff, User,
  FileText, Warehouse, Truck, Leaf, Globe, Star, ChevronDown,
  Package, CreditCard, Award, BarChart2, AlertCircle, X
} from 'lucide-react';
import { translations } from '../../i18n/translations';

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

function Input({ icon, error, ...props }) {
  return (
    <FieldWrap icon={icon} error={error}>
      <input {...props} className="flex-1 px-3 py-3 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400" />
    </FieldWrap>
  );
}

function Select({ icon, error, children, ...props }) {
  return (
    <FieldWrap icon={icon} error={error}>
      <select {...props} className="flex-1 px-3 py-3 text-sm outline-none bg-transparent text-gray-800 appearance-none">
        {children}
      </select>
      <ChevronDown className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
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
function Step1({ data, onChange, onNext, otpSent, otpVerified, onSendOtp, onVerifyOtp, otp, setOtp, t }) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  const initials = data.name ? data.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'US';

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

      {/* Full Name */}
      <div>
        <Label required>{t?.regFullName || 'Full Name'}</Label>
        <Input
          icon={User}
          placeholder={t?.regFullNamePlaceholder || 'Enter your full name'}
          value={data.name}
          onChange={e => onChange('name', e.target.value)}
          error={errors.name}
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
            <div className="mt-3 p-3.5 bg-teal-50 rounded-xl border border-teal-200 animate-in fade-in">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-teal-800 font-bold">
                  Enter 4-digit OTP sent to +91-{data.mobile}
                </p>
                <span className="text-[10px] bg-teal-200/70 text-teal-900 font-mono px-2 py-0.5 rounded font-bold">
                  Demo: 1234
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3">
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
                    className="w-10 h-10 text-center text-lg font-bold border border-teal-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const demoOtp = ['1', '2', '3', '4'];
                    setOtp(demoOtp);
                    setTimeout(() => onVerifyOtp(demoOtp), 150);
                  }}
                  className="ml-auto text-xs font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer whitespace-nowrap"
                >
                  ⚡ {t?.regAutoVerify || 'Auto Fill & Verify'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => onVerifyOtp(otp)}
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
              >
                {t?.regVerifyOtp || 'Verify OTP'}
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
function FarmerForm({ data, onChange }) {
  const upd = (k, v) => onChange('farmer', k, v);
  const toggleService = s => upd('services', data.services?.includes(s) ? (data.services||[]).filter(x=>x!==s) : [...(data.services||[]),s]);

  return (
    <div className="space-y-5">
      <SectionCard icon={MapPin} title="Farming Location">
        <div><Label required>State</Label>
          <Select value={data.state||''} onChange={e=>upd('state',e.target.value)}>
            <option value="">Select State</option>
            {STATES.map(s=><option key={s}>{s}</option>)}
          </Select></div>
        <div><Label required>District</Label><Input placeholder="e.g. Nashik" value={data.district||''} onChange={e=>upd('district',e.target.value)}/></div>
        <div><Label required>Block / Tehsil</Label><Input placeholder="e.g. Niphad" value={data.block||''} onChange={e=>upd('block',e.target.value)}/></div>
        <div><Label required>Village</Label><Input placeholder="e.g. Ozar" value={data.village||''} onChange={e=>upd('village',e.target.value)}/></div>
        <div><Label required>Pincode</Label><Input placeholder="e.g. 422206" value={data.pincode||''} onChange={e=>upd('pincode',e.target.value)}/></div>
      </SectionCard>

      <SectionCard icon={Leaf} title="Farm Details">
        <div>
          <Label required>Total Land Area</Label>
          <div className="flex gap-2">
            <input type="number" placeholder="e.g. 5" value={data.landArea||''} onChange={e=>upd('landArea',e.target.value)}
              className="flex-1 px-3 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
            <select value={data.landUnit||'Acre'} onChange={e=>upd('landUnit',e.target.value)}
              className="w-28 px-3 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500 bg-white">
              <option>Acre</option><option>Hectare</option><option>Bigha</option>
            </select>
          </div>
        </div>
        <div><Label>Cultivated Area</Label>
          <input type="number" placeholder="Cultivated area" value={data.cultivatedArea||''} onChange={e=>upd('cultivatedArea',e.target.value)}
            className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
        </div>
        <FullRow><Label>Land Ownership</Label>
          <RadioGroup name="ownership" options={['Own','Leased','Both']} value={data.ownership||'Own'} onChange={v=>upd('ownership',v)}/></FullRow>
      </SectionCard>

      <SectionCard icon={Sprout} title="Farming Information">
        <div><Label required>Primary Crop</Label>
          <Select value={data.primaryCrop||''} onChange={e=>upd('primaryCrop',e.target.value)}>
            <option value="">Select Crop</option>
            {CROPS.map(c=><option key={c}>{c}</option>)}
          </Select></div>
        <div><Label>Other Crops</Label><Input placeholder="e.g. Tomato, Soybean" value={data.otherCrops||''} onChange={e=>upd('otherCrops',e.target.value)}/></div>
        <div><Label>Current Season Crop</Label><Input placeholder="Current crop" value={data.seasonCrop||''} onChange={e=>upd('seasonCrop',e.target.value)}/></div>
        <div><Label>Farming Type</Label>
          <Select value={data.farmingType||'Conventional'} onChange={e=>upd('farmingType',e.target.value)}>
            {['Conventional','Organic','Natural','Mixed'].map(t=><option key={t}>{t}</option>)}
          </Select></div>
        <div><Label>Farming Experience (years)</Label>
          <input type="number" placeholder="e.g. 10" value={data.farmingExp||''} onChange={e=>upd('farmingExp',e.target.value)}
            className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></div>
      </SectionCard>

      <SectionCard icon={Globe} title="Irrigation & Soil">
        <div><Label>Irrigation Source</Label>
          <Select value={data.irrigation||''} onChange={e=>upd('irrigation',e.target.value)}>
            <option value="">Select Source</option>
            {['Borewell','Canal','Rainfed','River','Drip','Other'].map(s=><option key={s}>{s}</option>)}
          </Select></div>
        <div><Label>Soil Type</Label>
          <Select value={data.soilType||''} onChange={e=>upd('soilType',e.target.value)}>
            <option value="">Select Type</option>
            {['Black Cotton','Red Laterite','Sandy Loam','Alluvial','Clay','Loamy'].map(s=><option key={s}>{s}</option>)}
          </Select></div>
        <FullRow><Label>Soil Testing Available?</Label>
          <RadioGroup name="soilTest" options={['Yes','No']} value={data.soilTesting||'No'} onChange={v=>upd('soilTesting',v)}/></FullRow>
      </SectionCard>

      <SectionCard icon={Star} title="Preferences & Interested Services">
        <div><Label>Preferred Language</Label>
          <Select value={data.language||''} onChange={e=>upd('language',e.target.value)}>
            <option value="">Select Language</option>
            {['Hindi','Marathi','English','Gujarati','Punjabi','Telugu','Tamil','Kannada'].map(l=><option key={l}>{l}</option>)}
          </Select></div>
        <FullRow>
          <Label>Interested Services</Label>
          <MultiSelect options={FARMER_SERVICES} selected={data.services||[]} onChange={v=>upd('services',v)} />
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
      if (!d.primaryCrop) e.primaryCrop = 'Required';
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

      {selectedRole === 'farmer' && <FarmerForm data={roleDetails.farmer || {}} onChange={onChange} />}
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
      { label: 'Primary Crop', value: rd.primaryCrop || '—' },
      { label: 'Farm Size', value: rd.landArea ? `${rd.landArea} ${rd.landUnit || 'Acre'}` : '—' },
      { label: 'Farming Type', value: rd.farmingType || '—' },
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

  const handleSendOtp = () => {
    if (basicDetails.mobile.length === 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = (providedOtp) => {
    const code = Array.isArray(providedOtp) ? providedOtp.join('') : otp.join('');
    if (code.length === 4) {
      setOtpVerified(true);
    }
  };

  const handleGoToDashboard = (basic, role, rd) => {
    const chosenRole = role || 'farmer';
    const user = {
      name: basic.name,
      phone: basic.mobile,
      email: basic.email,
      role: chosenRole,
      location: rd.district || rd.city || 'Nashik, Maharashtra',
      state: rd.state || 'Maharashtra',
      photoPreview: basic.photoPreview,
      ...(chosenRole === 'farmer' ? { primaryCrop: rd.primaryCrop || 'Wheat', landArea: rd.landArea || '5', landUnit: rd.landUnit || 'Acre', farmingType: rd.farmingType || 'Natural' } : {}),
      ...(chosenRole === 'fpo' ? { fpoName: rd.name || 'Sahyadri Farmers Producer Co.', totalMembers: rd.totalMembers || '350' } : {}),
      ...(chosenRole === 'buyer' ? { businessName: rd.businessName || 'Kisan Agro Traders', buyerType: rd.buyerType || 'Wholesaler' } : {}),
    };
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
