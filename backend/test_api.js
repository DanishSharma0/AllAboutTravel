const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/rentals?vehicleType=Car',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('--- API RESPONSE ---');
      console.log('debugReqQuery:', parsed.debugReqQuery);
      console.log('debugQuery:', parsed.debugQuery);
      console.log('count:', parsed.count);
    } catch(e) {
      console.log('Failed to parse:', data);
    }
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.end();
