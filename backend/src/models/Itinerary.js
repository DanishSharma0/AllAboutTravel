const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema(
  {
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    duration: {
      type: Number,
      default: 3,
    },
    days: [
      {
        dayNumber: Number,
        title: String,
        activities: [
          {
            time: String,
            activity: String,
            description: String,
            placeId: mongoose.Schema.Types.ObjectId,
            duration: String,
          },
        ],
      },
    ],
    budget: {
      min: Number,
      max: Number,
    },
    difficultyLevel: {
      type: String,
      enum: ['Easy', 'Moderate', 'Challenging'],
      default: 'Moderate',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

itinerarySchema.index({ cityId: 1, isActive: 1 });

module.exports = mongoose.model('Itinerary', itinerarySchema);
