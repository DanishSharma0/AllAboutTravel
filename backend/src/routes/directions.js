const express = require('express');
const router = express.Router();
const {
  getDirections,
  getNearbyAttractions,
} = require('../controllers/directionsController');

router.get('/route', getDirections);
router.get('/nearby', getNearbyAttractions);

module.exports = router;
