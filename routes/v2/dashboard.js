var express = require('express');
const {authenticateToken} = require("../../src/utils/tokenHandler");
const {getRatingsGivenForConnection, getRatingsRecievedForConnection} = require("../../src/utils/nodeUtils");
var router = express.Router();

router.get('/', authenticateToken, async function (req, res, next) {
    let brightId = req.authData.brightId

    res.json(
        {
            "ratingsRecieved": await getRatingsRecievedForConnection(brightId),
            "ratingsGiven": await getRatingsGivenForConnection(brightId)
        }
    )


});

module.exports = router;
