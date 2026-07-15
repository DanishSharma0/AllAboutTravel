import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { recommendationAPI, placesAPI } from '../services/api';
import CityOverviewCard from '../components/CityOverviewCard';
import RecommendationCarousel from '../components/RecommendationCarousel';
import TouristAttractionsSection from '../components/TouristAttractionsSection';
import SuggestedItinerarySection from '../components/SuggestedItinerarySection';
import AITravelAssistant from '../components/AITravelAssistant';
import TripHubDashboard from '../components/TripHubDashboard';
import ErrorBoundary from '../components/ErrorBoundary';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getServiceRoute = (item, category) => {
  const routeMap = {
    hostels: `/hostels/${item._id}`,
    rentals: `/rentals/${item._id}`,
    tourGuides: `/tour-guides/${item._id}`,
    products: `/products/${item._id}`,
  };
  return routeMap[category];
};

const ContinueExploring = () => {
  const { cityId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [cityInfo, setCityInfo] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [peopleAlsoBooked, setPeopleAlsoBooked] = useState([]);
  const [attractions, setAttractions] = useState(null);
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [restaurants, setRestaurants] = useState(null);
  const [shopping, setShopping] = useState(null);
  const [hospitals, setHospitals] = useState(null);
  const [essentials, setEssentials] = useState(null);
  const [placeMarkers, setPlaceMarkers] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [activeCategory, setActiveCategory] = useState('popular');
  const placeRequestControllerRef = useRef(null);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);
  const [cityError, setCityError] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [tabLoading, setTabLoading] = useState({
    overview: true,
    recommendations: false,
    attractions: false,
    itinerary: false,
    map: false,
  });
  const [placeLoading, setPlaceLoading] = useState(false);

  // Extract booking details from location state
  const bookingDetails = location.state?.bookingDetails || null;
  const rawBookingCategory = location.state?.bookingCategory || bookingDetails?.type || null;
  const bookingCategory = rawBookingCategory === 'tour'
    ? 'tourGuides'
    : rawBookingCategory === 'tourGuide'
    ? 'tourGuides'
    : rawBookingCategory === 'hostel'
    ? 'hostels'
    : rawBookingCategory === 'rental'
    ? 'rentals'
    : rawBookingCategory === 'product'
    ? 'products'
    : rawBookingCategory;
  const excludeServiceId = bookingDetails?.itemId || bookingDetails?.bookingId || null;

  const fetchCityInfo = React.useCallback(async () => {
    try {
      setError(null);
      setCityError(null);
      setTabLoading((prev) => ({ ...prev, overview: true }));
      const cityInfoRes = await recommendationAPI.getCityInfo(cityId);
      setCityInfo(cityInfoRes.data.city);
    } catch (err) {
      console.error('Error fetching city info:', err);
      setCityError(err.response?.data?.message || 'Failed to load city information');
    } finally {
      setTabLoading((prev) => ({ ...prev, overview: false }));
      setLoading(false);
    }
  }, [cityId]);

  const fetchRecommendations = React.useCallback(async () => {
    try {
      setError(null);
      setTabLoading((prev) => ({ ...prev, recommendations: true }));
      const params = { cityId, bookingCategory };
      if (excludeServiceId) params.excludeServiceId = excludeServiceId;
      const recommendationsRes = await recommendationAPI.getSmartRecommendations(params);
      setRecommendations(recommendationsRes.data.recommendations);
      setPeopleAlsoBooked(recommendationsRes.data.peopleAlsoBooked || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.response?.data?.message || 'Failed to load recommendations');
    } finally {
      setTabLoading((prev) => ({ ...prev, recommendations: false }));
    }
  }, [cityId, bookingCategory, excludeServiceId]);

  const fetchAttractions = React.useCallback(async () => {
    try {
      setError(null);
      setTabLoading((prev) => ({ ...prev, attractions: true }));
      const attractionsRes = await recommendationAPI.getTouristAttractions(cityId, 12, cityInfo?.latitude, cityInfo?.longitude);
      setAttractions(attractionsRes.data.attractions);
    } catch (err) {
      console.error('Error fetching attractions:', err);
      setError(err.response?.data?.message || 'Failed to load attractions');
    } finally {
      setTabLoading((prev) => ({ ...prev, attractions: false }));
    }
  }, [cityId, cityInfo?.latitude, cityInfo?.longitude]);

  const fetchCategoryPlaces = React.useCallback(
    async (type, setter, limit = 8) => {
      if (!cityInfo?.latitude || !cityInfo?.longitude) return;
      try {
        setMapError(null);
        setPlaceLoading(true);
        if (placeRequestControllerRef.current) {
          placeRequestControllerRef.current.abort();
        }
        placeRequestControllerRef.current = new AbortController();

        const response = await placesAPI.getNearbyPlaces(
          cityInfo.latitude,
          cityInfo.longitude,
          type,
          8000,
          limit,
          placeRequestControllerRef.current.signal
        );
        setter(response.data.places || []);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          console.error(`Error fetching ${type} places:`, err);
          setMapError(err.response?.data?.message || `Failed to load ${type} places`);
        }
      } finally {
        setPlaceLoading(false);
      }
    },
    [cityInfo?.latitude, cityInfo?.longitude]
  );

  const fetchMapPlaces = React.useCallback(async () => {
    if (!cityInfo?.latitude || !cityInfo?.longitude) return;
    try {
      setMapError(null);
      setPlaceLoading(true);
      const results = await Promise.allSettled([
        placesAPI.getPopularAttractions(cityInfo.name, 8),
        placesAPI.getNearbyPlaces(cityInfo.latitude, cityInfo.longitude, 'restaurant', 8000, 8),
        placesAPI.getNearbyPlaces(cityInfo.latitude, cityInfo.longitude, 'shopping', 8000, 8),
        placesAPI.getNearbyPlaces(cityInfo.latitude, cityInfo.longitude, 'hospital', 8000, 8),
        placesAPI.getNearbyPlaces(cityInfo.latitude, cityInfo.longitude, 'essentials', 8000, 8),
      ]);

      const [popularRes, restaurantsRes, shoppingRes, hospitalsRes, essentialsRes] = results.map((result) =>
        result.status === 'fulfilled' ? result.value : null
      );

      setPopularPlaces(popularRes?.data?.places || []);
      setRestaurants(restaurantsRes?.data?.places || []);
      setShopping(shoppingRes?.data?.places || []);
      setHospitals(hospitalsRes?.data?.places || []);
      setEssentials(essentialsRes?.data?.places || []);
      setPlaceMarkers([
        ...(popularRes?.data?.places || []),
        ...(restaurantsRes?.data?.places || []),
        ...(shoppingRes?.data?.places || []),
        ...(hospitalsRes?.data?.places || []),
        ...(essentialsRes?.data?.places || []),
      ]);

      const failedResult = results.find((result) => result.status === 'rejected');
      if (failedResult) {
        console.error('Error fetching Geoapify categories:', failedResult.reason);
        setMapError(failedResult.reason.response?.data?.message || 'Failed to load some nearby places');
      }
    } catch (err) {
      console.error('Error fetching Geoapify categories:', err);
      setMapError(err.response?.data?.message || 'Failed to load nearby places');
    } finally {
      setPlaceLoading(false);
    }
  }, [cityInfo?.latitude, cityInfo?.longitude, cityInfo?.name]);

  const fetchWikipediaInfo = async (title) => {
    if (!title) return null;
    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
      if (!response.ok) return null;
      const data = await response.json();
      return {
        summary: data.extract || null,
        wikipediaUrl: data.content_urls?.desktop?.page || null,
      };
    } catch (err) {
      console.warn('Wikipedia fetch failed:', err);
      return null;
    }
  };

  const handleLearnMore = async (place) => {
    setSelectedPlace({ ...place, loading: true });
    try {
      const [detailsRes, wikiInfo] = await Promise.all([
        placesAPI.getPlaceDetails(place.placeId),
        fetchWikipediaInfo(place.name),
      ]);
      setSelectedPlace({
        ...place,
        details: detailsRes.data.details,
        wiki: wikiInfo,
        loading: false,
      });
    } catch (err) {
      console.error('Error loading place details:', err);
      setSelectedPlace({ ...place, loading: false });
      setError('Could not load additional place details.');
    }
  };

  const handleSelectCategory = (categoryKey, type, setter) => {
    setActiveCategory(categoryKey);
    if (categoryKey === 'popular') return;
    if (!setter) return;
    setter((current) => current || []);
    if (!cityInfo?.latitude || !cityInfo?.longitude) return;
    if (categoryKey !== 'popular') {
      fetchCategoryPlaces(type, setter, 8);
    }
  };

  const activeCategoryPlaces = useMemo(() => {
    switch (activeCategory) {
      case 'restaurants':
        return restaurants || [];
      case 'shopping':
        return shopping || [];
      case 'hospitals':
        return hospitals || [];
      case 'essentials':
        return essentials || [];
      default:
        return popularPlaces || [];
    }
  }, [activeCategory, popularPlaces, restaurants, shopping, hospitals, essentials]);

  const categoryConfig = useMemo(
    () => [
      {
        key: 'popular',
        label: 'Popular Sights',
        description: 'Must-see landmarks near your booking location.',
        type: 'tourist_attraction',
        setter: setPopularPlaces,
        icon: '🏛️',
      },
      {
        key: 'restaurants',
        label: 'Dining',
        description: 'Find the best local restaurants and cafes.',
        type: 'restaurant',
        setter: setRestaurants,
        icon: '🍽️',
      },
      {
        key: 'shopping',
        label: 'Shopping',
        description: 'Browse popular shops and markets.',
        type: 'shopping',
        setter: setShopping,
        icon: '🛍️',
      },
      {
        key: 'essentials',
        label: 'Essentials',
        description: 'Healthcare, pharmacies, and fuel nearby.',
        type: 'essentials',
        setter: setEssentials,
        icon: '🛒',
      },
    ],
    []
  );

  useEffect(() => {
    return () => {
      placeRequestControllerRef.current?.abort();
    };
  }, []);

  const fetchItinerary = React.useCallback(async () => {
    try {
      setError(null);
      setTabLoading((prev) => ({ ...prev, itinerary: true }));
      const itineraryRes = await recommendationAPI.getSuggestedItinerary(cityId, 3);
      setItinerary(itineraryRes.data.itinerary);
    } catch (err) {
      console.error('Error fetching itinerary:', err);
      setError(err.response?.data?.message || 'Failed to load itinerary');
    } finally {
      setTabLoading((prev) => ({ ...prev, itinerary: false }));
    }
  }, [cityId]);

  useEffect(() => {
    if (cityId) {
      fetchCityInfo();
    }
  }, [cityId, fetchCityInfo]);

  useEffect(() => {
    if (!cityInfo) return;

    fetchMapPlaces();

    const loadActiveTabData = async () => {
      if (activeTab === 'recommendations' && !recommendations) {
        await fetchRecommendations();
      }
      if (activeTab === 'attractions' && !attractions) {
        await fetchAttractions();
      }
      if (activeTab === 'itinerary' && !itinerary) {
        await fetchItinerary();
      }
    };

    loadActiveTabData();
  }, [activeTab, cityInfo, recommendations, attractions, itinerary, fetchRecommendations, fetchAttractions, fetchItinerary, fetchMapPlaces]);


  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your travel experience...</p>
        </div>
      </div>
    );
  }

  if (cityError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{cityError}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🎉 Booking Confirmed!</h1>
          <p className="text-lg text-indigo-100 mb-6">Let's continue exploring your trip to {cityInfo?.name}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {error && (
            <div className="mb-4 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="flex overflow-x-auto space-x-8">
            {[
              { id: 'overview', label: '🏙️ City Overview' },
              { id: 'recommendations', label: '🎯 Recommendations' },
              { id: 'attractions', label: '🏛️ Attractions' },
              { id: 'itinerary', label: '📅 Itinerary' },
              { id: 'assistant', label: '🤖 AI Assistant' },
              { id: 'hub', label: '🗺️ Trip Hub' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 px-4 whitespace-nowrap font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorBoundary>
          {/* City Overview Tab */}
          {activeTab === 'overview' && cityInfo && (
            <div className="animate-fade-in space-y-10">
              <CityOverviewCard city={cityInfo} bookingDetails={bookingDetails} />
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Continue exploring nearby</h2>
                    <p className="text-slate-500 mt-2">Discover popular sights, dining, shopping, and essentials around your destination.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {categoryConfig.map((category) => (
                      <button
                        key={category.key}
                        onClick={() => handleSelectCategory(category.key, category.type, category.setter)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          activeCategory === category.key
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {category.icon} {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 p-6 bg-slate-50">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{categoryConfig.find((item) => item.key === activeCategory)?.label}</h3>
                      <p className="text-sm text-slate-600">
                        {categoryConfig.find((item) => item.key === activeCategory)?.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {placeLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                          <div key={index} className="animate-pulse rounded-3xl bg-white p-6 h-28" />
                        ))
                      ) : activeCategoryPlaces?.length > 0 ? (
                        activeCategoryPlaces.map((place) => (
                          <div key={place.placeId} className="bg-white rounded-3xl shadow-sm p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h4 className="text-lg font-bold text-slate-900">{place.name}</h4>
                                <p className="text-sm text-slate-500 mt-1">{place.address || 'No address available'}</p>
                              </div>
                              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{place.category}</span>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3 items-center">
                              {place.rating ? (
                                <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold">
                                  ⭐ {place.rating.toFixed(1)}
                                </span>
                              ) : null}
                              {place.distance ? (
                                <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-semibold">
                                  📏 {place.distance}m away
                                </span>
                              ) : null}
                              <button
                                onClick={() => handleLearnMore(place)}
                                className="ml-auto rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                              >
                                Learn more
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-slate-500">
                          <p>No places found for this category yet.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                      <MapContainer
                        center={[cityInfo.latitude, cityInfo.longitude]}
                        zoom={12}
                        scrollWheelZoom={false}
                        className="h-96 w-full"
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {placeMarkers.map((place) =>
                          place.latitude && place.longitude ? (
                            <Marker key={`${place.placeId}-${place.latitude}-${place.longitude}`} position={[place.latitude, place.longitude]}>
                              <Popup>
                                <div className="space-y-2">
                                  <p className="font-semibold text-slate-900">{place.name}</p>
                                  <p className="text-sm text-slate-600">{place.address || 'Location'}</p>
                                  <button
                                    type="button"
                                    onClick={() => handleLearnMore(place)}
                                    className="mt-2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                                  >
                                    Learn more
                                  </button>
                                </div>
                              </Popup>
                            </Marker>
                          ) : null
                        )}
                      </MapContainer>
                    </div>

                    {mapError && (
                      <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {mapError}
                      </div>
                    )}

                    {selectedPlace ? (
                      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{selectedPlace.name}</h3>
                            <p className="text-sm text-slate-500">{selectedPlace.address || selectedPlace.category}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedPlace(null)}
                            className="text-slate-500 hover:text-slate-700"
                          >
                            Close
                          </button>
                        </div>
                        {selectedPlace.loading ? (
                          <div className="mt-6 animate-pulse space-y-4">
                            <div className="h-4 rounded bg-slate-200"></div>
                            <div className="h-4 rounded bg-slate-200"></div>
                            <div className="h-4 rounded bg-slate-200"></div>
                          </div>
                        ) : (
                          <div className="mt-6 space-y-4">
                            {selectedPlace.details?.description && (
                              <p className="text-slate-600">{selectedPlace.details.description}</p>
                            )}
                            {selectedPlace.details?.opening_hours && (
                              <p className="text-sm text-slate-500">Hours: {selectedPlace.details.opening_hours}</p>
                            )}
                            {selectedPlace.wiki?.summary && (
                              <div>
                                <h4 className="text-sm font-semibold text-slate-900">From Wikipedia</h4>
                                <p className="text-slate-600">{selectedPlace.wiki.summary}</p>
                                {selectedPlace.wiki.wikipediaUrl && (
                                  <a
                                    href={selectedPlace.wiki.wikipediaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
                                  >
                                    Read more
                                  </a>
                                )}
                              </div>
                            )}
                            <div className="grid gap-2 sm:grid-cols-2">
                              {selectedPlace.website && (
                                <a
                                  href={selectedPlace.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                                >
                                  Visit website
                                </a>
                              )}
                              {selectedPlace.latitude && selectedPlace.longitude && (
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${selectedPlace.latitude},${selectedPlace.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                >
                                  Open in Maps
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                        <p>Select a place from the map or list to view more details.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="animate-fade-in">
              {tabLoading.recommendations ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse bg-white rounded-3xl p-6 h-96" />
                  ))}
                </div>
              ) : recommendations ? (
                <>
                  <RecommendationCarousel recommendations={recommendations} />
                  {peopleAlsoBooked.length > 0 && (
                    <div className="mt-12 bg-white rounded-3xl shadow-lg p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">People Also Booked</h3>
                          <p className="text-sm text-slate-500">Services popular with travelers in this city.</p>
                        </div>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {peopleAlsoBooked.map((bookingItem) => (
                          <button
                            type="button"
                            key={`${bookingItem.category}-${bookingItem.item._id}`}
                            onClick={() => navigate(getServiceRoute(bookingItem.item, bookingItem.category))}
                            className="text-left bg-slate-50 hover:bg-slate-100 transition rounded-3xl p-5 border border-slate-200"
                          >
                            <div className="font-semibold text-slate-900 mb-1">{bookingItem.label}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-[0.12em] mb-3">{bookingItem.category === 'tourGuides' ? 'Tour Guide' : bookingItem.category === 'hostels' ? 'Hostel' : bookingItem.category === 'rentals' ? 'Vehicle' : 'Product'}</div>
                            <p className="text-sm text-slate-600 line-clamp-2">{bookingItem.item.description || 'Browse the details and make a booking.'}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-lg">No recommendations available for this city yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Attractions Tab */}
          {activeTab === 'attractions' && (
            <div className="animate-fade-in">
              {tabLoading.attractions ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse bg-white rounded-3xl p-6 h-96" />
                  ))}
                </div>
              ) : attractions ? (
                <TouristAttractionsSection attractions={attractions} cityName={cityInfo?.name} />
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-lg">No attractions available for this city.</p>
                </div>
              )}
            </div>
          )}

          {/* Itinerary Tab */}
          {activeTab === 'itinerary' && (
            <div className="animate-fade-in">
              {tabLoading.itinerary ? (
                <div className="animate-pulse bg-white rounded-3xl p-6 h-80" />
              ) : itinerary ? (
                <SuggestedItinerarySection itinerary={itinerary} cityName={cityInfo?.name} />
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-lg">No itinerary available for this city right now.</p>
                </div>
              )}
            </div>
          )}

          {/* AI Assistant Tab */}
          {activeTab === 'assistant' && (
            <div className="animate-fade-in">
              <AITravelAssistant cityId={cityId} cityName={cityInfo?.name} />
            </div>
          )}

          {/* Trip Hub Tab (Bonus) */}
          {activeTab === 'hub' && (
            <div className="animate-fade-in">
              <TripHubDashboard
                cityInfo={cityInfo}
                bookingDetails={bookingDetails}
                recommendations={recommendations}
                attractions={attractions}
              />
            </div>
          )}
        </ErrorBoundary>
      </div>

      {/* CTA Section */}
      <div className="bg-linear-to-r from-indigo-600 to-blue-600 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to explore more?</h2>
          <p className="text-lg text-indigo-100 mb-6">
            Start planning your perfect trip with our AI assistant or browse more recommendations
          </p>
          <button
            onClick={() => setActiveTab('assistant')}
            className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-lg hover:bg-indigo-50 transition"
          >
            Chat with AI Assistant
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContinueExploring;
