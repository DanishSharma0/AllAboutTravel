const express = require('express');
const router = express.Router();
const {
  getAllPlaces,
  getPlacesByCity,
  getPlaceDetails,
  searchPlaces,
  getCategories,
} = require('../controllers/placeController');

router.get('/', getAllPlaces);
router.get('/city/:cityId', getPlacesByCity);
router.get('/categories', getCategories);
router.get('/search', searchPlaces);
router.get('/:placeId', getPlaceDetails);

module.exports = router;
