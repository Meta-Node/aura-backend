var express = require('express');
const {getConnection} = require("../../src/controllers/connectionController");
const {rateConnection, getAllRatingsGiven} = require("../../src/controllers/ratingController");
const {validateAuraPlayer} = require("../../src/middlewear/aurahandler");
const {persistToLog} = require("../../src/controllers/activityLogController");
const {decrypt} = require("../../src/middlewear/decryption");
const {resetRatingForConnectionPostRating} = require("../../src/controllers/energyController");

var router = express.Router();

router.post('/:fromBrightId/:toBrightId', validateAuraPlayer, async function (req, res, next) {
    let fromBrightId = req.params.fromBrightId;
    let toBrightId = req.params.toBrightId
    let rating = req.body.encryptedRating

    let connection = (await getConnection(fromBrightId, toBrightId))[0];
    if (connection === undefined) {
        res.status(500).send("No connection between these two brightId");
    }

    //need decryption logic here
    try {
        rating = decrypt(rating, req.body.signingKey).rating
    } catch (exception) {
        return res.status(500).send(exception.toString())
    }
    await resetRatingForConnectionPostRating(fromBrightId, toBrightId)
    await rateConnection(fromBrightId, toBrightId, rating)
    await persistToLog(fromBrightId, toBrightId, {
            "action": "RATED_CONNECTION",
            "amount": rating
        }
    )
    res.send()
});

router.get("/:fromBrightId", validateAuraPlayer, async function (req, res, next) {
    let ratings = (await getAllRatingsGiven(req.params.fromBrightId)).rows
    res.json({
        ratings
    })
});

module.exports = router;
