const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  entityType: {
    type: String,
    enum: ['Hostel', 'Rental', 'TourGuide'],
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,

  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    required: true,
  }
}, { timestamps: true });


reviewSchema.index({ user: 1, entityType: 1, entityId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
