const mongoose = require('mongoose');
require('dotenv').config();
const City = require('./src/models/City');
const TouristPlace = require('./src/models/TouristPlace');
const connectDB = require('./src/config/database');

async function seedPlaces() {
  try {
    await connectDB();
    console.log('Connected to DB');

    const city = await City.findOne({ name: 'Demo City' });
    if (!city) {
      console.error('Demo City not found. Run seedDemoData.js first.');
      process.exit(1);
    }

    const places = [
      {
        cityId: city._id,
        name: 'Himalayan Summit Viewpoint',
        category: 'Nature',
        description: 'A breathtaking panoramic viewpoint overlooking snow-capped Himalayan peaks. The perfect spot to watch sunrise paint the mountains in golden hues.',
        latitude: 28.7200,
        longitude: 77.1100,
        rating: 4.9,
        entryFee: 0,
        timings: { open: '05:00', close: '19:00' },
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        bestTimeToVisit: 'October to March',
      },
      {
        cityId: city._id,
        name: 'Ancient Valley Fort',
        category: 'Fort',
        description: 'A magnificent 16th-century fort perched on a hilltop, offering stunning views of the valley below. Rich with history and legends of brave warriors.',
        latitude: 28.7100,
        longitude: 77.0950,
        rating: 4.7,
        entryFee: 50,
        timings: { open: '09:00', close: '17:00' },
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        bestTimeToVisit: 'November to February',
      },
      {
        cityId: city._id,
        name: 'Shiva Mandir Temple',
        category: 'Temple',
        description: 'A sacred 800-year-old temple dedicated to Lord Shiva, built with intricate stone carvings. Pilgrims come from across the country to seek blessings.',
        latitude: 28.7050,
        longitude: 77.1200,
        rating: 4.8,
        entryFee: 0,
        timings: { open: '06:00', close: '20:00' },
        image: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        bestTimeToVisit: 'Year round',
      },
      {
        cityId: city._id,
        name: 'Local Spice Market',
        category: 'Market',
        description: 'A vibrant traditional market bursting with colours, aromas, and flavours. Find exotic spices, handmade crafts, and authentic local street food.',
        latitude: 28.7080,
        longitude: 77.1050,
        rating: 4.5,
        entryFee: 0,
        timings: { open: '08:00', close: '21:00' },
        image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        bestTimeToVisit: 'Morning hours',
      },
      {
        cityId: city._id,
        name: 'Heritage Museum',
        category: 'Museum',
        description: 'A world-class museum housing over 5,000 artefacts spanning 3,000 years of history. Features ancient coins, weapons, textiles, and royal costumes.',
        latitude: 28.7150,
        longitude: 77.1150,
        rating: 4.6,
        entryFee: 100,
        timings: { open: '10:00', close: '18:00' },
        image: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        bestTimeToVisit: 'Weekdays',
      },
      {
        cityId: city._id,
        name: 'Glacial Blue Lake',
        category: 'Nature',
        description: 'A stunning high-altitude glacial lake with crystal clear turquoise water surrounded by pine forests and snowy peaks. Ideal for camping and trekking.',
        latitude: 28.7300,
        longitude: 77.0900,
        rating: 4.9,
        entryFee: 0,
        timings: { open: '00:00', close: '23:59' },
        image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        bestTimeToVisit: 'May to September',
      },
    ];

    let added = 0;
    for (const placeData of places) {
      const exists = await TouristPlace.findOne({ name: placeData.name });
      if (!exists) {
        await TouristPlace.create(placeData);
        console.log(`✅ Seeded: ${placeData.name}`);
        added++;
      } else {
        console.log(`⏭️  Already exists: ${placeData.name}`);
      }
    }

    console.log(`\nDone! ${added} new places added.`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding places:', err);
    process.exit(1);
  }
}

seedPlaces();
