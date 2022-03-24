const AES = require('crypto-js/aes');
const Utf8 = require('crypto-js/enc-utf8');
const axios = require("axios")
var jwt = require('jsonwebtoken');
var express = require('express');
const {
    pullDecryptedUserData, generateKey, pullProfilePhoto
} = require("../../src/utils/authUtils");
const {getRatings, getRatedById} = require("../../src/controllers/ratingController");
var router = express.Router();


router.post('/', async function (req, res, next) {

});

module.exports = router;