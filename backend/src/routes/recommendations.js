const express = require('express');
const router = express.Router();
const {
  getSmartRecommendations,
  getCityInformation,
  getTouristAttractions,
  getSuggestedItinerary,
  chatWithTravelAssistant,
  getChatHistory,
} = require('../controllers/recommendationController');
const { authMiddleware } = require('../middleware/auth');

/**
 * Get smart recommendations for a booked service
 * Query params: cityId, bookingCategory
 */
router.get('/smart-recommendations', getSmartRecommendations);

/**
 * Get comprehensive city information
 * Params: cityId
 */
router.get('/city-info/:cityId', getCityInformation);

/**
 * Get tourist attractions in a city
 * Params: cityId
 * Query params: limit
 */
router.get('/attractions/:cityId', getTouristAttractions);

/**
 * Get suggested itinerary for a city
 * Query params: cityId, days
 */
router.get('/itinerary', getSuggestedItinerary);

/**
 * Chat with AI Travel Assistant
 * Protected route - requires authentication
 */
router.post('/chat', authMiddleware, chatWithTravelAssistant);

/**
 * Get chat history for a city
 * Protected route - requires authentication
 * Params: cityId
 */
router.get('/chat-history/:cityId', authMiddleware, getChatHistory);

module.exports = router;
