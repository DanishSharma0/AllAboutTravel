import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageTransitionLoader - Kinetic Typography & Horizon
 * ──────────────────────────────────────────────────
 * Apple-style minimalist expanding canvas wipe. The mountain draws itself 
 * while a glowing sun rises perfectly into the peak. The text dynamically
 * rises from a hidden horizon line for a premium kinetic effect.
 */
export default function PageTransitionLoader() {
  const location = useLocation();
  const [lastPath, setLastPath] = useState(location.pathname);
  const [isActive, setIsActive] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const timers = useRef([]);

  // Intercept route changes DURING render (before browser paint)
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    setIsActive(true);
    setIsFadingOut(false);
  }

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    if (!isActive) return;
    
    clearTimers();

    // Keep the canvas visible for 1.4s to savor the typography and sunrise
    const t1 = setTimeout(() => {
      setIsFadingOut(true); 
      
      const t2 = setTimeout(() => {
        setIsActive(false);
      }, 700); // 700ms fade out
      timers.current.push(t2);
    }, 1400); 
    
    timers.current.push(t1);

    return clearTimers;
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden transition-opacity duration-[700ms] ease-out"
      style={{ opacity: isFadingOut ? 0 : 1 }}
    >
      {/* 
        This base layer instantly mounts and blurs the underlying page's loading skeletons 
        so they aren't jarring before the expanding circle completely covers them. 
      */}
      <div className="absolute inset-0 bg-[#fdfbf7]/95 backdrop-blur-2xl" />
      
      {/* ── Expanding Pure White Canvas ── */}
      <div className="absolute inset-0 bg-white canvas-expand flex items-center justify-center flex-col">
        
        {/* ── Minimalist Mountain & Sunrise ── */}
        <svg viewBox="0 0 400 200" className="w-[80vw] max-w-[500px] mt-10 overflow-visible">
          <defs>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" /> {/* yellow-200 */}
              <stop offset="60%" stopColor="#f59e0b" /> {/* amber-500 */}
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0.8" /> {/* accent-600 */}
            </radialGradient>
            
            {/* Shimmering gradient for mountain line */}
            <linearGradient id="mountainLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            
            <clipPath id="horizonClip">
               <rect x="0" y="0" width="400" height="200" />
            </clipPath>
          </defs>

          {/* The rising sun, clipped so it looks like it's coming from behind the mountain base */}
          <g clipPath="url(#horizonClip)">
            <circle 
              className="rise-sun"
              cx="250" 
              cy="70" 
              r="20" 
              fill="url(#sunGlow)" 
            />
          </g>

          {/* The Mountain Silhouette */}
          <path 
            className="draw-mountain relative z-10" 
            d="M 50,150 L 150,50 L 220,120 L 280,60 L 350,150" 
            fill="none" 
            stroke="url(#mountainLine)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>

        {/* ── Kinetic Typography Horizon ── */}
        <div className="relative mt-8 overflow-hidden py-2">
          {/* 
             The text is initially translated completely below the visible boundary
             of this overflow-hidden container, making the bottom edge act as a horizon.
          */}
          <h2 className="text-slate-800 font-serif tracking-[0.4em] uppercase text-xs sm:text-sm font-black rise-text text-center">
            All about travel
          </h2>
        </div>
        
        {/* Subtitle rising slightly later */}
        <div className="relative mt-2 overflow-hidden py-1">
          <p className="text-accent-500 font-sans tracking-[0.8em] uppercase text-[9px] font-bold rise-text-delayed">
            A New Dawn
          </p>
        </div>

      </div>

      <style>{`
        /* The wipe effect expanding from bottom center */
        .canvas-expand {
          clip-path: circle(0% at 50% 100%);
          animation: expand-circle 0.65s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }

        @keyframes expand-circle {
          0% { clip-path: circle(0% at 50% 100%); }
          100% { clip-path: circle(150% at 50% 100%); }
        }

        /* The minimalist mountain drawing */
        .draw-mountain {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: draw-line 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards 0.2s; 
        }

        @keyframes draw-line {
          to { stroke-dashoffset: 0; }
        }

        /* The Sun rising into the peak */
        .rise-sun {
          transform: translateY(80px) scale(0.8);
          opacity: 0;
          animation: sun-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.4s;
        }

        @keyframes sun-up {
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        /* Kinetic Typography Rising from Horizon */
        .rise-text {
          transform: translateY(150%);
          opacity: 0;
          animation: text-horizon-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.5s;
        }
        
        .rise-text-delayed {
          transform: translateY(150%);
          opacity: 0;
          animation: text-horizon-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.65s;
        }

        @keyframes text-horizon-rise {
          0% { transform: translateY(150%); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateY(0%); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
