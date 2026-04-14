const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { createReview, getReviewsByEntity } = require('../controllers/reviewController');

// POST /api/reviews - Add a new review (Requires Auth)
router.post('/', authMiddleware, createReview);

// GET /api/reviews/:entityType/:entityId - Get all reviews for a listing (Public)
router.get('/:entityType/:entityId', getReviewsByEntity);

module.exports = router;
