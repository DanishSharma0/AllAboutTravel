import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onFinished }) => {
  const [phase, setPhase] = useState('drop'); // drop, spread, mountain, reveal

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('spread'), 1200),
      setTimeout(() => setPhase('mountain'), 2800),
      setTimeout(() => setPhase('reveal'), 4200),
      setTimeout(() => {
         setPhase('fadeout');
         setTimeout(onFinished, 1200);
      }, 7000)
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, [onFinished]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#0a0a0c] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 
      ${phase === 'fadeout' ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
      
      {/* ─── The Atmospheric Void ─── */}
      <div className="absolute inset-0 bg-radial-gradient(circle at center, #1a1a2e 0%, #0a0a0c 100%) opacity-50" />

      {/* ─── 1. The Ink Drop ─── */}
      {phase === 'drop' && (
        <div className="w-4 h-12 bg-orange-500 rounded-full animate-[drop-fall_1.2s_ease-in_forwards] blur-[1px]" />
      )}

      {/* ─── 2. The Ink Spread ─── */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 
        ${['spread', 'mountain'].includes(phase) ? 'opacity-100' : 'opacity-0'}`}>
        <svg viewBox="0 0 400 400" className="w-[80vw] h-[80vw] max-w-2xl ink-shape">
          <path 
            d="M200,200 m-100,0 a100,100 0 1,0 200,0 a100,100 0 1,0 -200,0" 
            fill="#f97316" 
            className={`transition-all duration-[3000ms] ease-out
              ${phase === 'spread' ? 'animate-ink-expand' : 'opacity-0 scale-[2]'}`} 
          />
        </svg>
      </div>

      {/* ─── 3. The Mountain Silhouette ─── */}
      <div className={`absolute bottom-0 w-full h-[60vh] transition-all duration-[3000ms] ease-out flex items-end
        ${['mountain', 'reveal'].includes(phase) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>
        <svg viewBox="0 0 1000 400" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          {/* Back Range */}
          <path d="M0,400 L0,300 L200,150 L400,280 L600,100 L800,250 L1000,200 L1000,400 Z" fill="#1a1a2e" opacity="0.4" />
          {/* Main Range */}
          <path d="M0,400 L0,350 L150,250 L350,330 L500,200 L700,310 L850,180 L1000,300 L1000,400 Z" fill="#0f172a" />
        </svg>
      </div>

      {/* ─── 4. The Rising Mist ─── */}
      <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-2000
        ${['mountain', 'reveal'].includes(phase) ? 'opacity-100' : 'opacity-0'}`}>
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute bottom-0 w-[150%] h-[40vh] bg-gradient-to-t from-white/10 to-transparent blur-[50px] animate-[mist-drift_8s_linear_infinite]"
            style={{ animationDelay: `${i * 1.5}s`, left: '-25%' }}
          />
        ))}
      </div>

      {/* ─── 5. The Ethereal Branding ─── */}
      <div className={`relative z-20 flex flex-col items-center transition-all duration-[2500ms]
        ${phase === 'reveal' ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-90 blur-xl'}`}>
        
        <div className="text-center">
          <h1 className="text-5xl md:text-9xl font-serif italic font-light tracking-[0.1em] text-white ethereal-glow">
            ALL ABOUT TRAVEL
          </h1>
          
          <div className="mt-12 flex flex-col items-center gap-6">
             <div className="h-px w-32 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
             <p className="text-[10px] md:text-xs tracking-[1em] text-orange-200/40 uppercase font-bold ml-[1em]">
               Curated Adventures
             </p>
             <div className="flex gap-4 items-center">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <div className="w-1 h-1 bg-white/20 rounded-full" />
             </div>
          </div>
        </div>
      </div>

      {/* Decorative Textures */}
      <div className="absolute inset-0 film-grain z-30 pointer-events-none opacity-[0.03]" />
      <div className="absolute inset-0 vignette-overlay z-40 pointer-events-none opacity-60" />
    </div>
  );
};

export default LoadingScreen;