import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RecommendationCarousel = ({ recommendations }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('hostels');
  const [scrollPositions, setScrollPositions] = useState({});

  React.useEffect(() => {
    if (!recommendations) return;
    const firstAvailable = ['hostels', 'rentals', 'tourGuides', 'products'].find(
      (key) => Array.isArray(recommendations[key]) && recommendations[key].length > 0
    );
    if (firstAvailable && activeCategory !== firstAvailable) {
      setActiveCategory(firstAvailable);
    }
  }, [recommendations]);

  const categories = [
    { key: 'hostels', label: '🏨 Hostels', icon: '🏨' },
    { key: 'rentals', label: '🚗 Vehicles', icon: '🚗' },
    { key: 'tourGuides', label: '👨‍🏫 Tour Guides', icon: '👨‍🏫' },
    { key: 'products', label: '🛍️ Products', icon: '🛍️' },
  ];

  const scrollCarousel = (category, direction) => {
    const element = document.getElementById(`carousel-${category}`);
    if (element) {
      const scrollAmount = 350;
      const newPosition = (scrollPositions[category] || 0) + (direction === 'left' ? -scrollAmount : scrollAmount);
      element.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPositions({ ...scrollPositions, [category]: newPosition });
    }
  };

  const currentItems = recommendations[activeCategory] || [];

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        <span className="text-yellow-400 mr-1">{'⭐'.repeat(Math.floor(rating))}</span>
        <span className="text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const getServiceRoute = (item, category) => {
    const routeMap = {
      hostels: `/hostels/${item._id}`,
      rentals: `/rentals/${item._id}`,
      tourGuides: `/tour-guides/${item._id}`,
      products: `/products/${item._id}`,
    };
    return routeMap[category];
  };

  const getPriceLabel = (item, category) => {
    const priceMap = {
      hostels: `₹${item.pricePerNight}/night`,
      rentals: `₹${item.pricePerDay}/day`,
      tourGuides: `₹${item.chargesPerDay}/day`,
      products: `₹${item.price}`,
    };
    return priceMap[category];
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">🎯 Smart Recommendations</h2>
        <p className="text-gray-600">Discover everything available at your destination</p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center gap-4 flex-wrap mb-8">
        {categories.map((cat) => {
          const itemsForCat = recommendations[cat.key] || [];
          return (
            itemsForCat.length > 0 && (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeCategory === cat.key
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-600'
                }`}
              >
                {cat.label}
              </button>
            )
          );
        })}
      </div>

      {/* Carousel Container */}
      {currentItems.length > 0 ? (
        <div className="relative">
          {/* Scroll Buttons */}
          {currentItems.length > 3 && (
            <>
              <button
                onClick={() => scrollCarousel(activeCategory, 'left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-indigo-50 transition"
              >
                <ChevronLeft className="h-6 w-6 text-indigo-600" />
              </button>
              <button
                onClick={() => scrollCarousel(activeCategory, 'right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-indigo-50 transition"
              >
                <ChevronRight className="h-6 w-6 text-indigo-600" />
              </button>
            </>
          )}

          {/* Carousel */}
          <div
            id={`carousel-${activeCategory}`}
            className="flex overflow-x-auto gap-6 pb-4 scroll-smooth"
            style={{ scrollBehavior: 'smooth' }}
          >
            {currentItems.map((item) => (
              <div
                key={item._id}
                className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {item.image || item.images?.[0] ? (
                    <img
                      src={item.image || item.images?.[0]}
                      alt={item.name || item.modelName}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600">
                      📷 No Image
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow">
                    {renderStars(item.rating || 0)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {item.name || item.modelName}
                  </h3>

                  {/* Category/Type */}
                  <p className="text-sm text-gray-600 mb-3 capitalize">
                    {item.category || item.vehicleType || item.specialization || 'Service'}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Price */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-indigo-600">
                      {getPriceLabel(item, activeCategory)}
                    </span>
                  </div>

                  {/* Additional Info */}
                  <div className="mb-4 text-xs text-gray-600 space-y-1">
                    {activeCategory === 'hostels' && (
                      <>
                        <p>🏠 {item.availableRooms} rooms available</p>
                        {item.facilities && <p>✨ {item.facilities.slice(0, 2).join(', ')}</p>}
                      </>
                    )}
                    {activeCategory === 'rentals' && (
                      <p>⚡ {item.fuelType || 'Vehicle'}</p>
                    )}
                    {activeCategory === 'tourGuides' && (
                      <p>📚 {item.experienceYears} years experience</p>
                    )}
                    {activeCategory === 'products' && (
                      <p>📦 {item.stock} in stock</p>
                    )}
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={() => navigate(getServiceRoute(item, activeCategory))}
                    className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No recommendations available for this category</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationCarousel;
