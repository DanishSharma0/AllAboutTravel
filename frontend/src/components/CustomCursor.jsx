import React, { useEffect, useRef, useState, useCallback } from 'react';

const PETAL_COUNT_MAX = 40;

const createPetal = (x, y) => ({
  id: Math.random(),
  x,
  y,
  size: Math.random() * 8 + 5,
  opacity: 1,
  rotation: Math.random() * 360,
  drift: (Math.random() - 0.5) * 60,
  fall: Math.random() * 40 + 30,
  duration: Math.random() * 800 + 600,
  createdAt: Date.now(),
});

const CustomCursor = () => {
  const dotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [petals, setPetals] = useState([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastSpawn = useRef(0);

  const onMouseMove = useCallback((e) => {
    const { clientX: x, clientY: y } = e;
    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    lastPos.current = { x, y };
    const now = Date.now();
    if (speed > 8 && now - lastSpawn.current > 60) {
      lastSpawn.current = now;
      const newPetal = createPetal(x, y);
      setPetals(prev => [...prev.slice(-PETAL_COUNT_MAX), newPetal]);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setPetals(prev => prev.filter(p => now - p.createdAt < p.duration + 200));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onEnter = () => setIsHovering(true);
    const onLeave = () => setIsHovering(false);
    const attach = () => {
      document.querySelectorAll('a, button, input, select, textarea, label, [role="button"]')
        .forEach(el => {
          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
        });
    };
    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
    };
  }, [onMouseMove]);

  return (
    <>
      <style>{`*, *::before, *::after { cursor: none !important; }`}</style>

      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] will-change-transform"
        style={{ transform: 'translate(-999px, -999px)' }}
      >
        <div className={`rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out ${isHovering ? 'w-5 h-5 bg-accent-500/80 shadow-[0_0_12px_4px_rgba(249,115,22,0.5)]' : 'w-3 h-3 bg-accent-500 shadow-[0_0_8px_2px_rgba(249,115,22,0.4)]'}`} />
        {isHovering && (
          <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-accent-400 animate-ping opacity-60" />
        )}
      </div>

      {petals.map(petal => <SakuraPetal key={petal.id} petal={petal} />)}
    </>
  );
};

const SakuraPetal = ({ petal }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.transform = `translate(calc(${petal.x}px + ${petal.drift}px), calc(${petal.y}px + ${petal.fall}px)) rotate(${petal.rotation + 180}deg)`;
        ref.current.style.opacity = '0';
      }
    });
  }, [petal]);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 pointer-events-none z-[99998] will-change-transform"
      style={{
        transform: `translate(${petal.x}px, ${petal.y}px) rotate(${petal.rotation}deg)`,
        opacity: 0.9,
        transition: `transform ${petal.duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${petal.duration}ms ease-out`,
        width: petal.size,
        height: petal.size,
        marginLeft: -petal.size / 2,
        marginTop: -petal.size / 2,
      }}
    >
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M10 2 C14 2, 18 6, 18 10 C18 14, 14 18, 10 18 C6 18, 2 14, 2 10 C2 6, 6 2, 10 2Z" fill="url(#petalGrad)" fillOpacity="0.85" />
        <defs>
          <radialGradient id="petalGrad" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#ffd1dc" />
            <stop offset="100%" stopColor="#ffb7c5" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

export default CustomCursor;