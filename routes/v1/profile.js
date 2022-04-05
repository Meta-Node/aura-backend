const {getConnection, getConnections, getBrightId, get4Unrated} = require("../../src/controllers/connectionController");
const {rateConnection} = require("../../src/controllers/ratingController");
const {validateAuraPlayer} = require("../../src/middlewear/aurahandler");
const express = require("express");

var router = express.Router();
//needs 4 to be rated
//aura time
// number of connection
router.get('/:fromBrightId', validateAuraPlayer, async function (req, res, next) {
    let fromBrightId = req.params.fromBrightId
    let connections = await getConnections(fromBrightId)
    let brightIdDate = (await getBrightId(fromBrightId))[0]["createdAt"]
    let fourUnrated = await get4Unrated(fromBrightId)
    let rating = 10
    let numOfConnections = connections.length - 1

    res.json({
        numOfConnections,
        brightIdDate,
        fourUnrated,
        rating
    })
});

module.exports = router