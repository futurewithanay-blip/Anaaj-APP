import React, { useState } from 'react';
import { MessageSquare, Check, X, ShieldCheck, DollarSign, Send, ArrowRight, Building2, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BuyerOffers({ farmerLots, t }) {
  const [activeNegotiation, setActiveNegotiation] = useState(null);
  const [counterPrice, setCounterPrice] = useState(2640);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'buyer', text: 'Namaste! We can procure your 85 Quintal Grade-A Onion lot at ₹2,620/Q with farmgate pickup within 48 hours.', time: '11:20 AM' },
    { sender: 'farmer', text: 'Export grade size is above 55mm with 11.5% moisture. Lowest acceptable price is ₹2,650/Q.', time: '11:25 AM' },
    { sender: 'buyer', text: 'We can revise to ₹2,635/Q with immediate digital advance payment release into your bank account.', time: '11:30 AM' },
  ]);
  const [newChatText, setNewChatText] = useState('');

  const handleAcceptOffer = (lotId, buyerName, price) => {
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    alert(`🎉 Order Confirmed!\nBuyer: ${buyerName}\nAgreed Price: ₹${price}/Qtl\nEscrow payment initiated. Logistics pickup scheduled!`);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    const userMsg = { sender: 'farmer', text: newChatText, time: 'Just now' };
    setChatMessages([...chatMessages, userMsg]);
    setNewChatText('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'buyer',
          text: `Agreed! We accept ₹${counterPrice}/Qtl. Locking the digital contract now.`,
          time: 'Just now'
        }
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
        <div>
          <h4 className="font-bold text-sm text-emerald-950 font-heading flex items-center gap-2">
            <span>📩 Live Digital Offers from Verified Buyers</span>
          </h4>
          <p className="text-xs text-emerald-800">
            Accept directly with Escrow Protection or Negotiate with counter-bids in real-time.
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-300">
          3 Active Bids
        </span>
      </div>

      {/* Offers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {farmerLots.map((lot) => (
          <div key={lot.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">{lot.id}</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {lot.status}
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900 font-heading">{lot.crop}</h4>
              <p className="text-xs text-slate-500">{lot.quantityQtl} Quintals • {lot.grade}</p>
            </div>

            {/* Top Bid Details */}
            {lot.topBuyerName ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{lot.topBuyerName}</p>
                      <p className="text-[10px] text-slate-400">Verified Institutional Buyer (98% Rating)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Offered Rate</span>
                    <span className="text-xl font-black text-emerald-700 font-heading">
                      ₹{lot.topOfferPrice}/Q
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/80">
                  <span>Your Reserve: <strong>₹{lot.expectedPrice}/Q</strong></span>
                  <span>Total Value: <strong>₹{(lot.topOfferPrice * lot.quantityQtl).toLocaleString()}</strong></span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleAcceptOffer(lot.id, lot.topBuyerName, lot.topOfferPrice)}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Offer</span>
                  </button>

                  <button
                    onClick={() => setActiveNegotiation(lot)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-600" />
                    <span>Counter / Chat</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 text-center text-xs text-slate-500">
                Listing live on Buyer Exchange. Matching with nearby flour mills and exporters...
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Counter-Offer / Negotiation Chat Modal */}
      {activeNegotiation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col h-[520px]">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm font-heading">
                  Price Negotiation with {activeNegotiation.topBuyerName}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Lot: {activeNegotiation.crop} ({activeNegotiation.quantityQtl} Quintals)
                </p>
              </div>
              <button onClick={() => setActiveNegotiation(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2.5 bg-slate-50">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'farmer' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'farmer'
                        ? 'bg-emerald-700 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 px-1 mt-0.5">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Quick Counter Offer Bar */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
              <span className="font-bold text-slate-700">Quick Counter (₹/Q):</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  className="w-24 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-emerald-800"
                />
                <button
                  type="button"
                  onClick={() => setNewChatText(`Our revised counter-offer is ₹${counterPrice}/Quintal. Farmgate pickup.`)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Propose ₹{counterPrice}
                </button>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={newChatText}
                onChange={(e) => setNewChatText(e.target.value)}
                placeholder="Type your reply to buyer..."
                className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-agri-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-agri-700 hover:bg-agri-800 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
