const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getMyBookings, confirmPayment, payBooking } = require('../controllers/bookingController');

// All booking routes require authentication
router.use(authMiddleware);

// GET /api/bookings/me -> Fetches all hostels, rentals, tours booked by this user
router.get('/me', getMyBookings);

// POST /api/bookings/pay/:type/:bookingId -> Updates payment status for a booking
router.post('/pay/:type/:bookingId', payBooking);

// POST /api/bookings/confirm-payment -> Customer submits payment details
router.post('/confirm-payment', confirmPayment);

module.exports = router;
