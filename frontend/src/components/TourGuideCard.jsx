import { Star, MapPin, MessageSquare, ArrowRight, ShieldCheck, Award, Languages, UserCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TourGuideCard({ guide }) {
  const price = guide.chargesPerDay || guide.price_per_day;

  // Custom rating color logic
  const getRatingColor = (rating) => {
    if (rating >= 4.8) return 'text-emerald-500';
    if (rating >= 4.5) return 'text-accent-500';
    return 'text-amber-500';
  };

  const ratingColor = getRatingColor(guide.rating || 5);

  return (
    <Link
      to={`/tour-guides/${guide._id}`}
      className="group flex bg-white rounded-2xl overflow-hidden border border-sand-200 transition-all duration-300 hover:shadow-[0_12px_40px_-8px_rgba(249,115,22,0.16)] hover:border-accent-200 hover:-translate-y-0.5"
      style={{ minHeight: '168px' }}
    >
      {/* ── Left: Profile/Image ── */}
      <div className="relative w-56 shrink-0 overflow-hidden">
        {guide.image ? (
          <img
            src={guide.image}
            alt={guide.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sand-100 to-sand-200 flex items-center justify-center">
            <UserCheck size={40} className="text-sand-300" />
          </div>
        )}
        {/* Subtle right-edge shadow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10 group-hover:to-black/20 transition-all duration-500" />

        {/* Experience Badge */}
        {guide.experience && (
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
            <Award size={10} className="text-accent-400" />
            {guide.experience}+ Yrs Exp
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm border border-sand-100">
          <Star size={10} className="fill-accent-500 text-accent-500" />
          {guide.rating ? guide.rating.toFixed(1) : '5.0'}
        </div>
      </div>

      {/* ── Center: Info ── */}
      <div className="flex flex-col flex-1 px-6 py-5 min-w-0 justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <MapPin size={11} className="text-accent-500 shrink-0 stroke-[2.5]" />
            <span className="text-[10px] font-black text-accent-500 uppercase tracking-[0.12em]">
              {guide.city}
            </span>
          </div>

          <h3 className="text-[16px] font-black text-slate-900 leading-snug group-hover:text-accent-600 transition-colors duration-300 line-clamp-1 mb-2">
            {guide.name}
          </h3>

          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
            {guide.bio || 'Professional local guide dedicated to providing authentic cultural experiences and memorable mountain adventures.'}
          </p>
        </div>

        {/* Languages & Specialties */}
        <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-sand-100">
          {guide.languages && guide.languages.slice(0, 2).map((lang, i) => (
            <span
              key={i}
              className="flex items-center gap-1 text-[9px] font-black text-slate-500 bg-sand-50 border border-sand-200 px-2 py-0.5 rounded-full uppercase tracking-wider"
            >
              <Languages size={9} className="text-accent-400" />
              {lang}
            </span>
          ))}
          {guide.specialty && (
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {guide.specialty}
            </span>
          )}
        </div>
      </div>

      {/* ── Right: Price + CTA ── */}
      <div className="flex flex-col items-end justify-between px-6 py-5 bg-sand-50/60 border-l border-sand-100 shrink-0 w-44">
        <div className="text-right">
          {price ? (
            <>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">starting from</div>
              <div className="text-2xl font-black text-slate-900 leading-none tracking-tight">
                ₹{Number(price).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-accent-500 font-bold mt-1 flex items-center gap-0.5 justify-end">
                <Clock size={9} />
                Full Day Tour
              </div>
            </>
          ) : (
            <div className="text-xs font-bold text-slate-400 bg-sand-100 px-2 py-1 rounded-lg">Check schedule</div>
          )}
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-accent-500 active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all duration-200 shadow-lg shadow-slate-900/10 hover:shadow-accent-500/25 group/btn mt-4">
          Book Guide
          <ArrowRight size={12} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </Link>
  );
}
