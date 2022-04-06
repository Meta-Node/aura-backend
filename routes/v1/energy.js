var express = require('express');
const {getConnection} = require("../../src/controllers/connectionController");
const crypto = require("crypto-js");
const {getSigningKey} = require("../../src/controllers/brightIdController");
const Utf8 = require("crypto-js/enc-utf8");
const {addEnergyTransfer, clearEnergyForBrightId, getEnergy} = require("../../src/controllers/energyController");
const {persistToLog} = require("../../src/controllers/activityLogController");
const {json} = require("express");
const {validateAuraPlayer} = require("../../src/middlewear/aurahandler");
const nacl = require("tweetnacl");
const {decrypt} = require("../../src/middlewear/decryption");
const {getRatingsMap} = require("../../src/controllers/ratingController");
var router = express.Router();

//https://github.com/dchest/tweetnacl-js/blob/master/README.md#documentation
//compare energy to ratings
//if rating = 1 can only send 25%
// if 1 < rating <= 2, can only send up to 50%
//if rating < 1, cannot send anything
router.post('/:fromBrightId', validateAuraPlayer, async function (req, res, next) {
    let fromBrightId = req.params.fromBrightId;
    let publicKey = req.body.signingKey

    let decryptedJson = req.body.encryptedTransfers;

    try {
        decryptedJson = decrypt(decryptedJson, publicKey)
    } catch (exception) {
        res.status(500).send("Could not decrypt using publicKey: " + publicKey)
    }
    if (decryptedJson === undefined || decryptedJson == null) {
        res.status(500).send("decryption issues: " + publicKey);
    }

    let energy = 0;
    decryptedJson.transfers
        .map(t => t.amount)
        .forEach(t => energy+=t)

    if(energy > 100) {
        res.status(500).send("cannot give out over 100 energy");
    }

    let ratingMap = getRatingsMap(fromBrightId);

    decryptedJson.transfers.forEach(transfer => {
        let rating = ratingMap[transfer.brightId];
        if(transfer.amount < 0) {
            res.status(500).send("cannot send negative amount")
        }
        if(rating === undefined) {
            res.status(500).send(`Cannot send energy to unrated connection ${transfer.brightId}`)
        }
        if(rating.rating < 1) {
            res.status(500).send(`Cannot send energy to connection  ${transfer.brightId} because connection has rating ${rating.rating}`)
        }
        if(rating.rating === 1 && transfer.amount > 25) {
            res.status(500).send(`Cannot send that ${transfer.amount} energy to connection  ${transfer.brightId} because connection has rating ${rating.rating}`)
        }
        if(rating.rating > 1 && rating.rating <= 2 && transfer.amount > 50) {
            res.status(500).send(`Cannot send that much energy energy to connection ${transfer.brightId} because connection has rating ${rating.rating}`)
        }


    })

    let promises = []

    await clearEnergyForBrightId(fromBrightId)
    decryptedJson.transfers.forEach(transfer => {
            promises.push(addEnergyTransfer(transfer.brightId, fromBrightId, transfer.amount))
            promises.push(persistToLog(
                    fromBrightId,
                    transfer.brightId,
                    {
                        "action": "ENERGY_TRANSFER",
                        "amount": transfer.amount
                    }
                )
            )
        }
    )

    await Promise.all(promises)

    res.json({
        "energyAllocation": (await getEnergy(fromBrightId)).rows
    })
});

//add get all ratings given from BrightId

module.exports = router;
