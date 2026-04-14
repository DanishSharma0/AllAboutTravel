const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
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


const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, callback) => callback(null, true), // allow all in dev
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
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


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
