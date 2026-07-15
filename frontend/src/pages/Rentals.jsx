import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import RentalCard from '../components/RentalCard';
import { rentalsAPI } from '../services/api';
import {
  Search, MapPin, SlidersHorizontal, Bike,
  Car, RotateCcw, TrendingUp, DollarSign,
  Crown, Home, ListFilter, CheckCircle2,
  Info, Zap, ShieldCheck
} from 'lucide-react';

const VEHICLE_TYPES = ['Bike', 'Scooty', 'Car', 'EV'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

const QUICK_FILTERS = [
  { label: 'All Fleet', icon: Home, value: null },
  { label: 'Cars', icon: Crown, value: { vehicleType: 'Car' } },
  { label: 'Scooty', icon: TrendingUp, value: { vehicleType: 'Scooty' } },
  { label: 'EVs', icon: Zap, value: { vehicleType: 'EV' } },
  { label: 'Bikes', icon: Bike, value: { vehicleType: 'Bike' } },
];

const DEFAULT_FILTERS = {
  city: '',
  minPrice: '0',
  maxPrice: '10000',
  vehicleType: '',
  sortBy: 'newest',
};

const MIN_LIMIT = 0;
const MAX_LIMIT = 10000;

export default function Rentals() {
  const [searchParams] = useSearchParams();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    city: searchParams.get('city') || '',
  });
  const [searchInput, setSearchInput] = useState(searchParams.get('city') || '');
  const [activeQuick, setActiveQuick] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchRentals = useCallback(async (activeFilters) => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilters.city) params.city = activeFilters.city;
      if (activeFilters.minPrice && activeFilters.minPrice !== '0') params.minPrice = activeFilters.minPrice;
      if (activeFilters.maxPrice && activeFilters.maxPrice !== '10000') params.maxPrice = activeFilters.maxPrice;
      if (activeFilters.vehicleType) params.vehicleType = activeFilters.vehicleType;
      if (activeFilters.sortBy !== 'newest') params.sortBy = activeFilters.sortBy;

      const response = await rentalsAPI.getAll(params);
      setRentals(response.data || []);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reactive Fetching
  useEffect(() => {
    fetchRentals(filters);
    
    // Sync Quick Filter active state based on current filters.vehicleType
    const foundIdx = QUICK_FILTERS.findIndex(qf => qf.value?.vehicleType === filters.vehicleType);
    setActiveQuick(foundIdx === -1 ? 0 : foundIdx);
  }, [filters, fetchRentals]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, city: searchInput }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
  };

  const handleQuickFilter = (idx, qf) => {
    if (qf.value === null) {
      handleReset();
      return;
    }
    setFilters(prev => ({ ...prev, ...qf.value }));
  };

  const handleMinSlider = (e) => {
    const value = Math.min(Number(e.target.value), Number(filters.maxPrice) - 500);
    handleFilterChange('minPrice', value.toString());
  };

  const handleMaxSlider = (e) => {
    const value = Math.max(Number(e.target.value), Number(filters.minPrice) + 500);
    handleFilterChange('maxPrice', value.toString());
  };

  const minPos = ((Number(filters.minPrice) - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100;
  const maxPos = ((Number(filters.maxPrice) - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100;

  const activeFilterCount = [
    filters.minPrice !== '0',
    filters.maxPrice !== '10000',
    filters.vehicleType,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FBFAF9] flex flex-col font-sans selection:bg-accent-100 selection:text-accent-700">

      {/* ── Polished Minimalist Ribbon ── */}
      <div className={`sticky top-20 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 border-b border-sand-200/60 ${isScrolled ? 'py-2 shadow-sm' : 'py-4'}`}>
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between gap-10">
          <div className="flex items-center gap-6 shrink-0">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
              Explore <span className="text-accent-500">Rentals</span>
            </h1>
          </div>
          <div className="flex-1 max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin size={15} className="text-accent-500" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search city for vehicles..."
                className="w-full bg-sand-50/50 border border-sand-200/80 rounded-full pl-11 pr-28 py-2.5 text-[13px] font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-accent-500/5 focus:border-accent-500/40 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-slate-900 hover:bg-accent-500 text-white px-6 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300"
              >
                Find
              </button>
            </form>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <div className="hidden xl:flex items-center gap-2">
              {QUICK_FILTERS.map((qf, idx) => {
                const isActive = activeQuick === idx;
                const Icon = qf.icon;
                return (
                  <button
                    key={qf.label}
                    onClick={() => handleQuickFilter(idx, qf)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black transition-all border ${
                      isActive
                        ? 'bg-accent-500 text-white border-accent-500 shadow-lg shadow-accent-500/20'
                        : 'bg-white text-slate-500 border-sand-200 hover:border-accent-200'
                    }`}
                  >
                    <Icon size={12} />
                    {qf.label}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <ListFilter size={14} className="text-slate-400" />
              <select
                value={filters.sortBy}
                onChange={handleSortChange}
                className="bg-transparent text-[11px] font-black text-slate-800 focus:outline-none cursor-pointer uppercase tracking-wider"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex flex-1 max-w-[1600px] mx-auto w-full px-6 py-10 gap-12">

        {/* ── MODULAR FILTER PANEL ── */}
        <aside className="hidden lg:block shrink-0 w-80">
          <div className="sticky top-32 flex flex-col gap-5">
            
            {/* Header Module */}
            <div className="bg-white rounded-3xl p-5 border border-sand-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                  <SlidersHorizontal size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Filters</h2>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleReset}
                  className="w-8 h-8 rounded-full bg-sand-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center"
                >
                  <RotateCcw size={14} />
                </button>
              )}
            </div>

            {/* Scrollable Container */}
            <div className="hostel-sidebar-scroll overflow-y-auto max-h-[calc(100vh-14rem)] flex flex-col gap-4 pr-2">
              
              {/* Dual Range Price Slider */}
              <div className="bg-white rounded-[2rem] p-6 border border-sand-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                    <DollarSign size={12} className="text-accent-500" />
                    Price / Day
                  </div>
                </div>

                <div className="px-1 pt-2">
                  <div className="relative h-1 w-full bg-sand-100 rounded-full">
                    <div 
                      className="absolute h-full bg-accent-500 rounded-full transition-all duration-150"
                      style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
                    />
                    <input
                      type="range"
                      min={MIN_LIMIT}
                      max={MAX_LIMIT}
                      step="50"
                      value={filters.minPrice}
                      onChange={handleMinSlider}
                      className="absolute w-full -top-1 bg-transparent appearance-none pointer-events-none range-slider-thumb z-30"
                    />
                    <input
                      type="range"
                      min={MIN_LIMIT}
                      max={MAX_LIMIT}
                      step="50"
                      value={filters.maxPrice}
                      onChange={handleMaxSlider}
                      className="absolute w-full -top-1 bg-transparent appearance-none pointer-events-none range-slider-thumb z-30"
                    />
                  </div>
                </div>

                <div className="flex items-center bg-sand-50/50 border border-sand-200/60 rounded-3xl p-1.5">
                  <div className="flex-1 px-3 py-1">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Min</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-300">₹</span>
                      <span className="text-sm font-black text-slate-900">{Number(filters.minPrice).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-sand-200/60 mx-1" />
                  <div className="flex-1 px-3 py-1">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Max</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-300">₹</span>
                      <span className="text-sm font-black text-slate-900">{Number(filters.maxPrice).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Type Module */}
              <div className="bg-white rounded-[2rem] p-6 border border-sand-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-5">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                  <Bike size={12} className="text-accent-500" />
                  Vehicle Category
                </div>
                <div className="space-y-2">
                  {VEHICLE_TYPES.map((vType) => {
                    const isActive = filters.vehicleType === vType;
                    return (
                      <button
                        key={vType}
                        onClick={() => handleFilterChange('vehicleType', isActive ? '' : vType)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all ${
                          isActive ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-sand-50/50 border-sand-100 text-slate-600'
                        }`}
                      >
                        <span className="text-[11px] font-black uppercase tracking-wider">{vType}</span>
                        {isActive && <CheckCircle2 size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-6 border border-sand-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                  <ShieldCheck size={12} className="text-accent-500" />
                  Why Rent With Us?
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={10} className="text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-[9px] font-bold text-slate-500 uppercase leading-tight">Verified & Insured vehicles for peace of mind.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={10} className="text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-[9px] font-bold text-slate-500 uppercase leading-tight">24/7 Roadside assistance across the region.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                {filters.city ? `Available in ${filters.city}` : "Curated Fleet"}
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-48 gap-6">
              <div className="w-12 h-12 border-4 border-accent-500/10 border-t-accent-500 rounded-full animate-spin" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Scanning Fleet...</p>
            </div>
          ) : rentals.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-sand-200 p-24 text-center shadow-sm">
              <div className="w-20 h-20 bg-sand-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Search size={32} className="text-slate-200" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-widest">No vehicles found</h3>
              <p className="text-xs text-slate-400 font-bold mb-8 uppercase tracking-widest">Try adjusting your filters or search city</p>
              <button onClick={handleReset} className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-accent-500 transition-all">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {rentals.map((rental, idx) => (
                <div
                  key={rental._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${idx * 40}ms`, opacity: 0, animationFillMode: 'forwards' }}
                >
                  <RentalCard rental={rental} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <style>{`
        .range-slider-thumb::-webkit-slider-thumb {
          appearance: none;
          pointer-events: auto;
          width: 18px;
          height: 18px;
          background: #ffffff;
          border: 4px solid #f97316;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(249, 115, 22, 0.2);
          transition: transform 0.2s;
        }
        .range-slider-thumb::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .range-slider-thumb::-moz-range-thumb {
          appearance: none;
          pointer-events: auto;
          width: 18px;
          height: 18px;
          background: #ffffff;
          border: 4px solid #f97316;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(249, 115, 22, 0.2);
        }
      `}</style>
    </div>
  );
}
