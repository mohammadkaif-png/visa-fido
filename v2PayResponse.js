const express = require('express');
const router = express.Router();

router.post('/pay/response', async (req, res) => {
    try {
        console.log("=== REQUEST DEBUG START V2 PAY RESPONSE ===");
        console.log("Request Method ----", req.method);
        console.log("Request URL ----", req.originalUrl);
        console.log("Request Headers ----", req.headers);
        console.log("Query Params ----", req.query);
        console.log("Request Body ----", req.body);
        console.log("=== REQUEST DEBUG END V2 PAY RESPONSE ===");
        res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <body>
                <script>
                    (function() {
                        const payload = {
                            type: "AUTHORIZATION_RESULT",
                            data: ${JSON.stringify(req.body)}
                        };

                        if (window.opener && !window.opener.closed) {
                            window.opener.postMessage(payload, window.location.origin);
                            window.close();
                        } else {
                            document.body.innerHTML = "Transation successfull.";
                        }
                    })();
                </script>
            </body>
            </html>
        `);
        // res.status(200).send("Succeess");


    } catch (err) {
        res.status(200).send("Error");

    }
});

router.get('/pay/response', async (req, res) => {
    try {
        console.log("=== REQUEST DEBUG START V2 PAY RESPONSE ===");
        console.log("Request Method ----", req.method);
        console.log("Request URL ----", req.originalUrl);
        console.log("Request Headers ----", req.headers);
        console.log("Query Params ----", req.query);
        console.log("Request Body ----", req.body);
        console.log("=== REQUEST DEBUG END V2 PAY RESPONSE ===");
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
