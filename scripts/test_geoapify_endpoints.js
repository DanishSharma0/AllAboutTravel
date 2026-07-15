const axios = require('axios');
const base = 'http://localhost:5000/api';

(async function run() {
  try {
    const health = await axios.get(`${base}/health`);
    console.log('health:', health.data);
  } catch (e) {
    console.error('health failed:', e.response?.data || e.message);
    return;
  }

  const city = 'Bengaluru';
  try {
    const popular = await axios.get(`${base}/places/popular/${encodeURIComponent(city)}`, { params: { limit: 4 } });
    console.log('popular count:', popular.data?.places?.length);
    console.log('popular sample:', Array.isArray(popular.data.places) ? popular.data.places[0]?.name : 'none');
  } catch (e) {
    console.error('popular failed:', e.response?.data || e.message);
  }

  try {
    const nearby = await axios.get(`${base}/places/nearby`, { params: { lat: 12.9716, lng: 77.5946, type: 'restaurant', radius: 5000, limit: 4 } });
    console.log('nearby restaurants count:', nearby.data?.places?.length);
    console.log('restaurant sample:', Array.isArray(nearby.data.places) ? nearby.data.places[0]?.name : 'none');

    const placeId = nearby.data.places?.[0]?.placeId;
    if (placeId) {
      const details = await axios.get(`${base}/places/details`, { params: { placeId } });
      console.log('details fetched:', details.data?.details?.name || 'missing');
    } else {
      console.log('no restaurant placeId available for details test');
    }
  } catch (e) {
    console.error('nearby/details failed:', e.response?.data || e.message);
  }
})();
