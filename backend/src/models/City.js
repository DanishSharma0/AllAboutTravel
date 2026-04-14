const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    state: {
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
    description: {
      type: String,
      required: true,
    },
    history: {
      type: String,
      required: true,
    },
    culture: {
      type: String,
      required: true,
    },
    festivals: [String],
    localFood: [String],
    languages: [String],
    bestTimeToVisit: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    popularity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('City', citySchema);
