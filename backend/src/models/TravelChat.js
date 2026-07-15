const mongoose = require('mongoose');

const travelChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    conversation: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
          required: true,
        },
        content: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    sessionActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

travelChatSchema.index({ userId: 1, cityId: 1 });

module.exports = mongoose.model('TravelChat', travelChatSchema);
