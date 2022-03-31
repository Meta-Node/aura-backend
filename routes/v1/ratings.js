var express = require('express');
const {getConnection} = require("../../src/controllers/connectionController");
const {rateConnection} = require("../../src/controllers/ratingController");
const {validateAuraPlayer} = require("../../src/middlewear/aurahandler");
const {persistToLog} = require("../../src/controllers/activityLogController");

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

    await rateConnection(fromBrightId, toBrightId, rating)
    await persistToLog(fromBrightId, toBrightId, {
            "action": "RATED_CONNECTION",
            "amount": rating
        }
    )
});

module.exports = router;
