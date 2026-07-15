/**
 * Seed Script for Itineraries
 * Run: node backend/scripts/seedItineraries.js
 * 
 * This script creates sample itineraries for all cities in your database.
 * Customize the itineraries based on your actual cities.
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Itinerary = require('../src/models/Itinerary');
const City = require('../src/models/City');

const itineraries = [
  {
    title: '3-Day Adventure Itinerary',
    description: 'Perfect for adventure seekers and nature lovers',
    duration: 3,
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & City Exploration',
        activities: [
          {
            time: '9:00 AM',
            activity: 'Arrival & Check-in',
            description: 'Reach the city and settle into your accommodation',
            duration: '30 mins',
          },
          {
            time: '11:00 AM',
            activity: 'Visit Major Temple/Monument',
            description: 'Explore the citys historical landmark',
            duration: '1.5 hours',
          },
          {
            time: '1:00 PM',
            activity: 'Lunch at Local Restaurant',
            description: 'Try authentic local cuisine',
            duration: '1 hour',
          },
          {
            time: '3:00 PM',
            activity: 'Local Market & Shopping',
            description: 'Browse local handicrafts and souvenirs',
            duration: '2 hours',
          },
          {
            time: '7:00 PM',
            activity: 'Dinner & Rest',
            description: 'Enjoy dinner and relax',
            duration: '1.5 hours',
          },
        ],
      },
      {
        dayNumber: 2,
        title: 'Adventure Activities',
        activities: [
          {
            time: '7:00 AM',
            activity: 'Early Morning Trek',
            description: 'Trek through scenic mountain or nature trails',
            duration: '3 hours',
          },
          {
            time: '11:00 AM',
            activity: 'Adventure Sports',
            description: 'Try local adventure activities (ATV, paragliding, etc.)',
            duration: '2 hours',
          },
          {
            time: '1:30 PM',
            activity: 'Lunch at Scenic Location',
            description: 'Picnic lunch with a view',
            duration: '1 hour',
          },
          {
            time: '3:00 PM',
            activity: 'Cultural Experience',
            description: 'Visit local villages or cultural sites',
            duration: '2 hours',
          },
          {
            time: '7:00 PM',
            activity: 'Evening Entertainment',
            description: 'Bonfire, music, or local performances',
            duration: '2 hours',
          },
        ],
      },
      {
        dayNumber: 3,
        title: 'Mountain Views & Departure',
        activities: [
          {
            time: '6:00 AM',
            activity: 'Sunrise at Scenic Viewpoint',
            description: 'Watch sunrise from a scenic location',
            duration: '2 hours',
          },
          {
            time: '9:00 AM',
            activity: 'Photography & Nature Walk',
            description: 'Capture memories in nature',
            duration: '2 hours',
          },
          {
            time: '12:00 PM',
            activity: 'Return to Main City',
            description: 'Scenic journey back',
            duration: '1 hour',
          },
          {
            time: '1:30 PM',
            activity: 'Final Shopping & Lunch',
            description: 'Last-minute souvenirs and dining',
            duration: '1.5 hours',
          },
          {
            time: '4:00 PM',
            activity: 'Departure',
            description: 'Safe travel back home',
            duration: 'Varies',
          },
        ],
      },
    ],
    budget: {
      min: 5000,
      max: 15000,
    },
    difficultyLevel: 'Moderate',
    isActive: true,
  },
];

const seedItineraries = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Get all cities
    const cities = await City.find({}).select('_id name');
    
    if (cities.length === 0) {
      console.log('⚠️ No cities found in database. Please seed cities first.');
      process.exit(1);
    }

    console.log(`📍 Found ${cities.length} cities`);

    // Clear existing itineraries (optional)
    await Itinerary.deleteMany({});
    console.log('🗑️ Cleared existing itineraries');

    // Create itinerary for each city
    const itinerariesToInsert = cities.map(city => ({
      ...itineraries[0],
      cityId: city._id,
    }));

    const result = await Itinerary.insertMany(itinerariesToInsert);
    console.log(`✅ Successfully seeded ${result.length} itineraries`);

    // Display created itineraries
    result.forEach((itinerary, index) => {
      const city = cities[index];
      console.log(`   📅 ${city.name}: "${itinerary.title}"`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    process.exit(1);
  }
};

// Run the seed
seedItineraries();
