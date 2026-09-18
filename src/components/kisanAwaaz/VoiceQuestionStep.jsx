/**
 * VoiceQuestionStep.jsx
 * ---------------------
 * Renders a single question step in the Kisan Awaaz voice conversation flow.
 * Reusable across all form fields — the parent (KisanAwaazOverlay) drives state.
 *
 * Shows:
 *  - The spoken question text
 *  - Microphone pulse/waveform animation while listening
 *  - Confirmation chip (large emoji + parsed value) after speech is captured
 *  - "Sahi hai?" confirmation with ✅ / 🔁 tap buttons
 *  - "🔁 Repeat Question" button
 *  - Fallback: numeric keypad or text input for that one field if speech fails twice
 *  - "⌨️ Switch to Typing" escape hatch (always visible)
 *  - "Skip" button for optional fields
 */
import React, { useState, useEffect } from 'react';

/* ─── Mic Waveform Animation ─── */
function MicWaveform({ isListening }) {
  return (
    <div className="flex items-center justify-center gap-1 h-12" aria-label="Microphone listening indicator">
      {[0.4, 0.7, 1.0, 0.7, 0.4, 0.9, 0.5].map((h, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full transition-all"
          style={{
            height: isListening ? `${Math.round(h * 40)}px` : '6px',
            backgroundColor: isListening ? '#16a34a' : '#cbd5e1',
            animation: isListening ? `pulse-bar ${0.6 + i * 0.1}s ease-in-out infinite alternate` : 'none',
            transitionDuration: '0.15s',
          }}
        />
      ))}
      <style>{`
        @keyframes pulse-bar {
          from { transform: scaleY(0.5); opacity: 0.7; }
          to   { transform: scaleY(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─── Numeric Keypad (Fallback for number fields) ─── */
function NumericKeypad({ value, onChange, onConfirm, lang }) {
  const LABELS = { en: 'Confirm', hi: 'पुष्टि करें', mr: 'पुष्टी करा' };
  const CLEAR  = { en: 'Clear',   hi: 'मिटाएं',      mr: 'साफ करा'  };

  const handleKey = (k) => {
    if (k === 'DEL') { onChange(value.slice(0, -1)); return; }
    if (k === '.' && value.includes('.')) return;
    onChange(value + k);
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      <div className="w-full max-w-[280px] bg-slate-100 rounded-2xl px-4 py-3 text-center text-3xl font-black text-slate-900 tracking-widest min-h-[56px]">
        {value || <span className="text-slate-300">0</span>}
      </div>
      <div className="grid grid-cols-3 gap-2 w-full max-w-[280px]">
        {['1','2','3','4','5','6','7','8','9','.','0','DEL'].map((k) => (
          <button
            key={k}
            onClick={() => handleKey(k)}
            className={`h-14 rounded-xl text-xl font-bold transition active:scale-95 ${
              k === 'DEL'
                ? 'bg-red-100 text-red-700 hover:bg-red-200 text-sm'
                : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm'
            }`}
          >
            {k === 'DEL' ? CLEAR[lang] || 'DEL' : k}
          </button>
        ))}
      </div>
      <button
        onClick={() => onConfirm(value)}
        className="w-full max-w-[280px] py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition"
      >
        ✓ {LABELS[lang] || 'Confirm'}
      </button>
    </div>
  );
}

/* ─── Text Input Fallback ─── */
function TextFallback({ value, onChange, onConfirm, lang, fieldLabel }) {
  const CONFIRM = { en: 'Confirm', hi: 'ठीक है', mr: 'बरोबर आहे' };
  const PLACEHOLDER = { en: `Type ${fieldLabel}...`, hi: 'यहाँ टाइप करें...', mr: 'येथे टाइप करा...' };

  return (
    <div className="flex flex-col gap-3 mt-4 w-full max-w-sm mx-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={PLACEHOLDER[lang] || '...'}
        autoFocus
        className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 focus:border-emerald-500 text-lg text-slate-800 outline-none"
      />
      <button
        onClick={() => value.trim() && onConfirm(value.trim())}
        disabled={!value.trim()}
        className="py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-sm transition"
      >
        ✓ {CONFIRM[lang] || 'Confirm'}
      </button>
    </div>
  );
}

/* ─── Date Picker Fallback ─── */
function DateFallback({ value, onChange, onConfirm, lang }) {
  const CONFIRM = { en: 'Confirm Date', hi: 'तारीख पक्की करें', mr: 'तारीख निश्चित करा' };
  return (
    <div className="flex flex-col gap-3 mt-4 w-full max-w-sm mx-auto">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 focus:border-emerald-500 text-base text-slate-800 outline-none"
      />
      <button
        onClick={() => value && onConfirm(value)}
        disabled={!value}
        className="py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-sm transition"
      >
        ✓ {CONFIRM[lang] || 'Confirm Date'}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */

/**
 * @param {Object}   fieldConfig     — single field config from KisanAwaazConfig
 * @param {string}   lang            — 'en' | 'hi' | 'mr'
 * @param {'question'|'listening'|'confirm'|'fallback'} phase
 * @param {string}   transcript      — raw speech transcript (from useSpeechToText)
 * @param {any}      parsedValue     — result from parseVoiceValue (structured)
 * @param {string}   parsedDisplay   — human-readable display string for the parsed value
 * @param {boolean}  isListening     — from useSpeechToText hook
 * @param {boolean}  isSpeaking      — from useTextToSpeech hook
 * @param {string|null} error        — error code from STT/TTS hook
 * @param {number}   retryCount      — how many times this field has been retried
 * @param {number}   fieldIndex      — 0-based index
 * @param {number}   totalFields
 * @param {Function} onStartListening
 * @param {Function} onStopListening
 * @param {Function} onRepeatQuestion
 * @param {Function} onConfirmYes    — user confirmed "yes, this is correct"
 * @param {Function} onConfirmNo     — user wants to retry
 * @param {Function} onSkip          — skip this optional field
 * @param {Function} onFallbackValue — user typed/keyed a value in fallback
 * @param {Function} onSwitchToTyping
 */
export default function VoiceQuestionStep({
  fieldConfig,
  lang = 'hi',
  phase,
  transcript,
  parsedValue,
  parsedDisplay,
  isListening,
  isSpeaking,
  error,
  retryCount,
  fieldIndex,
  totalFields,
  onStartListening,
  onStopListening,
  onRepeatQuestion,
  onConfirmYes,
  onConfirmNo,
  onSkip,
  onFallbackValue,
  onSwitchToTyping,
}) {
  const [fallbackInput, setFallbackInput] = useState('');

  // Reset fallback input whenever the field changes
  useEffect(() => { setFallbackInput(''); }, [fieldConfig.key]);

  const questionText = fieldConfig.questions?.[lang] || fieldConfig.questions?.hi || '';
  const confirmLabel = fieldConfig.confirmTemplate?.[lang]?.(parsedDisplay || parsedValue) || parsedDisplay || parsedValue;

  /* ─── Error message labels ─── */
  const ERR_MSG = {
    mic_denied: {
      en: "Microphone access denied. Please allow mic access in your browser settings.",
      hi: "माइक्रोफ़ोन अनुमति नहीं मिली। ब्राउज़र सेटिंग में माइक अनुमति दें।",
      mr: "मायक्रोफोन परवानगी नाकारली. ब्राउझर सेटिंगमध्ये माइक परवानगी द्या.",
    },
    no_speech: {
      en: "Nothing was heard. Please try speaking again.",
      hi: "कुछ सुनाई नहीं दिया। दोबारा बोलने की कोशिश करें।",
      mr: "काहीच ऐकू आले नाही. पुन्हा बोलण्याचा प्रयत्न करा.",
    },
    speech_not_supported: {
      en: "Your browser doesn't support voice input. Please type below.",
      hi: "आपका ब्राउज़र आवाज़ इनपुट सपोर्ट नहीं करता। नीचे टाइप करें।",
      mr: "तुमचा ब्राउझर व्हॉइस इनपुट सपोर्ट करत नाही. खाली टाइप करा.",
    },
  };

  const LABELS = {
    stepOf: { en: `Field ${fieldIndex + 1} of ${totalFields}`, hi: `फील्ड ${fieldIndex + 1} / ${totalFields}`, mr: `फील्ड ${fieldIndex + 1} / ${totalFields}` },
    tapToSpeak: { en: 'Tap to Speak', hi: 'बोलने के लिए दबाएं', mr: 'बोलण्यासाठी दाबा' },
    stopRecording: { en: 'Done Speaking', hi: 'बोल दिया', mr: 'बोलून झाले' },
    repeat: { en: '🔁 Repeat Question', hi: '🔁 सवाल दोहराएं', mr: '🔁 प्रश्न पुन्हा सांगा' },
    skip: { en: '⏭ Skip (Optional)', hi: '⏭ छोड़ें (वैकल्पिक)', mr: '⏭ सोडा (ऐच्छिक)' },
    switchTyping: { en: '⌨️ Switch to Typing', hi: '⌨️ टाइप करें', mr: '⌨️ टाइप करा' },
    heardLabel: { en: '🎤 You said:', hi: '🎤 आपने कहा:', mr: '🎤 तुम्ही म्हणालात:' },
    isCorrect: { en: 'Is this correct?', hi: 'क्या यह सही है?', mr: 'हे बरोबर आहे का?' },
    yes: { en: '✅ Yes, Correct', hi: '✅ हाँ, सही है', mr: '✅ हो, बरोबर आहे' },
    no: { en: '🔁 Say Again', hi: '🔁 दोबारा बोलें', mr: '🔁 पुन्हा सांगा' },
    typeInstead: { en: 'Type instead', hi: 'टाइप करें', mr: 'टाइप करा' },
    listening: { en: 'Listening…', hi: 'सुन रहा हूँ…', mr: 'ऐकतोय…' },
    speaking: { en: 'Bot is speaking…', hi: 'बोल रहा हूँ…', mr: 'बोलतोय…' },
  };

  const l = (key) => LABELS[key]?.[lang] || LABELS[key]?.hi || '';

  const isOptional = !fieldConfig.required;
  const showFallback = phase === 'fallback' || retryCount >= 2;
  const isDateField = fieldConfig.type === 'date' && fieldConfig.showDatePickerFallback;
  const isNumberField = ['number', 'number+unit', 'phone'].includes(fieldConfig.type);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto px-2 select-none">

      {/* Progress pill */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {l('stepOf')}
        </span>
        {isOptional && (
          <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
            Optional
          </span>
        )}
      </div>

      {/* Question card */}
      <div className={`w-full rounded-3xl p-5 text-center transition-all ${
        isSpeaking ? 'bg-blue-50 border-2 border-blue-200' : 'bg-white border-2 border-slate-100 shadow-sm'
      }`}>
        <p className="text-sm font-semibold leading-relaxed text-slate-700">
          {isSpeaking && <span className="inline-block mr-1.5 text-blue-500 animate-pulse">🔊</span>}
          {questionText}
        </p>
        {isSpeaking && (
          <p className="text-xs text-blue-500 font-bold mt-1.5">{l('speaking')}</p>
        )}
      </div>

      {/* ── LISTENING PHASE ── */}
      {(phase === 'question' || phase === 'listening') && !showFallback && (
        <>
          <MicWaveform isListening={isListening} />

          {isListening ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <p className="text-sm font-bold text-emerald-600 animate-pulse">{l('listening')}</p>
              <button
                onClick={onStopListening}
                className="w-full max-w-[280px] py-4 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold rounded-2xl text-sm shadow-lg shadow-red-200 transition flex items-center justify-center gap-2"
              >
                <span className="w-3 h-3 rounded-full bg-white animate-ping inline-block" />
                {l('stopRecording')}
              </button>
            </div>
          ) : (
            <button
              onClick={onStartListening}
              disabled={isSpeaking}
              className={`w-full max-w-[280px] py-5 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-3 shadow-lg active:scale-95 ${
                isSpeaking
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-agri-600 hover:from-emerald-600 text-white shadow-emerald-200'
              }`}
            >
              <span className="text-2xl">🎤</span>
              <span>{l('tapToSpeak')}</span>
            </button>
          )}

          {/* Error display */}
          {error && ERR_MSG[error] && (
            <p className="text-xs text-red-600 font-semibold text-center bg-red-50 border border-red-100 rounded-xl px-3 py-2 w-full">
              {ERR_MSG[error][lang] || ERR_MSG[error].hi}
            </p>
          )}
        </>
      )}

      {/* ── CONFIRMATION PHASE ── */}
      {phase === 'confirm' && !showFallback && (
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Raw transcript (transparency) */}
          {transcript && (
            <div className="text-xs text-slate-500 text-center">
              <span className="font-bold text-slate-600">{l('heardLabel')}</span>{' '}
              <span className="italic">"{transcript}"</span>
            </div>
          )}

          {/* Confirmation chip — large, readable */}
          <div className="flex items-center justify-center gap-3 bg-emerald-50 border-2 border-emerald-300 rounded-3xl px-6 py-5 w-full shadow-sm">
            <span className="text-4xl">{fieldConfig.emoji || '✅'}</span>
            <span className="text-xl font-black text-emerald-900 font-heading leading-tight text-center">
              {confirmLabel}
            </span>
          </div>

          <p className="text-sm font-semibold text-slate-600 text-center">{l('isCorrect')}</p>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={onConfirmYes}
              className="py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-2xl text-sm shadow-md transition"
            >
              {l('yes')}
            </button>
            <button
              onClick={onConfirmNo}
              className="py-4 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold rounded-2xl text-sm transition"
            >
              {l('no')}
            </button>
          </div>
        </div>
      )}

      {/* ── FALLBACK PHASE (after 2 failed attempts) ── */}
      {showFallback && (
        <div className="w-full">
          <p className="text-xs text-amber-700 font-bold bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-center mb-1">
            {lang === 'mr' ? 'आवाज समजला नाही — कृपया खाली लिहा.' : lang === 'en' ? "Couldn't understand — please enter below." : 'आवाज़ नहीं समझ आया — नीचे भरें।'}
          </p>

          {isDateField ? (
            <DateFallback
              value={fallbackInput}
              onChange={setFallbackInput}
              onConfirm={(v) => { setFallbackInput(''); onFallbackValue(v); }}
              lang={lang}
            />
          ) : isNumberField ? (
            <NumericKeypad
              value={fallbackInput}
              onChange={setFallbackInput}
              onConfirm={(v) => { setFallbackInput(''); onFallbackValue(v); }}
              lang={lang}
            />
          ) : (
            <TextFallback
              value={fallbackInput}
              onChange={setFallbackInput}
              onConfirm={(v) => { setFallbackInput(''); onFallbackValue(v); }}
              lang={lang}
              fieldLabel={fieldConfig.key}
            />
          )}
        </div>
      )}

      {/* ── Action buttons row ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
        <button
          onClick={onRepeatQuestion}
          disabled={isSpeaking}
          className="text-xs text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-full transition disabled:opacity-40"
        >
          {l('repeat')}
        </button>

        {isOptional && phase !== 'confirm' && (
          <button
            onClick={onSkip}
            className="text-xs text-slate-500 font-bold bg-slate-50 hover:bg-slate-100 border border-slate-100 px-3 py-1.5 rounded-full transition"
          >
            {l('skip')}
          </button>
        )}

        <button
          onClick={onSwitchToTyping}
          className="text-xs text-slate-500 font-bold bg-slate-50 hover:bg-slate-100 border border-slate-100 px-3 py-1.5 rounded-full transition"
        >
          {l('switchTyping')}
        </button>
      </div>
    </div>
  );
}
