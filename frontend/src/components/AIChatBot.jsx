import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, Send, X } from 'lucide-react';

export default function HologramBot() {
  const [currentMessage, setCurrentMessage] = useState("Greetings. I am your Mountain Peak Guide. How may I assist you?");
  const [isTyping, setIsTyping] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [input, setInput] = useState("");
  const location = useLocation();


  useEffect(() => {
    const sendContextualGreeting = () => {
      let msg = "";
      if (location.pathname === '/hostels') {
        msg = "Analyzing peaks... Looking for an exclusive chalet or summit lodge? Let me know your dates.";
      } else if (location.pathname === '/places') {
        msg = "Scanning destinations... We are near breathtaking hidden trails. Ask me for recommendations.";
      } else if (location.pathname === '/tour-guides') {
        msg = "Locating experts... Our local guides offer unforgettable mountain tours. Need suggestions?";
      } else if (location.pathname === '/login' || location.pathname === '/register') {
        msg = "Security protocols active. Creating an account unlocks exclusive rewards.";
      }

      if (msg && currentMessage !== msg) {
        setIsTyping(true);
        setCurrentMessage("");
        setIsInputOpen(false);
        setTimeout(() => {
          setCurrentMessage(msg);
          setIsTyping(false);
        }, 1500);
      }
    };
    
    const timeout = setTimeout(sendContextualGreeting, 1000);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput("");
    setIsInputOpen(false);
    setCurrentMessage("");
    setIsTyping(true);


    setTimeout(() => {
      const lowerQuery = userMsg.toLowerCase();
      let reply = "I am processing your request. Currently, I am a simulated holographic assistant. Please use the navigation above to explore.";
      
      if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('how much')) {
        reply = "Data retrieved: Stays start at $250/night for Oceanview Rooms and reach $557/night for Beachfront Suites.";
      } else if (lowerQuery.includes('book') || lowerQuery.includes('reserve')) {
        reply = "Booking systems are online. Please navigate to the main page to use the reservation widget.";
      } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
        reply = "Greetings. How can I optimize your luxury experience today?";
      } else if (lowerQuery.includes('spa') || lowerQuery.includes('massage')) {
        reply = "Wellness center detected. We offer world-class deep-tissue massages. Booking in advance is highly recommended.";
      } else if (lowerQuery.includes('food') || lowerQuery.includes('dining') || lowerQuery.includes('eat')) {
        reply = "Culinary options: 'Dining by the Sea' experiences are available daily, featuring freshly caught seafood.";
      }

      setCurrentMessage(reply);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-6 font-sans">
      
      {}
      {(currentMessage || isTyping || isInputOpen) && (
        <div className="relative flex flex-col items-end animate-fade-in origin-bottom-right">
          
          {}
          <div className="relative max-w-[320px] bg-cyan-900/60 backdrop-blur-md border hover:border-cyan-300 transition duration-300 border-cyan-400/50 p-5 rounded-2xl rounded-br-none shadow-[0_0_20px_rgba(0,255,255,0.2)]">
            <div className="absolute top-0 right-0 -trate-y-1/2 translate-x-1/2">
               {}
               <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(0,255,255,1)]"></div>
            </div>
            <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2">
               <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(0,255,255,1)]"></div>
            </div>

            {}
            {currentMessage && !isTyping && (
              <button 
                onClick={() => { setCurrentMessage(""); setIsInputOpen(false); }} 
                className="absolute top-2 right-2 text-cyan-300 hover:text-white transition opacity-50 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="text-cyan-50 text-sm leading-relaxed tracking-wide font-light">
              {isTyping ? (
                <div className="flex items-center gap-2 text-cyan-300">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span className="animate-pulse">Synthesizing data...</span>
                </div>
              ) : (
                <p>{currentMessage}</p>
              )}
            </div>
          </div>

          {}
          {isInputOpen && (
            <form onSubmit={handleSend} className="mt-4 relative w-full flex animate-slide-up shadow-[0_0_15px_rgba(0,255,255,0.1)]">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Transmit your query..." 
                className="w-full bg-cyan-950/80 backdrop-blur-md text-cyan-50 placeholder-cyan-400/50 text-sm border border-cyan-500/50 rounded-full py-3 pl-5 pr-12 focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition"
                autoFocus
                disabled={isTyping}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-1 top-1 w-10 h-10 flex items-center justify-center bg-cyan-500/20 hover:bg-cyan-400/40 text-cyan-100 rounded-full transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          {}
          <div className="absolute -bottom-6 right-8 w-px h-6 bg-gradient-to-b from-cyan-400/50 to-transparent"></div>
        </div>
      )}

      {}
      <div className="relative group cursor-pointer" onClick={() => !isTyping && setIsInputOpen(!isInputOpen)}>
        {}
        <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-40 group-hover:opacity-70 animate-pulse transition duration-500"></div>
        <div className="absolute inset-2 bg-blue-500 rounded-full blur-xl opacity-50 animate-bounce cursor-pointer"></div>
        
        {}
        <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-300 via-blue-500 to-indigo-900 rounded-full flex flex-col items-center justify-center border border-cyan-200/50 shadow-[0_0_20px_rgba(0,255,255,0.4)] z-10 overflow-hidden group-hover:scale-105 transition-transform duration-300">
          
          {}
          <div className="absolute inset-1 border border-cyan-100/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
          <div className="absolute inset-2 border-t border-cyan-50/40 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
          
          <Sparkles className="w-7 h-7 text-white drop-shadow-[0_0_8px_white] animate-[pulse_2s_ease-in-out_infinite]" />
        </div>
      </div>

    </div>
  );
}
