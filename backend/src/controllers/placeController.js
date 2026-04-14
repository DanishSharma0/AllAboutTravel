const TouristPlace = require('../models/TouristPlace');
const mongoose = require('mongoose');
const City = require('../models/City');

// Get all places (with optional city search)
const getAllPlaces = async (req, res) => {
  try {
    const { city } = req.query;
    let query = {};
    if (city) {
      const cityDoc = await City.findOne({ name: { $regex: new RegExp(city, 'i') } });
      if (cityDoc) {
        query.cityId = cityDoc._id;
      } else {
        return res.json([]);
      }
    }
    const places = await TouristPlace.find(query).populate('cityId', 'name state');
    res.json(places);
  } catch (error) {
    console.error('Get all places error:', error);
    res.status(500).json({ message: 'Failed to fetch places', error: error.message });
  }
};

// Get places by city
const getPlacesByCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { category, limit = 20, offset = 0 } = req.query;

    let query = { cityId: mongoose.Types.ObjectId.isValid(cityId) ? cityId : null };

    if (category) {
      query.category = category;
    }

    const places = await TouristPlace.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .populate('cityId', 'name state');

    res.json(places);
  } catch (error) {
    console.error('Get places error:', error);
    res.status(500).json({ message: 'Failed to fetch places', error: error.message });
  }
};

// Get place details
const getPlaceDetails = async (req, res) => {
  try {
    const { placeId } = req.params;

    const place = await TouristPlace.findById(placeId)
      .populate('cityId', 'name state')
      .populate('reviews.userId', 'name avatar');

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json(place);
  } catch (error) {
    console.error('Get place details error:', error);
    res.status(500).json({ message: 'Failed to fetch place details', error: error.message });
  }
};

// Search places
const searchPlaces = async (req, res) => {
  try {
    const { q, cityId } = req.query;

    if (!q || q.length < 2) {
      return res.json([]);
    }

    let query = {
      name: { $regex: q, $options: 'i' },
    };

    if (cityId) {
      query.cityId = cityId;
    }

    const places = await TouristPlace.find(query)
      .limit(10)
      .select('name category rating image');

    res.json(places);
  } catch (error) {
    console.error('Search places error:', error);
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

// Get place categories
const getCategories = async (req, res) => {
  try {
    const categories = await TouristPlace.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

module.exports = {
  getAllPlaces,
  getPlacesByCity,
  getPlaceDetails,
  searchPlaces,
  getCategories,
};
