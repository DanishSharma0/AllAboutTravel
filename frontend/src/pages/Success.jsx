import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle, Home, ArrowRight, Car, Map,
  MapPin, Star, Clock, Sparkles, ChevronRight,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { rentalsAPI, tourGuidesAPI } from '../services/api';

/* ─── Inline Suggestion Cards (styled, no dependency on existing card components) ─── */

function SuggestionRentalCard({ rental }) {
  return (
    <Link
      to={`/rentals/${rental._id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative overflow-hidden h-44">
        {rental.image ? (
          <img
            src={rental.image}
            alt={rental.modelName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
            <Car size={40} className="text-orange-300" />
          </div>
        )}
        <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
          Rental
        </span>
        {rental.pricePerDay && (
          <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-orange-600 text-[11px] font-black px-2.5 py-1 rounded-full shadow">
            ₹{rental.pricePerDay}/day
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            {rental.vehicleType || 'Vehicle'}
          </p>
          <h4 className="font-black text-slate-900 text-base leading-tight group-hover:text-orange-600 transition-colors">
            {rental.modelName}
          </h4>
          <div className="flex items-center gap-1 text-slate-400 text-xs mt-1.5">
            <MapPin size={11} />
            <span>{rental.cityId?.name || 'Nearby'}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1 text-orange-600 font-bold text-xs">
          <span>Book Vehicle</span>
          <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

function SuggestionGuideCard({ guide }) {
  return (
    <Link
      to={`/tour-guides/${guide._id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative overflow-hidden h-44">
        {guide.image ? (
          <img
            src={guide.image}
            alt={guide.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
            <span className="text-5xl font-black text-emerald-300">
              {guide.name?.charAt(0) || 'G'}
            </span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
          Tour Guide
        </span>
        {guide.chargesPerDay && (
          <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-emerald-600 text-[11px] font-black px-2.5 py-1 rounded-full shadow">
            ₹{guide.chargesPerDay}/day
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.round(guide.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 fill-slate-200'}
              />
            ))}
            {guide.rating > 0 && (
              <span className="text-[10px] text-slate-400 ml-0.5">({guide.rating})</span>
            )}
          </div>
          <h4 className="font-black text-slate-900 text-base leading-tight group-hover:text-emerald-600 transition-colors">
            {guide.name}
          </h4>
          <div className="flex items-center gap-1 text-slate-400 text-xs mt-1.5">
            <MapPin size={11} />
            <span>{guide.cityId?.name || 'Nearby'}</span>
            {guide.experienceYears > 0 && (
              <>
                <span className="mx-1 text-slate-200">•</span>
                <Clock size={11} />
                <span>{guide.experienceYears}y exp</span>
              </>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1 text-emerald-600 font-bold text-xs">
          <span>Book Guide</span>
          <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

/* ─── Main Success Page ─── */

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentId, orderId, cityData, bookingType } = location.state || {};

  const [rentals, setRentals] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const cityName = cityData?.name;
  const cityId = cityData?._id;

  useEffect(() => {
    if (!cityId) return;

    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const [rentalRes, guideRes] = await Promise.all([
          rentalsAPI.getAll({ city: cityName }),
          tourGuidesAPI.getAll({ city: cityName }),
        ]);

        // Exclude the category the user just booked, and limit to 3 each
        if (bookingType !== 'rental') setRentals((rentalRes.data || []).slice(0, 3));
        if (bookingType !== 'tour') setGuides((guideRes.data || []).slice(0, 3));
      } catch (err) {
        console.error('Could not load suggestions:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [cityId, cityName, bookingType]);

  const hasSuggestions = rentals.length > 0 || guides.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* ── Success Card ── */}
        <div className="max-w-md mx-auto mb-14">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 text-center">
              {/* Animated checkmark */}
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-[bounce_1s_ease-in-out_1]">
                <CheckCircle size={48} />
              </div>

              <h1 className="text-3xl font-black text-slate-900 mb-2">Payment Successful!</h1>
              <p className="text-slate-500 mb-8 font-medium">
                Thank you! Your booking is now confirmed.
              </p>

              {/* Payment details */}
              <div className="space-y-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Payment ID</span>
                  <span className="text-slate-900 font-mono font-bold text-xs">{paymentId || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Order ID</span>
                  <span className="text-slate-900 font-mono font-bold text-xs">{orderId || 'N/A'}</span>
                </div>
                {cityName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Destination</span>
                    <span className="text-slate-900 font-bold text-xs flex items-center gap-1">
                      <MapPin size={11} className="text-emerald-500" /> {cityName}
                    </span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/my-bookings')}
                  className="w-full bg-slate-900 text-white font-black tracking-widest uppercase text-xs py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  View My Bookings <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-white text-slate-900 font-black tracking-widest uppercase text-xs py-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  Back to Home <Home size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── City Suggestions Section ── */}
        {cityName && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Complete your trip
                </p>
                <h2 className="text-2xl font-black text-slate-900">
                  More to explore in{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                    {cityName}
                  </span>
                </h2>
              </div>
            </div>

            {loadingSuggestions ? (
              <div className="text-center py-12 text-slate-400 text-sm">Loading suggestions…</div>
            ) : hasSuggestions ? (
              <div className="space-y-10">

                {/* Rentals */}
                {rentals.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <Car size={18} className="text-orange-500" />
                        <h3 className="text-lg font-black text-slate-800">
                          Vehicle Rentals in {cityName}
                        </h3>
                      </div>
                      <Link
                        to={`/rentals?city=${encodeURIComponent(cityName)}`}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                      >
                        See all <ChevronRight size={13} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {rentals.map((r) => (
                        <SuggestionRentalCard key={r._id} rental={r} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Tour Guides */}
                {guides.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <Map size={18} className="text-emerald-500" />
                        <h3 className="text-lg font-black text-slate-800">
                          Tour Guides in {cityName}
                        </h3>
                      </div>
                      <Link
                        to={`/tour-guides?city=${encodeURIComponent(cityName)}`}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        See all <ChevronRight size={13} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {guides.map((g) => (
                        <SuggestionGuideCard key={g._id} guide={g} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                No additional services found for {cityName} right now.
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Success;
