const mongoose = require('mongoose');

const hostelBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    roomType: {
      type: String,
      enum: ['Dorm', 'Private Single', 'Private Double', 'Suite'],
      required: true,
    },
    numberOfGuests: {
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

module.exports = mongoose.model('HostelBooking', hostelBookingSchema);
