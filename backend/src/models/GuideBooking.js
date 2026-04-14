const mongoose = require('mongoose');

const guideBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    guideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TourGuide',
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      enum: ['Hourly', 'Daily', 'Multi-day'],
      required: true,
    },
    numberOfPeople: {
      type: Number,
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
    specialRequests: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('GuideBooking', guideBookingSchema);
