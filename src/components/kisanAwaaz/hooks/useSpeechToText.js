/**
 * useSpeechToText.js
 * ------------------
 * React hook wrapping speech recognition for Kisan Awaaz voice forms.
 *
 * Primary provider: Bhashini Dhruva ASR API (Government of India)
 *   - Requires VITE_BHASHINI_USER_ID and VITE_BHASHINI_API_KEY env vars
 *   - Uses MediaRecorder to capture audio, sends base64-encoded audio to Dhruva
 *
 * Fallback (if Bhashini is unreachable or credentials not set):
 *   Web Speech API (window.SpeechRecognition / window.webkitSpeechRecognition)
 *   - Browser-native, no API key needed
 *   - Works in Chrome/Edge on Android; limited on iOS Safari
 *
 * Language code mapping:
 *   'en' → 'en-IN' (Web Speech) / 'en' (Bhashini)
 *   'hi' → 'hi-IN' (Web Speech) / 'hi' (Bhashini)
 *   'mr' → 'mr-IN' (Web Speech) / 'mr' (Bhashini)
 */
import { useState, useRef, useCallback, useEffect } from 'react';

/* ─── Bhashini Dhruva ASR config ─── */
const BHASHINI_USER_ID  = import.meta.env.VITE_BHASHINI_USER_ID;
const BHASHINI_API_KEY  = import.meta.env.VITE_BHASHINI_API_KEY;
const BHASHINI_ENDPOINT = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';

const BHASHINI_ASR_SERVICE = {
  en: 'ai4bharat/whisper-medium-en--gpu--t4',
  hi: 'ai4bharat/conformer-hi-gpu--t4',
  mr: 'ai4bharat/conformer-mr-gpu--t4',
};

const WEB_SPEECH_LANG = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };

/* ─── Convert audio Blob to base64 string ─── */
const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // FileReader result: "data:<type>;base64,<data>"
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

/* ─── Call Bhashini Dhruva ASR API ─── */
async function callBhashiniASR(audioBlob, lang) {
  const base64Audio = await blobToBase64(audioBlob);
  const response = await fetch(BHASHINI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      userID:    BHASHINI_USER_ID,
      ulcaApiKey: BHASHINI_API_KEY,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: 'asr',
          config: {
            language: { sourceLanguage: lang },
            serviceId: BHASHINI_ASR_SERVICE[lang] || BHASHINI_ASR_SERVICE.hi,
            audioFormat: 'flac',
            samplingRate: 16000,
          },
        },
      ],
      inputData: {
        audio: [{ audioContent: base64Audio }],
      },
    }),
  });

  if (!response.ok) throw new Error(`Bhashini ASR HTTP ${response.status}`);

  const data = await response.json();
  // Response structure: { pipelineResponse: [{ taskType: 'asr', output: [{ source: '...' }] }] }
  const output = data?.pipelineResponse?.[0]?.output?.[0]?.source;
  if (!output) throw new Error('Bhashini ASR: empty output');
  return output.trim();
}

/**
 * useSpeechToText
 * @param {string} lang - 'en' | 'hi' | 'mr'
 * @returns {Object} { transcript, isListening, error, provider, startListening, stopListening, reset }
 *
 * error codes:
 *   'mic_denied'        – microphone permission denied
 *   'mic_error'         – other mic/MediaRecorder error
 *   'speech_not_supported' – browser has no SpeechRecognition API (and Bhashini failed)
 *   'no_speech'         – recognized nothing
 *   'api_error'         – Bhashini API call failed (fell back to Web Speech)
 *   'network_error'     – Bhashini unreachable (fell back to Web Speech)
 */
