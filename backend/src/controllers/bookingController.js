const GuideBooking = require('../models/GuideBooking');
const Notification = require('../models/Notification');
const Hostel = require('../models/Hostel');
const Rental = require('../models/Rental');
const TourGuide = require('../models/TourGuide');
const HostelBooking = require('../models/HostelBooking');
const RentalBooking = require('../models/RentalBooking');



const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;


    const [hostelBookings, rentalBookings, guideBookings] = await Promise.all([
      HostelBooking.find({ userId }).populate('hostelId', 'name image address cityId'),
      RentalBooking.find({ userId }).populate('rentalId', 'modelName vehicleType image cityId'),
      GuideBooking.find({ userId }).populate('guideId', 'name image experienceYears cityId'),
    ]);

    res.status(200).json({
      hostels: hostelBookings,
      rentals: rentalBookings,
      tours: guideBookings,
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};


const confirmPayment = async (req, res) => {
  try {
    const { bookingId, category, transactionId, paymentMethod } = req.body;
    const userId = req.user._id;

    let booking;
    let providerId;
    let listingName;

    switch (category.toLowerCase()) {
      case 'hostel':
        booking = await HostelBooking.findById(bookingId).populate('hostelId');
        if (booking) {
          providerId = booking.hostelId.providerId;
          listingName = booking.hostelId.name;
        }
        break;
      case 'rental':
        booking = await RentalBooking.findById(bookingId).populate('rentalId');
        if (booking) {
          providerId = booking.rentalId.providerId;
          listingName = booking.rentalId.modelName;
        }
        break;
      case 'tour':
        booking = await GuideBooking.findById(bookingId).populate('guideId');
        if (booking) {
          providerId = booking.guideId.providerId;
          listingName = booking.guideId.name;
        }
        break;
      default:
        return res.status(400).json({ message: 'Invalid category' });
    }

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.transactionId = transactionId;
    booking.paymentMethod = paymentMethod || 'UPI';
    booking.paymentStatus = 'Pending Verification';
    booking.paymentDate = new Date();
    await booking.save();


    await Notification.create({
      recipient: providerId,
      sender: userId,
      message: `A customer has paid for booking of ${listingName}. Transaction ID: ${transactionId}. Please verify it.`,
      type: 'PAYMENT_RECEIVED',
      relatedId: booking._id,
      onModel: category === 'hostel' ? 'HostelBooking' : category === 'rental' ? 'RentalBooking' : 'GuideBooking'
    });

    res.status(200).json({ message: 'Payment submitted for verification', booking });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Failed to submit payment', error: error.message });
  }
};

const payBooking = async (req, res) => {
  try {
    const { type, bookingId } = req.params;
    const userId = req.user._id;

    let booking;
    if (type === 'hostel') {
      booking = await HostelBooking.findOne({ _id: bookingId, userId });
    } else if (type === 'rental') {
      booking = await RentalBooking.findOne({ _id: bookingId, userId });
    } else if (type === 'tour') {
      booking = await GuideBooking.findOne({ _id: bookingId, userId });
    }

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = 'Paid';
    await booking.save();

    res.status(200).json({
      message: 'Payment successful',
      bookingId,
      paymentStatus: 'Paid',
    });
  } catch (error) {
    console.error('Pay booking error:', error);
    res.status(500).json({ message: 'Payment failed', error: error.message });
  }
};

module.exports = {
  getMyBookings,
  confirmPayment,
  payBooking,
};
