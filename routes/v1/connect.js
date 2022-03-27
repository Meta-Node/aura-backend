var express = require('express');
const axios = require("axios");
const AES = require("crypto-js/aes");
const Utf8 = require("crypto-js/enc-utf8");
const {persistSigningKey} = require("../../src/controllers/brightIdController");

const router = express.Router();

router.post('/', async function (req, res, next) {
    let pk = req.body.publicKey;
    let brightId = req.body.brightId;
    let encryptedTimestamp = req.body.encryptedTimestamp;
    if (pk === undefined || brightId === undefined || encryptedTimestamp === undefined) {
        res.status(500).send("Missing body params")
    }
    try {
        await validateSigningKey(brightId, encryptedTimestamp, pk);
        persistSigningKey(brightId, pk)
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

async function validateSigningKey(brightId, encryptedData, pk) {
    let keys = await axios.get(`https://app.brightid.org/node/v5/users/${brightId}`)
        .then(data => {
            return data.data.data.signingKeys
        })
        .catch(() => undefined)

    if (keys === undefined) {
        throw new Error(`[brightId: ${brightId}] problem fetching keys for brightId`)
    }

    if (!keys.includes(pk)) {
        throw new Error(`[brightId: ${brightId}] public key not in list of signing keys`)
    }

    try {
        let decrypt = JSON.parse(AES.decrypt(encryptedData, pk).toString(Utf8));
        let currentTime = Date.now().valueOf()
        if ((Math.abs(currentTime - decrypt["timestamp"] / 36e5) > 1)) {
            console.log(`[brightId: ${brightId}] timestamp delta too large`)
            throw new Error()
        }

    } catch (e) {
        throw new Error(`[brightId: ${brightId}] could not decrypt data: ${encryptedData} with signingKey ${pk}`)
    }

}

module.exports = router;