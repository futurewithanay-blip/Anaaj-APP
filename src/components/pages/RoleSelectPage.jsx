import React from 'react';
import { Sprout, Users, Building2, ArrowRight, ChevronLeft, Wheat, Star, Shield, Zap, Globe } from 'lucide-react';
import { translations } from '../../i18n/translations';

export default function RoleSelectPage({ onSelectRole, onBack, lang = 'en', setLang, t: propT }) {
  const t = propT || translations[lang] || translations.en;

  const roles = [
    {
      id: 'farmer',
      icon: Sprout,
      emoji: '👨‍🌾',
      title: t?.roleFarmerTitle || 'Farmer',
      subtitle: t?.roleFarmerSub || 'Individual Farmer',
      description: t?.roleFarmerDesc || 'Register your crops, get AI price predictions, connect directly with buyers, and manage your farm sales.',
      features: ['Create & manage crop lots', 'AI price forecasting', 'Direct buyer connections', 'Weather & Agromet alerts'],
      color: 'from-emerald-500 to-green-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      tag: 'Most Popular',
      tagColor: 'bg-emerald-600',
      loginText: t?.loginAsFarmer || 'Login as Farmer →',
    },
    {
      id: 'fpo',
      icon: Users,
      emoji: '🤝',
      title: t?.roleFpoTitle || 'FPO',
      subtitle: t?.roleFpoSub || 'Farmer Producer Organization',
      description: t?.roleFpoDesc || 'Aggregate crops from member farmers, manage bulk lots, and negotiate with institutional buyers at better prices.',
      features: ['Manage farmer members', 'Bulk crop aggregation', 'Collective bargaining', 'Revenue distribution tools'],
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800',
      btnColor: 'bg-amber-600 hover:bg-amber-700',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      tag: 'Group Power',
      tagColor: 'bg-amber-600',
      loginText: t?.loginAsFpo || 'Login as FPO →',
    },
    {
      id: 'buyer',
      icon: Building2,
      emoji: '🏢',
      title: t?.roleBuyerTitle || 'Buyer',
      subtitle: t?.roleBuyerSub || 'Institutional Buyer / Trader',
      description: t?.roleBuyerDesc || 'Browse verified crop listings, post procurement requirements, use AI matching to find the best farmers.',
      features: ['Browse verified lots', 'AI farmer matching', 'Post requirements', 'Digital contracts & payments'],
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
      btnColor: 'bg-blue-600 hover:bg-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      tag: 'Verified Buyers',
      tagColor: 'bg-blue-600',
      loginText: t?.loginAsBuyer || 'Login as Buyer →',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/20 py-10 px-4">
      {/* Top Header Bar with Back and Language Switcher */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-700 text-sm font-semibold transition group bg-white/80 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t?.btnBack || 'Back to Home'}
        </button>

        {setLang && (
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <Globe className="w-4 h-4 text-emerald-700" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-slate-800 font-bold text-xs outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
              <option value="gu">ગુજરાતી</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
            </select>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-900 text-xs font-bold mb-4 border border-emerald-200">
          <Wheat className="w-4 h-4 text-emerald-700" />
          <span className="text-amber-600 font-serif font-black text-sm">अ</span>naaj — {t?.tagline || "THE FARMER'S DIGITAL MARKET"}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 font-heading">
          {t?.roleSelectTitle || 'Select Your Role'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto font-medium">
          {t?.roleSelectDesc || 'Choose how you participate in the Anaaj marketplace. Each role gives you a specialized dashboard.'}
        </p>
      </div>

      {/* Role Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <div
              key={role.id}
              className={`relative rounded-2xl border-2 ${role.border} bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden`}
            >
              {/* Tag */}
              <div className={`absolute top-4 right-4 ${role.tagColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs`}>
                {role.tag}
              </div>

              {/* Top gradient bar */}
              <div className={`h-2 bg-gradient-to-r ${role.color}`} />

              <div className="p-6 flex flex-col flex-1">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${role.iconBg} flex items-center justify-center mb-4 text-2xl`}>
                  <Icon className={`w-7 h-7 ${role.iconColor}`} />
                </div>

                {/* Title */}
                <h2 className="text-xl font-black text-slate-900 mb-0.5">{role.title}</h2>
                <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wide">{role.subtitle}</p>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-5 leading-relaxed">{role.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {role.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className={`w-5 h-5 rounded-full ${role.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <Star className={`w-3 h-3 ${role.iconColor}`} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Action Buttons */}
                <div className="space-y-2 mt-auto">
                  <button
                    onClick={() => onSelectRole(role.id, 'login')}
                    className={`w-full flex items-center justify-center gap-2 py-3 ${role.btnColor} text-white font-bold text-sm rounded-xl transition shadow-md hover:shadow-lg cursor-pointer`}
                  >
                    <Shield className="w-4 h-4" />
                    {role.loginText}
                  </button>
                  <button
                    onClick={() => onSelectRole(role.id, 'register')}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 ${role.bg} ${role.iconColor} font-bold text-sm rounded-xl border ${role.border} hover:border-current transition cursor-pointer`}
                  >
                    <Zap className="w-4 h-4" />
                    {t?.registerNewAccount || 'Register New Account'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom note */}
      <p className="text-center text-slate-400 text-xs mt-10">
        🔒 All data is secured under Government of India Digital Infrastructure • SIH 2026 Prototype
      </p>
    </div>
  );
}
