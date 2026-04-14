const express = require('express');
const router = express.Router();
const {
  getCities,
  getCityDetails,
  searchCities,
} = require('../controllers/cityController');

router.get('/', getCities);
router.get('/search', searchCities);
router.get('/:cityId', getCityDetails);

module.exports = router;
