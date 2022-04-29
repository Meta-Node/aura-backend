const {getConnection, getConnections, getBrightId, get4Unrated} = require("../../src/controllers/connectionController");
const {rateConnection} = require("../../src/controllers/ratingController");
const {validateAuraPlayer} = require("../../src/middlewear/aurahandler");
const express = require("express");
const {getAllNicknamesForBrightId} = require("../../src/controllers/nicknameController");
const generateRatings = require("../../src/ratings/ratingsManager");

var router = express.Router();
//needs 4 to be rated
//aura time
// number of connection
router.get('/public/:fromBrightId', async function (req, res, next) {
    let fromBrightId = req.params.fromBrightId
    let connections = await getConnections(fromBrightId)
    let brightIdDate;
    try {
        brightIdDate = (await getBrightId(fromBrightId))[0]["createdAt"]
    } catch (e) {
        res.status(500).send("invalid brightId")
    }
    let rating = generateRatings(fromBrightId)
    let numOfConnections = connections.length

    res.json({
        numOfConnections,
        brightIdDate,
        rating,
    })
});


router.get('/:fromBrightId', validateAuraPlayer, async function (req, res, next) {
    let fromBrightId = req.params.fromBrightId
    let connections = await getConnections(fromBrightId)
    let brightIdDate = (await getBrightId(fromBrightId))[0]["createdAt"]
    let fourUnrated = await get4Unrated(fromBrightId)
    let rating = generateRatings(fromBrightId)
    let numOfConnections = connections.length
    let nicknames = (await getAllNicknamesForBrightId(fromBrightId)).rows

    res.json({
        numOfConnections,
        brightIdDate,
        fourUnrated,
        rating,
        nicknames
    })
});



module.exports = router