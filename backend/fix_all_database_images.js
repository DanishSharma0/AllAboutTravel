const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './.env') });
const connectDB = require('./src/config/database');

const City = require('./src/models/City');
const Hostel = require('./src/models/Hostel');
const Rental = require('./src/models/Rental');
const TourGuide = require('./src/models/TourGuide');
const Product = require('./src/models/Product');
const TouristPlace = require('./src/models/TouristPlace');

const VALID_UNSPLASH = {
  CITY: ["1477587458883-47145ed94245", "1514282401047-d79a71a590e8"],
  HOSTEL: ["1522798514-97ceb8c4f1c8", "1520250497591-112f2f40a3f4"],
  BIKE: ["1558981403-c5f9899a28bc", "1558981806-ec527fa84c39", "1515777315835-281b94c9589f", "1444491741275-3747c53c99b4"],
  CAR: ["1503376780353-7e6692767b70"],
  GUIDE: ["1534528741775-53994a69daeb", "1506794778202-cad84cf45f1d", "1500648767791-00dcc994a43e"]
};

const LOREM_KEYWORDS = {
  SCOOTER: 'scooter,vespa',
  EV: 'electric,scooter',
  PLACE: 'india,monument',
  SHOP_CLOTHING: 'traditional,clothing',
  SHOP_HANDICRAFT: 'handicraft,art',
  SHOP_GEAR: 'backpack,travel'
};

const getImageUrl = (type, lockId) => {
  if (VALID_UNSPLASH[type] && VALID_UNSPLASH[type].length > 0) {
    const id = VALID_UNSPLASH[type][lockId % VALID_UNSPLASH[type].length];
    return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1200`;
  }
  const keyword = LOREM_KEYWORDS[type] || 'travel';
  return `https://loremflickr.com/1200/800/${keyword}?lock=${lockId}`;
};

async function fixImages() {
  try {
    await connectDB();
    console.log("Fixing all images in the database...");

    // Cities
    const cities = await City.find({});
    for (let i = 0; i < cities.length; i++) {
      cities[i].image = getImageUrl('CITY', i);
      await cities[i].save();
    }
    console.log("Cities fixed.");

    // Hostels
    const hostels = await Hostel.find({});
    for (let i = 0; i < hostels.length; i++) {
      hostels[i].image = getImageUrl('HOSTEL', i);
      await hostels[i].save();
    }
    console.log("Hostels fixed.");

    // Rentals
    const rentals = await Rental.find({});
    for (let i = 0; i < rentals.length; i++) {
      let type = 'BIKE';
      if (rentals[i].vehicleType === 'Car') type = 'CAR';
      else if (rentals[i].vehicleType === 'Scooty') type = 'SCOOTER';
      else if (rentals[i].vehicleType === 'EV') type = 'EV';
      
      rentals[i].image = getImageUrl(type, i);
      await rentals[i].save();
    }
    console.log("Rentals fixed.");

    // Tour Guides
    const guides = await TourGuide.find({});
    for (let i = 0; i < guides.length; i++) {
      guides[i].image = getImageUrl('GUIDE', i);
      await guides[i].save();
    }
    console.log("Tour Guides fixed.");

    // Tourist Places
    const places = await TouristPlace.find({});
    for (let i = 0; i < places.length; i++) {
      places[i].image = getImageUrl('PLACE', i);
      await places[i].save();
    }
    console.log("Tourist Places fixed.");

    // Products
    const products = await Product.find({});
    for (let i = 0; i < products.length; i++) {
      let type = 'SHOP_GEAR';
      if (products[i].category === 'Clothing') type = 'SHOP_CLOTHING';
      else if (products[i].category === 'Handicraft') type = 'SHOP_HANDICRAFT';
      
      products[i].image = getImageUrl(type, i);
      await products[i].save();
    }
    console.log("Products fixed.");

    console.log("All broken images have been successfully replaced!");
    process.exit(0);
  } catch (err) {
    console.error("Error fixing images:", err);
    process.exit(1);
  }
}

fixImages();
