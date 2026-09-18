/**
 * KisanAwaazOverlay.jsx
 * ---------------------
 * Full-screen conversation overlay that manages the voice form-filling state machine.
 *
 * State machine phases:
 *   'intro'        – Bot greets user and announces the form
 *   'question'     – Bot speaks the current field question; waiting for user to tap mic
 *   'listening'    – Mic is active; recording speech
 *   'confirm'      – Bot repeats the parsed value; waiting for user yes/no
 *   'fallback'     – Failed 2x; showing text/numeric/date fallback input
 *   'summary'      – All fields done; bot reads back all collected values
 *   'summarizing'  – Bot is currently speaking the summary (TTS playing)
 *   'done'         – User confirmed everything; calling onVoiceSubmit
 *
 * Props:
 *   formConfig     – One of the FORM_* configs from KisanAwaazConfig.js
 *   lang           – 'en' | 'hi' | 'mr'
 *   onVoiceSubmit  – Called with { [fieldKey]: value } on final confirmation
 *   onPreFill      – Called with partial values if user exits early
 *   onClose        – Called when overlay should unmount
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, CheckCircle2, Mic, MicOff, Volume2 } from 'lucide-react';
import { useSpeechToText } from './hooks/useSpeechToText';
import { useTextToSpeech }  from './hooks/useTextToSpeech';
import VoiceQuestionStep from './VoiceQuestionStep';
import {
  parseYesNo, parseNumber, parseNumberWithUnit, parseCropName,
  parseGrievanceCategory, parseGrade, parseDate, parseMoisture,
  parsePhoneNumber, parseSkip, LOT_CROP_ALIASES, REQ_CROP_ALIASES,
} from './parseVoiceValue';

/* ── Map parser identifier strings to actual functions ── */
function runParser(parserId, rawText, lang, fieldConfig) {
  switch (parserId) {
    case 'cropNameLot':             return parseCropName(rawText, LOT_CROP_ALIASES);
    case 'cropNameReq':             return parseCropName(rawText, REQ_CROP_ALIASES);
    case 'grade':                   return parseGrade(rawText);
    case 'grievanceCategoryFarmer': return parseGrievanceCategory(rawText, 'farmer');
    case 'grievanceCategoryBuyer':  return parseGrievanceCategory(rawText, 'buyer');
    case 'date':                    return parseDate(rawText, lang);
    case 'moisture':                return parseMoisture(rawText, lang);
    case 'phone':                   return parsePhoneNumber(rawText);
    case 'number': {
      const r = parseNumber(rawText, lang);
      return r ? r.value : null;
    }
    case 'numberUnit': {
      const r = parseNumberWithUnit(rawText, lang);
      return r ? r.value : null;
    }
    case 'orderId': {
      // orderId: try to match "pehla/first" → first option, etc.
      const t = rawText.toLowerCase();
      const opts = fieldConfig.options || [];
      if (['pehla','first','ek','one','pahila'].some(w => t.includes(w))) return opts[0] || null;
      if (['doosra','second','do','two','dusra'].some(w => t.includes(w)))  return opts[1] || null;
      if (['teesra','third','teen','three','tisra'].some(w => t.includes(w)))return opts[2] || null;
      // Partial order ID match
      for (const opt of opts) {
        const id = opt.match(/ORD-\d+/)?.[0]?.toLowerCase();
        if (id && t.includes(id.replace('ord-', ''))) return opt;
      }
      return null;
    }
    case 'text':
    default:
      return rawText && rawText.trim() ? rawText.trim() : null;
  }
}

/* ── Format parsed value for display ── */
function formatDisplay(parsedValue, fieldConfig) {
  if (parsedValue === null || parsedValue === undefined) return '—';
  if (typeof parsedValue === 'number') return String(parsedValue);
  return String(parsedValue);
}

