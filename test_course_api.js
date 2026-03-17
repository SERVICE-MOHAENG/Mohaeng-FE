const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3333,
  path: /api/v1/courses/1, // Assuming course ID 1 exists, or we can look up an ID from DB if necessary
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (d) => {
    data += d;
  });
  res.on('end', () => {
    console.log(data);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
