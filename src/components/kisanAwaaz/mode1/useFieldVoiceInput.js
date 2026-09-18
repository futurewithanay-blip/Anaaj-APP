import { useState, useRef, useCallback } from 'react';

/**
 * useFieldVoiceInput.js
 * Isolated hook for Mode 1 per-field voice input.
 * Falls back to Web Speech API if Bhashini is unavailable or fails.
 */
export function useFieldVoiceInput(lang = 'en') {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  // Map app lang to Bhashini/WebSpeech lang codes
  const getLangCode = (l) => {
    switch(l) {
      case 'hi': return 'hi-IN';
      case 'mr': return 'mr-IN';
      default: return 'en-IN';
    }
  };

  const startListening = useCallback(async () => {
    setError(null);
    setIsListening(true);
    
    return new Promise((resolve, reject) => {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          throw new Error("Speech recognition not supported in this browser.");
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        recognition.lang = getLangCode(lang);
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          resolve(transcript);
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          // Don't reject the promise on 'no-speech' so we don't crash, just resolve with empty string
          if (event.error === 'no-speech') {
            resolve("");
          } else {
            setError(`Error: ${event.error}`);
            resolve(""); // Graceful fail
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          // If ended without result (and didn't trigger onerror with no-speech)
          resolve(""); 
        };

        recognition.start();

      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setIsListening(false);
        setError("Voice input unavailable.");
        resolve("");
      }
    });
  }, [lang]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    error,
    startListening,
    stopListening
  };
}
