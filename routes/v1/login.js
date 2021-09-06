const AES = require('crypto-js/aes');
const Utf8 = require('crypto-js/enc-utf8');
const axios = require("axios")
var express = require('express');
const {signedCookie} = require("cookie-parser");
const {
    pullFromNetwork,
    pullDecryptedUserData,
    generateKey, pullProfilePhoto
} = require("./authUtils");
var router = express.Router();
const usernameParam = "explorer_code";
const passwordParam = "password"

router.post('/', async function (req, res, next) {
    let body = req.body;
    let data = await loginUser(body[usernameParam], body[passwordParam]);
    res.cookie("brightId", data['brightId'], {signed: true})
    res.cookie("password", data["password"], {signed: true})

    res.json({
        "name": data.userData.name,
        "photo": data.photo,
        "score": "score"
    })
});

async function loginUser(username, password) {
    if (username == null) {
        throw new Error("Missing username in body")
    }
    if (password == null) {
        throw new Error("Missing password in body")
    }

    const brightId = AES.decrypt(username, password).toString(Utf8);

    try {
        const key = generateKey(brightId, password)
        let brightIdChunk = pullFromNetwork(brightId)
        let decryptedUserData = pullDecryptedUserData(key, password)
        let photoLink = await pullProfilePhoto(key, brightId, password)

            //in the future we may want to consider caching the decryptedUserData
            data = {
                'userData': (await decryptedUserData).userData,
                'brightId': brightId,
                'password': password,
                'photo': photoLink
            }
        return data
    } catch (e) {
        console.log(e)
        throw new Error("Could not login in user, please check username/password")
    }
}

module.exports = router;
