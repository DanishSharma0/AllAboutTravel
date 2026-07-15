import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import HostelCard from '../components/HostelCard';
import { hostelsAPI } from '../services/api';
import {
  Search, MapPin, SlidersHorizontal, Star,
  BedDouble, Wifi, Car, Utensils, Dumbbell,
  RotateCcw, ChevronDown, ChevronUp, Flame, TrendingUp,
  DollarSign, Crown, Home, X, Filter, ListFilter,
  CheckCircle2, Info, ArrowRight
} from 'lucide-react';

const ROOM_TYPES = ['Dorm', 'Private Single', 'Private Double', 'Suite'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Best Rated' },
];
const FACILITIES_OPTIONS = [
  { key: 'WiFi', icon: Wifi, label: 'Free WiFi' },
  { key: 'Parking', icon: Car, label: 'Parking' },
  { key: 'Restaurant', icon: Utensils, label: 'Restaurant' },
  { key: 'Gym', icon: Dumbbell, label: 'Gym' },
];

const QUICK_FILTERS = [
  { label: 'All Stays', icon: Home, value: null },
  { label: 'Top Rated', icon: Star, value: { minRating: '4' } },
  { label: 'Trending', icon: TrendingUp, value: { sortBy: 'newest' } },
  { label: 'Budget', icon: DollarSign, value: { maxPrice: '1000' } },
  { label: 'Luxury', icon: Crown, value: { minPrice: '3000' } },
];

const DEFAULT_FILTERS = {
  city: '',
  minPrice: '0',
  maxPrice: '10000',
  minRating: '',
  roomType: '',
  facilities: [],
  sortBy: 'newest',
};

// Custom Dual Range Slider Constants
const MIN_LIMIT = 0;
const MAX_LIMIT = 10000;

