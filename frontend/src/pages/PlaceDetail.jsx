import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


import { placesAPI } from '../services/api';
import { MapPin, Heart, ArrowLeft, Clock } from 'lucide-react';

export default function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    fetchPlaceDetails();
  }, [id]);

  const fetchPlaceDetails = async () => {
    try {
      const response = await placesAPI.getById(id);
      setPlace(response.data);
    } catch (error) {
      console.error('Error fetching place:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);

  };

  if (loading) return <div className="min-h-screen">Loading...</div>;
  if (!place) return <div className="min-h-screen">Place not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {}
          <button
            onClick={() => navigate('/places')}
            className="flex items-center gap-2 text-indigo-600 mb-6 hover:text-indigo-700"
          >
            <ArrowLeft size={20} />
            Back to Places
          </button>

          {}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {}
            {place.image && (
              <img src={place.image} alt={place.name} className="w-full h-96 object-cover" />
            )}

            <div className="p-8">
              {}
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{place.name}</h1>
                <button
                  onClick={handleFavorite}
                  className="p-2 hover:bg-red-100 rounded-lg transition"
                >
                  <Heart
                    size={28}
                    className={isFavorited ? 'fill-red-600 text-red-600' : 'text-gray-400'}
                  />
                </button>
              </div>

              {}
              <div className="flex gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={24} />
                  <span className="text-lg">{place.city}</span>
                </div>
                {place.distance && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={24} />
                    <span className="text-lg">{place.distance} km away</span>
                  </div>
                )}
              </div>

              {}
              {place.category && (
                <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  {place.category}
                </span>
              )}

              {}
              <p className="text-gray-600 text-lg mb-8">{place.description}</p>

              {}
              {(place.timings || place.entry_fee || place.best_time) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {place.timings && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Timings</h3>
                      <p className="text-gray-600">{place.timings}</p>
                    </div>
                  )}
                  {place.entry_fee && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Entry Fee</h3>
                      <p className="text-gray-600">₹{place.entry_fee}</p>
                    </div>
                  )}
                  {place.best_time && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Best Time to Visit</h3>
                      <p className="text-gray-600">{place.best_time}</p>
                    </div>
                  )}
                </div>
              )}

              {}
              {place.nearby_attractions && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Nearby Attractions</h3>
                  <ul className="space-y-2">
                    {place.nearby_attractions.map((attraction, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <span className="text-indigo-600">•</span>
                        {attraction}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {}
              {place.activities && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Activities</h3>
                  <div className="flex flex-wrap gap-2">
                    {place.activities.map((activity, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {}
              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition text-lg">
                Plan My Visit
              </button>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
