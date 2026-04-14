const Review = require('../models/Review');


exports.createReview = async (req, res) => {
  try {
    const { entityType, entityId, rating, comment } = req.body;
    

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }


    const review = new Review({
      user: req.user.id,
      entityType,
      entityId,
      rating,
      comment
    });

    await review.save();
    

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


exports.getReviewsByEntity = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    const reviews = await Review.find({ entityType, entityId })
      .populate('user', 'firstName lastName avatarName')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error fetching reviews.' });
  }
};
