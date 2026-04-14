const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getAllRentals,
  getRentalsByCity,
  getRentalDetails,
  bookRental,
} = require('../controllers/rentalController');

router.get('/', getAllRentals);
router.get('/city/:cityId', getRentalsByCity);
router.get('/:rentalId', getRentalDetails);
router.post('/book', authMiddleware, bookRental);

module.exports = router;
