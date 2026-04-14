const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { createReview, getReviewsByEntity } = require('../controllers/reviewController');


router.post('/', authMiddleware, createReview);


router.get('/:entityType/:entityId', getReviewsByEntity);

module.exports = router;
