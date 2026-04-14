import { Bike, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RentalCard({ rental }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      {rental.image && (
        <img src={rental.image} alt={rental.name} className="w-full h-48 object-cover" />
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{rental.name}</h3>
        
        {}
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <Bike size={18} />
          <span className="font-semibold">{rental.type}</span>
        </div>

        {}
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin size={18} />
          <span>{rental.city}</span>
        </div>

        {}
        {rental.features && (
          <p className="text-sm text-gray-600 mb-3">
            {rental.features.slice(0, 2).join(', ')}
          </p>
        )}

        {}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{rental.description}</p>

        {}
        <div className="flex justify-between items-center">
          <div>
            {rental.price_per_day && (
              <span className="text-lg font-bold text-indigo-600">
                ₹{rental.price_per_day}
              </span>
            )}
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <Clock size={14} />
              <span>per day</span>
            </div>
          </div>
          <Link
            to={`/rentals/${rental._id}`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
