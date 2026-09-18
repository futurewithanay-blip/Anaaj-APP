/**
 * KisanAwaazTrigger.jsx
 * ---------------------
 * The single trigger button that opens the Kisan Awaaz voice assistant overlay.
 * This is the ONLY element inserted into each existing form — one import + one JSX line.
 *
 * Renders a compact banner:
 *   🎙️  Fill by Voice Instead / आवाज़ से भरें / आवाजाने भरा
 *
 * Props:
 *   formConfig     — FORM_* config object from KisanAwaazConfig.js (required)
 *   lang           — 'en' | 'hi' | 'mr' (optional, defaults to 'hi')
 *   onVoiceSubmit  — (values: object) => void  — called on final voice confirmation
 *   onPreFill      — (values: object) => void  — called when user exits early (partial pre-fill)
 */
import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import KisanAwaazOverlay from './KisanAwaazOverlay';

const TRIGGER_TEXT = {
  en: 'Fill by Voice Instead',
  hi: 'आवाज़ से भरें',
  mr: 'आवाजाने भरा',
};

const BADGE_TEXT = {
  en: 'Voice-Guided • Kisan Awaaz',
  hi: 'वॉइस गाइडेड • किसान आवाज़',
  mr: 'व्हॉइस गाइडेड • किसान आवाज',
};

export default function KisanAwaazTrigger({
  formConfig,
  lang = 'hi',
  onVoiceSubmit = () => {},
  onPreFill     = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!formConfig) return null;

  const handleVoiceSubmit = (values) => {
    setIsOpen(false);
    onVoiceSubmit(values);
  };

  const handlePreFill = (values) => {
    // Overlay calls this before closing if user switches to typing
    onPreFill(values);
    // isOpen will be set to false by the overlay's onClose callback
  };

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* ── Trigger Banner ── */}
      <button
        type="button"
        id={`kisan-awaaz-trigger-${formConfig.formId}`}
        onClick={() => setIsOpen(true)}
        className={[
          'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-dashed transition-all cursor-pointer group',
          'border-emerald-300 bg-gradient-to-r from-emerald-50 to-green-50',
          'hover:border-emerald-500 hover:from-emerald-100 hover:to-green-100',
          'hover:shadow-md hover:shadow-emerald-100',
          'active:scale-[0.99]',
        ].join(' ')}
        aria-label={`${TRIGGER_TEXT[lang] || TRIGGER_TEXT.hi} — Kisan Awaaz Voice Assistant`}
      >
        {/* Icon */}
        <span className="shrink-0 w-9 h-9 rounded-full bg-emerald-500 group-hover:bg-emerald-600 flex items-center justify-center shadow-sm shadow-emerald-200 transition">
          <Mic className="w-4 h-4 text-white" strokeWidth={2.5} />
        </span>

        {/* Labels */}
        <div className="flex flex-col items-start min-w-0">
          <span className="text-sm font-black text-emerald-800 leading-tight">
            🎙️ {TRIGGER_TEXT[lang] || TRIGGER_TEXT.hi}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {BADGE_TEXT[lang] || BADGE_TEXT.hi}
            {' '}· {lang === 'hi' ? 'हिंदी, मराठी, English' : lang === 'mr' ? 'हिंदी, मराठी, English' : 'Hindi, Marathi, English'}
          </span>
        </div>

        {/* Arrow indicator */}
        <span className="ml-auto text-emerald-500 group-hover:text-emerald-700 font-bold text-lg transition">
          →
        </span>
      </button>

      {/* ── Overlay (portal-like full-screen modal) ── */}
      {isOpen && (
        <KisanAwaazOverlay
          formConfig={formConfig}
          lang={lang}
          onVoiceSubmit={handleVoiceSubmit}
          onPreFill={handlePreFill}
          onClose={handleClose}
        />
      )}
    </>
  );
}
