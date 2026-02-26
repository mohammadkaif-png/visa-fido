const https = require('https');
const fs = require('fs');

const visaAgent = new https.Agent({
    key: fs.readFileSync('./certs/client.key'),
    cert: fs.readFileSync('./certs/client.crt'),
    rejectUnauthorized: false
});

module.exports = visaAgent;
