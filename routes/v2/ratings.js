var express = require('express');
const {authenticateToken} = require("../../src/utils/tokenHandler");
const {getRatings, addRating} = require("../../src/utils/nodeUtils");
var router = express.Router();

router.post('/', authenticateToken, async function (req, res, next) {
    await addRating(req.authData.brightId, req.body.brightId, req.body.rating)
    res.json(
        ({
            "ratings": (await getRatings(req.body.brightId))
        })
    )
});

module.exports = router;
