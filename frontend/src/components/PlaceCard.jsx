import { MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlaceCard({ place }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      {place.image && (
        <img src={place.image} alt={place.name} className="w-full h-48 object-cover" />
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{place.name}</h3>
        
        {}
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin size={18} />
          <span>{place.city}</span>
        </div>

        {}
        {place.category && (
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {place.category}
          </span>
        )}

        {}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{place.description}</p>

        {}
        {place.distance && (
          <p className="text-sm text-gray-500 mb-4">
            {place.distance} km away
          </p>
        )}

        {}
        <div className="flex gap-2">
          <Link
            to={`/places/${place._id}`}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm text-center"
          >
            View Details
          </Link>
          <button className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition">
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
