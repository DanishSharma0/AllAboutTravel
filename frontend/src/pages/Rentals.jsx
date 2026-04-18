import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RentalCard from '../components/RentalCard';
import { rentalsAPI } from '../services/api';
import { Search, MapPin } from 'lucide-react';

export default function Rentals() {
  const [searchParams] = useSearchParams();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState(searchParams.get('city') || '');

  useEffect(() => {
    fetchRentals(searchParams.get('city') || searchCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRentals = async (city) => {
    setLoading(true);
    try {
      const response = await rentalsAPI.getAll({ city: city || searchCity });
      setRentals(response.data || []);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRentals(searchCity);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Vehicle Rentals</h1>
        {searchCity && (
          <p className="text-gray-500 mb-6 flex items-center gap-1">
            <MapPin size={15} className="text-orange-500" />
            Showing rentals in <span className="font-semibold text-orange-600 ml-1">"{searchCity}"</span>
          </p>
        )}

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-10">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search by city (e.g. Goa, Manali)..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2 text-sm"
            >
              <Search size={18} />
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">Loading rentals...</div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg font-semibold">No rentals found{searchCity ? ` in "${searchCity}"` : ''}.</p>
            <p className="text-gray-400 text-sm mt-2">Try a different city name.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((rental) => (
              <RentalCard key={rental._id} rental={rental} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
