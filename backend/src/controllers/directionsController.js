const axios = require('axios');
const TouristPlace = require('../models/TouristPlace');

// Get directions between two coordinates (returns GeoJSON geometry)
const getDirections = async (req, res) => {
  try {
    const { startLng, startLat, endLng, endLat } = req.query;

    if (!startLng || !startLat || !endLng || !endLat) {
      return res.status(400).json({ message: 'Start and end coordinates are required' });
    }

    const coordinates = [
      [parseFloat(startLng), parseFloat(startLat)],
      [parseFloat(endLng), parseFloat(endLat)],
    ];

    const orsApiKey = process.env.ORS_API_KEY;

    // Request GeoJSON geometry from OpenRouteService
    const response = await axios.post(
      'https://api.openrouteservice.org/v2/directions/driving-car',
      {
        coordinates,
        options: {
          geometry_format: 'geojson'
        }
      },
      {
        headers: {
          Authorization: orsApiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    const route = response.data.routes[0];

    res.json({
      distance: route.summary?.distance || 0,
      duration: route.summary?.duration || 0,
      geometry: route.geometry, // GeoJSON LineString
      bbox: route.bbox,
    });
  } catch (error) {
    console.error('Directions error:', error?.response?.data || error.message);

    if (error.response?.status === 403) {
      return res.status(403).json({
        message: 'OpenRouteService API key is invalid or quota exceeded',
        note: 'Please update the ORS_API_KEY in .env file',
      });
    }

    res.status(500).json({ message: 'Failed to fetch directions', error: error.message });
  }
};

// Get nearby attractions
const getNearbyAttractions = async (req, res) => {
  try {
    const { cityId, latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Find all places in city
    const places = await TouristPlace.find({ cityId }).lean();

    // Calculate distance for each place (Haversine formula)
    const placesWithDistance = places
      .map((place) => {
        const R = 6371; // Earth's radius in km
        const dLat = (parseFloat(latitude) - place.latitude) * (Math.PI / 180);
        const dLng = (parseFloat(longitude) - place.longitude) * (Math.PI / 180);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((parseFloat(latitude) * Math.PI) / 180) *
            Math.cos((place.latitude * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return { ...place, distance };
      })
      .filter((place) => place.distance < parseFloat(radius))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20);

    res.json(placesWithDistance);
  } catch (error) {
    console.error('Nearby attractions error:', error);
    res.status(500).json({ message: 'Failed to fetch nearby attractions', error: error.message });
  }
};

module.exports = {
  getDirections,
  getNearbyAttractions,
};
