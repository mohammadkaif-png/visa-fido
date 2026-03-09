const https = require('https');
const fs = require('fs');


// const visaAgent = new https.Agent({
//   key: process.env.VISA_CLIENT_KEY.replace(/\\n/g, '\n'),
//   cert: process.env.VISA_CLIENT_CERT.replace(/\\n/g, '\n'),
//   rejectUnauthorized: false
// });


const visaAgent = new https.Agent({
  key: Buffer
    .from(process.env.VISA_CLIENT_KEY, 'base64')
    .toString('utf8')
    .replace(/\\n/g, '\n'),
  cert: Buffer
    .from(process.env.VISA_CLIENT_CERT, 'base64')
    .toString('utf8')
    .replace(/\\n/g, '\n'),
  rejectUnauthorized: false
});

module.exports = visaAgent;
