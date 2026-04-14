import { Star, MapPin, Wifi, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HostelCard({ hostel }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      {hostel.image && (
        <img src={hostel.image} alt={hostel.name} className="w-full h-48 object-cover" />
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{hostel.name}</h3>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin size={18} />
          <span>{hostel.city}</span>
        </div>

        {/* Rating */}
        {hostel.rating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < hostel.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
            <span className="text-sm text-gray-600">({hostel.reviews || 0})</span>
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hostel.description}</p>

        {/* Amenities */}
        <div className="flex gap-2 mb-4">
          {hostel.wifi && <Wifi size={16} className="text-green-600" />}
          {hostel.common_area && <Users size={16} className="text-blue-600" />}
        </div>

        {/* Price & CTA */}
        <div className="flex justify-between items-center">
          {hostel.price && (
            <span className="text-lg font-bold text-indigo-600">
              ₹{hostel.price}/night
            </span>
          )}
          <Link
            to={`/hostels/${hostel._id}`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
