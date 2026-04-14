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

// All provider routes must be authenticated and restricted to PROVIDER role
router.use(authMiddleware, requireProvider);

// GET /api/provider/listings -> Fetches all hostels, rentals, tours owned by this provider
router.get('/listings', getMyListings);

// POST /api/provider/listings -> Creates a new hostel, rental, or tour
router.post('/listings', addListing);

// GET /api/provider/bookings -> Fetches all bookings for this provider's listings
router.get('/bookings', getProviderBookings);

// POST /api/provider/update-payment -> Updates payment details (UPI, Bank)
router.post('/update-payment', updatePaymentDetails);

// POST /api/provider/verify-payment -> Confirms or rejects a payment
router.post('/verify-payment', verifyPayment);

module.exports = router;
