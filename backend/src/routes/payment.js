const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

// All payment routes are protected
router.use(authMiddleware);

// POST /api/payment/create-order -> Create Razorpay order
router.post('/create-order', createOrder);

// POST /api/payment/verify -> Verify Razorpay signature
router.post('/verify', verifyPayment);

module.exports = router;
