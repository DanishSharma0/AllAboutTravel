const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['BOOKING_NEW', 'PAYMENT_RECEIVED', 'BOOKING_CANCELLED', 'SYSTEM'],
      default: 'SYSTEM',
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    onModel: {
      type: String,
      enum: ['HostelBooking', 'RentalBooking', 'GuideBooking'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
