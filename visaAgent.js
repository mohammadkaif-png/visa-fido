const https = require('https');
const fs = require('fs');


const visaAgent = new https.Agent({
  key: Buffer.from(process.env.VISA_CLIENT_KEY, 'base64'),
  cert: Buffer.from(process.env.VISA_CLIENT_CERT, 'base64'),
  rejectUnauthorized: false
});

module.exports = visaAgent;
