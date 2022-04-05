const {validateAuraPlayer} = require("../../src/middlewear/aurahandler");
const {getConnections, getBrightId, get4Unrated} = require("../../src/controllers/connectionController");
const express = require("express");
const {getAllAfter, getAllAfterForBrightId} = require("../../src/controllers/activityLogController");
var router = express.Router();

router.get('/:fromBrightId', validateAuraPlayer, async function (req, res, next) {
    let fromBrightId = req.body.fromBrightId
    let limit = req.query.limit ? req.query.limit : 20
    let timestamp = req.query.timestamp ? req.query.timestamp : Date.now()

    res.json({
        events: (await getAllAfterForBrightId(limit, timestamp, fromBrightId))
    })
});

router.get("/general", async function (req, res, next) {
    let limit = req.query.limit ? req.query.limit : 20
    let timestamp = req.query.timestamp ? req.query.timestamp : Date.now()
    res.json({
        events: (await getAllAfter(timestamp, limit)).rows
    })
});

module.exports = router