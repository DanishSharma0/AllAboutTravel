import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { directionService } from '../services';
import { MapPin, Navigation } from 'lucide-react';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Map() {
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);

          setUserLocation({ lat: 28.7041, lng: 77.1025 });
        }
      );
    } else {

      setUserLocation({ lat: 28.7041, lng: 77.1025 });
    }
  }, []);

  const handleGetDirections = async () => {
    if (!destination || !userLocation) {
      alert('Please enter a destination');
      return;
    }

    try {
      setIsLoading(true);


      const mockRoute = {
        routes: [[
          [userLocation.lng, userLocation.lat],
          [userLocation.lng + 0.1, userLocation.lat + 0.1]
        ]]
      };
      
      if (mockRoute.routes && mockRoute.routes[0]) {
        const coordinates = mockRoute.routes[0].map(coord => [coord[1], coord[0]]);
        setRoute(coordinates);
      }
    } catch (error) {
      alert('Could not get directions: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetNearbyPlaces = async () => {
    if (!userLocation) return;

    try {
      setIsLoading(true);


      setNearbyPlaces([
        { id: 1, name: 'Museum', lat: userLocation.lat + 0.01, lng: userLocation.lng + 0.01 },
        { id: 2, name: 'Temple', lat: userLocation.lat - 0.01, lng: userLocation.lng + 0.01 },
        { id: 3, name: 'Park', lat: userLocation.lat + 0.01, lng: userLocation.lng - 0.01 },
      ]);
    } catch (error) {
      alert('Error loading nearby places: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userLocation) {
    return <div className="text-center py-12">Loading map...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        <MapPin size={32} />
        Map & Navigation
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        {}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Navigation</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <input 
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <button 
                onClick={handleGetDirections}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 rounded transition"
              >
                <Navigation size={16} />
                Get Directions
              </button>

              <button 
                onClick={handleGetNearbyPlaces}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 rounded transition"
              >
                Nearby Places
              </button>
            </div>

            {nearbyPlaces.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-bold text-gray-800 mb-3">Nearby Attractions</h3>
                <div className="space-y-2">
                  {nearbyPlaces.map(place => (
                    <div key={place.id} className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <p className="font-semibold">{place.name}</p>
                      <p className="text-xs text-gray-600">
                        {place.lat.toFixed(3)}, {place.lng.toFixed(3)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-lg overflow-hidden">
          <MapContainer 
            center={[userLocation.lat, userLocation.lng]} 
            zoom={13} 
            style={{ height: '500px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            
            {}
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Your Location</Popup>
            </Marker>

            {}
            {route && (
              <Polyline positions={route} color="blue" weight={3} />
            )}

            {}
            {nearbyPlaces.map(place => (
              <Marker key={place.id} position={[place.lat, place.lng]}>
                <Popup>{place.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <p className="text-blue-900">
          <strong>💡 Tip:</strong> Use the navigation panel to search for destinations, get directions, and discover nearby attractions on the map.
        </p>
      </div>
    </div>
  );
}
