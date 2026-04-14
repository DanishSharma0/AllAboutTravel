const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');
const City = require('./src/models/City');
const Hostel = require('./src/models/Hostel');
const Rental = require('./src/models/Rental');
const TourGuide = require('./src/models/TourGuide');
const bcrypt = require('bcryptjs');

const connectDB = require('./src/config/database');

async function seedData() {
  try {
    await connectDB();
    console.log('Connected to DB');
    // 1. Ensure a City exists
    let city = await City.findOne({ name: 'Demo City' });
    if (!city) {
      city = new City({
        name: 'Demo City',
        state: 'Demo State',
        latitude: 28.7041,
        longitude: 77.1025,
        description: 'A beautiful city for demonstration purposes.',
        history: 'Founded in 2026',
        culture: 'Rich culture',
        festivals: ['Demo Fest'],
        localFood: ['Demo Cuisine'],
        languages: ['English'],
        bestTimeToVisit: 'Winter',
        rating: 4.8,
        popularity: 100
      });
      await city.save();
      console.log('Created Demo City');
    }
    // 2. Ensure a Provider exists
    let provider = await User.findOne({ email: 'provider@demo.com' });
    if (!provider) {
      provider = new User({
        name: 'Demo Provider',
        email: 'provider@demo.com',
        password: 'password123',
        phone: '1234567890',
        role: 'PROVIDER'
      });
      await provider.save();
      console.log('Created Demo Provider User');
    }

    // 3. Seed Hostel
    const existingHostel = await Hostel.findOne({ name: 'Demo Luxury Hostel' });
    if (!existingHostel) {
      const hostel = new Hostel({
        providerId: provider._id,
        cityId: city._id,
        name: 'Demo Luxury Hostel',
        address: '123 Demo Street',
        latitude: 28.7,
        longitude: 77.1,
        pricePerNight: 1500,
        rating: 4.5,
        facilities: ['WiFi', 'AC', 'Pool'],
        description: 'A luxurious hostel with amazing views.',
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        roomTypes: ['Private Double', 'Dorm'],
        availableRooms: 10,
        checkinTime: '14:00',
        checkoutTime: '11:00'
      });
      await hostel.save();
      console.log('Seeded Demo Hostel');
    }

    // 4. Seed Rental
    const existingRental = await Rental.findOne({ modelName: 'Demo SUV 4x4' });
    if (!existingRental) {
      const rental = new Rental({
        providerId: provider._id,
        cityId: city._id,
        vehicleType: 'Car',
        modelName: 'Demo SUV 4x4',
        pricePerHour: 300,
        pricePerDay: 3000,
        features: ['AC', 'GPS', 'Bluetooth'],
        description: 'Go anywhere with this rugged yet comfortable SUV.',
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        licensePlate: 'DEMO-1234'
      });
      await rental.save();
      console.log('Seeded Demo Rental');
    }

    // 5. Seed Tour Guide
    const existingGuide = await TourGuide.findOne({ name: 'Demo Guide John' });
    if (!existingGuide) {
      const guide = new TourGuide({
        providerId: provider._id,
        cityId: city._id,
        name: 'Demo Guide John',
        email: 'john@demoguide.com',
        phone: '9876543210',
        languages: ['English', 'Spanish'],
        experienceYears: 5,
        chargesPerHour: 500,
        chargesPerDay: 3000,
        rating: 4.9,
        specializations: ['History', 'Food'],
        description: 'I know all the hidden gems of this city!',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      });
      await guide.save();
      console.log('Seeded Demo Tour Guide');
    }

    console.log('Seeding Complete! You can test as provider@demo.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedData();
