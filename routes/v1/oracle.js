const express = require("express");
const {validateAuraPlayer} = require("../../src/middlewear/aurahandler");
const {getAllAfterForBrightId} = require("../../src/controllers/activityLogController");
var router = express.Router();

router.get('/rating/:fromBrightId', validateAuraPlayer, async function (req, res, next) {
    let fromBrightId = req.params.fromBrightId
    let rating = 0

    res.json({
        rating
    })
});

module.exports = router