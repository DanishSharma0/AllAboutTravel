const geoapifyService = require('../services/geoapifyService');

const getPopular = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) return res.status(400).json({ message: 'City is required' });
    const places = await geoapifyService.searchPopularByCity(city, { limit: parseInt(req.query.limit, 10) || 12 });
    return res.json({ success: true, places });
  } catch (err) {
    console.error('Get popular Geoapify places error:', err?.message || err);
    return res.status(500).json({ message: 'Failed to fetch popular places', error: err?.message || 'Internal error' });
  }
};

const getNearby = async (req, res) => {
  try {
    const { lat, lng, radius, type, limit } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'lat and lng are required' });
    const places = await geoapifyService.nearbySearch({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      radius: parseInt(radius, 10) || 5000,
      type: type || 'tourist_attraction',
      limit: parseInt(limit, 10) || 20,
    });
    return res.json({ success: true, places });
  } catch (err) {
    console.error('Get nearby Geoapify places error:', err?.message || err);
    return res.status(500).json({ message: 'Failed to fetch nearby places', error: err?.message || 'Internal error' });
  }
};

const getDetails = async (req, res) => {
  try {
    const { placeId } = req.query;
    if (!placeId) return res.status(400).json({ message: 'placeId is required' });
    const details = await geoapifyService.getPlaceDetails(placeId);
    if (!details) return res.status(404).json({ message: 'Place not found' });
    return res.json({ success: true, details });
  } catch (err) {
    console.error('Get Geoapify place details error:', err?.message || err);
    return res.status(500).json({ message: 'Failed to fetch place details', error: err?.message || 'Internal error' });
  }
};

module.exports = {
  getPopular,
  getNearby,
  getDetails,
};
