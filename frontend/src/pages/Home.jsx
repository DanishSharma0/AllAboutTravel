import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowRight, Star, ChevronDown, Sparkles, Wind, Waves } from 'lucide-react';


function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}


function Counter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}


function AnimateIn({ children, className = '', delay = 0, direction = 'up' }) {
  const [ref, inView] = useInView();
  const base = 'transition-all duration-700 ease-out';
  const hidden = {
    up:    'opacity-0 translate-y-12',
    down:  'opacity-0 -translate-y-12',
    left:  'opacity-0 -translate-x-12',
    right: 'opacity-0 translate-x-12',
    scale: 'opacity-0 scale-90',
  }[direction];
  const style = delay ? { transitionDelay: `${delay}ms` } : {};
  return (
    <div
      ref={ref}
      style={style}
      className={`${base} ${inView ? 'opacity-100 translate-y-0 translate-x-0 scale-100' : hidden} ${className}`}
    >
      {children}
    </div>
  );
}


function StayCard({ img, title, desc, price, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <AnimateIn delay={delay} direction="up">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group bg-white rounded-2xl overflow-hidden shadow-md border border-sand-100 flex flex-col cursor-pointer"
        style={{ transform: hovered ? 'translateY(-6px)' : 'translateY(0)', transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease' , boxShadow: hovered ? '0 20px 50px -10px rgba(0,0,0,0.18)' : '' }}
      >
        <div className="overflow-hidden flex-shrink-0 relative">
          <img src={img} alt={title} className="w-full h-44 object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-accent-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow">
            From ${price}
          </span>
        </div>
        <div className="p-5 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold mb-1.5 text-slate-800">{title}</h3>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{desc}</p>
          </div>
          <button className="mt-4 w-full flex items-center justify-between bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider group-hover:from-accent-600 group-hover:to-accent-700 transition-all duration-300 shadow-md shadow-accent-200">
            <span>Book Now</span>
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </AnimateIn>
  );
}


function ExperienceCard({ img, title, delay }) {
  return (
    <AnimateIn delay={delay} direction="scale">
      <div className="text-center group cursor-pointer">
        <div className="rounded-2xl overflow-hidden mb-3 shadow-md aspect-video relative">
          <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center pb-4">
            <span className="text-white text-xs font-semibold tracking-widest uppercase border border-white/60 px-3 py-1 rounded-full backdrop-blur-sm">Explore</span>
          </div>
        </div>
        <h4 className="font-bold text-sm text-slate-800 transition-colors duration-300 group-hover:text-accent-500">{title}</h4>
      </div>
    </AnimateIn>
  );
}


function OfferCard({ img, badge, badgeColor, title, desc, delay }) {
  return (
    <AnimateIn delay={delay} direction="up">
      <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
        <img src={img} alt={title} className="w-full h-60 object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
          <span className={`${badgeColor} text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block self-start shadow-md`}>{badge}</span>
          <h3 className="text-base font-bold">{title}</h3>
          <p className="text-xs text-white/70 mt-1 mb-3">{desc}</p>
          <div className="flex items-center gap-1 text-accent-400 font-semibold text-xs opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span>Claim Offer</span><ArrowRight size={12} />
          </div>
        </div>
      </div>
    </AnimateIn>
  );
}


function TestimonialCard({ quote, name, location, avatar, delay }) {
  return (
    <AnimateIn delay={delay} direction="up">
      <div className="glass-card rounded-2xl p-6 shadow-sm border border-sand-100 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-400">
        <div className="flex items-center gap-0.5 text-amber-400 text-lg">
          {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
        </div>
        <p className="text-sm text-slate-600 italic leading-relaxed flex-grow">"{quote}"</p>
        <div className="flex items-center gap-3 pt-3 border-t border-sand-100">
          <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover ring-2 ring-accent-200" />
          <div>
            <p className="text-xs font-bold text-slate-800">{name}</p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin size={9} />{location}</p>
          </div>
        </div>
      </div>
    </AnimateIn>
  );
}


export default function Home() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 Adults, 1 Child');
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);
  const rafRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  
  useEffect(() => {
    const tick = () => {
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const sy = scroll.current;

      if (bgRef.current) {
        bgRef.current.style.transform =
          `translate3d(${mx * 0.3}px, ${my * 0.3 + sy * 0.2}px, 0) scale(1.1)`;
      }
      if (contentRef.current) {
        contentRef.current.style.transform =
          `translate3d(0, ${sy * -0.12}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    const onScroll = () => { scroll.current = window.scrollY; };
    const onMouseMove = (e) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouse.current = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 10,
      };
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const handleSearch = () => {
    if (destination.trim()) navigate(`/hostels?city=${encodeURIComponent(destination.trim())}`);
    else navigate('/hostels');
  };

  const stays = [
    { img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop', title: 'Alpine Chalets', desc: 'Unparalleled luxury by the snowy peaks with spectacular mountain views and your own private fireplace.', price: '333', delay: 0 },
    { img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop', title: 'Lakeside Cabins', desc: 'Step directly onto pristine mountain lakes from your cabin. Wake up to the sound of nature.', price: '557', delay: 120 },
    { img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop', title: 'Summit Reach Rooms', desc: 'Panoramic views of breathtaking sunrises from your private balcony overlooking the grand mountains.', price: '257', delay: 240 },
  ];

  const experiences = [
    { img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop', title: 'Peak Climbing', delay: 0 },
    { img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop', title: 'Alpine Trekking', delay: 100 },
    { img: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?q=80&w=1000&auto=format&fit=crop', title: 'High-Altitude Spa', delay: 200 },
    { img: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=1000&auto=format&fit=crop', title: 'Mountain Biking', delay: 300 },
  ];

  const offers = [
    { img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop', badge: '20% OFF', badgeColor: 'bg-accent-500', title: 'Early Peak Escape', desc: 'Book 30 days in advance and save big.', delay: 0 },
    { img: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000&auto=format&fit=crop', badge: 'EXCLUSIVE', badgeColor: 'bg-rose-500', title: 'Honeymoon Heights', desc: 'Private chalet, champagne & spa included.', delay: 120 },
    { img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop', badge: 'FAMILY', badgeColor: 'bg-sky-500', title: 'Family Summit Deal', desc: 'Kids stay free + daily breakfast for all.', delay: 240 },
  ];

  const testimonials = [
    { quote: 'Absolutely breathtaking. The mountain chalet was a dream come true. Service was impeccable from check-in to check-out. Will definitely return!', name: 'Sarah M.', location: 'New York, USA', avatar: 'https://i.pravatar.cc/80?img=47', delay: 0 },
    { quote: 'The summit suite offered the most stunning sunrise views. The spa treatments were world-class. Mountain Harmony truly lives up to its name.', name: 'James K.', location: 'London, UK', avatar: 'https://i.pravatar.cc/80?img=33', delay: 120 },
    { quote: 'We booked the family bundle and it was beyond expectations. Kids loved the trekking, we loved the fire-pit dining. The perfect family getaway!', name: 'Priya R.', location: 'Dubai, UAE', avatar: 'https://i.pravatar.cc/80?img=12', delay: 240 },
  ];

  return (
    <div className="font-sans text-slate-800 bg-white overflow-x-hidden">

      {}
      <section
        ref={heroRef}
        className="relative h-[72vh] min-h-[540px] w-full bg-slate-900 flex flex-col items-center pt-20 pb-32 overflow-hidden"
      >
        {}
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform"
          style={{ transform: 'translate3d(0,0,0) scale(1.1)' }}
        >
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Mountain Harmony Resort" className="w-full h-full object-cover opacity-75" />
        </div>

        {}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent h-32" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 via-transparent to-blue-950/30" />

        {}
        <div className="absolute top-16 left-[8%] w-48 h-48 rounded-full bg-accent-500/10 blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute bottom-24 right-[10%] w-64 h-64 rounded-full bg-brand-500/10 blur-3xl animate-float pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl animate-float-fast pointer-events-none" />

        {}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 pointer-events-none"
            style={{
              width: `${4 + (i % 4) * 3}px`,
              height: `${4 + (i % 4) * 3}px`,
              left: `${10 + i * 11}%`,
              top: `${20 + (i % 3) * 20}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}

        {}
        <div
          ref={contentRef}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col justify-start items-center text-center text-white will-change-transform"
        >
          {}
          <div className="animate-fade-in opacity-0 mb-4 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
            <Sparkles size={11} className="text-accent-400 animate-pulse" />
            #1 Mountain Retreat in the Himalayas
            <Sparkles size={11} className="text-accent-400 animate-pulse" />
          </div>

          <h1 className="animate-fade-in-up opacity-0 text-4xl md:text-6xl lg:text-7xl font-serif mb-4 leading-tight tracking-wide uppercase drop-shadow-xl">
            Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">Harmony</span>
            <br />at Mountain Peak
          </h1>

          <p className="animate-fade-in-up-1 opacity-0 text-base md:text-lg font-light max-w-xl mb-8 drop-shadow-sm text-white/85">
            Escape to tranquility. Discover unparalleled luxury by the snow-capped mountains.
          </p>

          <div className="animate-fade-in-up-2 opacity-0 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSearch}
              className="group relative overflow-hidden bg-accent-500 hover:bg-accent-600 text-white px-8 py-3.5 rounded-full font-bold transition-all duration-300 tracking-wider text-sm shadow-xl shadow-accent-500/40 hover:shadow-accent-500/60 hover:scale-105 animate-pulse-glow"
            >
              <span className="relative z-10 flex items-center gap-2">
                BOOK YOUR ADVENTURE <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-400 to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button className="group bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-medium transition-all duration-300 tracking-wider text-sm hover:scale-105">
              <span className="flex items-center gap-2">
                <Sparkles size={15} /> Explore Lodges
              </span>
            </button>
          </div>
        </div>

        {}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-60">
          <span className="text-white text-[9px] uppercase tracking-widest">Scroll</span>
          <ChevronDown size={16} className="text-white" />
        </div>

        {}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" style={{ height: '60px' }}>
          <svg viewBox="0 0 1440 60" className="w-full h-full fill-white animate-wave">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {}
      <section className="relative w-full bg-white z-20 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">

            {}
            <AnimateIn direction="left" className="w-full lg:w-[330px] xl:w-[350px] flex-shrink-0 relative z-30">
              <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] p-6 xl:p-7 border border-sand-100 -mt-12 lg:-mt-20">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-5 flex items-center gap-2">
                  <Calendar size={14} className="text-accent-500" />
                  Plan Your Stay
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 flex items-center gap-1"><MapPin size={9} />Destination</label>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Where to?"
                      className="w-full border border-sand-200 rounded-xl p-3 text-sm focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 text-slate-700 placeholder:text-slate-400 transition-all duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5">Check In</label>
                      <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border border-sand-200 rounded-xl p-3 text-xs focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 bg-transparent text-slate-700 transition-all duration-200" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5">Check Out</label>
                      <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border border-sand-200 rounded-xl p-3 text-xs focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 bg-transparent text-slate-700 transition-all duration-200" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 flex items-center gap-1"><Users size={9} />Guests</label>
                    <select value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full border border-sand-200 rounded-xl p-3 text-sm focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 bg-white text-slate-700 cursor-pointer transition-all duration-200">
                      <option>1 Adult</option>
                      <option>2 Adults, 1 Child</option>
                      <option>2 Adults, 2 Children</option>
                      <option>3 Adults</option>
                    </select>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-accent-200 hover:shadow-xl hover:shadow-accent-300 hover:-translate-y-0.5 text-sm tracking-wider uppercase flex items-center justify-center gap-2 group"
                  >
                    <span>Search &amp; Book</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  </button>
                </div>
              </div>
            </AnimateIn>

            {}
            <div className="flex-1 w-full pt-10 lg:pt-6 min-w-0">
              <AnimateIn direction="right">
                <div className="text-center mb-8">
                  <p className="text-[10px] font-bold text-accent-500 uppercase tracking-[0.25em] mb-2">Hand-picked for you</p>
                  <h2 className="text-2xl xl:text-3xl font-serif text-slate-800 tracking-wide uppercase">Our Exclusive Stays</h2>
                </div>
              </AnimateIn>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stays.map((s) => <StayCard key={s.title} {...s} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-14 px-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-white/5" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-white/5" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-white/5" />
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative">
          {[
            { target: 500, suffix: '+', label: 'Luxury Rooms' },
            { target: 50000, suffix: '+', label: 'Happy Guests' },
            { target: 15, suffix: '', label: 'Years of Excellence' },
            { target: 98, suffix: '%', label: 'Guest Satisfaction' },
          ].map(({ target, suffix, label }, i) => (
            <AnimateIn key={label} delay={i * 100} direction="up">
              <div className="flex flex-col items-center group">
                <span className="text-4xl font-bold bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent tabular-nums">
                  <Counter target={target} suffix={suffix} />
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-widest mt-2 group-hover:text-slate-200 transition-colors duration-300">{label}</span>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-sand-50 border-t border-sand-100/50">
        <div className="max-w-[1200px] mx-auto">
          <AnimateIn>
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold text-accent-500 uppercase tracking-[0.25em] mb-2">Curated for you</p>
              <h2 className="text-2xl font-serif text-slate-800 tracking-wide uppercase">Resort Experiences</h2>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {experiences.map((e) => <ExperienceCard key={e.title} {...e} />)}
          </div>
        </div>
      </section>

      {}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-sand-100">
        <div className="max-w-[1200px] mx-auto">
          <AnimateIn>
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold text-accent-500 uppercase tracking-[0.25em] mb-2">Limited Time</p>
              <h2 className="text-2xl font-serif text-slate-800 tracking-wide uppercase">Special Offers</h2>
              <p className="text-slate-500 text-sm mt-2">Exclusive deals crafted for unforgettable experiences</p>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((o) => <OfferCard key={o.title} {...o} />)}
          </div>
        </div>
      </section>

      {}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sand-50 to-white border-t border-sand-100">
        <div className="max-w-[1200px] mx-auto">
          <AnimateIn>
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold text-accent-500 uppercase tracking-[0.25em] mb-2">Guest Stories</p>
              <h2 className="text-2xl font-serif text-slate-800 tracking-wide uppercase">What Our Guests Say</h2>
              <p className="text-slate-500 text-sm mt-2">Real experiences from real people</p>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => <TestimonialCard key={t.name} {...t} />)}
          </div>
        </div>
      </section>

      {}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2000&auto=format&fit=crop" alt="Ocean View" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/75 to-slate-900/50" />
        </div>
        {}
        <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/10 animate-spin-slow pointer-events-none hidden lg:block" />
        <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-white/5 animate-spin-slow pointer-events-none hidden lg:block" style={{ animationDirection: 'reverse', animationDuration: '18s' }} />
        <div className="relative z-10 max-w-2xl text-white">
          <AnimateIn direction="left">
            <p className="text-[10px] font-bold text-accent-400 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
              <Sparkles size={10} /> Your Adventure Awaits
            </p>
            <h2 className="text-3xl md:text-5xl font-serif uppercase leading-tight mb-4">
              Where Dreams<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
                Meet the Mountains
              </span>
            </h2>
            <p className="text-white/70 text-sm mb-8 max-w-md leading-relaxed">
              Escape from the ordinary. Discover the ultimate retreat where luxury and nature merge into one breathtaking experience.
            </p>
            <button
              onClick={handleSearch}
              className="group inline-flex items-center gap-3 bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-bold tracking-widest text-sm uppercase transition-all duration-300 shadow-2xl shadow-accent-700/50 hover:shadow-accent-600/60 hover:scale-105 animate-pulse-glow"
            >
              Reserve Your Stay
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </AnimateIn>
        </div>
      </section>

    </div>
  );
}
