import { Star, MapPin, Wifi, Car, Utensils, Dumbbell, Users, ArrowRight, BedDouble, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const FACILITY_MAP = {
  WiFi:       { icon: Wifi,     label: 'Free WiFi' },
  Parking:    { icon: Car,      label: 'Parking' },
  Restaurant: { icon: Utensils, label: 'Restaurant' },
  Gym:        { icon: Dumbbell, label: 'Gym' },
  CommonArea: { icon: Users,    label: 'Common Area' },
};

function getRatingBadge(rating) {
  if (!rating) return null;
  if (rating >= 4.7) return { text: 'Exceptional', bg: 'bg-emerald-500',   ring: 'ring-emerald-200' };
  if (rating >= 4.4) return { text: 'Excellent',   bg: 'bg-green-500',     ring: 'ring-green-200' };
  if (rating >= 4.0) return { text: 'Very Good',   bg: 'bg-lime-500',      ring: 'ring-lime-200' };
  if (rating >= 3.5) return { text: 'Good',         bg: 'bg-yellow-500',    ring: 'ring-yellow-200' };
  return                     { text: 'Okay',         bg: 'bg-orange-400',    ring: 'ring-orange-200' };
}

export default function HostelCard({ hostel }) {
  const badge = getRatingBadge(hostel.rating);

  const facilities = [];
  if (hostel.wifi)        facilities.push('WiFi');
  if (hostel.parking)     facilities.push('Parking');
  if (hostel.restaurant)  facilities.push('Restaurant');
  if (hostel.gym)         facilities.push('Gym');
  if (hostel.common_area) facilities.push('CommonArea');

  const price = hostel.pricePerNight || hostel.price;

  // Specifically target the "girl" placeholder image for replacement
  const GIRL_IMAGE_ID = 'photo-1517841905240-472988babdf9';
  const BETTER_FALLBACK = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200";

  const getHostelImage = () => {
    const originalImage = hostel.images?.[0] || hostel.image;
    
    // If the image is the specific girl placeholder, use a better hostel interior photo
    if (originalImage && originalImage.includes(GIRL_IMAGE_ID)) {
      return BETTER_FALLBACK;
    }
    
    // Otherwise, always use your original database image
    return originalImage || BETTER_FALLBACK;
  };

  const hostelImage = getHostelImage();

  return (
    <Link
      to={`/hostels/${hostel._id}`}
      className="group flex bg-white rounded-2xl overflow-hidden border border-sand-200 transition-all duration-300 hover:shadow-[0_12px_40px_-8px_rgba(249,115,22,0.16)] hover:border-accent-200 hover:-translate-y-0.5"
      style={{ minHeight: '168px' }}
    >
      {/* ── Left: Image ── */}
      <div className="relative w-56 shrink-0 overflow-hidden">
        <img
          src={hostelImage}
          alt={hostel.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Subtle right-edge shadow blending into card */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/15 group-hover:to-black/25 transition-all duration-500" />

        {/* Room type badge */}
        {hostel.roomType && (
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-white/10">
            {hostel.roomType}
          </div>
        )}

        {/* Instant book badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-accent-500/90 backdrop-blur-sm text-white text-[9px] font-black px-2 py-0.5 rounded-full">
          <Zap size={8} className="fill-white" />
          Instant Book
        </div>
      </div>

      {/* ── Center: Info ── */}
      <div className="flex flex-col flex-1 px-6 py-5 min-w-0 justify-between">
        {/* Top: location + name + rating */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <MapPin size={11} className="text-accent-500 shrink-0 stroke-[2.5]" />
            <span className="text-[10px] font-black text-accent-500 uppercase tracking-[0.12em]">
              {hostel.city}
            </span>
          </div>

          <h3 className="text-[15px] font-black text-slate-900 leading-snug group-hover:text-accent-600 transition-colors duration-300 line-clamp-1 mb-2">
            {hostel.name}
          </h3>

          {badge && hostel.rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className={`inline-flex items-center gap-1.5 ${badge.bg} text-white text-[11px] font-black px-2.5 py-1 rounded-lg ring-2 ring-offset-1 ${badge.ring}`}>
                <Star size={10} className="fill-white shrink-0" />
                {hostel.rating.toFixed(1)}
              </div>
              <span className="text-xs font-bold text-slate-600">{badge.text}</span>
              {hostel.reviews > 0 && (
                <span className="text-[11px] text-slate-400 font-medium">· {hostel.reviews} reviews</span>
              )}
            </div>
          )}

          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
            {hostel.description || 'A premium stay curated for travellers seeking comfort and community in the mountains.'}
          </p>
        </div>

        {/* Bottom: Facility pills */}
        <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-sand-100">
          {facilities.length > 0 ? (
            facilities.slice(0, 4).map((key) => {
              const { icon: Icon, label } = FACILITY_MAP[key] || {};
              if (!Icon) return null;
              return (
                <span
                  key={key}
                  className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-sand-50 border border-sand-200 px-2 py-0.5 rounded-full hover:border-accent-300 hover:text-accent-600 transition-colors"
                >
                  <Icon size={9} className="text-accent-400" />
                  {label}
                </span>
              );
            })
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-sand-50 border border-sand-200 px-2 py-0.5 rounded-full">
              <Shield size={9} className="text-emerald-400" />
              Verified Stay
            </span>
          )}
        </div>
      </div>

      {/* ── Right: Price + CTA ── */}
      <div className="flex flex-col items-end justify-between px-6 py-5 bg-sand-50/60 border-l border-sand-100 shrink-0 w-44">
        {/* Price */}
        <div className="text-right">
          {price ? (
            <>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">per night</div>
              <div className="text-2xl font-black text-slate-900 leading-none tracking-tight">
                ₹{Number(price).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-emerald-500 font-bold mt-1 flex items-center gap-0.5 justify-end">
                <Shield size={9} />
                Free cancellation
              </div>
            </>
          ) : (
            <div className="text-xs font-bold text-slate-400 bg-sand-100 px-2 py-1 rounded-lg">Contact for price</div>
          )}
        </div>

        {/* CTA Button */}
        <button className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all duration-200 shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 group/btn mt-4">
          View Details
          <ArrowRight size={12} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </Link>
  );
}