/* ════════════════════════════════════════════════════════════════
   SUMMARY SCREEN
════════════════════════════════════════════════════════════════ */
function SummaryScreen({ formConfig, collectedValues, lang, onConfirm, onEditField, onSwitchToTyping, isSpeaking }) {
  const LABELS = {
    summaryTitle: { en: 'Review Your Answers', hi: 'आपके उत्तरों की समीक्षा', mr: 'तुमच्या उत्तरांचा आढावा' },
    confirmSubmit: { en: '✅ Confirm & Submit', hi: '✅ पुष्टि करें और जमा करें', mr: '✅ पुष्टी करा आणि सादर करा' },
    switchTyping: { en: '⌨️ Edit Manually', hi: '⌨️ मैन्युअल संपादित करें', mr: '⌨️ मॅन्युअल संपादित करा' },
    notProvided: { en: '(not provided)', hi: '(नहीं दिया)', mr: '(दिले नाही)' },
    listening: { en: 'Say "Yes" to confirm or "No" to go back.', hi: 'पुष्टि के लिए "हाँ" बोलें या वापस जाने के लिए "नहीं"।', mr: 'पुष्टीसाठी "हो" बोला किंवा मागे जाण्यासाठी "नाही".' },
    botSpeaking: { en: '🔊 Listening to summary…', hi: '🔊 सारांश सुन रहे हैं…', mr: '🔊 सारांश ऐकत आहात…' },
  };
  const l = (k) => LABELS[k]?.[lang] || LABELS[k]?.hi || '';

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-base font-black text-slate-800 text-center font-heading">{l('summaryTitle')}</h3>

      {isSpeaking && (
        <div className="text-xs text-blue-600 font-bold bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-center">
          {l('botSpeaking')}
        </div>
      )}

      <div className="space-y-2">
        {formConfig.fields.map((field) => {
          const val = collectedValues[field.key];
          const display = val !== undefined && val !== null && val !== ''
            ? formatDisplay(val, field)
            : null;
          const template = field.confirmTemplate?.[lang] || field.confirmTemplate?.hi;

          return (
            <div
              key={field.key}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                display
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-50 border-slate-100 opacity-60'
              }`}
            >
              <span className="text-xl shrink-0">{field.emoji || '📄'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-500 truncate">{field.key}</p>
                <p className={`text-sm font-black truncate ${display ? 'text-slate-900' : 'text-slate-400'}`}>
                  {display
                    ? (template ? template(display) : display)
                    : l('notProvided')
                  }
                </p>
              </div>
              {display && (
                <button
                  onClick={() => onEditField(field)}
                  className="shrink-0 text-xs text-slate-400 hover:text-blue-600 font-bold px-2 py-1 rounded-lg hover:bg-blue-50 transition"
                >
                  ✏️
                </button>
              )}
            </div>
          );
        })}
      </div>

      {!isSpeaking && (
        <p className="text-xs text-center text-slate-500 font-semibold">{l('listening')}</p>
      )}

      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={onConfirm}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 text-white font-black rounded-2xl text-sm shadow-lg shadow-emerald-200 transition active:scale-[0.98]"
        >
          {l('confirmSubmit')}
        </button>
        <button
          onClick={onSwitchToTyping}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
        >
          {l('switchTyping')}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   DONE / SUCCESS SCREEN
════════════════════════════════════════════════════════════════ */
function DoneScreen({ lang, onClose }) {
  const MSG = {
    en: { title: 'Form Submitted! 🎉', sub: 'Your information has been saved successfully.' },
    hi: { title: 'फॉर्म जमा हो गया! 🎉', sub: 'आपकी जानकारी सफलतापूर्वक सहेज ली गई है।' },
    mr: { title: 'फॉर्म सादर झाला! 🎉', sub: 'तुमची माहिती यशस्वीरित्या जतन केली गेली आहे.' },
  };
  const BTN = { en: 'Close', hi: 'बंद करें', mr: 'बंद करा' };
  const m = MSG[lang] || MSG.hi;

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center shadow-xl shadow-emerald-100">
        <CheckCircle2 className="w-14 h-14 text-emerald-600" strokeWidth={2} />
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-black text-slate-900 font-heading">{m.title}</h3>
        <p className="text-sm text-slate-600 mt-1.5">{m.sub}</p>
      </div>
      <button
        onClick={onClose}
        className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm transition shadow-md"
      >
        {BTN[lang] || BTN.hi}
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MIC PERMISSION DENIED SCREEN
════════════════════════════════════════════════════════════════ */
function MicDeniedScreen({ lang, onSwitchToTyping, onClose }) {
  const MSG = {
    en: {
      title: 'Microphone Access Required',
      body:  'Please allow microphone access in your browser to use voice input. You can also switch to manual typing.',
      btn1:  '⌨️ Switch to Typing',
      btn2:  'Close',
    },
    hi: {
      title: 'माइक्रोफ़ोन अनुमति चाहिए',
      body:  'वॉइस इनपुट के लिए कृपया ब्राउज़र में माइक्रोफ़ोन अनुमति दें। आप मैन्युअल टाइपिंग भी चुन सकते हैं।',
      btn1:  '⌨️ टाइप करें',
      btn2:  'बंद करें',
    },
    mr: {
      title: 'मायक्रोफोन परवानगी आवश्यक',
      body:  'व्हॉइस इनपुटसाठी कृपया ब्राउझरमध्ये मायक्रोफोन परवानगी द्या. तुम्ही मॅन्युअल टायपिंगही निवडू शकता.',
      btn1:  '⌨️ टाइप करा',
      btn2:  'बंद करा',
    },
  };
  const m = MSG[lang] || MSG.hi;

  return (
    <div className="flex flex-col items-center gap-5 py-6 text-center">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
        <MicOff className="w-10 h-10 text-red-500" />
      </div>
      <div>
        <h3 className="text-lg font-black text-slate-900 font-heading">{m.title}</h3>
        <p className="text-sm text-slate-600 mt-1.5 max-w-xs">{m.body}</p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <button onClick={onSwitchToTyping} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm transition">
          {m.btn1}
        </button>
        <button onClick={onClose} className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm">
          {m.btn2}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN OVERLAY
════════════════════════════════════════════════════════════════ */
export default function KisanAwaazOverlay({ formConfig, lang = 'hi', onVoiceSubmit, onPreFill, onClose }) {
  /* ─── Conversation State ─── */
  const [phase,           setPhase]           = useState('intro');
  const [fieldIndex,      setFieldIndex]       = useState(0);
  const [collectedValues, setCollectedValues]  = useState({});
  const [parsedValue,     setParsedValue]      = useState(null);
  const [parsedDisplay,   setParsedDisplay]    = useState('');
  const [rawTranscript,   setRawTranscript]    = useState('');
  const [retryCount,      setRetryCount]       = useState(0);
  const [micDenied,       setMicDenied]        = useState(false);

  const STT = useSpeechToText(lang);
  const TTS = useTextToSpeech(lang);

  const fields     = formConfig.fields;
  const totalFields = fields.length;
  const currentField = fields[fieldIndex] || null;

  /* ─── Speak helper (queues speak and transitions phase after) ─── */
  const speakThen = useCallback((text, afterPhase) => {
    TTS.speak(text).then?.(() => {
      if (afterPhase) setPhase(afterPhase);
    }).catch?.(() => {
      if (afterPhase) setPhase(afterPhase);
    });
    // Web Speech API doesn't return a promise from speak — use onend callback instead.
    // We fall back to a timeout as a safety net.
    if (afterPhase) {
      const approxMs = Math.max(1500, text.length * 65); // ~65ms per char
      const timer = setTimeout(() => setPhase(p => p !== afterPhase ? afterPhase : p), approxMs + 500);
      return () => clearTimeout(timer);
    }
  }, [TTS]);

  /* ─── Phase: intro ─── */
  useEffect(() => {
    if (phase !== 'intro') return;
    const introText = formConfig.intro?.[lang] || formConfig.intro?.hi || '';
    TTS.speak(introText);
    // After intro, auto-advance to first question
    const approxMs = Math.max(2000, introText.length * 65) + 800;
    const t = setTimeout(() => setPhase('question'), approxMs);
    return () => clearTimeout(t);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── Phase: question — ask current field question via TTS ─── */
  useEffect(() => {
    if (phase !== 'question' || !currentField) return;
    const questionText = currentField.questions?.[lang] || currentField.questions?.hi || '';
    TTS.speak(questionText);
    setRetryCount(0);
    setParsedValue(null);
    setParsedDisplay('');
    setRawTranscript('');
  }, [phase, fieldIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── React to STT transcript changes ─── */
  useEffect(() => {
    if (!STT.transcript || STT.isListening) return;
    if (phase !== 'listening') return;
    if (!currentField) return;

    const raw = STT.transcript;
    setRawTranscript(raw);

    // Check for skip on optional fields
    if (!currentField.required && parseSkip(raw)) {
      advanceField();
      return;
    }

    // Check for "switch to typing" keyword
    if (['type', 'typing', 'keyboard', 'manual'].some(w => raw.toLowerCase().includes(w))) {
      handleSwitchToTyping();
      return;
    }

    // Run the field's parser
    const result = runParser(currentField.parser, raw, lang, currentField);

    if (result !== null && result !== undefined && result !== '') {
      setParsedValue(result);
      setParsedDisplay(formatDisplay(result, currentField));
      const confirmText = currentField.confirmTemplate?.[lang]?.(formatDisplay(result, currentField))
        || currentField.confirmTemplate?.hi?.(formatDisplay(result, currentField))
        || String(result);
      TTS.speak(confirmText);
      setPhase('confirm');
    } else {
      // Parser returned null — retry or show fallback
      const newRetry = retryCount + 1;
      setRetryCount(newRetry);
      if (newRetry >= 2) {
        setPhase('fallback');
        const fallbackMsg = {
          en: "Sorry, I couldn't understand. Please enter the value below.",
          hi: "माफ करें, समझ नहीं आया। नीचे दर्ज करें।",
          mr: "माफ करा, समजले नाही. खाली प्रविष्ट करा.",
        };
        TTS.speak(fallbackMsg[lang] || fallbackMsg.hi);
      } else {
        const retryMsg = {
          en: "I didn't catch that. Please say it again clearly.",
          hi: "समझ नहीं आया। कृपया दोबारा साफ बोलें।",
          mr: "समजले नाही. कृपया पुन्हा स्पष्ट बोला.",
        };
        TTS.speak(retryMsg[lang] || retryMsg.hi);
        setPhase('question');
      }
    }
  }, [STT.transcript, STT.isListening]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── React to STT errors ─── */
  useEffect(() => {
    if (!STT.error) return;
    if (STT.error === 'mic_denied') {
      setMicDenied(true);
      setPhase('question');
    }
  }, [STT.error]);

  /* ─── Phase: summary — read back all collected values ─── */
  useEffect(() => {
    if (phase !== 'summary') return;
    const summaryText = formConfig.summary?.[lang]?.(collectedValues)
      || formConfig.summary?.hi?.(collectedValues)
      || '';
    TTS.speak(summaryText);

    // After TTS speaks, listen for yes/no
    const approxMs = Math.max(2000, summaryText.length * 65) + 500;
    const t = setTimeout(() => {
      STT.startListening();
    }, approxMs);
    return () => clearTimeout(t);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── React to yes/no on summary ─── */
  useEffect(() => {
    if (phase !== 'summary') return;
    if (!STT.transcript || STT.isListening) return;
    const yesNo = parseYesNo(STT.transcript, lang);
    if (yesNo === true) {
      handleFinalConfirm();
    } else if (yesNo === false) {
      // Go back to the first field
      setFieldIndex(0);
      setPhase('question');
    }
    // null = unclear; just let the user tap the button
  }, [STT.transcript, STT.isListening, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── Phase: confirm — listen for yes/no ─── */
  useEffect(() => {
    if (phase !== 'confirm') return;
    // Give TTS time to finish, then start listening for yes/no
    const t = setTimeout(() => {
      if (phase === 'confirm') STT.startListening();
    }, 1500);
    return () => clearTimeout(t);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── React to yes/no on confirm ─── */
  useEffect(() => {
    if (phase !== 'confirm') return;
    if (!STT.transcript || STT.isListening) return;

    const yesNo = parseYesNo(STT.transcript, lang);
    if (yesNo === true) {
      handleConfirmYes();
    } else if (yesNo === false) {
      handleConfirmNo();
    }
    // null = unclear; let user tap buttons
  }, [STT.transcript, STT.isListening, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ════ Action Handlers ════ */

  const advanceField = useCallback(() => {
    const nextIndex = fieldIndex + 1;
    if (nextIndex >= totalFields) {
      setPhase('summary');
    } else {
      setFieldIndex(nextIndex);
      setPhase('question');
    }
    STT.reset();
  }, [fieldIndex, totalFields, STT]);

  const handleConfirmYes = useCallback(() => {
    if (!currentField) return;
    setCollectedValues(prev => ({ ...prev, [currentField.key]: parsedValue }));
    STT.reset();
    advanceField();
  }, [currentField, parsedValue, advanceField, STT]);

  const handleConfirmNo = useCallback(() => {
    setRetryCount(r => r + 1);
    STT.reset();
    setPhase('question');
  }, [STT]);

  const handleSkip = useCallback(() => {
    STT.reset();
    advanceField();
  }, [advanceField, STT]);

  const handleFallbackValue = useCallback((value) => {
    if (!currentField || !value) return;
    const parsed = runParser(currentField.parser, String(value), lang, currentField);
    const finalValue = parsed !== null ? parsed : value;
    setParsedValue(finalValue);
    setParsedDisplay(formatDisplay(finalValue, currentField));
    setCollectedValues(prev => ({ ...prev, [currentField.key]: finalValue }));
    STT.reset();
    advanceField();
  }, [currentField, lang, advanceField, STT]);

  const handleRepeatQuestion = useCallback(() => {
    if (!currentField) return;
    const qText = currentField.questions?.[lang] || currentField.questions?.hi || '';
    TTS.speak(qText);
    setPhase('question');
  }, [currentField, lang, TTS]);

  const handleFinalConfirm = useCallback(() => {
    TTS.stop();
    STT.reset();
    setPhase('done');
    try {
      onVoiceSubmit(collectedValues);
    } catch (err) {
      console.error('[KisanAwaaz] onVoiceSubmit error:', err);
    }
  }, [collectedValues, onVoiceSubmit, TTS, STT]);

  const handleSwitchToTyping = useCallback(() => {
    TTS.stop();
    STT.stopListening();
    try {
      onPreFill(collectedValues);
    } catch (err) {
      console.error('[KisanAwaaz] onPreFill error:', err);
    }
    onClose();
  }, [collectedValues, onPreFill, onClose, TTS, STT]);

  const handleEditField = useCallback((field) => {
    const idx = fields.findIndex(f => f.key === field.key);
    if (idx >= 0) {
      setFieldIndex(idx);
      setPhase('question');
      STT.reset();
    }
  }, [fields, STT]);

  const handleStartListening = useCallback(() => {
    setPhase('listening');
    STT.startListening();
  }, [STT]);

  const handleClose = useCallback(() => {
    TTS.stop();
    STT.stopListening();
    onClose();
  }, [TTS, STT, onClose]);

  /* ────────────────────────────────────────────────
     RENDER
  ──────────────────────────────────────────────── */
  const TITLE = {
    create_lot:       { en: '🌾 Create Lot', hi: '🌾 फसल लॉट बनाएं', mr: '🌾 पीक लॉट तयार करा' },
    grievance_farmer: { en: '⚠️ File Grievance', hi: '⚠️ शिकायत दर्ज करें', mr: '⚠️ तक्रार नोंदवा' },
    grievance_buyer:  { en: '⚠️ File Grievance', hi: '⚠️ शिकायत दर्ज करें', mr: '⚠️ तक्रार नोंदवा' },
    post_requirement: { en: '📦 Post Requirement', hi: '📦 खरीद मांग दर्ज करें', mr: '📦 खरेदी मागणी नोंदवा' },
    registration_s1:  { en: '👤 Registration', hi: '👤 पंजीकरण', mr: '👤 नोंदणी' },
    fpo_join:         { en: '🤝 Join FPO', hi: '🤝 FPO में जुड़ें', mr: '🤝 FPO मध्ये सामील व्हा' },
  };

  const PROVIDER_BADGE = STT.provider === 'bhashini'
    ? <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">🇮🇳 Bhashini</span>
    : <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">🌐 Web Speech</span>;

  const titleObj = TITLE[formConfig.formId] || TITLE.create_lot;
  const overlayTitle = titleObj[lang] || titleObj.hi;

  const accentColor = formConfig.color || '#16a34a';

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-slate-900/70 backdrop-blur-md"
      style={{ fontFamily: "'Inter', 'Noto Sans Devanagari', sans-serif" }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Kisan Awaaz Voice Assistant"
    >
      {/* Panel */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">

        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ background: `linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}06 100%)`, borderBottom: `2px solid ${accentColor}20` }}
        >
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-slate-900 font-heading">{overlayTitle}</span>
              {PROVIDER_BADGE}
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">
              {lang === 'en' ? '🎙️ Voice-guided form filling' : lang === 'mr' ? '🎙️ आवाजाद्वारे फॉर्म भरणे' : '🎙️ आवाज़ से फॉर्म भरें'}
              {' '}· {lang === 'en' ? 'Kisan Awaaz' : 'किसान आवाज़'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-slate-100 transition text-slate-500 hover:text-slate-800"
            aria-label="Close Kisan Awaaz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar (for active question phases) */}
        {['question','listening','confirm','fallback'].includes(phase) && (
          <div className="h-1 bg-slate-100 shrink-0">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(((fieldIndex + 1) / totalFields) * 100)}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
        )}

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-6">

          {/* Mic Denied */}
          {micDenied && phase !== 'done' && (
            <MicDeniedScreen lang={lang} onSwitchToTyping={handleSwitchToTyping} onClose={handleClose} />
          )}

          {/* Intro / loading spinner */}
          {!micDenied && phase === 'intro' && (
            <div className="flex flex-col items-center gap-5 py-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center shadow-lg">
                <Mic className="w-10 h-10 text-emerald-600 animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-black text-slate-900 font-heading">
                  {lang === 'en' ? 'Starting Kisan Awaaz…' : lang === 'mr' ? 'किसान आवाज सुरू होतोय…' : 'किसान आवाज़ शुरू हो रहा है…'}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {formConfig.intro?.[lang] || formConfig.intro?.hi}
                </p>
              </div>
              <Volume2 className="w-5 h-5 text-emerald-500 animate-bounce" />
            </div>
          )}

          {/* Question / Listening / Confirm / Fallback */}
          {!micDenied && currentField && ['question','listening','confirm','fallback'].includes(phase) && (
            <VoiceQuestionStep
              fieldConfig={currentField}
              lang={lang}
              phase={phase}
              transcript={rawTranscript}
              parsedValue={parsedValue}
              parsedDisplay={parsedDisplay}
              isListening={STT.isListening}
              isSpeaking={TTS.isSpeaking}
              error={STT.error}
              retryCount={retryCount}
              fieldIndex={fieldIndex}
              totalFields={totalFields}
              onStartListening={handleStartListening}
              onStopListening={STT.stopListening}
              onRepeatQuestion={handleRepeatQuestion}
              onConfirmYes={handleConfirmYes}
              onConfirmNo={handleConfirmNo}
              onSkip={handleSkip}
              onFallbackValue={handleFallbackValue}
              onSwitchToTyping={handleSwitchToTyping}
            />
          )}

          {/* Summary */}
          {!micDenied && phase === 'summary' && (
            <SummaryScreen
              formConfig={formConfig}
              collectedValues={collectedValues}
              lang={lang}
              onConfirm={handleFinalConfirm}
              onEditField={handleEditField}
              onSwitchToTyping={handleSwitchToTyping}
              isSpeaking={TTS.isSpeaking}
            />
          )}

          {/* Done */}
          {phase === 'done' && <DoneScreen lang={lang} onClose={handleClose} />}
        </div>

        {/* ── Footer — always-visible escape hatch ── */}
        {!['done', 'intro'].includes(phase) && !micDenied && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 shrink-0 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">
              {lang === 'en' ? 'Kisan Awaaz — Mode 2 Voice Assistant' : lang === 'mr' ? 'किसान आवाज — मोड 2' : 'किसान आवाज़ — मोड 2'}
            </p>
            <button
              onClick={handleSwitchToTyping}
              className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 transition"
            >
              ⌨️ {lang === 'en' ? 'Switch to Typing' : lang === 'mr' ? 'टाइप करा' : 'टाइप करें'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
