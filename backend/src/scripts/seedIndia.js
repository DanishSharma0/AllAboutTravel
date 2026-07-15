const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const connectDB = require('../config/database');

const City = require('../models/City');
const User = require('../models/User');
const Hostel = require('../models/Hostel');
const Rental = require('../models/Rental');
const TourGuide = require('../models/TourGuide');
const Product = require('../models/Product');
const TouristPlace = require('../models/TouristPlace');
const Review = require('../models/Review');

const CATEGORY_IMAGES = {
  CITY: [
    "1514282401047-d79a71a590e8", "1587474260584-1281d429f490", "1597089548027-e4620070ea81"
  ],
  HOSTEL: [
    "1555854832849-59db23e0d", "1520250497591-112f2f40a3f4", "1590073541814-1af1b1b46b28"
  ],
  BIKE: [
    "1558981403-c5f9899a28bc", "1515777315835-281b94c9589f", "1444491741275-3747c53c99b4"
  ],
  SCOOTER: [
    "1558981285-6f0c90f4d01a", "1591438670356-150bc6223847", "1625047509128-ED77334795aa"
  ],
  CAR: [
    "1503376780353-7e6692767b70", "1494976388531-d1059f9ad092", "1541899481-2fd3956b78ef"
  ],
  EV: [
    "1619767886554-2f2288adc99a", "1593941707882-c5bdd14ad1c4", "1620002093397-9475fe57a920"
  ],
  GUIDE: [
    "1534528741775-53994a69daeb", "1506794778202-cad84cf45f1d", "1500648767791-00dcc994a43e"
  ],
  PLACE: [
    "1477617722481-9962aae88c44", "1564507522543-d8921ec94726", "1548013146-735c7d206095"
  ],
  SHOP_CLOTHING: [
    "1583391733956-6c78276477e2", "1610030469983-98e6f24941da", "1621431607593-3ea33918a0ed"
  ],
  SHOP_HANDICRAFT: [
    "1606744824161-078fd61304f1", "1515814472491-a203f6f69904", "1582558586915-a67b4f910405"
  ],
  SHOP_GEAR: [
    "1523381235312-3c1900754700", "1441926932896-01a5a5b7557e", "1606103816285-024058f377c7"
  ]
};