export default function Hostels() {
  const [searchParams] = useSearchParams();
  const [hostels, setHostels] = useState([]);
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

  const fetchHostels = useCallback(async (activeFilters) => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilters.city) params.city = activeFilters.city;
      if (activeFilters.minPrice && activeFilters.minPrice !== '0') params.minPrice = activeFilters.minPrice;
      if (activeFilters.maxPrice && activeFilters.maxPrice !== '10000') params.maxPrice = activeFilters.maxPrice;
      if (activeFilters.minRating) params.minRating = activeFilters.minRating;
      if (activeFilters.roomType) params.roomType = activeFilters.roomType;
      if (activeFilters.facilities.length > 0) params.facilities = activeFilters.facilities.join(',');
      if (activeFilters.sortBy !== 'newest') params.sortBy = activeFilters.sortBy;

      const response = await hostelsAPI.getAll(params);
      setHostels(response.data || []);
    } catch (error) {
      console.error('Error fetching hostels:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHostels(filters);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const updated = { ...filters, city: searchInput };
    setFilters(updated);
    fetchHostels(updated);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFacilityToggle = (facility) => {
    setFilters(prev => {
      const exists = prev.facilities.includes(facility);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter(f => f !== facility)
          : [...prev.facilities, facility],
      };
    });
  };

  const handleSortChange = (e) => {
    const newFilters = { ...filters, sortBy: e.target.value };
    setFilters(newFilters);
    fetchHostels(newFilters);
  };

  const handleApplyFilters = () => fetchHostels(filters);

  const handleReset = () => {
    const reset = { ...DEFAULT_FILTERS };
    setFilters(reset);
    setSearchInput('');
    setActiveQuick(0);
    fetchHostels(reset);
  };

  const handleQuickFilter = (idx, qf) => {
    setActiveQuick(idx);
    if (qf.value === null) {
      handleReset();
      return;
    }
    const newFilters = { ...DEFAULT_FILTERS, ...qf.value };
    setFilters(newFilters);
    setSearchInput('');
    fetchHostels(newFilters);
  };

  // Slider Logic
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
    filters.minRating,
    filters.roomType,
    ...filters.facilities,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FBFAF9] flex flex-col font-sans selection:bg-accent-100 selection:text-accent-700">

      {/* ── Polished Minimalist Ribbon ── */}
      <div className={`sticky top-20 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 border-b border-sand-200/60 ${isScrolled ? 'py-2 shadow-sm' : 'py-4'}`}>
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between gap-10">
          <div className="flex items-center gap-6 shrink-0">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
              Curated <span className="text-accent-500">Hostels</span>
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
                placeholder="Search city..."
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

        {/* ── REDESIGNED FILTER PANEL ── */}
        <aside className="hidden lg:block shrink-0 w-80">
          <div className="sticky top-40 flex flex-col gap-5">
            
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
              
              {/* ── DUAL RANGE SLIDER PRICE MODULE ── */}
              <div className="bg-white rounded-[2rem] p-6 border border-sand-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                    <DollarSign size={12} className="text-accent-500" />
                    Price Range
                  </div>
                </div>

                {/* Slider Container */}
                <div className="px-1 pt-2">
                  <div className="relative h-1 w-full bg-sand-100 rounded-full">
                    {/* Active Track Highlight */}
                    <div 
                      className="absolute h-full bg-accent-500 rounded-full transition-all duration-150"
                      style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
                    />

                    {/* Dual Range Inputs (Stacked) */}
                    <input
                      type="range"
                      min={MIN_LIMIT}
                      max={MAX_LIMIT}
                      value={filters.minPrice}
                      onChange={handleMinSlider}
                      className="absolute w-full -top-1 bg-transparent appearance-none pointer-events-none range-slider-thumb z-30"
                    />
                    <input
                      type="range"
                      min={MIN_LIMIT}
                      max={MAX_LIMIT}
                      value={filters.maxPrice}
                      onChange={handleMaxSlider}
                      className="absolute w-full -top-1 bg-transparent appearance-none pointer-events-none range-slider-thumb z-30"
                    />
                  </div>
                </div>

                {/* Value Display Capsule */}
                <div className="flex items-center bg-sand-50/50 border border-sand-200/60 rounded-3xl p-1.5 transition-all">
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

                {/* Quick Chips */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Budget', min: '0', max: '1500' },
                    { label: 'Luxe', min: '3000', max: '10000' }
                  ].map((chip) => {
                    const isSelected = filters.minPrice === chip.min && filters.maxPrice === chip.max;
                    return (
                      <button
                        key={chip.label}
                        onClick={() => {
                          handleFilterChange('minPrice', chip.min);
                          handleFilterChange('maxPrice', chip.max);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
                          isSelected
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-sand-50/50 border-sand-100 text-slate-400 hover:border-accent-200'
                        }`}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating Module */}
              <div className="bg-white rounded-[2rem] p-6 border border-sand-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-5">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                  <Star size={12} className="text-accent-500" />
                  Minimum Rating
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((r) => {
                    const isActive = Number(filters.minRating) === r;
                    return (
                      <button
                        key={r}
                        onClick={() => handleFilterChange('minRating', isActive ? '' : r)}
                        className={`flex-1 py-3 rounded-2xl border text-[11px] font-black transition-all ${
                          isActive ? 'bg-accent-500 border-accent-500 text-white shadow-lg' : 'bg-sand-50/50 border-sand-100 text-slate-400'
                        }`}
                      >
                        {r}★
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Room Type */}
              <div className="bg-white rounded-[2rem] p-6 border border-sand-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-5">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                  <BedDouble size={12} className="text-accent-500" />
                  Experience
                </div>
                <div className="space-y-2">
                  {ROOM_TYPES.map((type) => {
                    const isActive = filters.roomType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => handleFilterChange('roomType', isActive ? '' : type)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all ${
                          isActive ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-sand-50/50 border-sand-100 text-slate-600'
                        }`}
                      >
                        <span className="text-[11px] font-black uppercase">{type}</span>
                        {isActive && <CheckCircle2 size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Facilities */}
              <div className="bg-white rounded-[2rem] p-6 border border-sand-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-5">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                  <Info size={12} className="text-accent-500" />
                  Key Amenities
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {FACILITIES_OPTIONS.map(({ key, icon: Icon, label }) => {
                    const active = filters.facilities.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => handleFacilityToggle(key)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                          active ? 'bg-accent-50 border-accent-300 text-accent-700' : 'bg-sand-50/30 border-sand-100 text-slate-400'
                        }`}
                      >
                        <Icon size={14} className={active ? 'text-accent-500' : 'text-slate-300'} />
                        <span className="text-[9px] font-black uppercase leading-none">{label.split(' ')[1] || label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Update Button */}
              <button
                onClick={handleApplyFilters}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-lg transition-all active:scale-[0.98] mt-4 mb-10"
              >
                Update Stay
              </button>

            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                {filters.city ? `Stays in ${filters.city}` : "Curated Stays"}
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-48 gap-6">
              <div className="w-12 h-12 border-4 border-accent-500/10 border-t-accent-500 rounded-full animate-spin" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Syncing Hostels...</p>
            </div>
          ) : hostels.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-sand-200 p-24 text-center shadow-sm">
              <div className="w-20 h-20 bg-sand-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Search size={32} className="text-slate-200" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-widest">No results found</h3>
              <button onClick={handleReset} className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-accent-500 transition-all">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {hostels.map((hostel, idx) => (
                <div
                  key={hostel._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${idx * 40}ms`, opacity: 0, animationFillMode: 'forwards' }}
                >
                  <HostelCard hostel={hostel} />
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
        .range-slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
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
