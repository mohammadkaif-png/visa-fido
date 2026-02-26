

const express = require('express');
const router = express.Router();

router.post('/pay/start', async (req, res) => {
    try {
        console.log("=== REQUEST DEBUG START V2 PAY START ===");
        console.log("Request Method ----", req.method);
        console.log("Request URL ----", req.originalUrl);
        console.log("Request Headers ----", req.headers);
        console.log("Query Params ----", req.query);
        console.log("Request Body ----", req.body);
        console.log("=== REQUEST DEBUG END V2 PAY START ===");



        res.status(200).json({
            data: "success",
            error: null,
        });

    } catch (err) {
        res.status(200).json({
            data: null,
            error: "Internal Server Error"
        });
    }
});



router.get('/pay/start', async (req, res) => {
    try {
        console.log("=== REQUEST DEBUG START V2 PAY START ===");
        console.log("Request Method ----", req.method);
        console.log("Request URL ----", req.originalUrl);
        console.log("Request Headers ----", req.headers);
        console.log("Query Params ----", req.query);
        console.log("Request Body ----", req.body);
        console.log("=== REQUEST DEBUG END V2 PAY START ===");

        res.status(200).json({
            data: "success",
            error: null,
        });

    } catch (err) {
        res.status(200).json({
            data: null,
            error: "Internal Server Error"
        });
    }
});


module.exports = { router };
