const AES = require('crypto-js/aes');
const Utf8 = require('crypto-js/enc-utf8');
const axios = require("axios")
var jwt = require('jsonwebtoken');
var express = require('express');
const {
    pullFromNetwork,
    pullDecryptedUserData,
    generateKey, pullProfilePhoto
} = require("../../src/utils/authUtils");
const {getRatings} = require("../../src/controllers/ratingController");
var router = express.Router();
const usernameParam = "explorer_code";
const passwordParam = "password"

router.post('/', async function (req, res, next) {
    let body = req.body;
    let data = await loginUser(body[usernameParam], body[passwordParam]);

    let token = jwt.sign({
            'brightId': data['brightId'],
            'password': data['password']
        }, process.env.SECRET,
        {expiresIn: '24h'})

    let scores = await await getRatings(data['brightId'])["rows"]
    res.json({
        "name": data.userData.name,
        "photo": data.photo,
        "score": calculateScore(scores),
        "token": token,
        "connectionsCount": null,
        "ratingsCount": null
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
        let decryptedUserData = pullDecryptedUserData(key, password)
        let photoLink =  pullProfilePhoto(key, brightId, password)

        //in the future we may want to consider caching the decryptedUserData
        data = {
            'userData': (await decryptedUserData).userData,
            'brightId': brightId,
            'password': password,
            'photo': await photoLink
        }
        return data
    } catch (e) {
        console.log(e)
        throw new Error("Could not login in user, please check username/password")
    }
}

function calculateScore(scores) {
    if (!scores) {
        return []
    } else {
        return scores
    }
}

module.exports = router;
