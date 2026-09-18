import { useState, useRef } from 'react';
import { Mic, Loader2, AlertCircle, Check } from 'lucide-react';
import { useFieldVoiceInput } from './useFieldVoiceInput';
import { parseNumeric, parseText, parseFuzzy, findBestSelectOption } from './parseFieldVoiceValue';

/**
 * VoiceInputMic.jsx
 * Universal Per-Field Voice Input component for Anaaj Platform.
 * Supports:
 * 1. <input> (text, search, number, etc.)
 * 2. <textarea>
 * 3. <select> dropdowns (automatic fuzzy matching & option selection)
 * 
 * Works seamlessly via explicit `onResult` callback OR automatic DOM dispatch to siblings.
 */
export default function VoiceInputMic({
  onResult,
  type = 'auto', // 'auto' | 'text' | 'number' | 'fuzzy' | 'dropdown'
  options = [],
  lang = 'hi', // Hindi default with English recognition fallback
  className = '',
  buttonClassName = '',
  title = 'बोलकर इनपुट दें (Click to speak / Voice Input)'
}) {
  const { isListening, error, startListening } = useFieldVoiceInput(lang);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successBadge, setSuccessBadge] = useState('');
  
  // Store original placeholder/state to restore it later
  const origPlaceholderRef = useRef('');
  const targetElementRef = useRef(null);

  const handleMicClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isListening) return;

    setShowError(false);
    setSuccessBadge('');

    // Locate target input, textarea, or select within parent container
    const parent = e.currentTarget.closest('.relative') || e.currentTarget.parentElement;
    const target = parent?.querySelector('input, select, textarea');
    
    if (target) {
      targetElementRef.current = target;
      if (target.tagName.toLowerCase() !== 'select') {
        origPlaceholderRef.current = target.placeholder || '';
        target.placeholder = '🎙️ Listening... बोलिए...';
      }
    }

    try {
      const transcript = await startListening();
      
      if (transcript && transcript.trim().length > 0) {
        const spoken = transcript.trim();
        const isSelect = target?.tagName.toLowerCase() === 'select' || type === 'dropdown';

        // ── 1. DROPDOWN (<select>) HANDLING ────────────────────────────────
        if (isSelect && target) {
          const selectOptions = options.length > 0
            ? options.map(opt => typeof opt === 'string' ? { value: opt, text: opt } : opt)
            : Array.from(target.options || []).map(opt => ({ value: opt.value, text: opt.text }));

          const matched = findBestSelectOption(spoken, selectOptions);

          if (matched) {
            // Apply native setter for React controlled selects
            const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLSelectElement.prototype,
              'value'
            )?.set;

            if (nativeSelectValueSetter) {
              nativeSelectValueSetter.call(target, matched.value);
            } else {
              target.value = matched.value;
            }

            // Dispatch synthetic events
            target.dispatchEvent(new Event('input', { bubbles: true }));
            target.dispatchEvent(new Event('change', { bubbles: true }));

            if (typeof onResult === 'function') {
              onResult(matched.value);
            }

            setSuccessBadge(matched.text.split('(')[0].trim().slice(0, 16));
            setTimeout(() => setSuccessBadge(''), 2500);
          } else {
            setErrorMessage(`"${spoken}" नहीं मिला`);
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
          }
        } 
        // ── 2. INPUT / TEXTAREA HANDLING ─────────────────────────────────
        else {
          let finalValue = '';
          const effectiveType = type === 'auto' 
            ? (target?.type === 'number' ? 'number' : 'text') 
            : type;

          switch (effectiveType) {
            case 'number':
              finalValue = parseNumeric(spoken);
              if (finalValue === null) {
                setErrorMessage('संख्या समझ नहीं आई (Say a number)');
                setShowError(true);
                setTimeout(() => setShowError(false), 3000);
              }
              break;
            case 'fuzzy':
              finalValue = parseFuzzy(spoken, options);
              break;
            case 'text':
            default:
              finalValue = parseText(spoken);
              break;
          }

          if (finalValue !== null && finalValue !== '') {
            // Update the DOM element directly so it works even without explicit onResult
            if (target) {
              const proto = target instanceof HTMLTextAreaElement 
                ? window.HTMLTextAreaElement.prototype 
                : window.HTMLInputElement.prototype;
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;

              if (nativeInputValueSetter) {
                nativeInputValueSetter.call(target, finalValue);
              } else {
                target.value = finalValue;
              }

              target.dispatchEvent(new Event('input', { bubbles: true }));
              target.dispatchEvent(new Event('change', { bubbles: true }));
            }

            // Call explicit callback if provided
            if (typeof onResult === 'function') {
              onResult(finalValue);
            }

            setSuccessBadge('✓ दर्ज हुआ');
            setTimeout(() => setSuccessBadge(''), 2200);
          }
        }

      } else if (error) {
        setErrorMessage('आवाज रिकॉर्ड नहीं हुई');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } finally {
      // Restore original placeholder
      if (targetElementRef.current && targetElementRef.current.tagName.toLowerCase() !== 'select') {
        targetElementRef.current.placeholder = origPlaceholderRef.current;
      }
      targetElementRef.current = null;
    }
  };

  return (
    <div className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 pointer-events-auto ${className}`}>
      {/* Success Badge */}
      {successBadge && (
        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-in fade-in flex items-center gap-1 whitespace-nowrap">
          <Check className="w-3 h-3" />
          <span>{successBadge}</span>
        </span>
      )}

      {/* Ephemeral inline error message */}
      {showError && (
        <div className="absolute right-full mr-2 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg whitespace-nowrap flex items-center gap-1 shadow-md animate-in fade-in slide-in-from-right-2 border border-slate-700">
          <AlertCircle className="w-3 h-3 text-amber-400" />
          <span>{errorMessage || 'कृपया दोबारा बोलें'}</span>
        </div>
      )}

      {/* Mic Button */}
      <button
        type="button"
        onClick={handleMicClick}
        title={title}
        aria-label="Voice Input"
        className={`p-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
          isListening 
            ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200 scale-110 shadow-md' 
            : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 active:scale-95'
        } ${buttonClassName}`}
      >
        {isListening ? (
          <div className="flex items-center gap-1 px-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            <span className="text-[10px] font-black uppercase tracking-wider text-white">बोलिए</span>
          </div>
        ) : (
          <Mic className="w-4 h-4 text-emerald-700 transition-transform group-hover:scale-110" />
        )}
      </button>
    </div>
  );
}
