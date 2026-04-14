import { useState, useEffect } from 'react';
import PlaceCard from '../components/PlaceCard';
import { placesAPI } from '../services/api';
import { Search } from 'lucide-react';

export default function Places() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await placesAPI.getAll({ search: searchQuery });
      setPlaces(response.data || []);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPlaces();
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto pb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Tourist Places</h1>

          {}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search places..."
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
            <div className="text-center text-gray-600">Loading places...</div>
          ) : places.length === 0 ? (
            <div className="text-center text-gray-600">No places found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
