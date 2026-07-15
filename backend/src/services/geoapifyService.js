const axios = require('axios');
const mongoose = require('mongoose');
const cache = require('../utils/cache');
const GooglePlace = require('../models/GooglePlace');

const API_KEY = process.env.GEOAPIFY_API_KEY?.trim();
const GEOCODE_URL = 'https://api.geoapify.com/v1/geocode/search';
const BASE_URL = 'https://api.geoapify.com/v2/places';
const DETAILS_URL = 'https://api.geoapify.com/v2/place-details';
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

const ensureApiKey = () => {
  if (!API_KEY) {
    throw new Error('GEOAPIFY_API_KEY is not configured');
  }
};

const CATEGORY_MAP = {
  tourist_attraction: 'tourism.sights',
  restaurants_cafes: 'catering.restaurant,catering.cafe',
  restaurant: 'catering.restaurant',
  cafe: 'catering.cafe',
  shopping: 'commercial.shopping',
  hospital: 'healthcare.hospital',
  pharmacy: 'healthcare.pharmacy',
  fuel: 'transport.fuel',
  park: 'leisure.park',
  museum: 'tourism.museum',
  monument: 'historic',
  essentials: 'healthcare.hospital,healthcare.pharmacy,transport.fuel',
};

const buildCategories = (type) => {
  if (!type) return CATEGORY_MAP.tourist_attraction;
  return CATEGORY_MAP[type] || type;
};

const buildAddress = (props = {}) => {
  if (props.formatted) return props.formatted;
  const parts = [props.address_line1, props.address_line2, props.address_line3, props.city, props.state, props.country]
    .filter(Boolean);
  return parts.join(', ');
};

const normalizePlace = (feature) => {
  const props = feature.properties || {};
  const coordinates = Array.isArray(feature.geometry?.coordinates) ? feature.geometry.coordinates : [null, null];
  const placeId = props.place_id || props.xid || null;
  const categories = props.categories || props.type || '';

  return {
    placeId,
    name: props.name || props.result_type || 'Unknown place',
    category: categories,
    latitude: coordinates[1],
    longitude: coordinates[0],
    rating: props.rate || props.rating || 0,
    userRatingsTotal: props.num_reviews || props.review_count || 0,
    address: buildAddress(props),
    distance: props.distance || null,
    isOpen: props.opening_hours?.open_now ?? null,
    openingHours: props.opening_hours || null,
    image: props.photo?.url || props.image || null,
    website: props.website || props.url || null,
    googleMapsUrl: props.url || (coordinates[1] && coordinates[0] ? `https://www.google.com/maps/search/?api=1&query=${coordinates[1]},${coordinates[0]}` : null),
    raw: feature,
  };
};

const requestWithGeoapify = async ({ url, params = {} }) => {
  ensureApiKey();
  try {
    return await axios.get(url, {
      params: {
        apiKey: API_KEY,
        ...params,
      },
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (error) {
    console.error('Geoapify API call failed:', {
      url,
      params,
      status: error.response?.status,
      responseData: error.response?.data,
    });
    throw error;
  }
};

const persistPlaces = async (places) => {
  if (mongoose.connection.readyState !== 1) {
    console.warn('MongoDB not connected; skipping Geoapify place persistence');
    return;
  }

  await Promise.all(
    places.map(async (place) => {
      if (!place.placeId) return;
      try {
        await GooglePlace.findOneAndUpdate(
          { googlePlaceId: place.placeId },
          { ...place, lastFetched: new Date() },
          { upsert: true, new: true }
        );
      } catch (error) {
        console.warn('Geoapify place upsert failed', error.message);
      }
    })
  );
};

const searchPopularByCity = async (cityName, { limit = 12 } = {}) => {
  ensureApiKey();
  const cacheKey = `geoapify:popular:${cityName}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const geocodeResp = await requestWithGeoapify({
    url: GEOCODE_URL,
    params: {
      text: cityName,
      limit: 1,
    },
  });

  const geocodeFeature = geocodeResp.data.features?.[0];
  if (!geocodeFeature) {
    throw new Error(`Unable to geocode city: ${cityName}`);
  }

  const [lng, lat] = Array.isArray(geocodeFeature.geometry?.coordinates)
    ? geocodeFeature.geometry.coordinates
    : [null, null];

  if (lat == null || lng == null) {
    throw new Error(`Invalid geocode response for city: ${cityName}`);
  }

  const resp = await requestWithGeoapify({
    url: BASE_URL,
    params: {
      categories: buildCategories('tourist_attraction'),
      filter: `circle:${lng},${lat},${Math.min(40000, 5000)}`,
      bias: `proximity:${lng},${lat}`,
      limit,
    },
  });

  const results = (resp.data.features || []).map(normalizePlace).filter((place) => place.placeId);
  await persistPlaces(results);
  cache.set(cacheKey, results, CACHE_TTL);
  return results;
};

const nearbySearch = async ({ lat, lng, radius = 5000, type = 'tourist_attraction', limit = 20 }) => {
  ensureApiKey();
  const cacheKey = `geoapify:nearby:${lat}:${lng}:${radius}:${type}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const resp = await requestWithGeoapify({
    url: BASE_URL,
    params: {
      categories: buildCategories(type),
      filter: `circle:${lng},${lat},${Math.min(radius, 40000)}`,
      bias: `proximity:${lng},${lat}`,
      limit,
    },
  });

  const results = (resp.data.features || []).map(normalizePlace).filter((place) => place.placeId);
  await persistPlaces(results);
  cache.set(cacheKey, results, CACHE_TTL);
  return results;
};

const getPlaceDetails = async (placeId) => {
  ensureApiKey();
  const cacheKey = `geoapify:details:${placeId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const resp = await requestWithGeoapify({
    url: DETAILS_URL,
    params: {
      id: placeId,
    },
  });

  const feature = resp.data.features?.[0];
  if (!feature) return null;

  const normalized = normalizePlace(feature);
  await persistPlaces([normalized]);
  cache.set(cacheKey, normalized, CACHE_TTL);
  return normalized;
};

module.exports = {
  searchPopularByCity,
  nearbySearch,
  getPlaceDetails,
};
