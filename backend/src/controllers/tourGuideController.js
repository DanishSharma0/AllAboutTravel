const GuideBooking = require('../models/GuideBooking');
const TourGuide = require('../models/TourGuide');

const User = require('../models/User');
const Notification = require('../models/Notification');
const City = require('../models/City');

// Get all guides (with optional city search)
const getAllGuides = async (req, res) => {
  try {
    const { city } = req.query;
    let query = {};
    if (city) {
      const cityDoc = await City.findOne({ name: { $regex: new RegExp(city, 'i') } });
      if (cityDoc) {
        query.cityId = cityDoc._id;
      } else {
        return res.json([]);
      }
    }
    const guides = await TourGuide.find(query).populate('cityId', 'name state');
    res.json(guides);
  } catch (error) {
    console.error('Get all guides error:', error);
    res.status(500).json({ message: 'Failed to fetch guides', error: error.message });
  }
};

// Get tour guides by city
const getGuidesByCity = async (req, res) => {
  try {
    const { cityId } = req.params;

    const guides = await TourGuide.find({ cityId }).populate('cityId', 'name state');

    res.json(guides);
  } catch (error) {
    console.error('Get guides error:', error);
    res.status(500).json({ message: 'Failed to fetch guides', error: error.message });
  }
};

// Get guide details
const getGuideDetails = async (req, res) => {
  try {
    const { guideId } = req.params;

    const guide = await TourGuide.findById(guideId).populate('cityId', 'name state');

    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    res.json(guide);
  } catch (error) {
    console.error('Get guide details error:', error);
    res.status(500).json({ message: 'Failed to fetch guide details', error: error.message });
  }
};

// Book tour guide (protected)
const bookGuide = async (req, res) => {
  try {
    const { guideId, bookingDate, endDate, duration, numberOfPeople } = req.body;
    const userId = req.user.userId;

    if (!guideId || !bookingDate || !endDate || !duration || !numberOfPeople) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const guide = await TourGuide.findById(guideId);

    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    // Calculate total price based on duration
    let totalPrice = 0;
    if (duration === 'Hourly') {
      const hours = 1;
      totalPrice = guide.chargesPerHour * hours * numberOfPeople;
    } else if (duration === 'Daily') {
      totalPrice = guide.chargesPerDay * numberOfPeople;
    } else if (duration === 'Multi-day') {
      const start = new Date(bookingDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      totalPrice = guide.chargesPerDay * days * numberOfPeople;
    }

    // Create booking
    const booking = new GuideBooking({
      userId,
      guideId,
      bookingDate,
      endDate,
      duration,
      numberOfPeople,
      totalPrice,
      status: 'Pending',
    });

    await booking.save();

    // Fetch provider details for payment
    const provider = await User.findById(guide.providerId).select('paymentDetails businessDetails name');

    // Notify provider of new booking
    await Notification.create({
      recipient: guide.providerId,
      sender: userId,
      message: `You have a new tour booking with ${guide.name}!`,
      type: 'BOOKING_NEW',
      relatedId: booking._id,
      onModel: 'GuideBooking'
    });

    res.status(201).json({
      message: 'Guide booked successfully',
      booking: {
        id: booking._id,
        guideId,
        totalPrice,
        status: 'Pending',
        providerDetails: {
          upiId: provider?.paymentDetails?.upiId,
          businessName: provider?.businessDetails?.businessName || provider?.name,
        }
      },
    });
  } catch (error) {
    console.error('Book guide error:', error);
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
};

module.exports = {
  getAllGuides,
  getGuidesByCity,
  getGuideDetails,
  bookGuide,
};
