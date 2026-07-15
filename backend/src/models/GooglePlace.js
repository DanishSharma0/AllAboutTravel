const mongoose = require('mongoose');

const googlePlaceSchema = new mongoose.Schema(
  {
    googlePlaceId: { type: String, index: true, unique: true },
    name: String,
    latitude: Number,
    longitude: Number,
    rating: Number,
    userRatingsTotal: Number,
    photos: [String],
    openingHours: {},
    website: String,
    googleMapsUrl: String,
    popularityScore: Number,
    raw: {},
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    lastFetched: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GooglePlace', googlePlaceSchema);
