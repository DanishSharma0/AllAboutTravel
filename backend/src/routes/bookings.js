const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getMyBookings, confirmPayment, payBooking } = require('../controllers/bookingController');


router.use(authMiddleware);


router.get('/me', getMyBookings);


router.post('/pay/:type/:bookingId', payBooking);


router.post('/confirm-payment', confirmPayment);

module.exports = router;
