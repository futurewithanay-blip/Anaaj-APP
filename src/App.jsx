import React, { useState, useEffect } from 'react';
import TopGovtHeader from './components/layout/TopGovtHeader';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Common Interactive Tools
import AuthModal from './components/common/AuthModal';
import KisanVoiceBot from './components/common/KisanVoiceBot';
import SmsFallbackModal from './components/common/SmsFallbackModal';
import MandiMap from './components/common/MandiMap';

// Public Pages
import HomeView from './components/panels/public/HomeView';
import SchemesView from './components/panels/public/SchemesView';
import ServicesView from './components/panels/public/ServicesView';
import AboutView from './components/panels/public/AboutView';
import ContactView from './components/panels/public/ContactView';

// New Pages & Dashboards
import RoleSelectPage from './components/pages/RoleSelectPage';
import FarmerLoginPage from './components/pages/FarmerLoginPage';
import BuyerLoginPage from './components/pages/BuyerLoginPage';
import FpoLoginPage from './components/pages/FpoLoginPage';
import RegistrationFlow from './components/pages/RegistrationFlow';
import FarmerDashboardNew from './components/dashboards/FarmerDashboardNew';
import BuyerDashboardNew from './components/dashboards/BuyerDashboardNew';
import FpoDashboardNew from './components/dashboards/FpoDashboardNew';

