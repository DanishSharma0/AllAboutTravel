import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Logo from './Logo';
import OfferBanner from './OfferBanner';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [petals, setPetals] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Generate High-Intensity Falling Sakura Petals
    const interval = setInterval(() => {
      const id = Math.random();
      const newPetal = {
        id,
        left: Math.random() * 100 + 'vw',
        top: '-20px',
        size: (Math.random() * 8 + 6) + 'px',
        duration: (Math.random() * 12 + 15) + 's'
      };
      // Keep more petals for higher intensity
      setPetals(prev => [...prev.slice(-40), newPetal]);
    }, 400); // Increased frequency

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Hostels', path: '/hostels' },
    { name: 'Places', path: '/places' },
    { name: 'Guides', path: '/tour-guides' },
    { name: 'Rentals', path: '/rentals' },
    { name: 'Shop', path: '/products' },
  ];

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      {/* High-Intensity Falling Sakura Petals */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {petals.map(petal => (
          <div
            key={petal.id}
            className="sakura-petal-intense"
            style={{
              left: petal.left,
              top: petal.top,
              width: petal.size,
              height: petal.size,
              animationDuration: petal.duration
            }}
          />
        ))}
      </div>

      <nav className="relative z-30 w-full px-6 lg:px-12 py-4 flex items-center justify-between">
        
        {/* Navigation Links */}
        <div className="hidden lg:flex flex-1 gap-6 xl:gap-8 items-center justify-start">
          {navLinks.map(link => (
            <Link 
              key={link.path}
              to={link.path} 
              className="relative py-2 text-slate-500 text-xs xl:text-sm tracking-[0.15em] uppercase font-semibold transition-all duration-300 group hover:text-accent-600 flex items-center"
            >
              <span className="transition-transform duration-300 ease-out group-hover:-translate-y-1 block">
                {link.name}
              </span>
              {/* Center-Out Underline */}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-500 rounded-full scale-x-0 origin-center group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </Link>
          ))}
        </div>

        {/* Logo */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <Link to="/">
            <Logo className="w-56 hover:opacity-90 transition-opacity" />
          </Link>
        </div>

        {/* User Actions / Nameplate */}
        <div className="hidden lg:flex flex-1 justify-end items-center gap-6">
          {user ? (
             <div className="flex items-center gap-6">
               {/* Nameplate Design: Option 1 (The Petal Path) - Orange Version */}
               <div className="group flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-accent-100 shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all duration-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-default">
                 <div className="relative">
                   <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-accent-400 to-amber-300 opacity-0 group-hover:opacity-100 petal-ring blur-[2px] transition-opacity duration-500" />
                   <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-accent-500 to-amber-400 flex items-center justify-center text-white font-bold text-xs shadow-inner z-10 border border-white/50">
                     {user.name.charAt(0).toUpperCase()}
                   </div>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-slate-700 font-bold text-xs tracking-wide leading-none">{user.name}</span>
                   <span className="text-[8px] text-accent-500 font-bold uppercase tracking-tighter mt-0.5">Zen Traveler</span>
                 </div>
               </div>

               <Link
                 to="/profile"
                 className="text-slate-400 hover:text-accent-500 transition-colors duration-300 transform hover:scale-110"
                 title="Profile"
               >
                 <User size={20} />
               </Link>
               {user.role === 'PROVIDER' && (
                 <Link
                   to="/provider-dashboard"
                   className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.15em] px-5 py-2 rounded-full hover:bg-accent-600 transition-all duration-300 shadow-md hover:shadow-accent-200 hover:-translate-y-0.5"
                 >
                   Dashboard
                 </Link>
               )}
                <Link
                  to="/my-bookings"
                  className="relative py-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-accent-600 transition-all duration-300 group flex items-center"
                >
                  <span className="transition-transform duration-300 ease-out group-hover:-translate-y-1 block">
                    Bookings
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-500 rounded-full scale-x-0 origin-center group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </Link>
               <button
                 onClick={handleLogout}
                 className="group flex items-center gap-2 border border-accent-100 text-accent-500 px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all duration-300 shadow-sm"
               >
                 Logout
               </button>
             </div>
          ) : (
            <>
               <Link
                to="/login"
                className="text-slate-500 text-sm font-semibold uppercase tracking-widest hover:text-slate-900 transition"
              >
                Sign In
              </Link>
               <Link
                to="/register"
                className="border border-slate-300 text-slate-800 px-7 py-2.5 rounded-none text-sm font-bold uppercase tracking-widest hover:bg-slate-50 hover:border-slate-400 transition"
              >
                Join Now
              </Link>
            </>
          )}
        </div>

        {}
        <div className="lg:hidden flex flex-1 justify-end">
          <button
            className="text-slate-600 hover:text-slate-900 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
             {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="px-6 py-4 flex flex-col gap-4">
            <Link
              to="/hostels"
              className="text-xl font-medium text-slate-700 hover:text-slate-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hostels
            </Link>
            <Link
              to="/places"
              className="text-xl font-medium text-slate-700 hover:text-slate-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Places
            </Link>
            <Link
              to="/tour-guides"
              className="text-xl font-medium text-slate-700 hover:text-slate-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tour Guides
            </Link>
            <Link
              to="/rentals"
              className="text-xl font-medium text-slate-700 hover:text-slate-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Rentals
            </Link>
            <Link
              to="/products"
              className="text-xl font-medium text-slate-700 hover:text-slate-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>

            <div className="h-px bg-slate-100 my-2"></div>

            {user ? (
              <>
                <div className="py-4 flex items-center gap-4 border-b border-slate-100 mb-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Welcome Back</span>
                    <span className="text-slate-800 font-bold text-lg">{user.name}</span>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="text-lg font-medium text-slate-700 hover:text-slate-900 mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                {user.role === 'PROVIDER' && (
                  <Link
                    to="/provider-dashboard"
                    className="flex items-center justify-center w-full font-bold uppercase tracking-widest text-sm bg-slate-900 text-white px-5 py-3 rounded-lg hover:bg-slate-800 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/my-bookings"
                  className="text-xl font-medium text-slate-700 hover:text-slate-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="mt-4 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-md font-bold text-lg hover:bg-red-100 transition"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-2 pb-4">
                <Link
                  to="/login"
                  className="w-full text-center px-5 py-3 text-slate-700 font-semibold border border-slate-200 uppercase tracking-widest hover:bg-slate-50 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center px-6 py-3 bg-slate-900 text-white font-bold uppercase tracking-widest hover:bg-slate-800 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Offer Banner positioned absolutely below header to avoid pushing content down */}
      <div className="absolute top-full left-0 w-full z-40">
        <OfferBanner variant="alpineGlow" />
      </div>
    </header>
  );
}
