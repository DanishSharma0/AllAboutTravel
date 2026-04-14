import { useState, useEffect } from 'react';
import TourGuideCard from '../components/TourGuideCard';
import { tourGuidesAPI } from '../services/api';
import { Search } from 'lucide-react';

export default function TourGuides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const response = await tourGuidesAPI.getAll({ city: searchCity });
      setGuides(response.data || []);
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGuides();
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto pb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Tour Guides</h1>

          {/* Search Bar */}
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

          {/* Guides Grid */}
          {loading ? (
            <div className="text-center text-gray-600">Loading guides...</div>
          ) : guides.length === 0 ? (
            <div className="text-center text-gray-600">No guides found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <TourGuideCard key={guide._id} guide={guide} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
