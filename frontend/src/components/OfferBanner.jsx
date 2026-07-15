import React from 'react';
import { Sparkles, Tag, Percent, Plane, Hotel, Map } from 'lucide-react';

const OfferBanner = ({ variant = "dark" }) => {
  const offers = [
    { text: "Early Bird Special: Get 25% OFF on Summer Holiday Packages!", icon: <Plane className="w-4 h-4 mr-2" /> },
    { text: "Flash Sale: Flat ₹2,000 off on all Boutique Hostels. Code: HIMALAYA2K", icon: <Hotel className="w-4 h-4 mr-2" /> },
    { text: "Exclusive: 3 Nights @ Bali starting at just ₹24,999!", icon: <Sparkles className="w-4 h-4 mr-2" /> },
    { text: "Guided Tours: Book 1 Get 1 Half-Price on Heritage Walks.", icon: <Map className="w-4 h-4 mr-2" /> },
    { text: "Member Deal: Extra 10% discount for Mountain Zen members.", icon: <Percent className="w-4 h-4 mr-2" /> },
  ];

  const doubledOffers = [...offers, ...offers];

  const themes = {
    glass: {
      container: "bg-white/70 backdrop-blur-md border-b border-sand-200",
      text: "text-slate-600",
      iconColor: "text-slate-500",
      dot: "bg-slate-300",
      letterSpacing: "tracking-[0.15em]"
    },
    vibrant: {
      container: "bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 border-b border-orange-400/20",
      text: "text-white",
      iconColor: "text-white",
      dot: "bg-white/40",
      letterSpacing: "tracking-[0.2em]"
    },
    dark: {
      container: "bg-slate-950 border-b border-white/5",
      text: "text-white/90",
      iconColor: "text-sky-400",
      dot: "bg-gradient-to-tr from-sky-400 to-emerald-400",
      letterSpacing: "tracking-[0.2em]"
    },
    forest: {
        container: "bg-[#062c26] border-b border-emerald-900/30",
        text: "text-emerald-50/90",
        iconColor: "text-emerald-400",
        dot: "bg-emerald-500/50",
        letterSpacing: "tracking-[0.2em]"
    },
    zenSand: {
      container: "bg-sand-50 border-b border-sand-200",
      text: "text-slate-700",
      iconColor: "text-slate-400",
      dot: "bg-slate-300",
      letterSpacing: "tracking-[0.2em]"
    },
    morningMist: {
      container: "bg-white/60 backdrop-blur-xl border-b border-white/20",
      text: "text-slate-900 font-medium",
      iconColor: "text-sky-500",
      dot: "bg-gradient-to-r from-sky-400 to-orange-300",
      letterSpacing: "tracking-[0.15em]"
    },
    alpineGlow: {
      container: "bg-rose-100 border-b border-rose-200 shadow-sm",
      text: "text-rose-900",
      iconColor: "text-rose-600",
      dot: "bg-rose-300",
      letterSpacing: "tracking-[0.18em]"
    }
  };

  const renderText = (text) => {
    if (variant !== 'alpineGlow') return text;
    const parts = text.split(/(\d+%|OFF|Code:|Sale:|₹\d+,?\d*)/g);
    return parts.map((part, i) => (
      /(\d+%|OFF|Code:|Sale:|₹\d+,?\d*)/.test(part) ? 
        <span key={i} className="text-rose-700 font-black">{part}</span> : part
    ));
  };

  const style = themes[variant] || themes.dark;

  return (
    <div className={`w-full overflow-hidden group transition-all duration-500 ${style.container}`}>
      <div className="flex animate-marquee py-1">
        {doubledOffers.map((offer, index) => (
          <div
            key={index}
            className="flex items-center px-12 whitespace-nowrap"
          >
            <div className="flex items-center">
              <span className={style.iconColor}>{offer.icon}</span>
              <span className={`${style.text} text-[10px] font-bold uppercase ${style.letterSpacing}`}>
                {renderText(offer.text)}
              </span>
            </div>
            <div className={`ml-12 w-1 h-1 rounded-full ${style.dot}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferBanner;