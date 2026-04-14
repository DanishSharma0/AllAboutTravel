import { Star, MapPin, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TourGuideCard({ guide }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      {guide.image && (
        <img src={guide.image} alt={guide.name} className="w-full h-48 object-cover" />
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{guide.name}</h3>
        
        {}
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin size={18} />
          <span>{guide.city}</span>
        </div>

        {}
        {guide.experience && (
          <p className="text-sm text-gray-600 mb-2">
            {guide.experience} years experience
          </p>
        )}

        {}
        {guide.rating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < guide.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
            <span className="text-sm text-gray-600">({guide.reviews || 0})</span>
          </div>
        )}

        {}
        {guide.languages && (
          <div className="text-sm text-gray-600 mb-4">
            Languages: {guide.languages.join(', ')}
          </div>
        )}

        {}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{guide.bio}</p>

        {}
        <div className="flex justify-between items-center">
          {guide.price_per_day && (
            <span className="text-lg font-bold text-indigo-600">
              ₹{guide.price_per_day}/day
            </span>
          )}
          <Link
            to={`/tour-guides/${guide._id}`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm flex items-center gap-1"
          >
            <MessageSquare size={16} />
            Book
          </Link>
        </div>
      </div>
    </div>
  );
}
