const RentalBooking = require('../models/RentalBooking');
const Rental = require('../models/Rental');

const User = require('../models/User');
const Notification = require('../models/Notification');
const City = require('../models/City');

// Get all rentals (with optional city search)
const getAllRentals = async (req, res) => {
  try {
    const { city } = req.query;
    let query = { availabilityStatus: true };
    if (city) {
      const cityDoc = await City.findOne({ name: { $regex: new RegExp(city, 'i') } });
      if (cityDoc) {
        query.cityId = cityDoc._id;
      } else {
        return res.json([]);
      }
    }
    const rentals = await Rental.find(query).populate('cityId', 'name state');
    res.json(rentals);
  } catch (error) {
    console.error('Get all rentals error:', error);
    res.status(500).json({ message: 'Failed to fetch rentals', error: error.message });
  }
};

// Get rentals by city
const getRentalsByCity = async (req, res) => {
  try {
    const { cityId } = req.params;

    const rentals = await Rental.find({
      cityId,
      availabilityStatus: true,
    }).populate('cityId', 'name state');

    res.json(rentals);
  } catch (error) {
    console.error('Get rentals error:', error);
    res.status(500).json({ message: 'Failed to fetch rentals', error: error.message });
  }
};

// Get rental details
const getRentalDetails = async (req, res) => {
  try {
    const { rentalId } = req.params;

    const rental = await Rental.findById(rentalId).populate('cityId', 'name state');

    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    res.json(rental);
  } catch (error) {
    console.error('Get rental details error:', error);
    res.status(500).json({ message: 'Failed to fetch rental details', error: error.message });
  }
};

// Book rental (protected)
const bookRental = async (req, res) => {
  try {
    const { rentalId, startDate, endDate, pickupLocation, dropLocation } = req.body;
    const userId = req.user.userId;

    if (!rentalId || !startDate || !endDate || !pickupLocation || !dropLocation) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get rental price
    const rental = await Rental.findById(rentalId);

    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    // Calculate total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = rental.pricePerDay * days;

    // Create booking
    const booking = new RentalBooking({
      userId,
      rentalId,
      startDate,
      endDate,
      pickupLocation,
      dropLocation,
      totalPrice,
      status: 'Pending',
    });

    await booking.save();

    // Fetch provider details for payment
    const provider = await User.findById(rental.providerId).select('paymentDetails businessDetails name');

    // Notify provider of new booking
    await Notification.create({
      recipient: rental.providerId,
      sender: userId,
      message: `You have a new rental booking for ${rental.modelName}!`,
      type: 'BOOKING_NEW',
      relatedId: booking._id,
      onModel: 'RentalBooking'
    });

    res.status(201).json({
      message: 'Rental booked successfully',
      booking: {
        id: booking._id,
        rentalId,
        totalPrice,
        status: 'Pending',
        providerDetails: {
          upiId: provider?.paymentDetails?.upiId,
          businessName: provider?.businessDetails?.businessName || provider?.name,
        }
      },
    });
  } catch (error) {
    console.error('Book rental error:', error);
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
};

module.exports = {
  getAllRentals,
  getRentalsByCity,
  getRentalDetails,
  bookRental,
};
