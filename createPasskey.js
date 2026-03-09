const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

let fs = require('fs');
let nodeJose = require('node-jose');

const visaAgent = require('./visaAgent');

const router = express.Router();

router.post('/passkey/create', async (req, res) => {
    try {
        console.log("create passkey flow")
        const txnId = crypto.randomBytes(16).toString("hex");

        if (!req.body?.token) {
            return res.status(400).json({
                error: " token or operation or operationType is missing"
            });
        }
        let cardNumber = req.body?.cardNumber || 4761120010000492
        const body = {
            response_type: "code",
            response_mode: "form_post",
            scope: "openid",
            state: txnId,
            server_state: req.body?.token,
            // redirect_uri: "https://weak-tova-ungently.ngrok-free.dev/v2/pay/response/azharamin/eulko4VVut9oxbebNnQv",
            redirect_uri: `${process.env.APPLICATION_URL}/v2/pay/response`,
            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            client_assertion: req.body?.token,
            prompt: "create",
            amr_values: [
                "pop#fido2"
            ],
            ui_locales: [
                "en"
            ],
            authorization_details: [{
                type: "com_visa_payment_credential_binding",
                payer: {
                    account: {
                        scheme: "com_visa_pan",
                        id: cardNumber
                    }
                },
                payee: {
                    name: "Your Merchant Name",
                    origin: "https://yourdomain.com"
                },
                confinements: {
                    origin: {
                        source_hint: 'SERVER_STATE'
                    },
                    device: {
                        source_hint: 'SERVER_STATE'
                    }
                },
                trustchain: {
                    anchor: {
                        authentication: [{
                            source_hint: "VDP",
                            source_id_hint: "ACS_TNX_ID",
                            source_id: txnId,
                            protocol: "TDS",
                            amr_values: ["pop#fido2"],
                            time: Math.floor(Date.now() / 1000).toString()
                        }]

                    },
                    surrogate: {
                        authentication: [{
                            amr_values: ["pop#fido2"],
                            time: Math.floor(Date.now() / 1000).toString()
                        }]
                    }
                },
                preferences: {
                    notification: {
                        email: "dummy@gmail.com"
                    }
                }
            }]
        };
        const encrypted = await createEncryptedPayload(body);
        const username = process.env.VISA_USERNAME;
        const password = process.env.VISA_PASSWORD;
        const kId = process.env.VISA_KEY_ID;
        const headers = getHeaders(username, password, kId)
        const response = await axios.post(`${process.env.VISA_BASE_URL}/vpp/v1/passkeys/oauth2/authorization/request/pushed`,
            {
                encData: encrypted.encData
            },
            {
                httpsAgent: visaAgent,
                headers: headers
            }
        );


        let decryptResponse = await fetchDecryptedPayload(response?.data)

        res.json({
            data: decryptResponse,
            error: null,
            error_description: null
        });

    } catch (err) {
        let decrypt = await fetchDecryptedPayload(err.response?.data)
        let { error, error_description } = extractError(decrypt)
        res.status(200).json({
            data: null,
            error: error,
            error_description: error_description
        });
    }
});


function makeAuthHeader(username, password) {
    const token = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${token}`;
}

function getHeaders(username, password, kid) {
    return {
        Authorization: makeAuthHeader(username, password),
        'Content-Type': 'application/json',
        'X-VIA-HINT': "US",
        "X-SERVICE-CONTEXT": "auth_apn=vdp-web",
        keyId: kid
    };
}

function createEncryptedPayload(payload) {
    let payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    let keystore = nodeJose.JWK.createKeyStore();
    let kId = process.env.VISA_KEY_ID
    let encProps = {
        kid: kId,
        alg: 'RSA-OAEP-256',
        enc: 'A128GCM'
    };
    // let encryptionCert = fs.readFileSync('./certs/public_key.pem');
    // const encryptionCert = process.env.VISA_PUBLIC_KEY.replace(/\\n/g, '\n');
    // const encryptionCert = Buffer.from(process.env.VISA_PUBLIC_KEY, 'base64').toString('utf8');
    const encryptionCert = Buffer.from(process.env.VISA_PUBLIC_KEY, 'base64').toString('utf8').replace(/\\n/g, '\n');

    return keystore.add(encryptionCert, 'pem', encProps)
        .then((key) => {
            return nodeJose.JWE.createEncrypt({
                format: 'compact',
                fields: {
                    'enc': 'A128GCM',
                    'iat': Date.now()
                }
            }, key)
                .update(payloadString)
                .final()
                .then((result) => {
                    return { encData: result };
                });
        });
}

async function fetchDecryptedPayload(encryptedPayloadString) {
    let encryptedPayload = typeof encryptedPayloadString == 'string' ? JSON.parse(encryptedPayloadString) : encryptedPayloadString;
    let keystore = nodeJose.JWK.createKeyStore();
    let kId = process.env.VISA_KEY_ID
    let decProps = {
        kid: kId,
        alg: 'RSA-OAEP-256',
        enc: 'A128GCM'
    };
    // let decryptionKey = fs.readFileSync("./certs/private_key.key");
    // const decryptionKey = process.env.VISA_PRIVATE_KEY.replace(/\\n/g, '\n');
    const decryptionKey = Buffer
        .from(process.env.VISA_PRIVATE_KEY, 'base64')
        .toString('utf8')
        .replace(/\\n/g, '\n');
    console.log("decryptionKey", decryptionKey)


    return keystore.add(decryptionKey, 'pem', decProps)
        .then((key) => {
            return nodeJose.JWE.createDecrypt(key)
                .decrypt(encryptedPayload.encData)
                .then((result) => {
                    return JSON.parse(result.payload.toString('utf8'));
                });
        });

}


function extractError(response) {
    if (response?.error_details && Array.isArray(response.error_details) && response.error_details.length > 0) {
        const { error, error_description } = response.error_details[0];
        return { error, error_description };
    }

    return {
        error: response?.error ?? 'unknown_error',
        error_description: response?.error_description ?? 'Unknown error occurred'
    };
}
// notfound_amr_values
// The requested amr value(s) was not found for the user

module.exports = { router };



