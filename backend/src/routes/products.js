const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getProductsByCity,
  getProductDetails,
  createOrder,
  getUserOrders,
} = require('../controllers/productController');

router.get('/city/:cityId', getProductsByCity);
router.get('/:productId', getProductDetails);
router.post('/order', authMiddleware, createOrder);
router.get('/user/orders', authMiddleware, getUserOrders);

module.exports = router;