// Localization & Data
import { translations } from './i18n/translations';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState('home'); // home, role-select, farmer-login, fpo-login, buyer-login, register-flow, farmer-dash, fpo-dash, buyer-dash, schemes, services, map, about, contact
  const [lang, setLang] = useState('en');

  // User State
  const [currentUser, setCurrentUser] = useState(null);
  
  // Modals
  const [voiceBotOpen, setVoiceBotOpen] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);

  const t = translations[lang] || translations.en;

  // Wrapper for view navigation to handle "My Dashboard" logic
  const navigateToView = (viewId) => {
    if (viewId === 'dashboard' && currentUser) {
      if (currentUser.role === 'farmer') setCurrentView('farmer-dash');
      else if (currentUser.role === 'fpo') setCurrentView('fpo-dash');
      else if (currentUser.role === 'buyer') setCurrentView('buyer-dash');
    } else {
      setCurrentView(viewId);
    }
  };

  // Flow handlers
  const [registerInitialRole, setRegisterInitialRole] = useState('');

  const handleGetStarted = (mode = 'register') => {
    if (mode === 'register') {
      setRegisterInitialRole('');
      navigateToView('register-flow');
    } else {
      navigateToView('role-select');
    }
  };

  const handleRoleSelect = (role, mode) => {
    if (mode === 'register') {
      setRegisterInitialRole(role);
      navigateToView('register-flow');
    } else {
      if (role === 'farmer') navigateToView('farmer-login');
      else if (role === 'fpo') navigateToView('fpo-login');
      else if (role === 'buyer') navigateToView('buyer-login');
    }
  };

  const handleLoginSuccess = (user, role) => {
    setCurrentUser(user);
    if (role === 'farmer') navigateToView('farmer-dash');
    else if (role === 'fpo') navigateToView('fpo-dash');
    else if (role === 'buyer') navigateToView('buyer-dash');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigateToView('home');
  };

  // Determine layout wrapper based on view
  const isDashboardOrAuth = ['role-select', 'farmer-login', 'fpo-login', 'buyer-login', 'register-flow', 'farmer-dash', 'fpo-dash', 'buyer-dash'].includes(currentView);

  // Dashboards and Auth pages render full screen without the main Navbar/Footer wrapper
  if (isDashboardOrAuth) {
    return (
      <div className="font-sans selection:bg-emerald-200 selection:text-emerald-950">
        {currentView === 'role-select' && (
          <RoleSelectPage
            onSelectRole={handleRoleSelect}
            onBack={() => setCurrentView('home')}
            lang={lang}
            setLang={setLang}
            t={t}
          />
        )}
        {currentView === 'farmer-login' && (
          <FarmerLoginPage
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setCurrentView('role-select')}
            onRegister={() => {
              setRegisterInitialRole('farmer');
              setCurrentView('register-flow');
            }}
            lang={lang}
            setLang={setLang}
            t={t}
          />
        )}
        {currentView === 'fpo-login' && (
          <FpoLoginPage
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setCurrentView('role-select')}
            onRegister={() => {
              setRegisterInitialRole('fpo');
              setCurrentView('register-flow');
            }}
            lang={lang}
            setLang={setLang}
            t={t}
          />
        )}
        {currentView === 'buyer-login' && (
          <BuyerLoginPage
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setCurrentView('role-select')}
            onRegister={() => {
              setRegisterInitialRole('buyer');
              setCurrentView('register-flow');
            }}
            lang={lang}
            setLang={setLang}
            t={t}
          />
        )}
        
        {currentView === 'register-flow' && (
          <RegistrationFlow
            initialRole={registerInitialRole}
            onComplete={handleLoginSuccess}
            onBack={() => setCurrentView('home')}
            lang={lang}
            setLang={setLang}
            t={t}
          />
        )}

        {currentView === 'farmer-dash' && (
          <FarmerDashboardNew
            user={currentUser}
            onLogout={handleLogout}
            lang={lang}
            setLang={setLang}
            t={t}
          />
        )}
        {currentView === 'fpo-dash' && (
          <FpoDashboardNew
            user={currentUser}
            onLogout={handleLogout}
            lang={lang}
            setLang={setLang}
            t={t}
          />
        )}
        {currentView === 'buyer-dash' && (
          <BuyerDashboardNew
            user={currentUser}
            onLogout={handleLogout}
            lang={lang}
            setLang={setLang}
            t={t}
          />
        )}
        
        <KisanVoiceBot isOpen={voiceBotOpen} onClose={() => setVoiceBotOpen(false)} t={t} lang={lang} />
      </div>
    );
  }

  // Standard Public Pages
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      <TopGovtHeader lang={lang} t={t} onOpenSmsModal={() => setSmsModalOpen(true)} />
      
      <Navbar
        currentView={currentView}
        setCurrentView={navigateToView}
        currentRole={currentUser?.role || 'farmer'}
        setCurrentRole={() => {}}
        lang={lang}
        setLang={setLang}
        t={t}
        currentUser={currentUser}
        onOpenAuthModal={handleGetStarted}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <HomeView
            setCurrentView={navigateToView}
            setCurrentRole={() => {}}
            onEnterPanel={(role) => handleRoleSelect(role, 'login')}
            onOpenAuthModal={handleGetStarted}
            onOpenVoiceBot={() => setVoiceBotOpen(true)}
            onOpenSmsModal={() => setSmsModalOpen(true)}
            t={t}
            lang={lang}
          />
        )}
        {currentView === 'schemes' && <SchemesView t={t} />}
        {currentView === 'services' && <ServicesView setCurrentRole={() => {}} setCurrentView={navigateToView} t={t} />}
        {currentView === 'map' && (
          <div className="space-y-6">
            <div className="max-w-3xl space-y-1">
              <h2 className="text-2xl font-black font-heading text-slate-900">Interactive Mandi & Storage Network Map</h2>
              <p className="text-xs text-slate-500">Live geospatial discovery of 500+ APMC Mandis, cold storage hubs and transit routes in Maharashtra, MP, UP & Punjab.</p>
            </div>
            <MandiMap t={t} />
          </div>
        )}
        {currentView === 'about' && <AboutView t={t} />}
        {currentView === 'contact' && <ContactView t={t} />}
      </main>

      <Footer setCurrentView={navigateToView} setLang={setLang} />

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        <button
          onClick={() => setVoiceBotOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-agri-700 hover:from-emerald-700 hover:to-agri-800 text-white font-bold text-xs rounded-full shadow-xl shadow-emerald-900/30 transition hover:scale-105 ring-2 ring-white/50"
          title="Talk to Kisan Saathi AI (Hindi / Marathi / English)"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping"></span>
          <span>🎙️ किसान साथी AI (Voice)</span>
        </button>
      </div>

      <KisanVoiceBot isOpen={voiceBotOpen} onClose={() => setVoiceBotOpen(false)} t={t} lang={lang} />
      <SmsFallbackModal isOpen={smsModalOpen} onClose={() => setSmsModalOpen(false)} />
    </div>
  );
}
