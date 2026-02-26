const https = require('https');
const fs = require('fs');

const visaAgent = new https.Agent({
    key: process.env.VISA_CLIENT_KEY.replace(/\\n/g, '\n'),
    cert: process.env.VISA_CLIENT_CERT.replace(/\\n/g, '\n'),
    rejectUnauthorized: false
});

module.exports = visaAgent;
