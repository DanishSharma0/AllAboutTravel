const https = require('https');
const http = require('http');

function checkUrl(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', (e) => resolve(e.message));
  });
}

async function run() {
  const urls = [
    'https://loremflickr.com/1200/800/hotel',
    'https://loremflickr.com/1200/800/scooter',
    'https://loremflickr.com/1200/800/car',
    'https://loremflickr.com/1200/800/india'
  ];
  
  for (const u of urls) {
    const status = await checkUrl(u);
    console.log(`${u} => ${status}`);
  }
}
run();
