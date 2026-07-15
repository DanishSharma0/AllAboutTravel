const express = require('express');
const router = express.Router();
const {
  getAllPlaces,
  getPlacesByCity,
  getPlaceDetails,
  searchPlaces,
  getCategories,
} = require('../controllers/placeController');
const { getPopular, getNearby, getDetails } = require('../controllers/geoapifyController');

router.get('/', getAllPlaces);
router.get('/city/:cityId', getPlacesByCity);
router.get('/categories', getCategories);
router.get('/search', searchPlaces);

router.get('/popular/:city', getPopular);
router.get('/nearby', getNearby);
router.get('/details', getDetails);

router.get('/:placeId', getPlaceDetails);

module.exports = router;
