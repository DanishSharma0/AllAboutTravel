const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getAllHostels,
  getHostelsByCity,
  getHostelDetails,
  bookHostel,
} = require('../controllers/hostelController');

router.get('/', getAllHostels);
router.get('/city/:cityId', getHostelsByCity);
router.get('/:hostelId', getHostelDetails);
router.post('/book', authMiddleware, bookHostel);

module.exports = router;
