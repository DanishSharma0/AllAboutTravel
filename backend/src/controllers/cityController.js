const City = require('../models/City');

// Get all cities with search
const getCities = async (req, res) => {
  try {
    const { search, limit = 20, offset = 0 } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { state: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const cities = await City.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .select('name state image bestTimeToVisit rating');

    res.json(cities);
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ message: 'Failed to fetch cities', error: error.message });
  }
};

// Get city details
const getCityDetails = async (req, res) => {
  try {
    const { cityId } = req.params;

    const city = await City.findById(cityId);

    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    res.json(city);
  } catch (error) {
    console.error('Get city details error:', error);
    res.status(500).json({ message: 'Failed to fetch city details', error: error.message });
  }
};

// Search cities (autocomplete)
const searchCities = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json([]);
    }

    const cities = await City.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { state: { $regex: q, $options: 'i' } },
      ],
    })
      .limit(10)
      .select('name state');

    res.json(cities);
  } catch (error) {
    console.error('Search cities error:', error);
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

module.exports = {
  getCities,
  getCityDetails,
  searchCities,
};
