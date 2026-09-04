import React, { useState } from 'react';
import { X, Smartphone, Send, MessageSquare, PhoneCall, CheckCircle2, Sparkles, Hash } from 'lucide-react';

export default function SmsFallbackModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('sms'); // 'sms' | 'ussd'
  const [smsQuery, setSmsQuery] = useState('PRICE ONION NASHIK');
  const [smsThread, setSmsThread] = useState([
    {
      sender: 'user',
      text: 'PRICE ONION NASHIK',
      time: '10:14 AM'
    },
    {
      sender: 'gateway',
      text: '🌾 [अnaaj-Govt] Lasalgaon Mandi Onion: Avg ₹2,580/Q (Min ₹2,100, Max ₹2,880). AI Trend: SELL NOW 🟢 (Expected -4% in 7d). Nearby Cold Storage: Dindori (4,500 MT avail). Reply OFFER to list lot.',
      time: '10:14 AM'
    }
  ]);

  const [ussdCode, setUssdCode] = useState('*99*123#');
  const [ussdScreen, setUssdScreen] = useState('menu'); // 'menu' | 'result'
  const [ussdResult, setUssdResult] = useState('');

  if (!isOpen) return null;

  const handleSendSms = (e) => {
    e.preventDefault();
    if (!smsQuery.trim()) return;

    const userText = smsQuery.toUpperCase();
    const newThread = [...smsThread, { sender: 'user', text: userText, time: 'Just now' }];
    setSmsThread(newThread);
    setSmsQuery('');

    setTimeout(() => {
      let reply = "";
      if (userText.includes('SOYBEAN') || userText.includes('LATUR')) {
        reply = "🌾 [अnaaj-Govt] Latur Mandi Soybean: Avg ₹5,180/Q. AI Trend: HOLD/WAIT 🟡 (Bullish futures, target ₹5,350+ in 15d). Reply LIST to register lot.";
      } else if (userText.includes('COTTON') || userText.includes('YAVATMAL')) {
        reply = "🌾 [अnaaj-Govt] Yavatmal Mandi Cotton: Avg ₹7,850/Q. AI Trend: SELL NOW 🟢. Reply TRANSPORT to book pickup.";
      } else {
        reply = `🌾 [अnaaj-Govt] ${userText}: Current APMC Rate is ₹2,740/Q. AI Recommendation: STABLE. Dial *99*123# or Call 1800-180-1551 for help.`;
      }
      setSmsThread([...newThread, { sender: 'gateway', text: reply, time: 'Just now' }]);
    }, 500);
  };

  const handleUssdDial = (opt) => {
    if (opt === '1') {
      setUssdResult("1. Lasalgaon: ₹2,580/Q (Onion)\n2. Latur: ₹5,180/Q (Soybean)\n3. Yavatmal: ₹7,850/Q (Cotton)\n4. Pune: ₹2,750/Q\n\nReply 0 to Go Back");
    } else if (opt === '2') {
      setUssdResult("AI Recommendation:\nOnion: SELL NOW 🟢\nSoybean: HOLD 🟡\nWheat: HOLD 🟡\n\nReply 0 to Go Back");
    } else if (opt === '3') {
      setUssdResult("Govt Schemes:\n1. PM-KISAN (₹6k/yr)\n2. Namo Shetkari (₹6k/yr)\n3. PMFBY (₹1 Token)\n\nReply 0 to Go Back");
    } else {
      setUssdResult("Invalid Option. Please dial *99*123# again.");
    }
    setUssdScreen('result');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-harvest-400" />
            <div>
              <h3 className="font-bold text-sm">Offline SMS / USSD Fallback Gateway</h3>
              <p className="text-[10px] text-slate-400">Low-Connectivity / Feature Phone Mode</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('sms')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition flex items-center justify-center gap-2 ${
              activeTab === 'sms' ? 'border-agri-600 text-agri-900 bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>SMS Mode (To: 56161)</span>
          </button>
          <button
            onClick={() => setActiveTab('ussd')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition flex items-center justify-center gap-2 ${
              activeTab === 'ussd' ? 'border-amber-600 text-amber-900 bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>USSD Dial (*99*123#)</span>
          </button>
        </div>

        {/* SMS Interface Simulation */}
        {activeTab === 'sms' ? (
          <div className="flex flex-col h-[400px]">
            <div className="bg-slate-100 p-2 text-center text-[11px] text-slate-600 border-b border-slate-200">
              Shortcode: <strong className="text-slate-900">56161</strong> (Govt. National SMS Portal)
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-slate-50">
              {smsThread.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-2xl text-xs ${
                      msg.sender === 'user'
                        ? 'bg-emerald-700 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-mono text-[11px]'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Quick SMS Query Chips */}
            <div className="p-2 bg-slate-100 border-t border-slate-200 flex gap-1.5 overflow-x-auto text-[10px]">
              <button
                onClick={() => setSmsQuery('PRICE ONION NASHIK')}
                className="px-2 py-1 bg-white rounded-lg border border-slate-200 font-bold"
              >
                PRICE ONION NASHIK
              </button>
              <button
                onClick={() => setSmsQuery('PRICE SOYBEAN LATUR')}
                className="px-2 py-1 bg-white rounded-lg border border-slate-200 font-bold"
              >
                PRICE SOYBEAN LATUR
              </button>
              <button
                onClick={() => setSmsQuery('PRICE COTTON YAVATMAL')}
                className="px-2 py-1 bg-white rounded-lg border border-slate-200 font-bold"
              >
                PRICE COTTON YAVATMAL
              </button>
            </div>

            {/* SMS Input Form */}
            <form onSubmit={handleSendSms} className="p-2.5 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={smsQuery}
                onChange={(e) => setSmsQuery(e.target.value)}
                placeholder="e.g. PRICE ONION NASHIK"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs uppercase focus:outline-none focus:ring-2 focus:ring-agri-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-agri-700 hover:bg-agri-800 text-white rounded-xl text-xs font-bold transition"
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          /* USSD Interface Simulation */
          <div className="p-6 bg-slate-950 text-emerald-400 font-mono text-xs flex flex-col justify-between h-[400px]">
            <div className="border border-emerald-500/30 rounded-2xl p-4 bg-slate-900/90 flex-1 flex flex-col justify-between">
              {ussdScreen === 'menu' ? (
                <div>
                  <p className="font-bold text-white mb-2">== अnaaj USSD (*99*123#) ==</p>
                  <p>1. Check Mandi Rates</p>
                  <p>2. AI Sell/Hold Recommendation</p>
                  <p>3. Govt Scheme Check</p>
                  <p>4. Book Storage/Logistics</p>
                  <p className="mt-3 text-slate-400">Enter Option (1-4):</p>
                </div>
              ) : (
                <div className="whitespace-pre-line text-emerald-300">
                  {ussdResult}
                </div>
              )}

              <div className="pt-4 border-t border-slate-800">
                {ussdScreen === 'menu' ? (
                  <div className="grid grid-cols-4 gap-2">
                    {['1', '2', '3', '4'].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleUssdDial(num)}
                        className="py-2 bg-emerald-950 text-emerald-300 rounded-lg font-bold hover:bg-emerald-900 border border-emerald-500/40 text-center"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => setUssdScreen('menu')}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-center"
                  >
                    Back to Main Menu
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 text-center mt-3">
              Runs via GSM standard USSD (Zero internet or smartphone required).
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