const getRandImg = (cat) => {
  const ids = CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.PLACE;
  const id = ids[Math.floor(Math.random() * ids.length)];
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1200`;
};

const INDIA_DATA = [
  { state: "Maharashtra", city: "Mumbai", lat: 19.0760, lng: 72.8777, desc: "The City of Dreams and India's financial capital.", culture: "Blend of traditional Marathi culture and cosmopolitan vibes.", food: ["Vada Pav", "Pav Bhaji", "Bhel Puri"] },
  { state: "Delhi", city: "New Delhi", lat: 28.6139, lng: 77.2090, desc: "The historical and political heart of India.", culture: "Rich history from Mughals to British colonial architecture.", food: ["Chole Bhature", "Butter Chicken", "Paranthas"] },
  { state: "Karnataka", city: "Bengaluru", lat: 12.9716, lng: 77.5946, desc: "The Garden City and Silicone Valley of India.", culture: "Pub culture, parks, and high-tech innovation.", food: ["Masala Dosa", "Bisi Bele Bath", "Filter Coffee"] },
  { state: "Goa", city: "Panaji", lat: 15.4909, lng: 73.8278, desc: "India's beach paradise with a unique Indo-Portuguese blend.", culture: "Susegad lifestyle, carnival spirit, and historic churches.", food: ["Fish Curry Rice", "Bebinca", "Prawn Balchao"] },
  { state: "Rajasthan", city: "Jaipur", lat: 26.9124, lng: 75.7873, desc: "The Pink City, known for its royal palaces and forts.", culture: "Rajput heritage, vibrant handicrafts, and folk music.", food: ["Dal Baati Churma", "Laal Maas", "Ghevar"] },
  { state: "Himachal Pradesh", city: "Manali", lat: 32.2432, lng: 77.1892, desc: "A high-altitude Himalayan resort town for adventure seekers.", culture: "Pahari traditions, winter festivals, and trekking lore.", food: ["Siddu", "Trout Fish", "Thukpa"] },
];

const seedData = async () => {
  try {
    await connectDB();
    console.log("Starting Seeding Process...");

    console.log("Clearing existing data...");
    await City.deleteMany({});
    await Hostel.deleteMany({});
    await Rental.deleteMany({});
    await TourGuide.deleteMany({});
    await Product.deleteMany({});
    await TouristPlace.deleteMany({});
    await Review.deleteMany({});
    console.log("Collections cleared.");

    const providers = [
      { name: "Danish Sharma", email: "ds7501243@gmail.com", phone: "9876543210", password: "password123", role: "PROVIDER", businessDetails: { businessName: "Danish Rentals", isApproved: true } },
      { name: "Arjit", email: "arjit@gmail.com", phone: "9876543211", password: "seed@123", role: "PROVIDER", businessDetails: { businessName: "Arjit Luxury Stays", isApproved: true } },
      { name: "Vikas", email: "vikas@gmail.com", phone: "9876543212", password: "seed@123", role: "PROVIDER", businessDetails: { businessName: "Vikas Boutique", isApproved: true } }
    ];

    const providerDocs = {};
    for (const p of providers) {
      let user = await User.findOne({ email: p.email });
      if (!user) {
        user = await User.create(p);
      }
      providerDocs[p.name] = user._id;
    }

    const danishId = providerDocs["Danish Sharma"];
    const arjitId = providerDocs["Arjit"];
    const vikasId = providerDocs["Vikas"];

    for (const data of INDIA_DATA) {
      console.log(`Seeding: ${data.city}...`);

      const city = await City.create({
        name: data.city,
        state: data.state,
        latitude: data.lat,
        longitude: data.lng,
        description: data.desc,
        history: `The history of ${data.city} is deeply rooted in ${data.state}'s evolution, reflecting centuries of transitions from ancient heritage to modern development.`,
        culture: data.culture,
        bestTimeToVisit: "October to March",
        localFood: data.food,
        languages: ["English", "Hindi", "Local"],
        image: getRandImg('CITY'),
        popularity: 80 + Math.floor(Math.random() * 20),
        rating: 4.5 + Math.random() * 0.5
      });

      // 1. Seed Hostels
      await Hostel.create({
        providerId: arjitId, cityId: city._id,
        name: `${data.city} Elite Backpacker Hostel`,
        address: `${Math.floor(Math.random()*900)+100} Main St, ${data.city}`,
        latitude: data.lat, longitude: data.lng,
        pricePerNight: 900 + Math.floor(Math.random() * 500),
        rating: 4.8,
        description: `Premium mountain-themed hostel in the heart of ${data.city}.`,
        image: getRandImg('HOSTEL'),
        roomTypes: ["Dorm", "Private Single"],
        facilities: ["WiFi", "Kitchen", "Lounge"],
        availableRooms: 10
      });

      // 2. Seed Rentals (Bikes, Scooty, Cars, EVs)
      const rentalTypes = [
        { type: "Bike", name: "Royal Enfield 350", img: "BIKE", price: 800 },
        { type: "Scooty", name: "Activa 6G", img: "SCOOTER", price: 400 },
        { type: "Car", name: "Mahindra Thar 4x4", img: "CAR", price: 3500 },
        { type: "EV", name: "Ather 450X Electric", img: "EV", price: 600 }
      ];

      for (const rt of rentalTypes) {
        await Rental.create({
          providerId: danishId, cityId: city._id,
          vehicleType: rt.type,
          modelName: rt.name,
          pricePerHour: Math.floor(rt.price / 10),
          pricePerDay: rt.price,
          description: `Well-maintained ${rt.name} available for rent in ${data.city}.`,
          image: getRandImg(rt.img),
          features: ["Full Tank", "Insured", "24/7 Support"]
        });
      }

      // 3. Seed Places
      const placeTypes = [
        { name: "The Ancient Fort", cat: "Fort" },
        { name: "Nature Valley", cat: "Nature" },
        { name: "Central Market", cat: "Market" }
      ];

      for (const pt of placeTypes) {
        await TouristPlace.create({
          cityId: city._id,
          name: `${data.city} ${pt.name}`,
          category: pt.cat,
          description: `A must-visit ${pt.cat.toLowerCase()} destination in ${data.city}.`,
          latitude: data.lat + (Math.random() - 0.5) * 0.02,
          longitude: data.lng + (Math.random() - 0.5) * 0.02,
          image: getRandImg('PLACE'),
          rating: 4.5 + Math.random() * 0.5
        });
      }

      // 4. Seed Products (Clothing, Handicraft, Accessories)
      const prodTypes = [
        { name: "Woolen Shawl", cat: "Clothing", img: "SHOP_CLOTHING", price: 2500 },
        { name: "Artisan Vase", cat: "Handicraft", img: "SHOP_HANDICRAFT", price: 1200 },
        { name: "Explorer Pack", cat: "Other", img: "SHOP_GEAR", price: 4500 }
      ];

      for (const pr of prodTypes) {
        await Product.create({
          cityId: city._id,
          name: `${data.city} ${pr.name}`,
          price: pr.price,
          category: pr.cat,
          description: `Authentic ${pr.name} sourced from local creators in ${data.city}.`,
          image: getRandImg(pr.img),
          rating: 4.2 + Math.random() * 0.8,
          stock: 20
        });
      }

      // 5. Seed Tour Guide
      await TourGuide.create({
        providerId: danishId, cityId: city._id,
        name: `${data.city} Local Expert`,
        email: `guide.${data.city.toLowerCase()}@example.com`,
        phone: `91${Math.floor(Math.random()*89999999+10000000)}`,
        experienceYears: 8,
        chargesPerDay: 2000,
        chargesPerHour: 300,
        languages: ["English", "Hindi"],
        specializations: ["Heritage Tours"],
        image: getRandImg('GUIDE'),
        verified: true,
        rating: 4.9
      });
    }

    console.log("Seeding Completed Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding Failed:", error);
    process.exit(1);
  }
};

seedData();
