import React, { useState } from 'react';

const TouristAttractionsSection = ({ attractions, cityName }) => {
  const [expandedId, setExpandedId] = useState(null);

  const getCategoryIcon = (category) => {
    const iconMap = {
      Nature: '🏞️',
      Temple: '🛕',
      Fort: '🏯',
      Market: '🏪',
      Museum: '🎨',
      Monument: '🗿',
      Other: '📍',
    };
    return iconMap[category] || '📍';
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">🏛️ Explore Nearby Tourist Attractions</h2>
        <p className="text-gray-600">Discover the cultural and natural landmarks of {cityName}</p>
      </div>

      {/* Attractions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attractions.map((attraction) => (
          <div
            key={attraction._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer"
            onClick={() => setExpandedId(expandedId === attraction._id ? null : attraction._id)}
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-200 overflow-hidden">
              {attraction.image ? (
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-300 to-indigo-400 flex items-center justify-center text-white text-4xl">
                  {getCategoryIcon(attraction.category)}
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow">
                <span className="text-yellow-400">⭐ {attraction.rating?.toFixed(1) || 4.5}</span>
              </div>
              <div className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {getCategoryIcon(attraction.category)} {attraction.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between gap-4 mb-3">
                <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{attraction.name}</h3>
                {attraction.distance && (
                  <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-[0.18em]">
                    {attraction.distance}
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-4">
                {attraction.wikiSummary ? (
                  <div className="text-sm">
                    <p className="font-semibold text-gray-700 mb-1">ℹ️ About this place</p>
                    <p className="text-gray-600 line-clamp-2">{attraction.wikiSummary}</p>
                  </div>
                ) : attraction.history ? (
                  <div className="text-sm">
                    <p className="font-semibold text-gray-700 mb-1">📜 History</p>
                    <p className="text-gray-600 line-clamp-2">{attraction.history}</p>
                  </div>
                ) : null}

                {attraction.famousFor && (
                  <div className="text-sm">
                    <p className="font-semibold text-gray-700 mb-1">⭐ Famous For</p>
                    <p className="text-gray-600">{attraction.famousFor}</p>
                  </div>
                )}
              </div>

              {/* Expandable Details */}
              {expandedId === attraction._id && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  {attraction.bestTimeToVisit && (
                    <div className="text-sm">
                      <p className="font-semibold text-gray-700">📅 Best Time to Visit</p>
                      <p className="text-gray-600">{attraction.bestTimeToVisit}</p>
                    </div>
                  )}

                  {attraction.openingHours && (
                    <div className="text-sm">
                      <p className="font-semibold text-gray-700">🕐 Opening Hours</p>
                      <p className="text-gray-600">{attraction.openingHours}</p>
                    </div>
                  )}

                  {attraction.entryFee && (
                    <div className="text-sm">
                      <p className="font-semibold text-gray-700">🎟️ Entry Fee</p>
                      <p className="text-gray-600">{attraction.entryFee}</p>
                    </div>
                  )}

                  {attraction.latitude && attraction.longitude && (
                    <a
                      href={`https://www.google.com/maps/search/${attraction.latitude},${attraction.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded font-semibold text-sm hover:bg-indigo-200 transition"
                    >
                      📍 View on Google Maps
                    </a>
                  )}
                  {attraction.wikiUrl && (
                    <a
                      href={attraction.wikiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-indigo-600 text-sm font-semibold hover:text-indigo-800 transition"
                    >
                      Read more on Wikipedia
                    </a>
                  )}
                </div>
              )}

              {/* Click to expand hint */}
              {expandedId !== attraction._id && (
                <p className="text-xs text-gray-500 text-center mt-3 italic">Click to see more details</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {attractions.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No attractions found for this city</p>
        </div>
      )}
    </div>
  );
};

export default TouristAttractionsSection;
