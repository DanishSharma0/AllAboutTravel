const mongoose = require('mongoose');
const Hostel = require('../models/Hostel');
const Rental = require('../models/Rental');
const TourGuide = require('../models/TourGuide');
const Product = require('../models/Product');
const TouristPlace = require('../models/TouristPlace');
const Itinerary = require('../models/Itinerary');
const TravelChat = require('../models/TravelChat');
const City = require('../models/City');
const HostelBooking = require('../models/HostelBooking');
const RentalBooking = require('../models/RentalBooking');
const GuideBooking = require('../models/GuideBooking');
const axios = require('axios');
const { sendGeminiAssistantMessage } = require('./geminiService');
const { GoogleGenerativeAIError, GoogleGenerativeAIFetchError } = require('@google/generative-ai');

const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (requestFn, retries = 2, delay = 500) => {
  try {
    return await requestFn();
  } catch (err) {
    if (retries <= 0) throw err;
    await waitFor(delay);
    return fetchWithRetry(requestFn, retries - 1, delay * 2);
  }
};

const ensureEnvVar = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured. Please set it in the environment.`);
  }
  return value;
};

const fetchWikiSummary = async (title) => {
  const wikipediaBaseUrl = process.env.WIKIPEDIA_BASE_URL || 'https://en.wikipedia.org/api/rest_v1/page/summary';
  if (!title) {
    return {
      wikiSummary: 'No additional information available.',
      wikiUrl: null,
    };
  }

  const pageTitle = encodeURIComponent(title.replace(/\s+/g, '_'));
  const url = `${wikipediaBaseUrl}/${pageTitle}`;

  try {
    const response = await fetchWithRetry(() => axios.get(url, { headers: { Accept: 'application/json' } }), 2, 500);
    const data = response.data;
    return {
      wikiSummary: data.extract || 'No additional information available.',
      wikiUrl: data.content_urls?.desktop?.page || data.content_urls?.mobile?.page || null,
    };
  } catch (err) {
    if (err.response?.status === 404) {
      return {
        wikiSummary: 'No additional information available for this attraction.',
        wikiUrl: null,
      };
    }
    console.warn('Wikipedia fetch failed:', err.message);
    return {
      wikiSummary: 'No additional information available at the moment.',
      wikiUrl: null,
    };
  }
};

const rankItems = (items, category) => {
  return items
    .map((item) => {
      const rating = item.rating || 0;
      const popularity = item.popularity || 0;
      const createdAtScore = item.createdAt ? Math.max(0, 30 - Math.floor((Date.now() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24))) : 0;
      const price =
        category === 'hostels'
          ? item.pricePerNight
          : category === 'rentals'
          ? item.pricePerDay
          : category === 'tourGuides'
          ? item.chargesPerDay
          : item.price;
      const priceScore = price ? 100 / (price + 1) : 0;
      const experienceScore = category === 'tourGuides' ? (item.experienceYears || 0) * 2 : 0;
      const score = rating * 25 + popularity * 5 + createdAtScore + priceScore + experienceScore;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);
};

const buildPeopleAlsoBooked = async (cityId, excludeServiceId) => {
  const unique = new Set();
  const results = [];

  const addItemsFromBookings = async (BookingModel, populateField, categoryKey, itemNameField) => {
    const bookings = await BookingModel.find()
      .sort({ createdAt: -1 })
      .populate({ path: populateField, match: { cityId } })
      .limit(30)
      .lean();

    bookings.forEach((booking) => {
      const item = booking[populateField];
      if (!item || !item._id) return;
      if (excludeServiceId && item._id.toString() === excludeServiceId.toString()) return;
      const id = item._id.toString();
      if (unique.has(id)) return;
      unique.add(id);
      results.push({
        category: categoryKey,
        item,
        label: item[itemNameField] || item.name || 'Recommended Service',
      });
    });
  };

  await Promise.all([
    addItemsFromBookings(HostelBooking, 'hostelId', 'hostels', 'name'),
    addItemsFromBookings(RentalBooking, 'rentalId', 'rentals', 'modelName'),
    addItemsFromBookings(GuideBooking, 'guideId', 'tourGuides', 'name'),
  ]);

  if (results.length < 5) {
    const fallbackHostels = await Hostel.find({ cityId, _id: { $ne: excludeServiceId } })
      .select('name pricePerNight rating image description address facilities')
      .limit(5 - results.length)
      .sort({ rating: -1, createdAt: -1 })
      .lean();

    fallbackHostels.forEach((item) => {
      const id = item._id.toString();
      if (!unique.has(id)) {
        unique.add(id);
        results.push({ category: 'hostels', item, label: item.name });
      }
    });
  }

  return results.slice(0, 6);
};

/**
 * Get smart recommendations for a booked service
 * Priority: 1. Same City 2. Same Category 3. Highest Rated 4. Lowest Price 5. Most Popular 6. Recently Added
 */
const getSmartRecommendations = async (req, res) => {
  try {
    const { cityId, bookingCategory, excludeServiceId } = req.query;

    if (!cityId) {
      return res.status(400).json({ message: 'City ID is required' });
    }

    const normalizeCategory = (category) => {
      if (!category) return null;
      if (category === 'tour') return 'tourGuides';
      if (category === 'hostel') return 'hostels';
      if (category === 'rental') return 'rentals';
      if (category === 'product') return 'products';
      return category;
    };

    const normalizedCategory = normalizeCategory(bookingCategory);
    const parsedExcludeId = excludeServiceId && mongoose.Types.ObjectId.isValid(excludeServiceId) ? excludeServiceId : null;
    const sameCityQuery = { cityId };
    const excludeQuery = parsedExcludeId ? { _id: { $ne: parsedExcludeId } } : {};

    const [hostels, rentals, tourGuides, products] = await Promise.all([
      normalizedCategory !== 'hostels'
        ? Hostel.find({ ...sameCityQuery, ...excludeQuery })
            .select('name pricePerNight rating popularity image description address facilities createdAt')
            .limit(12)
            .lean()
        : [],
      normalizedCategory !== 'rentals'
        ? Rental.find({ ...sameCityQuery, availabilityStatus: true, ...excludeQuery })
            .select('modelName vehicleType pricePerDay rating popularity image description fuelType features createdAt')
            .limit(12)
            .lean()
        : [],
      normalizedCategory !== 'tourGuides'
        ? TourGuide.find({ ...sameCityQuery, verified: true, ...excludeQuery })
            .select('name experienceYears chargesPerDay rating popularity image specializations languagesSpoken createdAt')
            .limit(12)
            .lean()
        : [],
      normalizedCategory !== 'products'
        ? Product.find({ ...sameCityQuery, stock: { $gt: 0 }, ...excludeQuery })
            .select('name category price rating popularity image description stock createdAt')
            .limit(12)
            .lean()
        : [],
    ]);

    const rankedHostels = rankItems(hostels, 'hostels');
    const rankedRentals = rankItems(rentals, 'rentals');
    const rankedGuides = rankItems(tourGuides, 'tourGuides');
    const rankedProducts = rankItems(products, 'products');

    const recommendations = {
      hostels: rankedHostels,
      rentals: rankedRentals,
      tourGuides: rankedGuides,
      products: rankedProducts,
    };

    const peopleAlsoBooked = await buildPeopleAlsoBooked(cityId, parsedExcludeId);

    res.status(200).json({
      success: true,
      recommendations,
      peopleAlsoBooked,
      totalCount: rankedHostels.length + rankedRentals.length + rankedGuides.length + rankedProducts.length,
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Failed to fetch recommendations', error: error.message });
  }
};

/**
 * Get comprehensive city information
 */
const getCityInformation = async (req, res) => {
  try {
    const { cityId } = req.params;

    if (!cityId) {
      return res.status(400).json({ message: 'City ID is required' });
    }

    const city = await City.findById(cityId);

    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    // Fetch weather information if configured
    let weather = null;
    if (process.env.OPENWEATHER_API_KEY) {
      try {
        const weatherResponse = await fetchWithRetry(() =>
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${city.latitude}&lon=${city.longitude}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
          )
        );
        weather = {
          temp: weatherResponse.data.main.temp,
          feels_like: weatherResponse.data.main.feels_like,
          humidity: weatherResponse.data.main.humidity,
          description: weatherResponse.data.weather[0].description,
          icon: weatherResponse.data.weather[0].icon,
        };
      } catch (err) {
        console.warn('Weather API error:', err.message);
      }
    } else {
      console.warn('OPENWEATHER_API_KEY is not configured. Skipping weather lookup.');
    }

    const cityInfo = {
      _id: city._id,
      name: city.name,
      state: city.state,
      latitude: city.latitude,
      longitude: city.longitude,
      description: city.description,
      history: city.history,
      culture: city.culture,
      festivals: city.festivals,
      localFood: city.localFood,
      languages: city.languages,
      bestTimeToVisit: city.bestTimeToVisit,
      weather,
    };

    res.status(200).json({ success: true, city: cityInfo });
  } catch (error) {
    console.error('Get city information error:', error);
    res.status(500).json({ message: 'Failed to fetch city information', error: error.message });
  }
};

/**
 * Get tourist attractions in a city
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
}

const getTouristAttractions = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { limit = 12, bookedLatitude, bookedLongitude } = req.query;

    if (!cityId) {
      return res.status(400).json({ message: 'City ID is required' });
    }

    const city = await City.findById(cityId);

    const attractions = await TouristPlace.find({ cityId })
      .select('name category description image latitude longitude rating openingHours entryFee famousFor history bestTimeToVisit wikiSummary wikiUrl wikiLastFetched')
      .limit(parseInt(limit))
      .lean();

    const enhancedAttractions = await Promise.all(
      attractions.map(async (attraction) => {
        const distance = bookedLatitude && bookedLongitude
          ? calculateDistance(parseFloat(bookedLatitude), parseFloat(bookedLongitude), attraction.latitude, attraction.longitude)
          : null;

        let wikiSummary = attraction.wikiSummary;
        let wikiUrl = attraction.wikiUrl;
        const shouldFetchWiki = !wikiSummary || !wikiUrl || !attraction.wikiLastFetched || new Date() - new Date(attraction.wikiLastFetched) > 1000 * 60 * 60 * 24 * 30;

        if (shouldFetchWiki) {
          const wiki = await fetchWikiSummary(attraction.name);
          wikiSummary = attraction.description || wiki.wikiSummary;
          wikiUrl = wiki.wikiUrl;

          await TouristPlace.findByIdAndUpdate(attraction._id, {
            wikiSummary,
            wikiUrl,
            wikiLastFetched: new Date(),
          });
        }

        return {
          ...attraction,
          distance: distance ? `${distance} km` : null,
          wikiSummary: wikiSummary || attraction.description || 'No additional information available.',
          wikiUrl,
        };
      })
    );

    const merged = [...enhancedAttractions];
    const seen = new Set(merged.map((a) => `${a.name}-${a.latitude}-${a.longitude}`));

    res.status(200).json({
      success: true,
      attractions: merged,
      count: merged.length,
    });
  } catch (error) {
    console.error('Get attractions error:', error);
    res.status(500).json({ message: 'Failed to fetch attractions', error: error.message });
  }
};

/**
 * Get suggested itinerary for a city
 */
const getSuggestedItinerary = async (req, res) => {
  try {
    const { cityId, days = 3 } = req.query;

    if (!cityId) {
      return res.status(400).json({ message: 'City ID is required' });
    }

    let itinerary = await Itinerary.findOne({
      cityId,
      duration: parseInt(days),
    });

    // If no itinerary found for exact duration, return the default 3-day itinerary
    if (!itinerary) {
      itinerary = await Itinerary.findOne({
        cityId,
        duration: 3,
      });
    }

    if (!itinerary) {
      return res.status(404).json({ message: 'No itinerary available for this city' });
    }

    res.status(200).json({
      success: true,
      itinerary,
    });
  } catch (error) {
    console.error('Get itinerary error:', error);
    res.status(500).json({ message: 'Failed to fetch itinerary', error: error.message });
  }
};

/**
 * Send message to AI Travel Assistant
 */
const chatWithTravelAssistant = async (req, res) => {
  try {
    const { cityId, message } = req.body;
    const userId = req.user._id;

    if (!cityId || !message) {
      return res.status(400).json({ message: 'City ID and message are required' });
    }

    // Get city information for context
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    // Create or get existing chat session
    let chat = await TravelChat.findOne({
      userId,
      cityId,
      sessionActive: true,
    });

    if (!chat) {
      chat = new TravelChat({
        userId,
        cityId,
        conversation: [],
      });
    }

    // Add user message to conversation
    chat.conversation.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Call Gemini SDK for response
    try {
      const model = process.env.AI_MODEL?.trim() || 'gemini-2.5-flash';
      const result = await sendGeminiAssistantMessage({
        model,
        city,
        conversation: chat.conversation,
        message,
      });

      chat.conversation.push({
        role: 'assistant',
        content: result.assistantText,
        timestamp: new Date(),
      });

      await chat.save();

      return res.status(200).json({
        success: true,
        response: result.assistantText,
        chatId: chat._id,
      });
    } catch (aiError) {
      console.error('Gemini SDK error:', aiError instanceof Error ? aiError.message : aiError);
      console.error('Gemini SDK error details:', {
        name: aiError?.name,
        message: aiError?.message,
        response: aiError?.response ? {
          status: aiError.response.status,
          statusText: aiError.response.statusText,
          data: aiError.response.data,
        } : null,
      });
      if (aiError instanceof GoogleGenerativeAIFetchError) {
        return res.status(502).json({ message: 'AI service temporarily unavailable', error: aiError.message });
      }
      if (aiError instanceof GoogleGenerativeAIError) {
        return res.status(500).json({ message: 'AI request error', error: aiError.message });
      }
      return res.status(500).json({ message: 'Failed to process AI request', error: aiError.message || aiError });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Failed to process chat', error: error.message });
  }
};

/**
 * Get chat history
 */
const getChatHistory = async (req, res) => {
  try {
    const { cityId } = req.params;
    const userId = req.user._id;

    if (!cityId) {
      return res.status(400).json({ message: 'City ID is required' });
    }

    const chat = await TravelChat.findOne({
      userId,
      cityId,
      sessionActive: true,
    });

    if (!chat) {
      return res.status(200).json({
        success: true,
        conversation: [],
        chatId: null,
      });
    }

    res.status(200).json({
      success: true,
      conversation: chat.conversation,
      chatId: chat._id,
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ message: 'Failed to fetch chat history', error: error.message });
  }
};

module.exports = {
  getSmartRecommendations,
  getCityInformation,
  getTouristAttractions,
  getSuggestedItinerary,
  chatWithTravelAssistant,
  getChatHistory,
  calculateDistance,
};
