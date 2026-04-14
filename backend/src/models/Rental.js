const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema(
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
    vehicleType: {
      type: String,
      enum: ['Bike', 'Scooty', 'Car'],
      required: true,
    },
    modelName: {
      type: String,
      required: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    availabilityStatus: {
      type: Boolean,
      default: true,
    },
    description: String,
    image: String,
    licensePlate: String,
    features: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rental', rentalSchema);
