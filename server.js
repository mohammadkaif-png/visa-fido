const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors'); 

const { router: loginPasskeyRouter } = require('./loginPasskey');
const { router: createPasskeyRouter } = require('./createPasskey');
const { router: v2PayResponse } = require('./v2PayResponse');
const { router: v2PayStart } = require('./v2PayStart');


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(cors()); // 👈 enable CORS for all origins

app.use('/api', loginPasskeyRouter);
app.use('/api', createPasskeyRouter);
app.use('/v2',v2PayResponse)
app.use('/v2',v2PayStart)


// axios.interceptors.request.use(req => {
//   console.log('➡️ REQUEST');
//   console.log('URL:', req.url);
//   console.log('METHOD:', req.method);
//   console.log('HEADERS:', req.headers);
//   console.log('BODY:', JSON.stringify(req.data, null, 2));
//   return req;
// });

// axios.interceptors.response.use(
//   res => {
//     console.log('⬅️ RESPONSE');
//     console.log('STATUS:', res.status);
//     console.log('HEADERS:', res.headers);
//     console.log('BODY:', JSON.stringify(res.data, null, 2));
//     return res;
//   },
//   err => {
//     console.log(err.toString());
//     if (err.response) {
//       console.log('STATUS:', err.response.status);
//       console.log('DATA:', err.response.data);
//       console.log('HEADERS:', err.response.headers);
//     }
//     throw err;
//   }
// );


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});