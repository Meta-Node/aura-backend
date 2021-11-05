var express = require('express');
const {authenticateToken} = require("../../src/utils/tokenHandler");
const {rateConnection, getRatings} = require("../../src/controllers/ratingController");
var router = express.Router();

router.post('/', authenticateToken, async function (req, res, next) {
    await rateConnection(req.authData.brightId, req.body.brightId, req.body.rating)
    res.json(
        ({
            "ratings": (await getRatings(req.body.brightId))["rows"]
        })
    )
});

module.exports = router;
