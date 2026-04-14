const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema(
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
    address: {
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
    pricePerNight: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    facilities: [String],
    description: String,
    image: String,
    roomTypes: [
      {
        type: String,
        enum: ['Dorm', 'Private Single', 'Private Double', 'Suite'],
      },
    ],
    availableRooms: {
      type: Number,
      required: true,
    },
    checkinTime: String,
    checkoutTime: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hostel', hostelSchema);
