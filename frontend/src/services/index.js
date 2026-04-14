import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const cityService = {
  getAllCities: async (search = '', limit = 20, offset = 0) => {
    const response = await api.get('/cities', {
      params: { search, limit, offset },
    });
    return response.data;
  },

  getCityDetails: async (cityId) => {
    const response = await api.get(`/cities/${cityId}`);
    return response.data;
  },

  searchCities: async (query) => {
    const response = await api.get('/cities/search', {
      params: { q: query },
    });
    return response.data;
  },
};

export const placeService = {
  getPlacesByCity: async (cityId, category = '', limit = 20, offset = 0) => {
    const response = await api.get(`/places/city/${cityId}`, {
      params: { category, limit, offset },
    });
    return response.data;
  },

  getPlaceDetails: async (placeId) => {
    const response = await api.get(`/places/${placeId}`);
    return response.data;
  },

  searchPlaces: async (query, cityId = '') => {
    const response = await api.get('/places/search', {
      params: { q: query, cityId },
    });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/places/categories');
    return response.data;
  },
};

export const rentalService = {
  getRentalsByCity: async (cityId) => {
    const response = await api.get(`/rentals/city/${cityId}`);
    return response.data;
  },

  getRentalDetails: async (rentalId) => {
    const response = await api.get(`/rentals/${rentalId}`);
    return response.data;
  },

  bookRental: async (bookingData) => {
    const response = await api.post('/rentals/book', bookingData);
    return response.data;
  },
};

export const hostelService = {
  getHostelsByCity: async (cityId) => {
    const response = await api.get(`/hostels/city/${cityId}`);
    return response.data;
  },

  getHostelDetails: async (hostelId) => {
    const response = await api.get(`/hostels/${hostelId}`);
    return response.data;
  },

  bookHostel: async (bookingData) => {
    const response = await api.post('/hostels/book', bookingData);
    return response.data;
  },
};

export const productService = {
  getProductsByCity: async (cityId, category = '') => {
    const response = await api.get(`/products/city/${cityId}`, {
      params: { category },
    });
    return response.data;
  },

  getProductDetails: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  createOrder: async (items) => {
    const response = await api.post('/products/order', { items });
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get('/products/user/orders');
    return response.data;
  },
};

export const guideService = {
  getGuidesByCity: async (cityId) => {
    const response = await api.get(`/guides/city/${cityId}`);
    return response.data;
  },

  getGuideDetails: async (guideId) => {
    const response = await api.get(`/guides/${guideId}`);
    return response.data;
  },

  bookGuide: async (bookingData) => {
    const response = await api.post('/guides/book', bookingData);
    return response.data;
  },
};

export const directionService = {
  getDirections: async (startLng, startLat, endLng, endLat) => {
    const response = await api.get('/directions/route', {
      params: { startLng, startLat, endLng, endLat },
    });
    return response.data;
  },

  getNearbyAttractions: async (cityId, latitude, longitude, radius = 5) => {
    const response = await api.get('/directions/nearby', {
      params: { cityId, latitude, longitude, radius },
    });
    return response.data;
  },
};
