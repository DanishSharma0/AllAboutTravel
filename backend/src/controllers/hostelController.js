const HostelBooking = require('../models/HostelBooking');
const Hostel = require('../models/Hostel');
const City = require('../models/City');
const User = require('../models/User');
const Notification = require('../models/Notification');


const getAllHostels = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, minRating, roomType, facilities, sortBy } = req.query;
    let query = {};

    // City filter
    if (city) {
      const cityDoc = await City.findOne({ name: { $regex: new RegExp(city, 'i') } });
      if (cityDoc) {
        query.cityId = cityDoc._id;
      } else {
        return res.json([]);
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    // Minimum rating filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Room type filter
    if (roomType) {
      query.roomTypes = { $in: [roomType] };
    }

    // Facilities filter (comma-separated e.g. "WiFi,Parking")
    if (facilities) {
      const facilityList = facilities.split(',').map(f => f.trim());
      query.facilities = { $all: facilityList };
    }

    // Sort
    let sortOption = {};
    if (sortBy === 'price_asc') sortOption.pricePerNight = 1;
    else if (sortBy === 'price_desc') sortOption.pricePerNight = -1;
    else if (sortBy === 'rating') sortOption.rating = -1;
    else sortOption.createdAt = -1;

    const hostels = await Hostel.find(query).sort(sortOption).populate('cityId', 'name state');
    res.json(hostels);
  } catch (error) {
    console.error('Get all hostels error:', error);
    res.status(500).json({ message: 'Failed to fetch hostels', error: error.message });
  }
};



const getHostelsByCity = async (req, res) => {
  try {
    const { cityId } = req.params;

    const hostels = await Hostel.find({ cityId }).populate('cityId', 'name state');

    res.json(hostels);
  } catch (error) {
    console.error('Get hostels error:', error);
    res.status(500).json({ message: 'Failed to fetch hostels', error: error.message });
  }
};


const getHostelDetails = async (req, res) => {
  try {
    const { hostelId } = req.params;

    const hostel = await Hostel.findById(hostelId).populate('cityId', 'name state');

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    res.json(hostel);
  } catch (error) {
    console.error('Get hostel details error:', error);
    res.status(500).json({ message: 'Failed to fetch hostel details', error: error.message });
  }
};


const bookHostel = async (req, res) => {
  try {
    const { hostelId, checkIn, checkOut, roomType, numberOfGuests } = req.body;
    const userId = req.user._id;

    if (!hostelId || !checkIn || !checkOut || !roomType || !numberOfGuests) {
      return res.status(400).json({ message: 'All fields are required' });
    }


    const hostel = await Hostel.findById(hostelId);

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }


    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = hostel.pricePerNight * nights;


    const booking = new HostelBooking({
      userId,
      hostelId,
      checkIn,
      checkOut,
      roomType,
      numberOfGuests,
      totalPrice,
      status: 'Pending',
    });

    await booking.save();


    const provider = await User.findById(hostel.providerId).select('paymentDetails businessDetails');

    res.status(201).json({
      message: 'Hostel booked successfully',
      booking: {
        id: booking._id,
        hostelId,
        totalPrice,
        status: 'Pending',
        providerDetails: {
          upiId: provider?.paymentDetails?.upiId,
          businessName: provider?.businessDetails?.businessName || provider?.name,
        }
      },
    });
  } catch (error) {
    console.error('Book hostel error:', error);
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
};

module.exports = {
  getAllHostels,
  getHostelsByCity,
  getHostelDetails,
  bookHostel,
};
