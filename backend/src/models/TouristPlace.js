const mongoose = require('mongoose');

const touristPlaceSchema = new mongoose.Schema(
  {
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Nature', 'Temple', 'Fort', 'Market', 'Museum', 'Monument', 'Other'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    googlePlaceId: {
      type: String,
      default: null,
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    userRatingsTotal: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        comment: String,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    entryFee: {
      type: Number,
      default: 0,
    },
    timings: {
      open: String,
      close: String,
    },
    image: {
      type: String,
      default: null,
    },
    images: [String],
    photos: [String],
    bestTimeToVisit: String,
    wikiSummary: {
      type: String,
      default: null,
    },
    wikiUrl: {
      type: String,
      default: null,
    },
    googleMapsUrl: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      default: null,
    },
    popularityScore: {
      type: Number,
      default: 0,
    },
    wikiLastFetched: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TouristPlace', touristPlaceSchema);
