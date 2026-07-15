const TourGuide = require('../models/TourGuide');
const Hostel = require('../models/Hostel');
const Rental = require('../models/Rental');
const HostelBooking = require('../models/HostelBooking');
const RentalBooking = require('../models/RentalBooking');
const GuideBooking = require('../models/GuideBooking');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Product = require('../models/Product');
const Order = require('../models/Order');


const addListing = async (req, res) => {
  try {
    const { category, ...listingData } = req.body;
    const providerId = req.user._id;

    if (!category) {
      return res.status(400).json({ message: 'Category is required (hostel, rental, tour)' });
    }

    let savedListing;

    switch (category.toLowerCase()) {
      case 'hostel':
        const newHostel = new Hostel({ ...listingData, providerId });
        savedListing = await newHostel.save();
        break;
      case 'rental':
        const newRental = new Rental({ ...listingData, providerId });
        savedListing = await newRental.save();
        break;
      case 'tour':
        const newTour = new TourGuide({ ...listingData, providerId });
        savedListing = await newTour.save();
        break;
      case 'product':
        const newProduct = new Product({ ...listingData, providerId });
        savedListing = await newProduct.save();
        break;
      default:
        return res.status(400).json({ message: 'Invalid category' });
    }

    res.status(201).json({
      message: `${category} created successfully`,
      listing: savedListing,
    });
  } catch (error) {
    console.error('Add listing error:', error);
    res.status(500).json({ 
      message: 'Failed to create listing', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


const getMyListings = async (req, res) => {
  try {
    const providerId = req.user._id;


    const hostels = await Hostel.find({ providerId });
    const rentals = await Rental.find({ providerId });
    const tours = await TourGuide.find({ providerId });
    const products = await Product.find({ providerId });

    res.status(200).json({
      hostels,
      rentals,
      tours,
      products,
    });
  } catch (error) {
    console.error('Get provider listings error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch listings', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


const updatePaymentDetails = async (req, res) => {
  try {
    const { upiId, bankName, accountNumber, accountHolderName, ifscCode } = req.body;
    const providerId = req.user._id;

    const user = await User.findByIdAndUpdate(
      providerId,
      {
        $set: {
          paymentDetails: {
            upiId,
            bankName,
            accountNumber,
            accountHolderName,
            ifscCode,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      console.error('Update payment error: User not found for ID', providerId);
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Payment details updated successfully',
      paymentDetails: user.paymentDetails,
    });
  } catch (error) {
    console.error('Update payment details error:', error);
    res.status(500).json({
      message: 'Failed to update payment details',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


const getProviderBookings = async (req, res) => {
  try {
    const providerId = req.user._id;


    const [hostels, rentals, tours, products] = await Promise.all([
      Hostel.find({ providerId }).select('_id'),
      Rental.find({ providerId }).select('_id'),
      TourGuide.find({ providerId }).select('_id'),
      Product.find({ providerId }).select('_id'),
    ]);

    const hostelIds = hostels.map((h) => h._id);
    const rentalIds = rentals.map((r) => r._id);
    const tourIds = tours.map((t) => t._id);
    const productIds = products.map((p) => p._id);


    const [hostelBookings, rentalBookings, guideBookings, productOrders] = await Promise.all([
      HostelBooking.find({ hostelId: { $in: hostelIds } }).populate('userId', 'name email phone'),
      RentalBooking.find({ rentalId: { $in: rentalIds } }).populate('userId', 'name email phone'),
      GuideBooking.find({ guideId: { $in: tourIds } }).populate('userId', 'name email phone'),
      Order.find({ 'items.productId': { $in: productIds } }).populate('userId', 'name email phone').populate('items.productId', 'name'),
    ]);

    res.status(200).json({
      hostels: hostelBookings,
      rentals: rentalBookings,
      tours: guideBookings,
      orders: productOrders,
    });
  } catch (error) {
    console.error('Get provider bookings error:', error);
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const { bookingId, category, status } = req.body;

    let booking;
    switch (category.toLowerCase()) {
      case 'hostel':
        booking = await HostelBooking.findById(bookingId);
        break;
      case 'rental':
        booking = await RentalBooking.findById(bookingId);
        break;
      case 'tour':
        booking = await GuideBooking.findById(bookingId);
        break;
      case 'product':
      case 'order':
        booking = await Order.findById(bookingId);
        break;
      default:
        return res.status(400).json({ message: 'Invalid category' });
    }

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = status;
    if (status === 'Paid') {
      booking.status = 'Confirmed';
    }
    await booking.save();


    await Notification.create({
      recipient: booking.userId,
      message: `Your payment for your ${category} booking has been verified!`,
      type: 'PAYMENT_RECEIVED',
      relatedId: booking._id,
      onModel: category === 'hostel' ? 'HostelBooking' : category === 'rental' ? 'RentalBooking' : (category === 'product' || category === 'order') ? 'Order' : 'GuideBooking'
    });

    res.status(200).json({ message: `Payment status updated to ${status}`, booking });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Failed to verify payment', error: error.message });
  }
};

module.exports = {
  addListing,
  getMyListings,
  updatePaymentDetails,
  getProviderBookings,
  verifyPayment,
};
