const express = require("express");
const {validateAuraPlayer} = require("../../src/middlewear/aurahandler");
const {getAllAfterForBrightId} = require("../../src/controllers/activityLogController");
const {generateRatings} = require("../../src/ratings/ratingsManager");
var router = express.Router();

router.get('/rating/:fromBrightId', validateAuraPlayer, async function (req, res, next) {
    let fromBrightId = req.params.fromBrightId
    let rating = generateRatings(fromBrightId)

    res.json({
        rating
    })
});

module.exports = router