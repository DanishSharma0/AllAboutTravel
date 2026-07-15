const express = require('express');
const cors = require('cors');
require('dotenv').config();


// Force restart 2
const connectDB = require('./config/database');
// Force nodemon restart


const authRoutes = require('./routes/auth');
const cityRoutes = require('./routes/cities');
const placeRoutes = require('./routes/places');
const rentalRoutes = require('./routes/rentals');
const hostelRoutes = require('./routes/hostels');
const tourGuideRoutes = require('./routes/tourGuides');
const productRoutes = require('./routes/products');
const directionsRoutes = require('./routes/directions');
const providerRoutes = require('./routes/provider');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const paymentRoutes = require('./routes/payment');
const recommendationRoutes = require('./routes/recommendations');


const app = express();

const startServer = async () => {
  await connectDB();

  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');
  app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/tour-guides', tourGuideRoutes);
app.use('/api/products', productRoutes);
app.use('/api/directions', directionsRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/recommendations', recommendationRoutes);



app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
  app.listen(PORT, HOST, () => {
    const geoKey = process.env.GEOAPIFY_API_KEY;
    const maskedGeoKey = geoKey ? `${geoKey.slice(0, 6)}****` : 'not-set';
    console.log(`Server running on http://${HOST}:${PORT}`);
    console.log(`GEOAPIFY_API_KEY: ${maskedGeoKey}`);
  });
};

startServer().catch((err) => {
  console.error('Server failed to start', err);
  process.exit(1);
});
