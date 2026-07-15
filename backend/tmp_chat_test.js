const http = require('http');
const https = require('https');
const url = require('url');

const endpoint = 'http://localhost:5000/api/recommendations/chat';
const parsed = url.parse(endpoint);
const data = JSON.stringify({
  message: 'Test AI response',
  cityId: '69f72a628f49f7edda919bd4'
});

const options = {
  hostname: parsed.hostname,
  port: parsed.port,
  path: parsed.path,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTQ4YjQ1YzUwN2EyODU4Y2QyYmQ4NjIiLCJlbWFpbCI6ImFpLXRlc3QtdXNlcisyMDI2LTJAYWxsYWJvdXR0cmF2ZWwuYXBwIiwiaWF0IjoxNzgzMTQ5NjYwLCJleHAiOjE3ODM3NTQ0NjB9.eOSH1jGVVvnc8juTo6-562Z2w300Isfsl9qditvRLJE'
  }
};

const lib = parsed.protocol === 'https:' ? https : http;
const req = lib.request(options, (res) => {
  let body = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log('headers', JSON.stringify(res.headers, null, 2));
    console.log('body', body);
  });
});
req.on('error', (err) => { console.error('request error', err.message); });
req.write(data);
req.end();
