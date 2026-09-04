import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Bot, Sparkles, X, CornerDownLeft } from 'lucide-react';

export default function KisanVoiceBot({ isOpen, onClose, t, lang }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'नमस्ते किसान भाई! मैं आपका डिजिटल कृषि साथी (अnaaj AI) हूँ। आप मुझसे किसी भी मंडी का भाव, फसल बेचने का सही समय, या सरकारी योजनाओं के बारे में बोलकर या लिखकर पूछ सकते हैं।',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Suggested Voice Prompts
  const suggestedQueries = [
    { label: "🧅 लासलगांव में प्याज का भाव?", query: "लासलगांव में प्याज का ताजा भाव क्या है और क्या मुझे अभी बेचना चाहिए?" },
    { label: "🌱 क्या अभी सोयाबीन बेचना सही है?", query: "सोयाबीन का भाव आगे बढ़ेगा या अभी बेच दें?" },
    { label: "🏛️ PM किसान सम्मान निधि पात्रता", query: "पीएम किसान और नमो शेतकरी योजना के लिए क्या पात्रता है?" },
    { label: "❄️ नजदीकी कोल्ड स्टोरेज", query: "नाशिक में प्याज रखने के लिए कोल्ड स्टोरेज कहाँ उपलब्ध है?" },
  ];

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    // Add user message
    const newMsg = { sender: 'user', text: query, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Generate intelligent AI response based on query keywords
    setTimeout(() => {
      let botResponse = "";
      const lower = query.toLowerCase();

      if (lower.includes('कांदा') || lower.includes('प्याज') || lower.includes('onion') || lower.includes('लासलगांव')) {
        botResponse = "🧅 **लासलगांव मंडी प्याज भाव**: आज का औसत भाव **₹2,580/क्विंटल** चल रहा है (उच्चतम ₹2,880)। AI मॉडल का सुझाव है: **अभी बेचें (SELL NOW 🟢)** क्योंकि दक्षिण भारत से भारी मांग है लेकिन 7 दिनों बाद खरीफ की नई आवक आने से दाम घट सकते हैं।";
      } else if (lower.includes('सोयाबीन') || lower.includes('soybean') || lower.includes('लातूर')) {
        botResponse = "🌱 **सोयाबीन भाव पूर्वानुमान**: लातूर मंडी में भाव ₹5,180/क्विंटल है। AI सलाह है: **कुछ दिन रुकें (HOLD 🟡)**। NCDEX वायदा बाजार के अनुसार 15 दिनों में भाव ₹5,350+ तक जा सकता है।";
      } else if (lower.includes('योजना') || lower.includes('pm kisan') || lower.includes('शेतकरी') || lower.includes('scheme')) {
        botResponse = "🏛️ **सरकारी योजना सहायता**: महाराष्ट्र के किसानों को PM-KISAN (₹6,000) + नमो शेतकरी महासन्मान निधि (₹6,000) मिलाकर कुल **₹12,000 प्रति वर्ष** मिलते हैं। इसके अलावा PM फसल बीमा योजना में केवल ₹1 टोकन प्रीमियम में पूरा बीमा उपलब्ध है!";
      } else if (lower.includes('स्टोरेज') || lower.includes('गोदाम') || lower.includes('storage')) {
        botResponse = "❄️ **कोल्ड स्टोरेज उपलब्धता**: दिंडोरी (नाशिक) स्थित महाएग्रो कोल्ड हब में वर्तमान में **4,500 मीट्रिक टन** जगह खाली है। किराया मात्र ₹5/क्विंटल/दिन है। आप ऐप के 'लॉजिस्टिक्स व स्टोरेज' सेक्शन से सीधे बुक कर सकते हैं।";
      } else {
        botResponse = `🌾 आपकी क्वेरी "${query}" के लिए: वर्तमान में मंडी कीमतें स्थिर हैं। अधिक सटीक जानकारी के लिए आप नजदीकी APMC मंडी का चयन कर सकते हैं अथवा हमारे टोल-फ्री किसान हेल्पलाइन 1800-180-1551 पर कॉल कर सकते हैं।`;
      }

      setMessages((prev) => [...prev, {
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      // Speak response using SpeechSynthesis if available
      speakText(botResponse.replace(/[#*`_]/g, ''));
    }, 600);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice recognition is simulating speech query in this browser.");
      handleSendMessage("लासलगांव में प्याज का ताजा भाव क्या है?");
      return;
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;

    if (!isListening) {
      recognition.start();
      setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg h-[90vh] sm:h-[620px] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-agri-800 to-emerald-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center ring-2 ring-white/20">
              <Bot className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold font-heading text-base leading-tight">Kisan Saathi AI Voice Assistant</h3>
                <span className="bg-emerald-400/30 text-emerald-100 text-[10px] font-bold px-2 py-0.2 rounded-full">Bilingual</span>
              </div>
              <p className="text-[11px] text-emerald-100">Ask in Hindi, Marathi, or English (बोलकर या लिखकर पूछें)</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-agri-700 text-white rounded-tr-none shadow-sm'
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 px-1 mt-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Voice Chips */}
        <div className="p-2.5 bg-slate-100 border-t border-slate-200 overflow-x-auto flex gap-2">
          {suggestedQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.query)}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 text-[11px] font-semibold whitespace-nowrap transition shadow-2xs"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input Bar with Mic & Send */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-2xl transition shadow-sm ${
              isListening
                ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
            }`}
            title="Press to speak in Hindi/Marathi/English"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="फसल भाव या योजना के बारे में पूछें..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-agri-500"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            className="p-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white shadow transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
