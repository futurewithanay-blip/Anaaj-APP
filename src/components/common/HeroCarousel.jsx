import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sprout,
  Users,
  Building2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  ShieldCheck,
  Globe,
  Pause,
  Play,
  PhoneCall
} from 'lucide-react';

export default function HeroCarousel({
  onEnterPanel,
  onOpenVoiceBot,
  onOpenSmsModal,
  onOpenAuthModal,
  t,
  lang
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      image: '/hero_slide1.jpg',
      badgeText: 'SMART INDIA HACKATHON 2026 • PS ID: 26132',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      titlePart1: 'Empowering Farmers with',
      titleHighlight: 'AI Mandi Price Discovery',
      titlePart2: '& Market Linkage',
      quote: '"Empowering India\'s Annadata: Connecting fields directly to verified processors and bulk buyers with real-time AI price forecasts and net take-home profit discovery."',
      primaryBtnText: t?.btnEnterFarmer || 'Enter Farmer Panel',
      primaryRole: 'farmer'
    },
    {
      id: 2,
      image: '/hero_slide2.jpg',
      badgeText: 'Agriculture for a Viksit Bharat',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      titlePart1: "India's Food and",
      titleHighlight: 'Economic Transformation',
      titlePart2: '',
      quote: '"Sowing Innovation, Harvesting Prosperity: Driving inclusive growth, building climate resilience, and eliminating post-harvest distress selling across 500+ APMC mandis."',
      primaryBtnText: 'Join FPO Aggregator →',
      primaryRole: 'fpo'
    },
    {
      id: 3,
      image: '/hero_slide3.jpg',
      badgeText: 'Direct Market & Escrow Trade',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
      titlePart1: 'Eliminating Middlemen,',
      titleHighlight: 'Maximizing Take-Home Income',
      titlePart2: '',
      quote: '"Where Every Grain Counts: Smart net-profit calculation subtracting freight, loading & cess, backed by 24-hour escrow payment security for every farmer."',
      primaryBtnText: 'Access Buyer Desk →',
      primaryRole: 'buyer'
    },
    {
      id: 4,
      image: '/hero_slide1.jpg',
      badgeText: 'Smart AI Decisions & Voice Assistant',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      titlePart1: 'Transforming Knowledge',
      titleHighlight: 'into Rural Prosperity',
      titlePart2: '',
      quote: '"From Seed to Sale: Multi-lingual AI Kisan Voice Assistant, Meghdoot weather advisories, and offline SMS fallback (*99#) for seamless rural connectivity."',
      primaryBtnText: 'Enter Farmer Panel →',
      primaryRole: 'farmer'
    }
  ];

  // Auto-advance slides every 5 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-emerald-950/40 text-white min-h-[540px] lg:min-h-[580px] flex flex-col justify-between transition-all duration-700 bg-slate-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 📸 Slide Background Images with smooth opacity fade */}
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        >
          <img
            src={s.image}
            alt="Anaaj Farmers Digital Market"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-7000 ease-out"
            style={{
              transform: idx === currentSlide ? 'scale(1.04)' : 'scale(1)'
            }}
          />
          
          {/* Deep Crisp Dark Gradient Overlay for Maximum Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
        </div>
      ))}

      {/* Decorative Subtle Glow */}
      <div className="absolute -left-20 top-1/3 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* 🌐 MAIN HERO CONTENT GRID */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-10 py-10 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* 👈 Left Content Block: Title + Inspiring Quote + Clean CTAs */}
          <div className="lg:col-span-7 space-y-5 animate-in fade-in slide-in-from-left-4 duration-500 key={currentSlide}">
            
            {/* Top Badge */}
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border backdrop-blur-md ${slide.badgeColor}`}>
              <span>{slide.badgeText}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-[1.15]">
              {slide.titlePart1} <br />
              <span className="bg-gradient-to-r from-harvest-300 via-harvest-400 to-amber-200 bg-clip-text text-transparent">
                {slide.titleHighlight}
              </span>{' '}
              {slide.titlePart2}
            </h1>

            {/* Inspiring Fresh Quote */}
            <div className="p-4 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/10 max-w-xl shadow-lg">
              <p className="text-sm sm:text-base italic text-emerald-100/90 leading-relaxed font-serif">
                {slide.quote}
              </p>
              <p className="text-[11px] font-bold text-harvest-400 uppercase tracking-widest mt-2.5 not-italic">
                — अnaaj ("THE FARMER'S DIGITAL MARKET")
              </p>
            </div>

            {/* Workable Role Launch CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onEnterPanel(slide.primaryRole)}
                className="px-6 py-3 bg-gradient-to-r from-harvest-400 to-harvest-500 hover:from-harvest-300 hover:to-harvest-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-xl shadow-harvest-500/20 transition hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>{slide.primaryBtnText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onEnterPanel('fpo')}
                className="px-5 py-3 bg-slate-900/80 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm border border-white/15 hover:border-white/30 transition backdrop-blur-md cursor-pointer"
              >
                <span>FPO Aggregator</span>
              </button>

              <button
                onClick={() => onEnterPanel('buyer')}
                className="px-5 py-3 bg-slate-900/80 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm border border-white/15 hover:border-white/30 transition backdrop-blur-md cursor-pointer"
              >
                <span>Buyer Desk</span>
              </button>
            </div>

            {/* Clean, Aesthetic Assistant & SMS Pill Buttons (No Emojis/Sparkles) */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <button
                onClick={onOpenVoiceBot}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-emerald-300 px-4 py-2 rounded-full border border-emerald-500/25 hover:border-emerald-500/50 font-medium cursor-pointer transition backdrop-blur-md"
              >
                <span>Kisan AI Voice Assistant</span>
                <span className="text-emerald-400 font-bold">→</span>
              </button>

              <button
                onClick={onOpenSmsModal}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-harvest-300 px-4 py-2 rounded-full border border-harvest-500/25 hover:border-harvest-500/50 font-medium cursor-pointer transition backdrop-blur-md"
              >
                <span>Offline SMS Simulator (*99#)</span>
                <span className="text-harvest-400 font-bold">→</span>
              </button>
            </div>

          </div>

          {/* 👉 Right Block: Sleek, Minimalist Live Mandi Signals Card */}
          <div className="lg:col-span-5 flex justify-end">
            <div className="w-full max-w-sm bg-slate-900/70 backdrop-blur-2xl rounded-2xl p-5 border border-white/10 shadow-2xl space-y-3.5 transition hover:border-emerald-500/30">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Live Mandi AI Signals
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                  Real-time
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-white/[0.04] hover:bg-white/[0.08] transition rounded-xl flex items-center justify-between border border-white/5">
                  <div>
                    <p className="text-[11px] text-slate-300 font-medium">Onion · Lasalgaon APMC</p>
                    <p className="text-base font-black text-white font-heading">₹2,580 / Q</p>
                  </div>
                  <button
                    onClick={() => onEnterPanel('farmer')}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-black tracking-wide shadow-md cursor-pointer transition"
                  >
                    SELL NOW
                  </button>
                </div>

                <div className="p-3 bg-white/[0.04] hover:bg-white/[0.08] transition rounded-xl flex items-center justify-between border border-white/5">
                  <div>
                    <p className="text-[11px] text-slate-300 font-medium">Soybean · Latur APMC</p>
                    <p className="text-base font-black text-white font-heading">₹5,180 / Q</p>
                  </div>
                  <button
                    onClick={() => onEnterPanel('farmer')}
                    className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-black tracking-wide shadow-md cursor-pointer transition"
                  >
                    HOLD (+₹200)
                  </button>
                </div>

                <div className="p-3 bg-white/[0.04] hover:bg-white/[0.08] transition rounded-xl flex items-center justify-between border border-white/5">
                  <div>
                    <p className="text-[11px] text-slate-300 font-medium">Cotton · Yavatmal APMC</p>
                    <p className="text-base font-black text-white font-heading">₹7,850 / Q</p>
                  </div>
                  <button
                    onClick={() => onEnterPanel('farmer')}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-black tracking-wide shadow-md cursor-pointer transition"
                  >
                    SELL NOW
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>500+ Mandi Arrivals Synced</span>
                <span className="font-semibold text-harvest-400">Prophet AI v2.4</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 🧭 BOTTOM CONTROLS & PAGINATION BAR (Clean & Fresh) */}
      <div className="relative z-20 px-6 sm:px-10 pb-5 flex items-center justify-between border-t border-white/10 pt-3 bg-slate-950/60 backdrop-blur-md">
        
        {/* Left: Play/Pause & Arrow Nav */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition cursor-pointer"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            title={isPaused ? "Resume Auto Slide" : "Pause Auto Slide"}
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
            <span>{isPaused ? "Play" : "Pause"}</span>
          </button>

          <button
            onClick={handleNext}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition cursor-pointer"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center/Right: Slide Counter & Pill Pagination Dots */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold font-mono text-slate-400">
            0{currentSlide + 1} / 0{slides.length}
          </span>
          <div className="flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide
                    ? 'w-7 bg-harvest-400 shadow-md shadow-harvest-500/50'
                    : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                title={`Go to Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}
