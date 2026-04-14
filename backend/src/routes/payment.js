const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { createOrder, verifyPayment } = require('../controllers/paymentController');


router.use(authMiddleware);


router.post('/create-order', createOrder);


router.post('/verify', verifyPayment);

module.exports = router;
