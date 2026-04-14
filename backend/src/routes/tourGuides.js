const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getAllGuides,
  getGuidesByCity,
  getGuideDetails,
  bookGuide,
} = require('../controllers/tourGuideController');

router.get('/', getAllGuides);
router.get('/city/:cityId', getGuidesByCity);
router.get('/:guideId', getGuideDetails);
router.post('/book', authMiddleware, bookGuide);

module.exports = router;
