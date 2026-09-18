/**
 * useTextToSpeech.js
 * ------------------
 * React hook wrapping text-to-speech playback for Kisan Awaaz voice forms.
 *
 * Primary provider: Bhashini Dhruva TTS API (Government of India)
 *   - Requires VITE_BHASHINI_USER_ID and VITE_BHASHINI_API_KEY env vars
 *   - Returns base64-encoded audio; plays via Audio element
 *
 * Fallback (if Bhashini is unreachable or credentials not set):
 *   Web Speech Synthesis API (window.speechSynthesis)
 *   - Browser-native, no API key needed
 *   - Voice quality and language support varies by device/OS
 *
 * Language → voice/service mapping:
 *   'en' → English Indian TTS
 *   'hi' → Hindi TTS (indic-tts-coqui-hindi)
 *   'mr' → Marathi TTS (indic-tts-coqui-marathi)
 */
import { useState, useRef, useCallback, useEffect } from 'react';

const BHASHINI_USER_ID  = import.meta.env.VITE_BHASHINI_USER_ID;
const BHASHINI_API_KEY  = import.meta.env.VITE_BHASHINI_API_KEY;
const BHASHINI_ENDPOINT = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';

const BHASHINI_TTS_SERVICE = {
  hi: 'ai4bharat/indic-tts-coqui-hindi-gpu--t4',
  mr: 'ai4bharat/indic-tts-coqui-marathi-gpu--t4',
  en: 'ai4bharat/indic-tts-coqui-english-gpu--t4',
};

const WEB_SPEECH_LANG   = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };
const WEB_SPEECH_RATE   = 0.88; // Slightly slower for clarity in agri context

const hasBhashiniCreds = Boolean(BHASHINI_USER_ID && BHASHINI_API_KEY);

/* ─── Call Bhashini Dhruva TTS API ─── */
async function callBhashiniTTS(text, lang) {
  const response = await fetch(BHASHINI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      userID:     BHASHINI_USER_ID,
      ulcaApiKey: BHASHINI_API_KEY,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: 'tts',
          config: {
            language: { sourceLanguage: lang },
            serviceId: BHASHINI_TTS_SERVICE[lang] || BHASHINI_TTS_SERVICE.hi,
            gender: 'male',
          },
        },
      ],
      inputData: {
        input: [{ source: text }],
      },
    }),
  });

  if (!response.ok) throw new Error(`Bhashini TTS HTTP ${response.status}`);

  const data = await response.json();
  // Response: { pipelineResponse: [{ taskType: 'tts', audio: [{ audioContent: '<base64>' }] }] }
  const b64 = data?.pipelineResponse?.[0]?.audio?.[0]?.audioContent;
  if (!b64) throw new Error('Bhashini TTS: empty audio');
  return b64;
}

/* ─── Play base64 audio blob ─── */
function playBase64Audio(base64, mimeType = 'audio/wav') {
  return new Promise((resolve, reject) => {
    const byteString = atob(base64);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) bytes[i] = byteString.charCodeAt(i);
    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => { URL.revokeObjectURL(url); resolve(audio); };
    audio.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    audio.play().catch(reject);
    return audio;
  });
}

/**
 * useTextToSpeech
 * @param {string} lang - 'en' | 'hi' | 'mr'
 * @returns {Object} { speak(text), stop(), isSpeaking, error, provider }
 *
 * error codes:
 *   'tts_error'     – synthesis failed
 *   'not_supported' – neither Bhashini nor Web Speech available
 */
export function useTextToSpeech(lang = 'hi') {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error,      setError]      = useState(null);
  const [provider,   setProvider]   = useState('unknown'); // 'bhashini' | 'webSpeech'

  const audioRef        = useRef(null);
  const utteranceRef    = useRef(null);
  const isMountedRef    = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Cancel any ongoing speech on unmount
      window.speechSynthesis?.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  /* ── Web Speech fallback ── */
  const speakViaWebSpeech = useCallback((text) => {
    if (!window.speechSynthesis) {
      if (isMountedRef.current) {
        setError('not_supported');
        setIsSpeaking(false);
      }
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = WEB_SPEECH_LANG[lang] || 'hi-IN';
    utter.rate = WEB_SPEECH_RATE;
    utter.pitch = 1.0;
    utteranceRef.current = utter;

    utter.onend = () => {
      if (isMountedRef.current) {
        setIsSpeaking(false);
        setProvider('webSpeech');
      }
    };
    utter.onerror = () => {
      if (isMountedRef.current) {
        setIsSpeaking(false);
        setError('tts_error');
      }
    };

    // Chrome bug: long utterances silently stop — split at sentence boundaries
    // and chain them. For simplicity we use a single utterance here.
    if (isMountedRef.current) {
      setProvider('webSpeech');
      setIsSpeaking(true);
    }
    window.speechSynthesis.speak(utter);
  }, [lang]);

  /* ── Main speak function ── */
  const speak = useCallback(async (text) => {
    if (!text) return;
    setError(null);

    // Stop any currently playing audio
    window.speechSynthesis?.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (isMountedRef.current) setIsSpeaking(true);

    if (hasBhashiniCreds) {
      try {
        const base64 = await callBhashiniTTS(text, lang);
        if (!isMountedRef.current) return;

        const audio = new Audio(`data:audio/wav;base64,${base64}`);
        audioRef.current = audio;

        audio.onended = () => {
          if (isMountedRef.current) {
            setIsSpeaking(false);
            setProvider('bhashini');
          }
        };
        audio.onerror = () => {
          // Bhashini audio failed to play — fall back to Web Speech
          if (isMountedRef.current) {
            console.warn('[KisanAwaaz] Bhashini TTS audio error, falling back to Web Speech');
            speakViaWebSpeech(text);
          }
        };

        setProvider('bhashini');
        await audio.play();
      } catch (bhashiniErr) {
        // Bhashini API call failed — fall back to Web Speech
        console.warn('[KisanAwaaz] Bhashini TTS failed, falling back to Web Speech:', bhashiniErr.message);
        if (isMountedRef.current) speakViaWebSpeech(text);
      }
    } else {
      speakViaWebSpeech(text);
    }
  }, [lang, speakViaWebSpeech]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (isMountedRef.current) setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, error, provider };
}
