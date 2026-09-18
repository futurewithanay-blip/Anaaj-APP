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
  PhoneCall,
  Mic
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
      badgeText: 'NATIONAL AGRI-MARKET INTELLIGENCE • APMC e-NAM LINKAGE',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      titlePart1: 'Empowering Farmers with',
      titleHighlight: 'AI Mandi Price Discovery',
      titlePart2: '& Market Linkage',
      quote: '"Empowering India\'s Annadata: Connecting fields directly to verified processors and bulk buyers with real-time AI price forecasts and net take-home profit discovery."',
      primaryBtnText: 'Enter Farmer Panel →',
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
          
          {/* Left Content Block: Title + Inspiring Quote */}
          <div className="lg:col-span-12 space-y-5 animate-in fade-in slide-in-from-left-4 duration-500 key={currentSlide}">
            


            {/* Badge Indicator */}
            <div>
              <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm ${slide.badgeColor}`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{slide.badgeText}</span>
              </span>
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

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onEnterPanel && onEnterPanel(slide.primaryRole || 'farmer')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-agri-600 to-emerald-600 hover:from-emerald-600 hover:to-agri-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/40 hover:scale-[1.03] transition-all cursor-pointer"
              >
                <span>{slide.primaryBtnText || 'Enter Platform'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenVoiceBot}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:border-emerald-400/50"
              >
                <Mic className="w-4 h-4 text-emerald-400" />
                <span>Kisan Voice AI</span>
              </button>

              <button
                onClick={onOpenSmsModal}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-harvest-300 font-semibold text-xs border border-harvest-500/30 transition cursor-pointer"
              >
                <span>SMS Mode (*99#)</span>
              </button>
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
