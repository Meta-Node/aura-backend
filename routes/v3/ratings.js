var express = require('express');
const {authenticateToken} = require("../../src/utils/tokenHandler");
const {getRatings, addRating, getRating} = require("../../src/utils/nodeUtils");
var router = express.Router();

router.post('/', authenticateToken, async function (req, res, next) {
    let oldRating = await getRating(req.authData.brightId, req.body.brightId)
    await addRating(req.authData.brightId, req.body.brightId, req.body.rating, oldRating)

    res.json(
        ({
            "ratings": (await getRatings(req.body.brightId))
        })
    )
});

module.exports = router;
