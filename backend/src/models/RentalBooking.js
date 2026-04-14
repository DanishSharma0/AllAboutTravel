const mongoose = require('mongoose');

const rentalBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rentalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rental',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    dropLocation: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid', 'Refunded', 'Pending Verification'],
      default: 'Unpaid',
    },
    transactionId: { type: String },
    paymentMethod: { type: String, default: 'UPI' },
    paymentDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RentalBooking', rentalBookingSchema);
