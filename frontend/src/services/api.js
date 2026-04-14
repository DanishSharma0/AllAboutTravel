import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => localStorage.removeItem('token'),
  getCurrentUser: () => api.get('/auth/me'),
};


export const citiesAPI = {
  getAll: () => api.get('/cities'),
  getById: (id) => api.get(`/cities/${id}`),
};


export const placesAPI = {
  getAll: (params) => api.get('/places', { params }),
  getById: (id) => api.get(`/places/${id}`),
  searchByCity: (cityId) => api.get(`/places/city/${cityId}`),
};


export const hostelsAPI = {
  getAll: (params) => api.get('/hostels', { params }),
  getById: (id) => api.get(`/hostels/${id}`),
  search: (params) => api.get('/hostels/search', { params }),
  getBookings: () => api.get('/hostels/my-bookings'),
  bookHostel: (data) => api.post('/hostels/book', data),
  cancelBooking: (bookingId) => api.delete(`/hostels/booking/${bookingId}`),
};


export const tourGuidesAPI = {
  getAll: (params) => api.get('/tour-guides', { params }),
  getById: (id) => api.get(`/tour-guides/${id}`),
  getByCity: (cityId) => api.get(`/tour-guides/city/${cityId}`),
  bookGuide: (data) => api.post('/tour-guides/book', data),
  getMyBookings: () => api.get('/tour-guides/my-bookings'),
  cancelBooking: (bookingId) => api.delete(`/tour-guides/booking/${bookingId}`),
};


export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  searchByCategory: (category) => api.get(`/products/category/${category}`),
};


export const rentalsAPI = {
  getAll: (params) => api.get('/rentals', { params }),
  getById: (id) => api.get(`/rentals/${id}`),
  searchByCity: (cityId) => api.get(`/rentals/city/${cityId}`),
  bookRental: (data) => api.post('/rentals/book', data),
  getMyBookings: () => api.get('/rentals/my-bookings'),
  cancelBooking: (bookingId) => api.delete(`/rentals/booking/${bookingId}`),
};


export const directionsAPI = {
  getDirections: (origin, destination) =>
    api.get('/directions', { params: { origin, destination } }),
  getNearbyPlaces: (lat, lng, radius = 5000) =>
    api.get('/directions/nearby', { params: { lat, lng, radius } }),
};


export const providerAPI = {
  getMyListings: () => api.get('/provider/listings'),
  addListing: (listingData) => api.post('/provider/listings', listingData),
  getProviderBookings: () => api.get('/provider/bookings'),
  updatePaymentDetails: (data) => api.post('/provider/update-payment', data),
  verifyPayment: (data) => api.post('/provider/verify-payment', data),
};


export const bookingAPI = {
  getMyBookings: () => api.get('/bookings/me'),
  payBooking: (type, bookingId) => api.post(`/bookings/pay/${type}/${bookingId}`),
  confirmPayment: (data) => api.post('/bookings/confirm-payment', data),
};


export const paymentAPI = {
  createOrder: (data) => api.post('/payment/create-order', data),
  verifyPayment: (data) => api.post('/payment/verify', data),
};


export const reviewAPI = {
  getReviews: (entityType, entityId) => api.get(`/reviews/${entityType}/${entityId}`),
  createReview: (data) => api.post('/reviews', data),
};

export default api;
