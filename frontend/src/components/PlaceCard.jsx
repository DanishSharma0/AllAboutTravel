import { Star, MapPin, ArrowRight, Info, Compass, Clock, Landmark, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlaceCard({ place }) {
  const ratingBadge = place.rating >= 4.5 ? 'Exceptional' : place.rating >= 4.0 ? 'Top Rated' : 'Popular';

  return (
    <Link
      to={`/places/${place._id}`}
      className="group flex bg-white rounded-2xl overflow-hidden border border-sand-200 transition-all duration-300 hover:shadow-[0_12px_40px_-8px_rgba(249,115,22,0.16)] hover:border-accent-200 hover:-translate-y-0.5"
      style={{ minHeight: '168px' }}
    >
      {/* ── Left: Image ── */}
      <div className="relative w-72 shrink-0 overflow-hidden">
        {place.image ? (
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sand-100 to-sand-200 flex items-center justify-center">
            <Landmark size={40} className="text-sand-300" />
          </div>
        )}
        {/* Subtle right-edge shadow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/15 group-hover:to-black/25 transition-all duration-500" />

        {/* Category Badge */}
        {place.category && (
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
            <Compass size={10} className="text-accent-400" />
            {place.category}
          </div>
        )}

        {/* Rating Overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm border border-sand-100">
          <Star size={10} className="fill-accent-500 text-accent-500" />
          {place.rating ? place.rating.toFixed(1) : '4.5'}
        </div>
      </div>

      {/* ── Center: Info ── */}
      <div className="flex flex-col flex-1 px-6 py-5 min-w-0 justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <MapPin size={11} className="text-accent-500 shrink-0 stroke-[2.5]" />
            <span className="text-[10px] font-black text-accent-500 uppercase tracking-[0.12em]">
              {place.cityId?.name || place.city || 'Explore'}
            </span>
          </div>

          <h3 className="text-[17px] font-black text-slate-900 leading-snug group-hover:text-accent-600 transition-colors duration-300 line-clamp-1 mb-2">
            {place.name}
          </h3>

          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
            {place.description || 'Discover the breathtaking beauty and rich cultural heritage of this curated mountain destination.'}
          </p>
        </div>

        {/* Highlights */}
        <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-sand-100">
          <span className="flex items-center gap-1 text-[9px] font-black text-slate-500 bg-sand-50 border border-sand-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <Clock size={9} className="text-accent-400" />
            Best in Morning
          </span>
          <span className="flex items-center gap-1 text-[9px] font-black text-slate-500 bg-sand-50 border border-sand-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <Camera size={9} className="text-accent-400" />
            Photo Spot
          </span>
        </div>
      </div>

      {/* ── Right: Badge + CTA ── */}
      <div className="flex flex-col items-end justify-between px-6 py-5 bg-sand-50/60 border-l border-sand-100 shrink-0 w-44">
        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Curation</div>
          <div className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
            place.rating >= 4.5 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-accent-50 text-accent-600 border-accent-100'
          }`}>
            {ratingBadge}
          </div>
          <div className="text-[10px] text-slate-400 font-bold mt-2 flex items-center gap-0.5 justify-end">
            <Info size={9} />
            Free Entry
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-accent-500 active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all duration-200 shadow-lg shadow-slate-900/10 hover:shadow-accent-500/25 group/btn mt-4">
          Discover
          <ArrowRight size={12} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </Link>
  );
}
