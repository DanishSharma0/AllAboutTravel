import React, { useEffect, useState } from 'react';
import { Compass, Plane } from 'lucide-react';

const InitialLoader = ({ onFinish }) => {
  const [phase, setPhase] = useState('loading');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Countdown logic (3 seconds)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Fade out after 3.5 seconds
    const fadeTimer = setTimeout(() => {
      setPhase('fading');
    }, 3500);

    // Completely unmount after 4.5 seconds
    const unmountTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 4500);

    return () => {
      clearInterval(timer);
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, [onFinish]);

  const isFading = phase === 'fading';

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-sand-50 transition-opacity duration-1000 ease-in-out pointer-events-none ${isFading ? 'opacity-0' : 'opacity-100'}`}>

      {/* 1. Giant Background Compass (Slow Rotation) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] overflow-hidden pointer-events-none z-0">
        <Compass className="w-[120vh] h-[120vh] animate-[spin_40s_linear_infinite]" strokeWidth={1} />
      </div>

      {/* 2. Sakura Petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="sakura-petal absolute top-[-10%] left-[10%] w-3 h-4 animate-[sakuraFall_4s_linear_infinite] opacity-60"></div>
        <div className="sakura-petal absolute top-[-10%] left-[30%] w-4 h-5 animate-[sakuraFall_5s_linear_infinite] delay-[1s] opacity-80"></div>
        <div className="sakura-petal absolute top-[-10%] left-[60%] w-2 h-3 animate-[sakuraFall_3.5s_linear_infinite] delay-[0.5s] opacity-50"></div>
        <div className="sakura-petal absolute top-[-10%] left-[80%] w-5 h-6 animate-[sakuraFall_6s_linear_infinite] delay-[2s] opacity-70"></div>
        <div className="sakura-petal absolute top-[-10%] left-[40%] w-3 h-4 animate-[sakuraFall_4.5s_linear_infinite] delay-[1.5s] opacity-90"></div>
        <div className="sakura-petal absolute top-[-10%] left-[70%] w-4 h-4 animate-[sakuraFall_5.5s_linear_infinite] delay-[0.8s] opacity-75"></div>
      </div>

      {/* 3. Center Content */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-lg px-4">

        {/* Flying Plane */}
        <div className="absolute -top-16 -right-8 animate-[flyPlane_4.5s_ease-in-out_forwards]">
          <Plane className="w-8 h-8 text-accent-300 drop-shadow-md" fill="currentColor" strokeWidth={1} />
        </div>

        {/* Project Name */}
        <h1 className="text-3xl md:text-5xl tracking-[0.3em] font-light text-slate-800 uppercase animate-[fadeBlurIn_2s_ease-out_forwards] text-center">
          All About Travel
        </h1>

        {/* Accent Line */}
        <div className="w-32 h-[1px] bg-accent-400 mt-6 mb-10 animate-[expandLine_1.5s_ease-out_forwards_0.5s] scale-x-0 origin-center"></div>

        {/* Reverse Countdown Clock */}
        <div className="flex flex-col items-center animate-[fadeIn_1s_ease-out_0.5s_forwards] opacity-0">
          <div className="text-xs tracking-[0.3em] text-slate-500 uppercase mb-3">
            Journey Begins In
          </div>
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white/70 backdrop-blur-sm border border-accent-200/50 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
            {/* Spinning ring around timer */}
            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-accent-400 animate-[spin_1s_linear_infinite] opacity-70"></div>
            <span className={`text-2xl font-semibold text-accent-500 transition-all duration-300 ${countdown === 0 ? 'scale-110' : ''}`}>
              {countdown > 0 ? `0${countdown}` : 'GO'}
            </span>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes sakuraFall {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); }
          50% { transform: translateY(50vh) translateX(30px) rotate(180deg); }
          100% { transform: translateY(110vh) translateX(-20px) rotate(360deg); }
        }

        .sakura-petal {
          background: linear-gradient(to bottom right, #ffd1dc, #ffb7c5);
          border-radius: 100% 0% 100% 100% / 100% 0% 100% 100%;
          box-shadow: 0 0 5px rgba(255, 183, 197, 0.4);
        }

        @keyframes fadeBlurIn {
          from { opacity: 0; filter: blur(12px); transform: scale(0.95); }
          to { opacity: 1; filter: blur(0px); transform: scale(1); }
        }

        @keyframes expandLine {
          to { transform: scaleX(1); }
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @keyframes flyPlane {
          0% { opacity: 0; transform: translate(-150px, 150px) rotate(-45deg) scale(0.5); }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { opacity: 0; transform: translate(250px, -250px) rotate(-45deg) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default InitialLoader;