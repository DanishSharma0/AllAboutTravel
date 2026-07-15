import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TripHubDashboard = ({ cityInfo, bookingDetails, recommendations, attractions }) => {
  const [liveWeather, setLiveWeather] = useState(null);
  const [budget, setBudget] = useState({ spent: 0, total: 5000, items: [] });
  const [tips, setTips] = useState([
    '🎒 Pack light for easy mobility',
    '💵 Carry small denominations for street vendors',
    '📱 Download offline maps',
    '🌡️ Check weather forecast daily',
    '🚕 Negotiate taxi fares beforehand',
  ]);

  useEffect(() => {
    if (cityInfo?.weather) {
      setLiveWeather(cityInfo.weather);
    }
  }, [cityInfo]);

  const hubSections = [
    {
      id: 'stay',
      icon: '🏨',
      title: 'My Stay',
      items: bookingDetails?.type === 'hostel' ? [bookingDetails] : [],
    },
    {
      id: 'rental',
      icon: '🚗',
      title: 'My Rental',
      items: bookingDetails?.type === 'rental' ? [bookingDetails] : [],
    },
    {
      id: 'guide',
      icon: '👨‍🏫',
      title: 'My Guide',
      items: bookingDetails?.type === 'tourGuide' ? [bookingDetails] : [],
    },
    {
      id: 'places',
      icon: '📍',
      title: 'Places to Visit',
      items: attractions?.slice(0, 5) || [],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">🗺️ Your Complete Trip Hub</h2>
        <p className="text-gray-600">All your {cityInfo?.name} trip information in one place</p>
      </div>

      {/* Top Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Current Weather */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg p-6 shadow-lg">
          <div className="text-3xl mb-2">🌤️</div>
          <h3 className="font-semibold mb-1">Weather</h3>
          <p className="text-2xl font-bold">{liveWeather?.temp || 'N/A'}°C</p>
          <p className="text-sm opacity-90 capitalize">{liveWeather?.description}</p>
        </div>

        {/* Trip Duration */}
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-lg p-6 shadow-lg">
          <div className="text-3xl mb-2">📅</div>
          <h3 className="font-semibold mb-1">Trip Duration</h3>
          <p className="text-2xl font-bold">3 Days</p>
          <p className="text-sm opacity-90">Planned Activities</p>
        </div>

        {/* Budget */}
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-lg p-6 shadow-lg">
          <div className="text-3xl mb-2">💰</div>
          <h3 className="font-semibold mb-1">Budget</h3>
          <p className="text-2xl font-bold">₹{budget.total}</p>
          <p className="text-sm opacity-90">Total Budget</p>
        </div>

        {/* Attractions */}
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-lg p-6 shadow-lg">
          <div className="text-3xl mb-2">🏛️</div>
          <h3 className="font-semibold mb-1">Attractions</h3>
          <p className="text-2xl font-bold">{attractions?.length || 0}</p>
          <p className="text-sm opacity-90">To Explore</p>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bookings Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">📋 My Bookings</h3>
          {bookingDetails ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{bookingDetails.serviceName}</h4>
                  <p className="text-sm text-gray-600 capitalize">{bookingDetails.type}</p>
                </div>
                <span className="text-3xl">{bookingDetails.type === 'hostel' ? '🏨' : bookingDetails.type === 'rental' ? '🚗' : '👨‍🏫'}</span>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                {bookingDetails.checkIn && <p>✓ Check-in: {bookingDetails.checkIn}</p>}
                {bookingDetails.amount && <p>✓ Amount: ₹{bookingDetails.amount}</p>}
                <p>✓ Status: Confirmed</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
              No active bookings
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">🔗 Quick Links</h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href={`https://www.google.com/maps/search/${cityInfo?.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center hover:shadow-lg transition cursor-pointer"
            >
              <div className="text-3xl mb-2">🗺️</div>
              <p className="font-semibold text-gray-800">Google Maps</p>
            </a>
            <button
              onClick={() => window.open(`tel:+91`)}
              className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg text-center hover:shadow-lg transition cursor-pointer"
            >
              <div className="text-3xl mb-2">🚨</div>
              <p className="font-semibold text-gray-800">Emergency</p>
            </button>
            <button
              className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center hover:shadow-lg transition cursor-pointer"
            >
              <div className="text-3xl mb-2">🍽️</div>
              <p className="font-semibold text-gray-800">Food Spots</p>
            </button>
            <button
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center hover:shadow-lg transition cursor-pointer"
            >
              <div className="text-3xl mb-2">🎉</div>
              <p className="font-semibold text-gray-800">Events</p>
            </button>
          </div>
        </div>
      </div>

      {/* Attractions List */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">🏛️ Places to Visit</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {attractions?.slice(0, 6).map((place) => (
            <div key={place._id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
              <div className="flex gap-4">
                {place.image ? (
                  <img src={place.image} alt={place.name} className="w-20 h-20 rounded object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded bg-gray-300 flex items-center justify-center text-2xl">
                    📍
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-1">{place.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{place.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <span className="text-yellow-400">⭐ {place.rating?.toFixed(1) || 4.5}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-l-4 border-orange-500">
        <h3 className="text-xl font-bold text-gray-800 mb-4">✈️ Travel Tips & Safety</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {tips.map((tip, index) => (
            <div key={index} className="flex gap-3">
              <span className="flex-shrink-0">👉</span>
              <p className="text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Tracker */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">💰 Budget Tracker</h3>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-700">Total Budget</span>
              <span className="font-bold text-lg">₹{budget.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${(budget.spent / budget.total) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Spent: ₹{budget.spent}</span>
              <span>Remaining: ₹{budget.total - budget.spent}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Local Information */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">ℹ️ Local Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-gray-700 mb-2">Languages Spoken</p>
            <p className="text-gray-600">{cityInfo?.languages?.join(', ') || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-2">Best Time to Visit</p>
            <p className="text-gray-600">{cityInfo?.bestTimeToVisit || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-2">Local Specialties</p>
            <p className="text-gray-600">{cityInfo?.localFood?.slice(0, 3).join(', ') || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-2">Festivals</p>
            <p className="text-gray-600">{cityInfo?.festivals?.slice(0, 2).join(', ') || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripHubDashboard;
