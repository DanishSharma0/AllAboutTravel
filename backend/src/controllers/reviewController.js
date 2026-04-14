const Review = require('../models/Review');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { entityType, entityId, rating, comment } = req.body;
    
    // Ensure rating is valid
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // Creating the review
    const review = new Review({
      user: req.user.id, // Assuming auth middleware sets req.user
      entityType,
      entityId,
      rating,
      comment
    });

    await review.save();
    
    // Populate the user reference before returning to send back name/avatar immediately
    await review.populate('user', 'firstName lastName avatarName');

    res.status(201).json({ message: 'Review successfully added.', review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this item.' });
    }
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error creating review.' });
  }
};

// Get reviews for a specific entity
exports.getReviewsByEntity = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    const reviews = await Review.find({ entityType, entityId })
      .populate('user', 'firstName lastName avatarName')
      .sort({ createdAt: -1 }); // Newest first
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error fetching reviews.' });
  }
};
