const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
      index: true,
    },
    serviceType: {
      type: String,
      enum: ['hostel', 'rental', 'tourGuide', 'product', 'attraction'],
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'serviceType',
      required: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      category: String,
      rating: Number,
      price: Number,
      popularity: Number,
    },
  },
  { timestamps: true }
);

// Compound index for efficient querying
recommendationSchema.index({ cityId: 1, serviceType: 1, isActive: 1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
