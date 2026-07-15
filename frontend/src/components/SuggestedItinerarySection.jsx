import React, { useState } from 'react';

const SuggestedItinerarySection = ({ itinerary, cityName }) => {
  const [expandedDay, setExpandedDay] = useState(0);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">📅 Suggested Travel Itinerary</h2>
        <p className="text-gray-600">
          {itinerary.duration}-Day {itinerary.difficultyLevel} trip to {cityName}
        </p>
      </div>

      {/* Budget Info */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-l-4 border-green-500">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Trip Duration</p>
            <p className="text-2xl font-bold text-gray-800">{itinerary.duration} Days</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Difficulty Level</p>
            <p className="text-2xl font-bold text-gray-800">{itinerary.difficultyLevel}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Budget Range</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{itinerary.budget?.min || 0} - ₹{itinerary.budget?.max || 'Variable'}
            </p>
          </div>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="space-y-4">
        {itinerary.days?.map((day, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Day Header */}
            <button
              onClick={() => setExpandedDay(expandedDay === index ? -1 : index)}
              className="w-full flex items-center justify-between p-6 hover:bg-indigo-50 transition"
            >
              <div className="flex items-center gap-4 text-left flex-1">
                <div className="bg-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl">
                  Day {day.dayNumber}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{day.title}</h3>
                  <p className="text-sm text-gray-600">{day.activities?.length || 0} activities planned</p>
                </div>
              </div>
              <span className={`text-2xl transition-transform ${expandedDay === index ? 'rotate-180' : ''}`}>
                ⬇️
              </span>
            </button>

            {/* Day Activities */}
            {expandedDay === index && (
              <div className="px-6 pb-6 border-t">
                <div className="space-y-4 pt-4">
                  {day.activities?.map((activity, actIndex) => (
                    <div key={actIndex} className="flex gap-4">
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600 text-sm">
                          {actIndex + 1}
                        </div>
                        {actIndex < day.activities.length - 1 && (
                          <div className="w-1 h-16 bg-indigo-200 my-2"></div>
                        )}
                      </div>

                      {/* Activity Details */}
                      <div className="flex-1 pb-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-gray-800">{activity.activity}</h4>
                            {activity.time && (
                              <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
                                🕐 {activity.time}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-2">{activity.description}</p>
                          {activity.duration && (
                            <p className="text-sm text-gray-600">⏱️ Duration: {activity.duration}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Travel Tips</h3>
        <ul className="space-y-2 text-blue-800">
          <li>✓ Book your accommodations and transport in advance for better rates</li>
          <li>✓ Check weather conditions before packing</li>
          <li>✓ Try local food at small restaurants for authentic experience</li>
          <li>✓ Carry a map or use offline maps on your phone</li>
          <li>✓ Keep emergency contacts handy</li>
        </ul>
      </div>

      {/* Print/Share Button */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => window.print()}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
        >
          🖨️ Print Itinerary
        </button>
        <button
          onClick={() => {
            const text = `${itinerary.duration}-Day Trip to ${cityName}\n\n${itinerary.days
              ?.map((d) => `${d.title}\n${d.activities?.map((a) => `- ${a.activity}`).join('\n')}`)
              .join('\n\n')}`;
            navigator.share
              ? navigator.share({ title: 'My Trip Itinerary', text })
              : alert('Copy the itinerary manually');
          }}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
        >
          📤 Share Itinerary
        </button>
      </div>
    </div>
  );
};

export default SuggestedItinerarySection;
