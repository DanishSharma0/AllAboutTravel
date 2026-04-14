import { useState, useEffect } from 'react';
import RentalCard from '../components/RentalCard';
import { rentalsAPI } from '../services/api';
import { Search } from 'lucide-react';

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await rentalsAPI.getAll({ city: searchCity });
      setRentals(response.data || []);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRentals();
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto pb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Rentals</h1>

          {}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Search by city..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <Search size={20} />
                Search
              </button>
            </div>
          </form>

          {}
          {loading ? (
            <div className="text-center text-gray-600">Loading rentals...</div>
          ) : rentals.length === 0 ? (
            <div className="text-center text-gray-600">No rentals found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentals.map((rental) => (
                <RentalCard key={rental._id} rental={rental} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
