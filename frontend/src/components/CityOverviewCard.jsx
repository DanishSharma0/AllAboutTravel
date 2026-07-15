import React from 'react';

const CityOverviewCard = ({ city, bookingDetails }) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 h-64 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold mb-2">Welcome to {city.name}</h2>
            <p className="text-xl text-indigo-100">{city.state}, India</p>
          </div>
        </div>
      </div>

      {/* City Info Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">About {city.name}</h3>
            <p className="text-gray-700 leading-relaxed">{city.description}</p>
          </div>

          {/* History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">📚 History</h3>
            <p className="text-gray-700 leading-relaxed">{city.history}</p>
          </div>

          {/* Culture */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">🎭 Culture</h3>
            <p className="text-gray-700 leading-relaxed">{city.culture}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Weather */}
            {city.weather && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-4">
                <div className="text-2xl mb-2">🌤️</div>
                <p className="text-sm text-gray-600 font-semibold">Current Weather</p>
                <p className="text-xl font-bold text-gray-800">{city.weather.temp}°C</p>
                <p className="text-sm text-gray-700 capitalize">{city.weather.description}</p>
              </div>
            )}

            {/* Best Time to Visit */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-4">
              <div className="text-2xl mb-2">📅</div>
              <p className="text-sm text-gray-600 font-semibold">Best Time</p>
              <p className="text-sm font-bold text-gray-800">{city.bestTimeToVisit}</p>
            </div>

            {/* Languages */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-4">
              <div className="text-2xl mb-2">🗣️</div>
              <p className="text-sm text-gray-600 font-semibold">Languages</p>
              <p className="text-sm font-bold text-gray-800">{city.languages?.join(', ') || 'N/A'}</p>
            </div>

            {/* Coordinates */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-4">
              <div className="text-2xl mb-2">📍</div>
              <p className="text-sm text-gray-600 font-semibold">Location</p>
              <p className="text-xs font-mono text-gray-800">{city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}</p>
            </div>
          </div>

          {/* Local Food */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">🍽️ Local Food</h3>
            <div className="flex flex-wrap gap-2">
              {city.localFood?.map((food, index) => (
                <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  {food}
                </span>
              ))}
            </div>
          </div>

          {/* Festivals */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">🎉 Festivals</h3>
            <div className="flex flex-wrap gap-2">
              {city.festivals?.map((festival, index) => (
                <span key={index} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                  {festival}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      {bookingDetails && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow p-6 border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4">✅ Your Booking</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Booking Type</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">{bookingDetails.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Service Name</p>
              <p className="text-lg font-semibold text-gray-800">{bookingDetails.serviceName}</p>
            </div>
            {bookingDetails.checkIn && (
              <div>
                <p className="text-sm text-gray-600">Check-in Date</p>
                <p className="text-lg font-semibold text-gray-800">{bookingDetails.checkIn}</p>
              </div>
            )}
            {bookingDetails.amount && (
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-lg font-semibold text-green-600">₹{bookingDetails.amount}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CityOverviewCard;
