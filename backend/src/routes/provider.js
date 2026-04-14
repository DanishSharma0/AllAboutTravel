const express = require('express');
const router = express.Router();
const { authMiddleware, requireProvider } = require('../middleware/auth');
const { 
  addListing, 
  getMyListings, 
  updatePaymentDetails, 
  getProviderBookings, 
  verifyPayment 
} = require('../controllers/providerController');


router.use(authMiddleware, requireProvider);


router.get('/listings', getMyListings);


router.post('/listings', addListing);


router.get('/bookings', getProviderBookings);


router.post('/update-payment', updatePaymentDetails);


router.post('/verify-payment', verifyPayment);

module.exports = router;
