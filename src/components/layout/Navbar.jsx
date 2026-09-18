import React, { useState } from 'react';
import {
  Sprout,
  Globe,
  UserPlus,
  Menu,
  X,
  Wheat,
  ChevronDown,
  LogOut
} from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  lang,
  setLang,
  t,
  currentUser,
  onOpenAuthModal,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t.navHome },
    { id: 'schemes', label: t.navSchemes },
    { id: 'services', label: t.navServices },
    { id: 'map', label: t.navMap },
    { id: 'about', label: t.navAbout },
    ...(currentUser ? [{ id: 'dashboard', label: '📊 ' + (t.dashOverview || 'Dashboard') }] : []),
  ];

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-agri-700 via-agri-600 to-emerald-500 text-white shadow-md shadow-agri-700/20 ring-2 ring-emerald-100">
              <Sprout className="w-7 h-7 text-emerald-100" />
              <div className="absolute -bottom-1 -right-1 bg-harvest-500 rounded-full p-0.5 ring-2 ring-white">
                <Wheat className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-slate-900 flex items-center">
                  <span className="text-amber-500 font-serif font-black text-3xl sm:text-4xl">अ</span>naaj
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 uppercase tracking-wide hidden xs:inline-block">
                  THE FARMER'S DIGITAL MARKET
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:block">
                THE FARMER'S DIGITAL MARKET • SIH 2026
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  currentView === link.id
                    ? 'text-agri-800 bg-agri-50 font-bold border-b-2 border-agri-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Action Cluster (Language Selector + Register Button) */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer shadow-xs"
                title="Change Language"
              >
                <Globe className="w-4 h-4 text-emerald-700" />
                <span className="font-extrabold uppercase tracking-wide">{languages.find(l => l.code === lang)?.native || lang}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.selectLanguage || "Select Language"}
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-emerald-50/50 transition cursor-pointer ${
                        lang === l.code ? 'font-bold text-emerald-800 bg-emerald-50' : 'text-slate-700'
                      }`}
                    >
                      <span className="font-medium">{l.native}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({l.label})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile or Register Button */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name[0]}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-emerald-900 leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-emerald-700 font-medium capitalize">{currentUser.role}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="ml-2 text-slate-400 hover:text-red-600 p-1 transition"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-agri-700 to-emerald-700 hover:from-emerald-700 hover:to-agri-800 shadow-md shadow-emerald-900/20 transition-all hover:scale-105 cursor-pointer tracking-wide uppercase"
                >
                  <UserPlus className="w-4 h-4 text-emerald-200" />
                  <span>{t.btnRegister}</span>
                </button>
              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : lang === 'hi' ? 'mr' : 'en')}
              className="px-2 py-1 text-xs font-bold bg-slate-100 text-slate-800 rounded-lg border border-slate-200 uppercase"
            >
              {lang}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentView(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  currentView === link.id ? 'bg-agri-50 text-agri-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {!currentUser && (
            <div className="pt-3 border-t border-slate-100 flex">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal('register');
                }}
                className="w-full py-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-agri-700 text-center tracking-wide uppercase shadow-md cursor-pointer"
              >
                {t.btnRegister}
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
