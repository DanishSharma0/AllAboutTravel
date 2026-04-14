const mongoose = require('mongoose');

const tourGuideSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    languages: [String],
    experienceYears: {
      type: Number,
      required: true,
    },
    chargesPerDay: {
      type: Number,
      required: true,
    },
    chargesPerHour: {
      type: Number,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    description: String,
    image: String,
    specializations: [String],
    availabilityDates: [
      {
        date: Date,
        available: Boolean,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('TourGuide', tourGuideSchema);
