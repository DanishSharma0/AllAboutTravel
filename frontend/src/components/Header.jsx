import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Logo from './Logo';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <nav className="w-full px-6 lg:px-12 py-4 flex items-center justify-between">
        
        {/* Desktop Navigation - Left Split */}
        <div className="hidden lg:flex flex-1 gap-6 xl:gap-8 items-center justify-start">
          <Link to="/hostels" className="text-slate-500 text-xs xl:text-sm tracking-widest uppercase hover:text-slate-900 transition font-semibold">
            Hostels
          </Link>
          <Link to="/places" className="text-slate-500 text-xs xl:text-sm tracking-widest uppercase hover:text-slate-900 transition font-semibold">
            Places
          </Link>
          <Link to="/tour-guides" className="text-slate-500 text-xs xl:text-sm tracking-widest uppercase hover:text-slate-900 transition font-semibold">
            Guides
          </Link>
          <Link to="/rentals" className="text-slate-500 text-xs xl:text-sm tracking-widest uppercase hover:text-slate-900 transition font-semibold">
            Rentals
          </Link>
          <Link to="/products" className="text-slate-500 text-xs xl:text-sm tracking-widest uppercase hover:text-slate-900 transition font-semibold">
            Shop
          </Link>
          <Link to="/map" className="text-slate-500 text-xs xl:text-sm tracking-widest uppercase hover:text-slate-900 transition font-semibold">
            Map
          </Link>
        </div>

        {/* Center Logo */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <Link to="/">
            <Logo className="w-56 hover:opacity-90 transition-opacity" />
          </Link>
        </div>

        {/* Desktop Actions - Right Split */}
        <div className="hidden lg:flex flex-1 justify-end items-center gap-6">
          {user ? (
             <div className="flex items-center gap-6">
               <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100 cursor-default">
                 <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                   {user.name.charAt(0).toUpperCase()}
                 </div>
                 <span className="text-slate-700 font-semibold text-sm tracking-wide">{user.name}</span>
               </div>
               <Link
                 to="/profile"
                 className="text-slate-500 hover:text-slate-900 transition"
                 title="Profile"
               >
                 <User size={20} />
               </Link>
               {user.role === 'PROVIDER' && (
                 <Link
                   to="/provider-dashboard"
                   className="bg-slate-900 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-md hover:bg-slate-700 transition"
                 >
                   Dashboard
                 </Link>
               )}
                <Link
                  to="/my-bookings"
                  className="text-slate-500 text-sm font-semibold uppercase tracking-wide hover:text-slate-900 transition"
                >
                  Bookings
                </Link>
               <button
                 onClick={handleLogout}
                 className="border border-red-200 text-red-600 px-5 py-2 rounded-none text-sm uppercase tracking-wider hover:bg-red-50 transition"
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

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex flex-1 justify-end">
          <button
            className="text-slate-600 hover:text-slate-900 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
             {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
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
            <Link
              to="/map"
              className="text-xl font-medium text-slate-700 hover:text-slate-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Map
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
    </header>
  );
}
