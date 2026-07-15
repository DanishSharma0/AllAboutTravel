const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './.env') });
const Rental = require('./src/models/Rental');
const connectDB = require('./src/config/database');

const checkRentals = async () => {
  try {
    await connectDB();
    const rentals = await Rental.find({}).limit(5);
    console.log("Found rentals:", JSON.stringify(rentals, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkRentals();
