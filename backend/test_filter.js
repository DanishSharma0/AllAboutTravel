const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './.env') });
const Rental = require('./src/models/Rental');
const connectDB = require('./src/config/database');

const testFilter = async () => {
  try {
    await connectDB();
    console.log("Testing filter: { vehicleType: 'Car' }");
    const cars = await Rental.find({ vehicleType: 'Car' });
    console.log(`Found ${cars.length} cars.`);
    
    console.log("Testing filter: { vehicleType: 'Bike' }");
    const bikes = await Rental.find({ vehicleType: 'Bike' });
    console.log(`Found ${bikes.length} bikes.`);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

testFilter();