export function useSpeechToText(lang = 'hi') {
  const [transcript,  setTranscript]  = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error,       setError]       = useState(null);
  const [provider,    setProvider]    = useState('unknown'); // 'bhashini' | 'webSpeech'

  const mediaRecorderRef = useRef(null);
  const streamRef        = useRef(null);
  const chunksRef        = useRef([]);
  const wsrRef           = useRef(null);
  const isMountedRef     = useRef(true);
  const autoStopTimerRef = useRef(null);

  const hasBhashiniCreds = Boolean(BHASHINI_USER_ID && BHASHINI_API_KEY);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Cleanup on unmount
      if (autoStopTimerRef.current) clearTimeout(autoStopTimerRef.current);
      mediaRecorderRef.current?.state !== 'inactive' && mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach(t => t.stop());
      wsrRef.current?.abort();
    };
  }, []);

  /* ── Web Speech fallback ── */
  const startWebSpeech = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      if (isMountedRef.current) {
        setError('speech_not_supported');
        setIsListening(false);
      }
      return;
    }

    const recognition = new SR();
    recognition.lang = WEB_SPEECH_LANG[lang] || 'hi-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    wsrRef.current = recognition;

    recognition.onresult = (event) => {
      const result = event.results[0]?.[0]?.transcript || '';
      if (isMountedRef.current) {
        setTranscript(result);
        setIsListening(false);
        setProvider('webSpeech');
      }
    };

    recognition.onspeechend = () => recognition.stop();

    recognition.onerror = (event) => {
      if (isMountedRef.current) {
        setError(event.error === 'not-allowed' ? 'mic_denied' : 'no_speech');
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (isMountedRef.current) setIsListening(false);
    };

    try {
      recognition.start();
      if (isMountedRef.current) {
        setIsListening(true);
        setProvider('webSpeech');
      }
    } catch (e) {
      if (isMountedRef.current) {
        setError('mic_error');
        setIsListening(false);
      }
    }
  }, [lang]);

  /* ── Bhashini path with MediaRecorder ── */
  const startBhashiniRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true },
      });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Release mic track
        stream.getTracks().forEach(t => t.stop());

        if (!isMountedRef.current) return;

        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });

        if (blob.size < 1000) {
          // Too small — likely silence
          setError('no_speech');
          setIsListening(false);
          return;
        }

        try {
          const text = await callBhashiniASR(blob, lang);
          if (isMountedRef.current) {
            setTranscript(text);
            setProvider('bhashini');
            setIsListening(false);
          }
        } catch (bhashiniErr) {
          // Bhashini failed at runtime — fall back to Web Speech
          console.warn('[KisanAwaaz] Bhashini ASR failed, falling back to Web Speech:', bhashiniErr.message);
          if (isMountedRef.current) {
            setError('api_error'); // Temporary — startWebSpeech will clear it
            setIsListening(false);
            startWebSpeech();
          }
        }
      };

      recorder.start(100); // collect audio in 100ms chunks
      if (isMountedRef.current) setIsListening(true);

      // Auto-stop after 8 seconds to prevent indefinite listening
      autoStopTimerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 8000);

    } catch (err) {
      if (isMountedRef.current) {
        setError(err.name === 'NotAllowedError' ? 'mic_denied' : 'mic_error');
        setIsListening(false);
      }
    }
  }, [lang, startWebSpeech]);

  /* ── Public API ── */
  const startListening = useCallback(() => {
    setTranscript('');
    setError(null);
    if (autoStopTimerRef.current) clearTimeout(autoStopTimerRef.current);

    if (hasBhashiniCreds) {
      startBhashiniRecording();
    } else {
      startWebSpeech();
    }
  }, [hasBhashiniCreds, startBhashiniRecording, startWebSpeech]);

  const stopListening = useCallback(() => {
    if (autoStopTimerRef.current) clearTimeout(autoStopTimerRef.current);

    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop(); // triggers onstop → Bhashini call
    }
    if (wsrRef.current) {
      wsrRef.current.stop();
    }
    if (isMountedRef.current) setIsListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setError(null);
    setIsListening(false);
  }, []);

  return { transcript, isListening, error, provider, startListening, stopListening, reset };
}
